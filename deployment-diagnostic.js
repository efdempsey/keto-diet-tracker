#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync } = require('child_process');

console.log('🔍 Running deployment diagnostic...\n');

// 1. Check Node.js version
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js version: ${nodeVersion}`);
} catch (error) {
  console.error('❌ Node.js not available');
  process.exit(1);
}

// 2. Check npm version
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm version: ${npmVersion}`);
} catch (error) {
  console.error('❌ npm not available');
}

// 3. Check package.json
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`✅ Package.json exists - ${pkg.name}`);
} else {
  console.error('❌ package.json not found');
}

// 4. Check deployment files
const deploymentFiles = [
  'deploy-server.js',
  'replit.toml',
  'simple-server.js'
];

deploymentFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ ${file} missing`);
  }
});

// 5. Check replit.toml configuration
if (fs.existsSync('replit.toml')) {
  const tomlContent = fs.readFileSync('replit.toml', 'utf8');
  console.log('\n📋 replit.toml configuration:');
  console.log(tomlContent);
}

// 6. Check environment variables
console.log('\n🌍 Environment variables:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`PORT: ${process.env.PORT || 'not set'}`);
console.log(`REPLIT_PORT: ${process.env.REPLIT_PORT || 'not set'}`);

// 7. Check for port conflicts
const testPorts = [3000, 8080, 5000];
console.log('\n🔌 Checking port availability:');

testPorts.forEach(port => {
  const server = http.createServer();
  server.listen(port, 'localhost', () => {
    console.log(`✅ Port ${port} available`);
    server.close();
  });
  
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`❌ Port ${port} in use`);
    }
  });
});

// 8. Test deployment server startup
console.log('\n🚀 Testing deployment server startup...');

try {
  const { spawn } = require('child_process');
  const serverProcess = spawn('node', ['deploy-server.js'], { 
    stdio: 'pipe',
    timeout: 5000
  });

  let startupSuccess = false;
  
  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Server is ready')) {
      console.log('✅ Deployment server starts successfully');
      startupSuccess = true;
      serverProcess.kill();
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.error('❌ Server startup error:', data.toString());
  });

  setTimeout(() => {
    if (!startupSuccess) {
      console.error('❌ Server failed to start within 5 seconds');
      serverProcess.kill();
    }
  }, 5000);

} catch (error) {
  console.error('❌ Failed to test server startup:', error.message);
}

// 9. Check for common deployment issues
console.log('\n🔍 Common deployment issues to check:');
console.log('• Ensure the deployment platform supports Node.js');
console.log('• Check if the deployment service can bind to the configured port');
console.log('• Verify that the deployment has sufficient memory and CPU');
console.log('• Confirm that the deployment service allows HTTP traffic');
console.log('• Check if there are any firewall restrictions');

console.log('\n✅ Diagnostic complete. Check output above for issues.');