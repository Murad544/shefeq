// start-prod.js
// Robust production launcher with ngrok + Vercel deploys

const fs = require("fs");
const path = require("path");
const { spawn, exec } = require("child_process");
const { promisify } = require("util");
const net = require("net");

const execAsync = promisify(exec);

// ----- CONFIG -----
const NGROK_DOMAIN = "mmu.ngrok.dev";

const CONFIG = {
  backend: {
    path: "./packages/backend",
    startCommand: "npm run dev",
    envFile: "./packages/backend/.env",
    port: 4000,
  },
  frontend: {
    userApp: {
      path: "./packages/user-app",
      envFile: "./packages/user-app/.env",
      buildCommand: "npm run build",
      buildDir: "./packages/user-app/build",
      vercelName: "semadaki-gozler-user",
    },
    adminApp: {
      path: "./packages/admin-app",
      envFile: "./packages/admin-app/.env",
      buildCommand: "npm run build",
      buildDir: "./packages/admin-app/build",
      vercelName: "semadaki-gozler-admin",
    },
  },
  ngrok: {
    port: 4000,
    path: "D:\\New folder\\ngrok-v3-stable-windows-amd64\\ngrok.exe",
    apiUrl: "http://127.0.0.1:4040/api/tunnels",
  },
  vercel: {
    production: true,
    buildTimeout: 300000,
    deployTimeout: 600000,
  },
  delays: {
    backendStart: 6000, // give the server a bit more time to boot
    ngrokStart: 4000,
    buildDelay: 1500,
    deployDelay: 4000,
    processKillWait: 8000,
    healthWaitMax: 20000, // max time to wait for health
  },
};

// ----- UTIL / LOGGING -----
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

function log(message, color = "reset") {
  const timestamp = new Date().toLocaleTimeString();
  console.log(colors[color] + `[${timestamp}] ${message}` + colors.reset);
}

function logStep(step, message, color = "magenta") {
  console.log("\n" + "=".repeat(60));
  log(`${step}: ${message}`, color);
  console.log("=".repeat(60));
}

async function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once("close", () => resolve(false));
      server.close();
    });
    server.on("error", () => resolve(true));
  });
}

async function killProcessOnPort(port) {
  try {
    log(`Killing processes on port ${port}...`, "yellow");

    if (process.platform === "win32") {
      try {
        const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
        const lines = stdout.split("\n").filter((line) => line.trim());
        const pids = new Set();
        for (const line of lines) {
          const match = line.match(/\s+(\d+)\s*$/);
          if (match && match[1] !== "0") pids.add(match[1]);
        }
        if (pids.size === 0) {
          log(`No processes found on port ${port}`, "green");
          return;
        }
        for (const pid of pids) {
          try {
            await execAsync(`taskkill /PID ${pid} /F`);
            log(`Killed process ${pid} on port ${port}`, "green");
          } catch (err) {
            if (
              !err.message.includes("not found") &&
              !err.message.includes("No tasks")
            ) {
              log(`Warning: Could not kill process ${pid}`, "yellow");
            }
          }
        }
      } catch {
        log(`No processes found on port ${port}`, "green");
      }
    } else {
      try {
        await execAsync(`lsof -ti:${port} | xargs kill -9`);
        log(`Killed processes on port ${port}`, "green");
      } catch {
        log(`No processes found on port ${port}`, "green");
      }
    }

    await new Promise((r) => setTimeout(r, CONFIG.delays.processKillWait));
  } catch (error) {
    log(`Could not kill processes on port ${port}: ${error.message}`, "yellow");
  }
}

async function ensurePortAvailable(port) {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    const inUse = await isPortInUse(port);
    if (!inUse) {
      log(`Port ${port} is available`, "green");
      return port;
    }
    attempts++;
    log(
      `Port ${port} is in use (attempt ${attempts}/${maxAttempts})`,
      "yellow"
    );
    if (attempts < maxAttempts) {
      await killProcessOnPort(port);
    } else {
      throw new Error(`Could not free port ${port} after multiple attempts`);
    }
  }
  return port;
}

