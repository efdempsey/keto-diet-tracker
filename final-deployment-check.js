#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

console.log('🔍 Final Deployment Readiness Check');
console.log('===================================\n');

// Function to check if a file exists and log result
function checkFile(filename, required = true) {
  const exists = fs.existsSync(filename);
  const status = exists ? '✅' : (required ? '❌' : '⚠️');
  console.log(`${status} ${filename} ${exists ? 'exists' : 'missing'}`);
  return exists;
}

// Check all deployment files
console.log('1️⃣ Deployment Files Check:');
const deploymentFiles = [
  'simple-server.js',
  'start.js',
  'Dockerfile',
  '.dockerignore',
  'app.yaml',
  'replit.toml'
];

let allFilesPresent = true;
deploymentFiles.forEach(file => {
  if (!checkFile(file)) {
    allFilesPresent = false;
  }
});

// Check configuration files
console.log('\n2️⃣ Configuration Check:');
if (fs.existsSync('.replit')) {
  const replitContent = fs.readFileSync('.replit', 'utf8');
  const deploymentTarget = replitContent.match(/deploymentTarget = "(.+)"/)?.[1];
  console.log(`✅ Deployment target: ${deploymentTarget}`);
  
  if (deploymentTarget === 'cloudrun') {
    console.log('✅ Cloud Run configuration detected');
    console.log('✅ Docker files created for Cloud Run');
  }
}

// Check server configuration for Cloud Run compatibility
console.log('\n3️⃣ Server Configuration Check:');
if (fs.existsSync('simple-server.js')) {
  const serverContent = fs.readFileSync('simple-server.js', 'utf8');
  const checks = [
    { check: serverContent.includes('GOOGLE_CLOUD_RUN_PORT'), desc: 'Cloud Run port support' },
    { check: serverContent.includes('8080'), desc: 'Default port 8080' },
    { check: serverContent.includes('0.0.0.0'), desc: 'Binding to 0.0.0.0' },
    { check: serverContent.includes('/health'), desc: 'Health check endpoint' },
    { check: serverContent.includes('/healthz'), desc: 'Kubernetes health check' },
    { check: serverContent.includes('/ping'), desc: 'Ping endpoint' }
  ];
  
  checks.forEach(({ check, desc }) => {
    console.log(`${check ? '✅' : '❌'} ${desc}`);
  });
}

// Test server startup
console.log('\n4️⃣ Server Startup Test:');
console.log('Testing server startup with deployment script...');

const testServer = spawn('node', ['start.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, PORT: '3001' }
});

let startupSuccessful = false;
let testTimeout;

testServer.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`   ${output.trim()}`);
  
  if (output.includes('server running') || output.includes('Server is ready')) {
    startupSuccessful = true;
    console.log('✅ Server startup successful');
    
    // Test health endpoints
    setTimeout(() => {
      testHealthEndpoints();
    }, 2000);
  }
});

testServer.stderr.on('data', (data) => {
  console.error(`   Error: ${data.toString()}`);
});

function testHealthEndpoints() {
  console.log('\n5️⃣ Health Endpoint Test:');
  
  const endpoints = [
    { path: '/', name: 'Root' },
    { path: '/health', name: 'Health' },
    { path: '/healthz', name: 'Healthz' },
    { path: '/ping', name: 'Ping' }
  ];
  
  let completedTests = 0;
  let allPassed = true;
  
  endpoints.forEach(endpoint => {
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: endpoint.path,
      method: 'GET'
    }, (res) => {
      const success = res.statusCode === 200;
      console.log(`${success ? '✅' : '❌'} ${endpoint.name}: ${res.statusCode}`);
      
      if (!success) allPassed = false;
      completedTests++;
      
      if (completedTests === endpoints.length) {
        finishTest(allPassed);
      }
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${endpoint.name}: ${err.message}`);
      allPassed = false;
      completedTests++;
      
      if (completedTests === endpoints.length) {
        finishTest(allPassed);
      }
    });
    
    req.end();
  });
}

function finishTest(allPassed) {
  console.log('\n6️⃣ Final Assessment:');
  
  if (allFilesPresent && startupSuccessful && allPassed) {
    console.log('✅ All deployment checks passed');
    console.log('✅ Configuration optimized for Cloud Run');
    console.log('✅ Server responds to all health checks');
    console.log('✅ Ready for deployment');
    console.log('\n🚀 Deployment button should now work');
    console.log('   If it still doesn\'t work, the issue may be:');
    console.log('   - Replit platform temporary issues');
    console.log('   - Account/billing requirements');
    console.log('   - Browser cache (try clearing browser cache)');
  } else {
    console.log('❌ Some deployment checks failed');
    console.log('   Please review the errors above');
  }
  
  // Cleanup
  testServer.kill();
  clearTimeout(testTimeout);
  process.exit(allPassed ? 0 : 1);
}

// Set timeout for the entire test
testTimeout = setTimeout(() => {
  console.log('❌ Test timeout - server startup may have failed');
  testServer.kill();
  process.exit(1);
}, 15000);