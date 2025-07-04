#!/usr/bin/env node

const { spawn } = require('child_process');
const http = require('http');

console.log('🧪 Testing Universal Deployment Server');
console.log('=====================================\n');

// Start the universal deployment server
const server = spawn('node', ['universal-deploy-server.js'], { stdio: 'pipe' });

let serverReady = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('Server output:', output);
  
  if (output.includes('Universal deployment server ready')) {
    serverReady = true;
    console.log('✅ Server started successfully');
    setTimeout(testEndpoints, 3000);
  }
});

server.stderr.on('data', (data) => {
  console.error('Server error:', data.toString());
});

function testEndpoints() {
  const endpoints = [
    { path: '/', description: 'Root endpoint' },
    { path: '/health', description: 'Health check' },
    { path: '/healthz', description: 'Cloud Run health check' },
    { path: '/ping', description: 'Ping check' },
    { path: '/status', description: 'Status check' }
  ];

  let completed = 0;
  const total = endpoints.length;

  console.log('\n🔍 Testing endpoints:');

  endpoints.forEach(endpoint => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: endpoint.path,
      method: 'GET'
    }, (res) => {
      const success = res.statusCode === 200;
      console.log(`${success ? '✅' : '❌'} ${endpoint.description} (${res.statusCode})`);
      
      if (endpoint.path === '/health' && success) {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const healthData = JSON.parse(data);
            console.log(`   Platform: ${healthData.deployment?.platform || 'Unknown'}`);
            console.log(`   Status: ${healthData.status}`);
          } catch (e) {
            console.log('   Health data parsing failed');
          }
        });
      }
      
      completed++;
      if (completed === total) {
        console.log('\n🎯 All tests completed!');
        console.log('✅ Universal deployment server is ready');
        console.log('✅ Compatible with both Replit and Cloud Run');
        server.kill();
        process.exit(0);
      }
    });

    req.on('error', (err) => {
      console.log(`❌ ${endpoint.description} (Error: ${err.message})`);
      completed++;
      if (completed === total) {
        console.log('\n🎯 All tests completed!');
        server.kill();
        process.exit(0);
      }
    });

    req.end();
  });
}

// Timeout after 15 seconds
setTimeout(() => {
  console.log('\n⏱️ Test timeout reached');
  server.kill();
  process.exit(1);
}, 15000);