function startProcess(command, args, cwd, name, port = null) {
  return new Promise((resolve, reject) => {
    log(`Starting ${name}...`, "blue");

    const env = { ...process.env };
    if (port) {
      env.PORT = port.toString();
      log(`Using port ${port} for ${name}`, "cyan");
    }

    // Allow backend logs to stream; others can be pipe.
    const stdio = name.toLowerCase().includes("backend") ? "inherit" : "pipe";
    const childProcess = spawn(command, args, { cwd, stdio, shell: true, env });

    if (stdio === "pipe") {
      childProcess.stdout.on("data", (data) => {
        const chunk = data.toString();
        if (
          chunk.match(/listening|ready|server running|started/i) ||
          (port && chunk.includes(`port ${port}`))
        ) {
          log(`${name} is ready!`, "green");
          resolve(childProcess);
        }
      });

      childProcess.stderr.on("data", (data) => {
        const error = data.toString();
        if (error.match(/EADDRINUSE|address already in use/i)) {
          log(`${name} failed: Port conflict detected`, "red");
          reject(new Error(`Port ${port || "unknown"} is already in use`));
          return;
        }
        if (!/warning|deprecated/i.test(error)) {
          log(`${name} stderr: ${error.trim()}`, "yellow");
        }
      });
    }

    childProcess.on("error", (error) => {
      log(`Failed to start ${name}: ${error.message}`, "red");
      reject(error);
    });

    childProcess.on("exit", (code, signal) => {
      if (code !== 0 && code !== null && signal !== "SIGTERM") {
        log(`${name} exited with code ${code}`, "red");
        reject(new Error(`${name} exited with code ${code}`));
      }
    });

    // Conservative ready fallback
    const timeout = name.toLowerCase().includes("backend") ? 20000 : 10000;
    setTimeout(() => {
      if (!childProcess.killed) {
        log(`${name} started (assuming ready after timeout)`, "green");
        resolve(childProcess);
      }
    }, timeout);
  });
}

async function gracefullyKillProcess(proc, name, timeoutMs = 10000) {
  if (!proc || proc.killed) return;

  return new Promise((resolve) => {
    log(`Stopping ${name}...`, "yellow");

    const timeout = setTimeout(() => {
      log(`${name} didn't stop gracefully, force killing...`, "yellow");
      try {
        proc.kill("SIGKILL");
      } catch {}
      resolve();
    }, timeoutMs);

    proc.on("exit", () => {
      clearTimeout(timeout);
      log(`${name} stopped`, "green");
      resolve();
    });

    try {
      proc.kill("SIGTERM");
    } catch {
      clearTimeout(timeout);
      resolve();
    }
  });
}

// ----- NGROK -----
function startNgrok(port) {
  return new Promise((resolve, reject) => {
    const args = [
      "http",
      `http://127.0.0.1:${port}`, // explicit upstream address
      `--url=${NGROK_DOMAIN}`, // reserved domain
      "--host-header=rewrite", // normalize Host for picky servers
      "--log=stdout",
      "--log-format=json",
    ];
    const ngrok = spawn(CONFIG.ngrok.path, args, { stdio: "pipe" });

    let resolved = false;
    const safeResolve = (v) => {
      if (!resolved) {
        resolved = true;
        resolve({ proc: ngrok, url: `https://${NGROK_DOMAIN}` });
      }
    };
    const safeReject = (e) => {
      if (!resolved) {
        resolved = true;
        try {
          ngrok.kill();
        } catch {}
        reject(e);
      }
    };

    ngrok.stdout.on("data", (buf) => {
      const lines = buf.toString().split(/\r?\n/).filter(Boolean);
      for (const line of lines) {
        try {
          const j = JSON.parse(line);
          if (
            j.msg === "started tunnel" &&
            j.url === `https://${NGROK_DOMAIN}`
          ) {
            log("ngrok tunnel established", "green");
            safeResolve({ proc: ngrok, url: `https://${NGROK_DOMAIN}` });
          }
        } catch {
          // ignore non-JSON
        }
      }
    });

    ngrok.stderr.on("data", (buf) => {
      const s = buf.toString();
      if (/ERR_NGROK_3200|domain.*not.*(available|found)|offline/i.test(s)) {
        safeReject(new Error("Reserved domain misconfigured or unavailable"));
      }
    });

    ngrok.on("error", (e) => safeReject(e));

    // Safety: assume ready after a short grace (still verified later)
    setTimeout(
      () => safeResolve({ proc: ngrok, url: `https://${NGROK_DOMAIN}` }),
      15000
    );
  });
}

