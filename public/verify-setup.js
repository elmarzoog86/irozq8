#!/usr/bin/env node

/**
 * Streamer's Quest - Setup Verification Script
 * Checks that all files are in place and system is ready
 */

const fs = require('fs');
const path = require('path');

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
};

// Check results
let passed = 0;
let failed = 0;

console.log(`
${colors.bold}${colors.blue}╔════════════════════════════════════════╗
║   Streamer's Quest Setup Verification   ║
║        Configuration Check v1.0.0       ║
╚════════════════════════════════════════╝${colors.reset}
`);

/**
 * Check if file exists
 */
function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  
  if (fs.existsSync(fullPath)) {
    const size = fs.statSync(fullPath).size;
    console.log(`${colors.green}✅${colors.reset} ${description} (${formatBytes(size)})`);
    passed++;
  } else {
    console.log(`${colors.red}❌${colors.reset} ${description} - NOT FOUND`);
    failed++;
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if dependency is installed
 */
function checkDependency(name) {
  try {
    require.resolve(name);
    console.log(`${colors.green}✅${colors.reset} Dependency: ${name}`);
    passed++;
  } catch (e) {
    console.log(`${colors.red}❌${colors.reset} Dependency: ${name} - NOT INSTALLED`);
    failed++;
  }
}

// ============================================================
// CHECKS
// ============================================================

console.log(`${colors.bold}📁 Core Files:${colors.reset}`);
checkFile('server.js', 'WebSocket Server');
checkFile('client.js', 'Client JavaScript');
checkFile('index.html', 'Game Interface');
checkFile('styles.css', 'Stylesheets');
checkFile('control-panel.html', 'Streamer Control Panel');

console.log(`\n${colors.bold}📚 Documentation:${colors.reset}`);
checkFile('package.json', 'Dependencies Configuration');
checkFile('README_STREAMER_QUEST.md', 'Main README');
checkFile('QUICKSTART.md', 'Quick Start Guide');
checkFile('STREAMER_QUEST_GUIDE.md', 'Complete Guide');

console.log(`\n${colors.bold}📦 Dependencies:${colors.reset}`);
checkDependency('express');
checkDependency('ws');

// ============================================================
// PORT CHECK
// ============================================================

console.log(`\n${colors.bold}🔌 Network Check:${colors.reset}`);

const net = require('net');

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(true);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port, '127.0.0.1');
  });
}

isPortAvailable(3000).then(available => {
  if (available) {
    console.log(`${colors.green}✅${colors.reset} Port 3000 is available`);
    passed++;
  } else {
    console.log(`${colors.yellow}⚠️${colors.reset} Port 3000 is in use (OK if restarting)`);
  }
});

// ============================================================
// NODE VERSION CHECK
// ============================================================

console.log(`\n${colors.bold}📋 System Information:${colors.reset}`);

const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

if (majorVersion >= 14) {
  console.log(`${colors.green}✅${colors.reset} Node.js version: ${nodeVersion}`);
  passed++;
} else {
  console.log(`${colors.red}❌${colors.reset} Node.js version too old: ${nodeVersion} (need 14+)`);
  failed++;
}

console.log(`${colors.blue}ℹ️${colors.reset} OS: ${process.platform}`);
console.log(`${colors.blue}ℹ️${colors.reset} CPU Cores: ${require('os').cpus().length}`);
console.log(`${colors.blue}ℹ️${colors.reset} Memory: ${Math.round(require('os').totalmem() / 1024 / 1024 / 1024)} GB`);

// ============================================================
// FINAL REPORT
// ============================================================

setTimeout(() => {
  console.log(`\n${colors.bold}═══════════════════════════════════════${colors.reset}`);
  
  const total = passed + failed;
  const percentage = total > 0 ? Math.round(passed / total * 100) : 0;
  
  console.log(`${colors.bold}📊 Verification Results:${colors.reset}`);
  console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
  console.log(`Overall: ${percentage}%`);
  
  if (failed === 0) {
    console.log(`\n${colors.bold}${colors.green}🎉 All checks passed! System ready to go!${colors.reset}`);
    console.log(`\n${colors.bold}Next steps:${colors.reset}`);
    console.log(`1. ${colors.bold}npm install${colors.reset} (if not already done)`);
    console.log(`2. ${colors.bold}npm start${colors.reset}         (to start server)`);
    console.log(`3. Open ${colors.bold}http://localhost:3000${colors.reset} in browser`);
    console.log(`4. Access Control Panel at ${colors.bold}http://localhost:3000/control-panel.html${colors.reset}`);
    console.log(`\n📚 Documentation: Read ${colors.bold}QUICKSTART.md${colors.reset} for beginner guide`);
    console.log(`📚 Full Docs: Read ${colors.bold}STREAMER_QUEST_GUIDE.md${colors.reset} for complete reference\n`);
  } else {
    console.log(`\n${colors.bold}${colors.red}⚠️  Please fix ${failed} issue(s) before starting${colors.reset}\n`);
  }
  
  process.exit(failed === 0 ? 0 : 1);
}, 500);
