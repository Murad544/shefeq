const fs = require("fs");
const path = require("path");
const { spawn, exec } = require("child_process");

const CONFIG = {
  backend: {
    path: "./packages/backend",
    startCommand: "npm run dev",
    envFile: "./packages/backend/.env",
  },
  frontend: {
    userApp: {
      path: "./packages/user-app",
      envFile: "./packages/user-app/.env",
      startCommand: "npm start",
    },
    adminApp: {
      path: "./packages/admin-app",
      envFile: "./packages/admin-app/.env",
      startCommand: "npm start",
    },
  },
  ngrok: {
    port: 4000,
    path: "D:\\New folder\\ngrok-v3-stable-windows-amd64\\ngrok.exe",
    apiUrl: "http://localhost:4040/api/tunnels",
  },
  delays: {
    backendStart: 3000,
    ngrokStart: 5000,
    frontendStart: 2000,
  },
};

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(colors[color] + message + colors.reset);
}

function updateEnvFile(filePath, key, value) {
  try {
    if (!fs.existsSync(filePath)) {
      log(`Creating new env file: ${filePath}`, "yellow");
      fs.writeFileSync(filePath, `${key}=${value}\n`);
      return;
    }

    let content = fs.readFileSync(filePath, "utf8");
    const regex = new RegExp(`^${key}=.*$`, "m");

    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
      log(`Updated ${key} in ${filePath}`, "green");
    } else {
      content += `\n${key}=${value}`;
      log(`Added ${key} to ${filePath}`, "green");
    }

    fs.writeFileSync(filePath, content);
  } catch (error) {
    log(`Error updating ${filePath}: ${error.message}`, "red");
  }
}

function updateBackendCors(ngrokUrl, productionUrls = []) {
  try {
    const envPath = CONFIG.backend.envFile;
    if (!fs.existsSync(envPath)) {
      log(`Backend .env file not found: ${envPath}`, "red");
      return;
    }

    let content = fs.readFileSync(envPath, "utf8");
    const corsRegex = /^CORS_ORIGINS=.*$/m;

    const corsOrigins = [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      // Main production domains
      "https://semadaki-gozler-admin.vercel.app",
      "https://semadaki-gozler-user.vercel.app",
      // All deployment URLs
      ...productionUrls,
      // Ngrok URL
      ngrokUrl,
    ];

    // Remove duplicates and empty values
    const uniqueCorsOrigins = [...new Set(corsOrigins.filter(Boolean))];
    const newCors = `CORS_ORIGINS=${uniqueCorsOrigins.join(",")}`;

    if (corsRegex.test(content)) {
      content = content.replace(corsRegex, newCors);
    } else {
      // If CORS_ORIGINS doesn't exist, add it
      content += `\n${newCors}`;
    }

    fs.writeFileSync(envPath, content);
    log(`Updated CORS origins with ${uniqueCorsOrigins.length} URLs`, "green");

    // Log each URL for debugging
    uniqueCorsOrigins.forEach((url) => {
      log(`  - ${url}`, "cyan");
    });
  } catch (error) {
    log(`Error updating CORS: ${error.message}`, "red");
  }
}