// Helper: fetch with timeout using AbortController (Node fetch has no `timeout` option)
async function fetchWithTimeout(url, ms, init = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

async function waitForOk(url, label, timeoutMs) {
  const start = Date.now();
  let lastErr = null;
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetchWithTimeout(url, 5000);
      if (res.ok || (res.status >= 200 && res.status < 500)) {
        log(`${label} responded with ${res.status}`, "green");
        return true;
      } else {
        lastErr = new Error(`${label} returned ${res.status}`);
      }
    } catch (e) {
      lastErr = e;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  if (lastErr)
    log(`${label} health check failed: ${lastErr.message}`, "yellow");
  return false;
}

async function getNgrokUrl(retries = 3) {
  const customDomainUrl = `https://${NGROK_DOMAIN}`;
  const apiUrl = CONFIG.ngrok.apiUrl || "http://127.0.0.1:4040/api/tunnels";

  // Try the custom domain first with retries
  for (let i = 0; i < retries; i++) {
    try {
      log(`Testing custom domain connectivity (attempt ${i + 1})...`, "cyan");
      const res = await fetchWithTimeout(customDomainUrl, 5000, {
        method: "GET",
      });
      if (res.ok || res.status < 500) {
        log(`Custom domain confirmed working: ${customDomainUrl}`, "green");
        return customDomainUrl;
      } else {
        log(
          `Custom domain responded with ${res.status} ${res.statusText}`,
          "yellow"
        );
      }
    } catch (err) {
      const reason = err.name === "AbortError" ? "timeout" : err.message;
      log(`Custom domain test ${i + 1} failed: ${reason}`, "yellow");
    }
    await new Promise((r) => setTimeout(r, 1200));
  }

  // Fallback: query local ngrok API
  log(
    "Custom domain test failed, checking ngrok API for active tunnels...",
    "yellow"
  );
  try {
    const res = await fetchWithTimeout(apiUrl, 5000, { method: "GET" });
    if (!res.ok)
      throw new Error(`ngrok API returned ${res.status} ${res.statusText}`);
    const data = await res.json();

    if (!data || !Array.isArray(data.tunnels) || data.tunnels.length === 0) {
      throw new Error("No tunnels found in ngrok API response");
    }

    const httpsTunnel =
      data.tunnels.find((t) => t.public_url?.startsWith("https://")) ||
      data.tunnels.find((t) => t.public_url);

    if (httpsTunnel?.public_url) {
      log(`Found active tunnel via API: ${httpsTunnel.public_url}`, "cyan");
      return httpsTunnel.public_url;
    }
    throw new Error("No public_url found on any tunnel");
  } catch (err) {
    log(`Error checking ngrok API: ${err.message}`, "yellow");
  }

  // Last resort
  log("Returning expected custom domain URL despite test failures", "yellow");
  return customDomainUrl;
}

// ----- BUILD / DEPLOY -----
async function buildApp(appConfig, appName) {
  try {
    log(`Building ${appName}...`, "blue");
    const { stdout, stderr } = await execAsync(appConfig.buildCommand, {
      cwd: appConfig.path,
      timeout: CONFIG.vercel.buildTimeout,
    });

    if (stderr && !/warning/i.test(stderr)) {
      log(`${appName} build warnings: ${stderr}`, "yellow");
    }

    if (!fs.existsSync(appConfig.buildDir)) {
      throw new Error(`Build directory not found: ${appConfig.buildDir}`);
    }

    log(`${appName} built successfully!`, "green");
    return true;
  } catch (error) {
    log(`${appName} build failed: ${error.message}`, "red");
    throw error;
  }
}

async function deployToVercel(appConfig, appName) {
  try {
    log(`Deploying ${appName} to Vercel...`, "blue");

    const vercelArgs = [
      "--prod",
      appConfig.buildDir,
      "--name",
      appConfig.vercelName,
      "--yes",
    ];

    const { stdout, stderr } = await execAsync(
      `npx vercel ${vercelArgs.join(" ")}`,
      { timeout: CONFIG.vercel.deployTimeout }
    );

    if (stderr && !/warning/i.test(stderr)) {
      log(`${appName} deployment warnings: ${stderr}`, "yellow");
    }

    const allUrls = stdout.match(/https:\/\/[^\s]+\.vercel\.app/g) || [];
    log(`Found URLs in deployment output: ${allUrls.join(", ")}`, "cyan");

    const productionMatch = stdout.match(
      /Production:\s*(https:\/\/[^\s]+\.vercel\.app)/
    );
    const deploymentUrl = productionMatch
      ? productionMatch[1]
      : allUrls[allUrls.length - 1];

    if (!deploymentUrl) {
      log(`${appName} deployment output: ${stdout}`, "yellow");
      throw new Error("Could not extract deployment URL from Vercel output");
    }

    log(`${appName} deployed successfully!`, "green");
    log(`${appName} URL: ${deploymentUrl}`, "cyan");

    return { url: deploymentUrl, allUrls };
  } catch (error) {
    log(`${appName} deployment failed: ${error.message}`, "red");
    throw error;
  }
}

async function checkVercelAuth() {
  try {
    await execAsync("npx vercel whoami");
    log("Vercel authentication verified", "green");
    return true;
  } catch {
    log("Vercel authentication required. Please run: vercel login", "red");
    return false;
  }
}

// ----- MAIN FLOW -----
async function main() {
  logStep("Starting", "Semadaki Gozler Production Deployment", "cyan");

  const processes = [];
  let backendProcess = null;
  let ngrokProcess = null;

  try {
    logStep("Pre-flight", "Running Pre-flight Checks");

    const isVercelAuthed = await checkVercelAuth();
    if (!isVercelAuthed) {
      log("Please authenticate with Vercel first:", "yellow");
      log("npx vercel login", "cyan");
      process.exit(1);
    }

    logStep("Port", `Ensuring Port ${CONFIG.backend.port} is Available`);
    await ensurePortAvailable(CONFIG.backend.port);

    // Clean old builds
    [CONFIG.frontend.userApp, CONFIG.frontend.adminApp].forEach((app) => {
      if (fs.existsSync(app.buildDir)) {
        log(`Cleaning previous build: ${app.buildDir}`, "yellow");
        fs.rmSync(app.buildDir, { recursive: true, force: true });
      }
    });

    // STEP 1: Start backend initially
    logStep("Backend", "Starting Backend Server");
    backendProcess = await startProcess(
      "npm",
      ["run", "dev"],
      CONFIG.backend.path,
      "Backend",
      CONFIG.backend.port
    );
    processes.push(backendProcess);
    await new Promise((r) => setTimeout(r, CONFIG.delays.backendStart));

    // Health check local upstream
    await waitForOk(
      `http://127.0.0.1:${CONFIG.backend.port}`,
      "Backend (local)",
      CONFIG.delays.healthWaitMax
    );

    // STEP 2: Start ngrok (matches the manual command that works for you)
    logStep("Tunnel", "Establishing Public Tunnel");
    const ng = await startNgrok(CONFIG.backend.port);
    ngrokProcess = ng.proc;
    processes.push(ngrokProcess);
    await new Promise((r) => setTimeout(r, CONFIG.delays.ngrokStart));

    // STEP 3: Get ngrok URL and update CORS
    logStep("Config", "Updating Configuration with Tunnel URL");
    const ngrokUrl = await getNgrokUrl();
    log(`Backend tunnel: ${ngrokUrl}`, "cyan");

    // Verify local + public after restart
    await waitForOk(
      `http://127.0.0.1:${CONFIG.backend.port}`,
      "Backend (local)",
      CONFIG.delays.healthWaitMax
    );
    await waitForOk(
      ngrokUrl,
      "Backend (public via ngrok)",
      CONFIG.delays.healthWaitMax
    );

    // STEP 5: Build apps
    logStep("Build", "Building Applications for Production");
    await buildApp(CONFIG.frontend.userApp, "User App");
    await buildApp(CONFIG.frontend.adminApp, "Admin App");
    await new Promise((r) => setTimeout(r, CONFIG.delays.deployDelay));

    // STEP 6: Deploy to Vercel
    logStep("Deploy", "Deploying to Vercel Production");
    const userAppDeployment = await deployToVercel(
      CONFIG.frontend.userApp,
      "User App"
    );
    const adminAppDeployment = await deployToVercel(
      CONFIG.frontend.adminApp,
      "Admin App"
    );

    // STEP 7: Final CORS update with deployment URLs + one last backend restart
    const allDeploymentUrls = [
      ...userAppDeployment.allUrls,
      ...adminAppDeployment.allUrls,
    ];
    if (allDeploymentUrls.length > 0) {
      await waitForOk(
        `http://127.0.0.1:${CONFIG.backend.port}`,
        "Backend (local)",
        CONFIG.delays.healthWaitMax
      );
      await waitForOk(
        ngrokUrl,
        "Backend (public via ngrok)",
        CONFIG.delays.healthWaitMax
      );
    }

    // STEP 8: Done
    logStep("Complete", "Production Deployment Complete!", "green");

    console.log("\n" + colors.green + "DEPLOYMENT SUMMARY" + colors.reset);
    console.log("=".repeat(50));
    log(
      `Backend (Development): http://localhost:${CONFIG.backend.port}`,
      "white"
    );
    log(`Backend (Public):      https://${NGROK_DOMAIN}`, "white");
    log(`User App (Production): ${userAppDeployment.url}`, "cyan");
    log(`Admin App (Production): ${adminAppDeployment.url}`, "cyan");
    console.log("=".repeat(50));

    log("\nNext Steps:", "yellow");
    log("1. Test your production deployments", "white");
    log("2. Keep this terminal open to maintain backend tunnel", "white");
    log("\nPress Ctrl+C to stop backend and tunnel", "red");

    // Graceful shutdown on Ctrl+C
    process.on("SIGINT", async () => {
      logStep("Shutdown", "Shutting down production environment", "yellow");
      for (const proc of processes) {
        if (proc && !proc.killed) {
          try {
            proc.kill();
          } catch {}
        }
      }
      process.exit(0);
    });

    process.stdin.resume();
  } catch (error) {
    logStep("Failed", `Production deployment failed: ${error.message}`, "red");
    for (const proc of [backendProcess, ngrokProcess]) {
      if (proc && !proc.killed) {
        try {
          proc.kill();
        } catch {}
      }
    }
    log("\nTroubleshooting:", "yellow");
    log(`1. Check that port ${CONFIG.backend.port} is available`, "white");
    log("2. Verify ngrok path is correct", "white");
    log("3. Check Vercel authentication (npx vercel whoami)", "white");
    process.exit(1);
  }
}

// ----- VALIDATION / ENTRY -----
function validatePaths() {
  const requiredPaths = [
    CONFIG.backend.path,
    CONFIG.frontend.userApp.path,
    CONFIG.frontend.adminApp.path,
  ];
  const missing = requiredPaths.filter((p) => !fs.existsSync(p));
  if (missing.length > 0) {
    log("Missing required directories:", "red");
    missing.forEach((p) => log(`   ${p}`, "red"));
    log(
      "\nPlease adjust the CONFIG object in this script to match your project structure.",
      "yellow"
    );
    return false;
  }
  if (!fs.existsSync(CONFIG.ngrok.path)) {
    log(`ngrok not found at: ${CONFIG.ngrok.path}`, "red");
    log(
      "Please update CONFIG.ngrok.path to point to your ngrok executable.",
      "yellow"
    );
    return false;
  }
  return true;
}

if (typeof fetch === "undefined") {
  log("This script requires Node.js 18+ with fetch support", "red");
  log("Please upgrade Node.js or install node-fetch", "yellow");
  process.exit(1);
}

if (validatePaths()) {
  main();
} else {
  process.exit(1);
}
