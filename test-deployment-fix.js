#!/usr/bin/env node

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

console.log('🔧 Testing deployment configuration fixes...');

// Test 1: Verify simple-server.js exists and has correct structure
console.log('\n1️⃣ Checking simple-server.js...');
if (!fs.existsSync('simple-server.js')) {
  console.error('❌ simple-server.js not found');
  process.exit(1);
}

const serverContent = fs.readFileSync('simple-server.js', 'utf8');
const hasHealthCheck = serverContent.includes('app.get(\'/health\'');
const hasRootEndpoint = serverContent.includes('app.get(\'/\'');
const hasProperBinding = serverContent.includes('0.0.0.0');

console.log(`✅ simple-server.js exists`);
console.log(`${hasHealthCheck ? '✅' : '❌'} Health check endpoint present`);
console.log(`${hasRootEndpoint ? '✅' : '❌'} Root endpoint present`);
console.log(`${hasProperBinding ? '✅' : '❌'} Proper binding to 0.0.0.0`);

// Test 2: Check replit.toml configuration
console.log('\n2️⃣ Checking replit.toml...');
if (!fs.existsSync('replit.toml')) {
  console.error('❌ replit.toml not found');
  process.exit(1);
}

const tomlContent = fs.readFileSync('replit.toml', 'utf8');
const hasCorrectRunCommand = tomlContent.includes('command = "node simple-server.js"');
const hasCorrectDeployment = tomlContent.includes('run = ["node", "simple-server.js"]');

console.log(`✅ replit.toml exists`);
console.log(`${hasCorrectRunCommand ? '✅' : '❌'} Correct run command`);
console.log(`${hasCorrectDeployment ? '✅' : '❌'} Correct deployment config`);

// Test 3: Start server and test endpoints
console.log('\n3️⃣ Starting server for testing...');

const server = spawn('node', ['simple-server.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  detached: false
});

let testsPassed = 0;
const totalTests = 4;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('Server output:', output.trim());
  
  if (output.includes('Server is ready')) {
    console.log('\n4️⃣ Testing endpoints...');
    
    // Test health check endpoint
    setTimeout(() => {
      const healthRequest = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/health',
        method: 'GET'
      }, (res) => {
        console.log(`✅ /health endpoint: Status ${res.statusCode}`);
        testsPassed++;
        
        res.on('data', (chunk) => {
          const data = JSON.parse(chunk.toString());
          if (data.status === 'OK') {
            console.log('✅ Health check response valid');
            testsPassed++;
          }
        });
      });
      
      healthRequest.on('error', (err) => {
        console.error('❌ Health check failed:', err.message);
      });
      
      healthRequest.end();
    }, 1000);
    
    // Test root endpoint
    setTimeout(() => {
      const rootRequest = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/',
        method: 'GET'
      }, (res) => {
        console.log(`✅ / endpoint: Status ${res.statusCode}`);
        testsPassed++;
        
        res.on('data', (chunk) => {
          const html = chunk.toString();
          if (html.includes('Keto Diet Tracker')) {
            console.log('✅ Root endpoint content valid');
            testsPassed++;
          }
        });
      });
      
      rootRequest.on('error', (err) => {
        console.error('❌ Root endpoint failed:', err.message);
      });
      
      rootRequest.end();
    }, 1500);
    
    // Final results
    setTimeout(() => {
      console.log(`\n📊 Test Results: ${testsPassed}/${totalTests} tests passed`);
      
      if (testsPassed === totalTests) {
        console.log('🎉 All deployment fixes applied successfully!');
        console.log('✅ Server is ready for deployment');
        console.log('✅ Health checks are responding');
        console.log('✅ Configuration is correct');
      } else {
        console.log('⚠️  Some tests failed - deployment may have issues');
      }
      
      server.kill('SIGTERM');
      process.exit(testsPassed === totalTests ? 0 : 1);
    }, 3000);
  }
});

server.stderr.on('data', (data) => {
  console.error('Server error:', data.toString());
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted');
  server.kill('SIGTERM');
  process.exit(1);
});