async function getNgrokUrl(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(CONFIG.ngrok.apiUrl);
      const data = await response.json();

      // Find HTTPS tunnel
      const httpsTunnel = data.tunnels?.find(
        (tunnel) =>
          tunnel.proto === "https" &&
          tunnel.config?.addr?.includes(CONFIG.ngrok.port)
      );

      if (httpsTunnel) {
        return httpsTunnel.public_url;
      }

      log(`Attempt ${i + 1}: No HTTPS tunnel found, retrying...`, "yellow");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      log(
        `Attempt ${i + 1}: Error fetching ngrok URL: ${error.message}`,
        "yellow"
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  throw new Error("Could not get ngrok URL after multiple attempts");
}

function startProcess(command, args, cwd, name) {
  return new Promise((resolve, reject) => {
    log(`Starting ${name}...`, "blue");

    const process = spawn(command, args, {
      cwd,
      stdio: "pipe",
      shell: true,
    });

    process.stdout.on("data", (data) => {
      const output = data.toString();
      if (
        output.includes("listening") ||
        output.includes("started") ||
        output.includes("ready")
      ) {
        log(`✅ ${name} is ready!`, "green");
        resolve(process);
      }
    });

    process.stderr.on("data", (data) => {
      const error = data.toString();
      if (!error.includes("warning") && !error.includes("deprecated")) {
        log(`${name} error: ${error}`, "red");
      }
    });

    process.on("error", (error) => {
      log(`Failed to start ${name}: ${error.message}`, "red");
      reject(error);
    });

    // Timeout for process start
    setTimeout(() => {
      log(`${name} started (timeout reached)`, "yellow");
      resolve(process);
    }, 10000);
  });
}

function startNgrok() {
  return new Promise((resolve, reject) => {
    log("Starting ngrok tunnel...", "blue");

    const ngrokProcess = spawn(CONFIG.ngrok.path, ["http", CONFIG.ngrok.port], {
      stdio: "pipe",
    });

    ngrokProcess.stdout.on("data", (data) => {
      const output = data.toString();
      if (output.includes("started tunnel") || output.includes("Forwarding")) {
        log("✅ ngrok tunnel established!", "green");
        resolve(ngrokProcess);
      }
    });

    ngrokProcess.stderr.on("data", (data) => {
      const error = data.toString();
      log(`ngrok: ${error}`, "yellow");
    });

    ngrokProcess.on("error", (error) => {
      log(`Failed to start ngrok: ${error.message}`, "red");
      reject(error);
    });

    // Timeout for ngrok start
    setTimeout(() => {
      log("ngrok started (timeout reached)", "yellow");
      resolve(ngrokProcess);
    }, 8000);
  });
}

async function main() {
  log("🚀 Starting Semadaki Gozler Development Environment...", "cyan");

  const processes = [];

  try {
    // Step 1: Start Backend
    log("\n📡 Step 1: Starting Backend Server...", "magenta");
    const backendProcess = await startProcess(
      "npm",
      ["run", "dev"],
      CONFIG.backend.path,
      "Backend"
    );
    processes.push(backendProcess);

    // Wait for backend to be ready
    await new Promise((resolve) =>
      setTimeout(resolve, CONFIG.delays.backendStart)
    );

    // Step 2: Start ngrok
    log("\n🌐 Step 2: Starting ngrok tunnel...", "magenta");
    const ngrokProcess = await startNgrok();
    processes.push(ngrokProcess);

    // Wait for ngrok to establish tunnel
    await new Promise((resolve) =>
      setTimeout(resolve, CONFIG.delays.ngrokStart)
    );

    // Step 3: Get ngrok URL and update environment files
    log("\n⚙️  Step 3: Updating environment files...", "magenta");
    const ngrokUrl = await getNgrokUrl();
    log(`🔗 ngrok URL: ${ngrokUrl}`, "cyan");

    // Update frontend environment files
    updateEnvFile(
      CONFIG.frontend.userApp.envFile,
      "REACT_APP_API_URL",
      ngrokUrl
    );
    updateEnvFile(
      CONFIG.frontend.adminApp.envFile,
      "REACT_APP_API_URL",
      ngrokUrl
    );

    // Update backend CORS
    updateBackendCors(ngrokUrl);

    // Restart backend to apply new CORS settings
    log("\n🔄 Restarting backend with new CORS settings...", "magenta");
    backendProcess.kill();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newBackendProcess = await startProcess(
      "npm",
      ["run", "dev"],
      CONFIG.backend.path,
      "Backend (restarted)"
    );
    processes[0] = newBackendProcess;

    // Wait before starting frontend apps
    await new Promise((resolve) =>
      setTimeout(resolve, CONFIG.delays.frontendStart)
    );

    // Step 4: Start Frontend Apps (optional - you can start these manually)
    log("\n💻 Step 4: Frontend apps ready to start!", "magenta");
    log("\n🎉 Development environment is ready!", "green");
    log("\n📋 Available commands:", "cyan");
    log(
      `   Backend:   Running on http://localhost:${CONFIG.ngrok.port}`,
      "yellow"
    );
    log(`   Public:    ${ngrokUrl}`, "yellow");
    log(`   User App:  cd user-app && npm start`, "yellow");
    log(`   Admin App: cd admin-app && npm start`, "yellow");
    log("\n⚠️  Press Ctrl+C to stop all processes", "red");

    // Handle graceful shutdown
    process.on("SIGINT", () => {
      log("\n🛑 Shutting down development environment...", "yellow");
      processes.forEach((proc) => {
        if (proc && !proc.killed) {
          proc.kill();
        }
      });
      process.exit(0);
    });

    // Keep the script running
    process.stdin.resume();
  } catch (error) {
    log(`❌ Error: ${error.message}`, "red");

    // Cleanup processes on error
    processes.forEach((proc) => {
      if (proc && !proc.killed) {
        proc.kill();
      }
    });

    process.exit(1);
  }
}

// Helper function to check if required directories exist
function validatePaths() {
  const requiredPaths = [
    CONFIG.backend.path,
    CONFIG.frontend.userApp.path,
    CONFIG.frontend.adminApp.path,
  ];

  const missing = requiredPaths.filter((p) => !fs.existsSync(p));

  if (missing.length > 0) {
    log("❌ Missing required directories:", "red");
    missing.forEach((p) => log(`   ${p}`, "red"));
    log(
      "\n💡 Please adjust the CONFIG object in this script to match your project structure.",
      "yellow"
    );
    return false;
  }

  if (!fs.existsSync(CONFIG.ngrok.path)) {
    log(`❌ ngrok not found at: ${CONFIG.ngrok.path}`, "red");
    log(
      "💡 Please update CONFIG.ngrok.path to point to your ngrok executable.",
      "yellow"
    );
    return false;
  }

  return true;
}

// Run the script
if (validatePaths()) {
  main();
} else {
  process.exit(1);
}
