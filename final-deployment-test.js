#!/usr/bin/env node

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

console.log('🔥 Final Deployment Readiness Test');
console.log('==================================\n');

// Test 1: Configuration Analysis
console.log('1️⃣ Configuration Analysis');
console.log('  .replit deploymentTarget:', fs.readFileSync('.replit', 'utf8').match(/deploymentTarget = "(.+)"/)?.[1] || 'not found');
console.log('  replit.toml run command:', fs.readFileSync('replit.toml', 'utf8').match(/command = "(.+)"/)?.[1] || 'not found');

// Test 2: Environment Detection  
console.log('\n2️⃣ Environment Variables');
console.log('  REPLIT_CLUSTER:', process.env.REPLIT_CLUSTER || 'not set');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('  PORT:', process.env.PORT || 'not set');

// Test 3: Server Startup and Health Checks
console.log('\n3️⃣ Server Deployment Test');
const server = spawn('node', ['replit-deployment-server.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'production' }
});

let serverReady = false;
let testResults = [];

server.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Ready to handle requests') && !serverReady) {
    serverReady = true;
    console.log('✅ Server started successfully');
    
    // Test all endpoints
    const tests = [
      { path: '/health', name: 'Health Check' },
      { path: '/healthz', name: 'Cloud Run Health' },
      { path: '/ping', name: 'Ping Test' },
      { path: '/status', name: 'Status Check' },
      { path: '/', name: 'Root Page' }
    ];
    
    tests.forEach((test, index) => {
      setTimeout(() => {
        const req = http.request({
          hostname: 'localhost',
          port: 3000,
          path: test.path,
          method: 'GET'
        }, (res) => {
          const result = {
            test: test.name,
            path: test.path,
            status: res.statusCode,
            success: res.statusCode === 200
          };
          testResults.push(result);
          console.log(`  ${result.success ? '✅' : '❌'} ${test.name}: ${res.statusCode}`);
          
          if (testResults.length === tests.length) {
            // All tests completed
            setTimeout(() => {
              console.log('\n📊 Final Results');
              console.log('================');
              
              const passed = testResults.filter(r => r.success).length;
              const total = testResults.length;
              
              console.log(`Tests Passed: ${passed}/${total}`);
              
              if (passed === total) {
                console.log('✅ ALL TESTS PASSED - Deployment Ready!');
                console.log('\n🎯 Deployment Status: READY FOR PRODUCTION');
                console.log('🚀 The app is configured for both Replit and Cloud Run deployment');
                console.log('💡 The universal server handles both deployment targets correctly');
                console.log('\n📋 Next Steps:');
                console.log('1. Use the Deploy button in Replit');
                console.log('2. The server will auto-detect the deployment environment');
                console.log('3. Health checks will confirm successful deployment');
                console.log('\n✨ Deployment issue resolved - ready to deploy!');
              } else {
                console.log('❌ Some tests failed - deployment may have issues');
                testResults.forEach(r => {
                  if (!r.success) {
                    console.log(`  Failed: ${r.test} (${r.status})`);
                  }
                });
              }
              
              server.kill('SIGTERM');
              process.exit(passed === total ? 0 : 1);
            }, 1000);
          }
        });
        
        req.on('error', (err) => {
          testResults.push({
            test: test.name,
            path: test.path,
            status: 'ERROR',
            success: false,
            error: err.message
          });
          console.log(`  ❌ ${test.name}: ${err.message}`);
        });
        
        req.end();
      }, index * 300);
    });
  }
});

server.stderr.on('data', (data) => {
  console.error(`Server error: ${data.toString()}`);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Timeout safeguard
setTimeout(() => {
  if (!serverReady) {
    console.log('❌ Server startup timeout - deployment may have issues');
    server.kill('SIGTERM');
    process.exit(1);
  }
}, 15000);

// Cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted');
  server.kill('SIGTERM');
  process.exit(1);
});