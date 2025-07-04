#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Checking Git Setup Status');
console.log('============================\n');

// Check if git is available
try {
  execSync('git --version', { stdio: 'pipe' });
  console.log('✅ Git is available');
} catch (error) {
  console.log('❌ Git is not available');
  process.exit(1);
}

// Check if this is a git repository
if (fs.existsSync('.git')) {
  console.log('✅ This is a git repository');
  
  // Check git status
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.log('📝 You have uncommitted changes');
      console.log('   Files to commit:');
      status.split('\n').filter(line => line.trim()).forEach(line => {
        console.log(`   ${line}`);
      });
    } else {
      console.log('✅ Working directory is clean');
    }
  } catch (error) {
    console.log('⚠️  Could not check git status');
  }
  
  // Check remote origin
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf8' });
    console.log(`✅ Remote origin set: ${remote.trim()}`);
  } catch (error) {
    console.log('❌ No remote origin set');
    console.log('   You need to connect this to a GitHub repository');
  }
  
} else {
  console.log('❌ This is not a git repository');
  console.log('   Run: git init');
}

console.log('\n📋 Quick Setup Commands:');
console.log('1. Initialize git (if needed): git init');
console.log('2. Add files: git add .');
console.log('3. Commit: git commit -m "Initial commit"');
console.log('4. Add GitHub remote: git remote add origin https://github.com/USERNAME/REPO.git');
console.log('5. Push: git push -u origin main');

console.log('\n🚀 Or run: ./push-to-github.sh for automated setup');