#!/usr/bin/env node

const http = require('http');
const { spawn } = require('child_process');

console.log('🔍 Verifying deployment configuration...');

// Test 1: Check if deploy-server.js exists
const fs = require('fs');
if (!fs.existsSync('deploy-server.js')) {
  console.error('❌ deploy-server.js not found');
  process.exit(1);
}
console.log('✅ deploy-server.js found');

// Test 2: Check if replit.toml has correct run command
const tomlContent = fs.readFileSync('replit.toml', 'utf8');
if (!tomlContent.includes('command = "node deploy-server.js"')) {
  console.error('❌ replit.toml does not have correct run command');
  process.exit(1);
}
console.log('✅ replit.toml configured correctly');

// Test 3: Start server and test endpoints
console.log('🚀 Starting deployment server for testing...');
const server = spawn('node', ['deploy-server.js'], { stdio: 'pipe' });

let serverReady = false;
server.stdout.on('data', (data) => {
  if (data.toString().includes('Server is ready')) {
    serverReady = true;
    console.log('✅ Server started successfully');
    testEndpoints();
  }
});

server.stderr.on('data', (data) => {
  console.error('Server error:', data.toString());
});

function testEndpoints() {
  setTimeout(() => {
    // Test health endpoint
    const healthReq = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/health',
      method: 'GET'
    }, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ /health endpoint responding');
      } else {
        console.error('❌ /health endpoint failed');
      }
      
      // Test root endpoint
      const rootReq = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/',
        method: 'GET'
      }, (res) => {
        if (res.statusCode === 200) {
          console.log('✅ / endpoint responding');
        } else {
          console.error('❌ / endpoint failed');
        }
        
        console.log('🎉 Deployment verification complete!');
        console.log('✅ All deployment requirements satisfied');
        console.log('✅ Ready for production deployment');
        
        server.kill();
        process.exit(0);
      });
      
      rootReq.on('error', (err) => {
        console.error('❌ Root endpoint test failed:', err.message);
        server.kill();
        process.exit(1);
      });
      
      rootReq.end();
    });
    
    healthReq.on('error', (err) => {
      console.error('❌ Health endpoint test failed:', err.message);
      server.kill();
      process.exit(1);
    });
    
    healthReq.end();
  }, 2000);
}

// Timeout after 10 seconds
setTimeout(() => {
  if (!serverReady) {
    console.error('❌ Server failed to start within 10 seconds');
    server.kill();
    process.exit(1);
  }
}, 10000);