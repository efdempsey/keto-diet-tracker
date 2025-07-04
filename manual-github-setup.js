#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Manual GitHub Setup Helper');
console.log('=============================\n');

console.log('Since the Git tab isn\'t connecting, let\'s set this up manually.\n');

console.log('Step 1: First, create a repository on GitHub:');
console.log('- Go to github.com');
console.log('- Click the "+" button → New repository');
console.log('- Name it: keto-diet-tracker');
console.log('- Make it Public');
console.log('- Don\'t add README, .gitignore, or license');
console.log('- Click "Create repository"\n');

rl.question('Have you created the GitHub repository? (y/n): ', (answer) => {
  if (answer.toLowerCase() !== 'y') {
    console.log('Please create the repository first, then run this script again.');
    rl.close();
    return;
  }

  rl.question('What is your GitHub username? ', (username) => {
    rl.question('What did you name your repository? (press enter for "keto-diet-tracker"): ', (repoName) => {
      const repo = repoName || 'keto-diet-tracker';
      
      console.log('\n🚀 Setting up Git connection...\n');
      
      try {
        // Check git status
        console.log('1. Checking git status...');
        execSync('git status', { stdio: 'inherit' });
        
        // Add files
        console.log('\n2. Adding all files...');
        execSync('git add .', { stdio: 'inherit' });
        
        // Commit
        console.log('\n3. Creating commit...');
        execSync('git commit -m "Initial commit: Keto Diet Tracker with deployment configs"', { stdio: 'inherit' });
        
        // Add remote
        console.log('\n4. Adding GitHub remote...');
        const remoteUrl = `https://github.com/${username}/${repo}.git`;
        execSync(`git remote add origin ${remoteUrl}`, { stdio: 'inherit' });
        
        // Push
        console.log('\n5. Pushing to GitHub...');
        execSync('git push -u origin main', { stdio: 'inherit' });
        
        console.log('\n✅ Success! Your code is now on GitHub!');
        console.log(`\n🔗 Repository URL: https://github.com/${username}/${repo}`);
        console.log('\n🚀 Next steps:');
        console.log('1. Go to railway.app');
        console.log('2. Login with GitHub');
        console.log('3. Deploy from GitHub repo');
        console.log(`4. Select ${username}/${repo}`);
        console.log('5. Your app will be deployed automatically!');
        
      } catch (error) {
        console.log('\n❌ Error occurred:');
        console.log(error.message);
        console.log('\nTry using a personal access token instead:');
        console.log('1. Go to GitHub.com → Settings → Developer settings → Personal access tokens');
        console.log('2. Generate new token with "repo" permissions');
        console.log('3. Use this command:');
        console.log(`git remote set-url origin https://${username}:YOUR_TOKEN@github.com/${username}/${repo}.git`);
      }
      
      rl.close();
    });
  });
});