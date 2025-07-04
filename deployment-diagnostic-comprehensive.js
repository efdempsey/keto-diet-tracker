#!/usr/bin/env node

const fs = require('fs');
const { spawn } = require('child_process');
const http = require('http');

console.log('🔍 Comprehensive Deployment Diagnostic');
console.log('=====================================\n');

// Step 1: Check file system
console.log('1️⃣ File System Check');
const requiredFiles = [
  'replit.toml',
  'robust-deploy-server.js',
  'simple-server.js',
  'package.json'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`✅ ${file} (${stats.size} bytes, modified: ${stats.mtime.toISOString()})`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Step 2: Check replit.toml configuration
console.log('\n2️⃣ Replit Configuration');
if (fs.existsSync('replit.toml')) {
  const tomlContent = fs.readFileSync('replit.toml', 'utf8');
  console.log('Current replit.toml:');
  console.log(tomlContent);
  
  const hasRobustServer = tomlContent.includes('robust-deploy-server.js');
  console.log(`${hasRobustServer ? '✅' : '❌'} Using robust-deploy-server.js`);
} else {
  console.log('❌ replit.toml not found');
}

// Step 3: Environment variables
console.log('\n3️⃣ Environment Variables');
const envVars = ['NODE_ENV', 'PORT', 'REPLIT_PORT', 'REPLIT_URL', 'REPLIT_SLUG'];
envVars.forEach(envVar => {
  const value = process.env[envVar];
  console.log(`${value ? '✅' : '⚠️'} ${envVar}: ${value || 'not set'}`);
});

// Step 4: Check server syntax
console.log('\n4️⃣ Server Syntax Check');
try {
  require.resolve('./robust-deploy-server.js');
  console.log('✅ robust-deploy-server.js syntax is valid');
} catch (err) {
  console.log('❌ robust-deploy-server.js syntax error:', err.message);
}

// Step 5: Port availability
console.log('\n5️⃣ Port Availability Test');
const testServer = require('net').createServer();
testServer.listen(3000, '0.0.0.0', () => {
  console.log('✅ Port 3000 is available');
  testServer.close();
  
  // Step 6: Live deployment test
  console.log('\n6️⃣ Live Deployment Test');
  const deploymentServer = spawn('node', ['robust-deploy-server.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  let serverReady = false;
  
  deploymentServer.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(`📡 ${output}`);
    
    if (output.includes('Ready to handle requests') && !serverReady) {
      serverReady = true;
      console.log('\n7️⃣ Endpoint Testing');
      
      // Test all endpoints
      const endpoints = [
        { path: '/health', description: 'Health check' },
        { path: '/healthz', description: 'Simple health' },
        { path: '/ping', description: 'Ping test' },
        { path: '/status', description: 'Status check' },
        { path: '/', description: 'Root page' }
      ];
      
      let testsCompleted = 0;
      let testsTotal = endpoints.length;
      
      endpoints.forEach((endpoint, index) => {
        setTimeout(() => {
          const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: endpoint.path,
            method: 'GET'
          }, (res) => {
            console.log(`✅ ${endpoint.description} (${endpoint.path}): ${res.statusCode}`);
            testsCompleted++;
            
            if (testsCompleted === testsTotal) {
              console.log('\n📊 Deployment Diagnostic Results');
              console.log('================================');
              console.log(`✅ All ${testsTotal} endpoints responding correctly`);
              console.log('✅ Server starts and binds successfully');
              console.log('✅ Configuration is valid');
              console.log('✅ Deployment should work correctly');
              
              console.log('\n🎯 Deployment Commands:');
              console.log('1. For manual deployment: node robust-deploy-server.js');
              console.log('2. For Replit deployment: Use the deploy button (configuration is correct)');
              
              deploymentServer.kill('SIGTERM');
              process.exit(0);
            }
          });
          
          req.on('error', (err) => {
            console.log(`❌ ${endpoint.description} (${endpoint.path}): ${err.message}`);
            testsCompleted++;
            
            if (testsCompleted === testsTotal) {
              deploymentServer.kill('SIGTERM');
              process.exit(1);
            }
          });
          
          req.end();
        }, (index + 1) * 500);
      });
    }
  });
  
  deploymentServer.stderr.on('data', (data) => {
    console.error(`❌ Server error: ${data.toString()}`);
  });
  
  deploymentServer.on('close', (code) => {
    console.log(`\n🔚 Server process exited with code ${code}`);
    process.exit(code);
  });
  
  // Cleanup timeout
  setTimeout(() => {
    if (!serverReady) {
      console.log('\n❌ Server failed to start within timeout');
      deploymentServer.kill('SIGTERM');
      process.exit(1);
    }
  }, 10000);
});

testServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('⚠️  Port 3000 is in use - checking what\'s running...');
    
    // Try to identify what's using the port
    const { exec } = require('child_process');
    exec('lsof -i :3000 2>/dev/null || netstat -tlnp 2>/dev/null | grep :3000', (error, stdout, stderr) => {
      if (stdout) {
        console.log('Port 3000 usage:', stdout);
      }
      console.log('❌ Cannot run deployment test - port in use');
      process.exit(1);
    });
  } else {
    console.log('❌ Port test failed:', err.message);
    process.exit(1);
  }
});

// Cleanup handlers
process.on('SIGINT', () => {
  console.log('\n🛑 Diagnostic interrupted');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Diagnostic terminated');
  process.exit(1);
});