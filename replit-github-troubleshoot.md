# Fixing Replit Git Tab GitHub Connection Issues

## Common Solutions

### Solution 1: Reset Git Integration
1. In the Git tab, look for "Settings" or gear icon
2. Click "Disconnect" or "Reset" if you see those options
3. Try connecting to GitHub again
4. Make sure you're logged into the correct GitHub account

### Solution 2: Use Shell Commands Instead
Since the Git tab isn't connecting, use the Shell:

```bash
# Check current git status
git status

# Add all files
git add .

# Commit your changes
git commit -m "Keto Diet Tracker - ready for deployment"

# Set up GitHub connection (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### Solution 3: GitHub Personal Access Token
If you get authentication errors:

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Create a new token with "repo" permissions
3. Use this command instead:
```bash
git remote add origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/REPO_NAME.git
```

### Solution 4: Alternative - Download and Upload
If git still doesn't work:

1. Click the 3-dot menu in Replit
2. Select "Download as ZIP"
3. Go to your GitHub repository
4. Click "Upload files"
5. Drag and drop your project files

### Solution 5: Check Replit Account
- Make sure your Replit account is connected to GitHub
- Go to Replit Account Settings → Connected accounts
- Reconnect GitHub if needed

## Quick Test
Run this in the Shell to check git status:
```bash
git remote -v
```

If it shows no remotes, you need to add the GitHub repository manually.