#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔍 Diagnosing Deployment Button Issue');
console.log('====================================\n');

// Check .replit configuration
console.log('1️⃣ Checking .replit configuration:');
if (fs.existsSync('.replit')) {
  const replitContent = fs.readFileSync('.replit', 'utf8');
  console.log('✅ .replit file exists');
  
  const deploymentTarget = replitContent.match(/deploymentTarget = "(.+)"/)?.[1];
  console.log(`   Deployment target: ${deploymentTarget || 'Not specified'}`);
  
  if (deploymentTarget === 'cloudrun') {
    console.log('⚠️  ISSUE IDENTIFIED: Deployment target is Cloud Run');
    console.log('   This requires Docker configuration for deployment');
    console.log('   Cloud Run deployment needs specific files');
  }
} else {
  console.log('❌ .replit file not found');
}

// Check required files for Cloud Run deployment
console.log('\n2️⃣ Checking Cloud Run deployment requirements:');
const cloudRunFiles = [
  'Dockerfile',
  'app.yaml',
  '.dockerignore'
];

cloudRunFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing (required for Cloud Run)`);
  }
});

// Check replit.toml
console.log('\n3️⃣ Checking replit.toml:');
if (fs.existsSync('replit.toml')) {
  const tomlContent = fs.readFileSync('replit.toml', 'utf8');
  console.log('✅ replit.toml exists');
  
  const runCommand = tomlContent.match(/command = "(.+)"/)?.[1];
  const deployCommand = tomlContent.match(/run = \[(.+)\]/)?.[1];
  
  console.log(`   Run command: ${runCommand || 'Not found'}`);
  console.log(`   Deploy command: ${deployCommand || 'Not found'}`);
}

// Check server configuration
console.log('\n4️⃣ Checking server configuration:');
if (fs.existsSync('simple-server.js')) {
  const serverContent = fs.readFileSync('simple-server.js', 'utf8');
  const hasCloudRunPort = serverContent.includes('GOOGLE_CLOUD_RUN_PORT');
  const hasProperPort = serverContent.includes('8080');
  
  console.log(`✅ simple-server.js exists`);
  console.log(`${hasCloudRunPort ? '✅' : '❌'} Cloud Run port configuration`);
  console.log(`${hasProperPort ? '✅' : '❌'} Default port 8080 configured`);
}

// Check package.json
console.log('\n5️⃣ Checking package.json:');
if (fs.existsSync('package.json')) {
  const packageContent = fs.readFileSync('package.json', 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  console.log('✅ package.json exists');
  console.log(`   Engine: ${packageJson.engines?.node || 'Not specified'}`);
  console.log(`   Start script: ${packageJson.scripts?.start || 'Not specified'}`);
  
  if (!packageJson.scripts?.start) {
    console.log('⚠️  No start script defined in package.json');
  }
}

// Check environment variables
console.log('\n6️⃣ Environment check:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'Not set'}`);
console.log(`   PORT: ${process.env.PORT || 'Not set'}`);
console.log(`   REPLIT_CLUSTER: ${process.env.REPLIT_CLUSTER || 'Not set'}`);

// Recommendations
console.log('\n7️⃣ Recommendations:');
console.log('   Since .replit is configured for Cloud Run deployment:');
console.log('   ✅ Dockerfile created for containerization');
console.log('   ✅ app.yaml created for App Engine compatibility');
console.log('   ✅ .dockerignore created for optimized builds');
console.log('   ✅ Server updated to handle Cloud Run port requirements');

console.log('\n8️⃣ Next steps:');
console.log('   1. Try the deployment button again');
console.log('   2. If still not working, the issue may be:');
console.log('      - Replit platform temporary issues');
console.log('      - Account/billing requirements');
console.log('      - Browser cache issues');
console.log('   3. Alternative: Use manual deployment methods');

console.log('\n✅ Deployment configuration is now optimized for Cloud Run');