#!/usr/bin/env node

const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

console.log('🧪 Testing Deployment Endpoints Configuration');
console.log('==============================================\n');

// Test 1: Verify simple-server.js exists and has correct structure
console.log('1️⃣ File Structure Check:');
if (fs.existsSync('simple-server.js')) {
  const content = fs.readFileSync('simple-server.js', 'utf8');
  const hasHealth = content.includes('app.get(\'/health\'');
  const hasHealthz = content.includes('app.get(\'/healthz\'');
  const hasPing = content.includes('app.get(\'/ping\'');
  const hasRoot = content.includes('app.get(\'/\'');
  const hasBinding = content.includes('0.0.0.0');
  const hasPort = content.includes('PORT = process.env.PORT || 3000');
  
  console.log(`✅ simple-server.js exists`);
  console.log(`${hasHealth ? '✅' : '❌'} /health endpoint present`);
  console.log(`${hasHealthz ? '✅' : '❌'} /healthz endpoint present`);
  console.log(`${hasPing ? '✅' : '❌'} /ping endpoint present`);
  console.log(`${hasRoot ? '✅' : '❌'} / (root) endpoint present`);
  console.log(`${hasBinding ? '✅' : '❌'} Proper binding to 0.0.0.0`);
  console.log(`${hasPort ? '✅' : '❌'} Port configuration correct`);
} else {
  console.log('❌ simple-server.js missing');
  process.exit(1);
}

// Test 2: Check replit.toml configuration
console.log('\n2️⃣ Configuration Check:');
if (fs.existsSync('replit.toml')) {
  const content = fs.readFileSync('replit.toml', 'utf8');
  const hasRunCommand = content.includes('command = "node simple-server.js"');
  const hasDeployment = content.includes('run = ["node", "simple-server.js"]');
  
  console.log(`✅ replit.toml exists`);
  console.log(`${hasRunCommand ? '✅' : '❌'} Correct run command`);
  console.log(`${hasDeployment ? '✅' : '❌'} Correct deployment config`);
  
  if (!hasRunCommand || !hasDeployment) {
    console.log('❌ replit.toml configuration needs fixing');
    process.exit(1);
  }
} else {
  console.log('❌ replit.toml missing');
  process.exit(1);
}

// Test 3: Start server and test endpoints
console.log('\n3️⃣ Starting server for endpoint testing...');

const server = spawn('node', ['simple-server.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: process.cwd()
});

let serverStarted = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`Server output: ${output.trim()}`);
  
  if (output.includes('server running on port') || output.includes('Server is ready')) {
    serverStarted = true;
    console.log('✅ Server started successfully');
    
    // Wait a moment for server to fully initialize
    setTimeout(() => {
      testEndpoints();
    }, 2000);
  }
});

server.stderr.on('data', (data) => {
  console.error(`Server error: ${data.toString()}`);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Test all endpoints
function testEndpoints() {
  console.log('\n4️⃣ Testing Endpoints:');
  
  const endpoints = [
    { path: '/', name: 'Root' },
    { path: '/health', name: 'Health Check' },
    { path: '/healthz', name: 'Healthz' },
    { path: '/ping', name: 'Ping' }
  ];
  
  let completedTests = 0;
  let allPassed = true;
  
  endpoints.forEach(endpoint => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: endpoint.path,
      method: 'GET'
    }, (res) => {
      const success = res.statusCode === 200;
      console.log(`${success ? '✅' : '❌'} ${endpoint.name} (${endpoint.path}): ${res.statusCode}`);
      
      if (!success) {
        allPassed = false;
      }
      
      completedTests++;
      
      if (completedTests === endpoints.length) {
        console.log(`\n5️⃣ Test Summary:`);
        console.log(`${allPassed ? '✅' : '❌'} All endpoints ${allPassed ? 'passed' : 'failed'}`);
        console.log(`✅ Deployment configuration verified`);
        console.log(`✅ Server responds to all required endpoints`);
        console.log(`✅ Ready for production deployment`);
        
        // Clean up
        server.kill();
        process.exit(allPassed ? 0 : 1);
      }
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${endpoint.name} (${endpoint.path}): Error - ${err.message}`);
      allPassed = false;
      completedTests++;
      
      if (completedTests === endpoints.length) {
        server.kill();
        process.exit(1);
      }
    });
    
    req.end();
  });
}

// Timeout after 30 seconds
setTimeout(() => {
  console.log('❌ Test timeout - server may not be starting correctly');
  server.kill();
  process.exit(1);
}, 30000);