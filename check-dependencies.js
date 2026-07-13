const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

const projects = [
  { name: 'Backend', path: './packages/backend', packageManager: 'npm' },
  { name: 'User App', path: './packages/user-app', packageManager: 'npm' },
  { name: 'Admin App', path: './packages/admin-app', packageManager: 'npm' }
];

function checkNodeModules(projectPath) {
  const nodeModulesPath = path.join(projectPath, 'node_modules');
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return { exists: false, reason: 'No package.json found' };
  }
  
  if (!fs.existsSync(nodeModulesPath)) {
    return { exists: false, reason: 'node_modules folder missing' };
  }
  
  try {
    const contents = fs.readdirSync(nodeModulesPath);
    if (contents.length === 0) {
      return { exists: false, reason: 'node_modules folder is empty' };
    }
  } catch (error) {
    return { exists: false, reason: 'Cannot read node_modules folder' };
  }
  
  const packageLockPath = path.join(projectPath, 'package-lock.json');
  if (!fs.existsSync(packageLockPath)) {
    return { exists: false, reason: 'package-lock.json missing (may need npm install)' };
  }
  
  return { exists: true };
}

function installDependencies(projectPath, projectName) {
  return new Promise((resolve, reject) => {
    log(`📦 Installing dependencies for ${projectName}...`, 'blue');
    
    const npmProcess = spawn('npm', ['install'], {
      cwd: projectPath,
      stdio: 'pipe',
      shell: true
    });
    
    let output = '';
    let errorOutput = '';
    
    npmProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    npmProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    npmProcess.on('close', (code) => {
      if (code === 0) {
        log(`✅ ${projectName} dependencies installed successfully!`, 'green');
        resolve();
      } else {
        log(`❌ Failed to install ${projectName} dependencies`, 'red');
        log(`Error: ${errorOutput}`, 'red');
        reject(new Error(`npm install failed for ${projectName}`));
      }
    });
    
    npmProcess.on('error', (error) => {
      log(`❌ Error starting npm install for ${projectName}: ${error.message}`, 'red');
      reject(error);
    });
  });
}

async function main() {
  log('🔍 Checking project dependencies...', 'cyan');
  
  const missingDeps = [];
  
  for (const project of projects) {
    if (!fs.existsSync(project.path)) {
      log(`⚠️  ${project.name} directory not found: ${project.path}`, 'yellow');
      continue;
    }
    
    const depCheck = checkNodeModules(project.path);
    
    if (depCheck.exists) {
      log(`✅ ${project.name}: Dependencies OK`, 'green');
    } else {
      log(`❌ ${project.name}: ${depCheck.reason}`, 'red');
      missingDeps.push(project);
    }
  }
  
  if (missingDeps.length > 0) {
    log(`\n🔧 Installing missing dependencies for ${missingDeps.length} project(s)...`, 'yellow');
    
    for (const project of missingDeps) {
      try {
        await installDependencies(project.path, project.name);
      } catch (error) {
        log(`❌ Failed to install dependencies for ${project.name}`, 'red');
        process.exit(1);
      }
    }
    
    log('\n🎉 All dependencies installed successfully!', 'green');
  } else {
    log('\n✅ All dependencies are up to date!', 'green');
  }
  
  log('\n🔍 Verifying installations...', 'cyan');
  let allGood = true;
  
  for (const project of projects) {
    if (!fs.existsSync(project.path)) continue;
    
    const depCheck = checkNodeModules(project.path);
    if (depCheck.exists) {
      log(`✅ ${project.name}: Verified`, 'green');
    } else {
      log(`❌ ${project.name}: Still missing dependencies`, 'red');
      allGood = false;
    }
  }
  
  if (!allGood) {
    log('\n❌ Some dependencies are still missing. Please run manually:', 'red');
    log('npm run install:all', 'yellow');
    process.exit(1);
  }
  
  log('\n🚀 All projects ready for development/production!', 'green');
}

main().catch((error) => {
  log(`❌ Dependency check failed: ${error.message}`, 'red');
  process.exit(1);
});