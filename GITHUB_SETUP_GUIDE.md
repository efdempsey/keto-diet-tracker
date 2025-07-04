# How to Push Your Code to GitHub

Follow these simple steps to get your Keto Diet Tracker on GitHub and deployed.

## Step 1: Create a GitHub Account (if needed)

1. Go to [github.com](https://github.com)
2. Click "Sign up" if you don't have an account
3. Choose a username and create your account

## Step 2: Create a New Repository

1. Once logged in, click the "+" icon in the top right
2. Select "New repository"
3. Name it something like: `keto-diet-tracker`
4. Make it **Public** (required for free deployments)
5. **Don't** initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 3: Push Your Code from Replit

### Option A: Using Replit's Git Integration (Easiest)

1. In your Replit project, look for the Git tab in the sidebar
2. If you don't see it, go to Tools > Git
3. Click "Create a Git repository"
4. Follow the prompts to connect to GitHub
5. Push your code directly from Replit

### Option B: Using the Shell/Terminal

1. Open the Shell tab in Replit
2. Run these commands one by one:

```bash
# Initialize git repository
git init

# Add all your files
git add .

# Make your first commit
git commit -m "Initial commit - Keto Diet Tracker"

# Connect to your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/keto-diet-tracker.git

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username**

### Option C: Download and Upload (If git doesn't work)

1. In Replit, click the three dots menu
2. Select "Download as ZIP"
3. Extract the ZIP file on your computer
4. Go to your GitHub repository page
5. Click "uploading an existing file"
6. Drag and drop all your files
7. Commit the changes

## Step 4: Verify Your Files Are on GitHub

Check that these files are in your repository:
- `simple-server.js`
- `railway.json`
- `render.yaml`
- `vercel.json`
- `package.json`
- `replit.toml`
- `DEPLOYMENT_GUIDE.md`

## Step 5: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click "Login" and choose "Login with GitHub"
3. Authorize Railway to access your repositories
4. Click "Deploy from GitHub repo"
5. Select your `keto-diet-tracker` repository
6. Railway will automatically detect your `railway.json` and deploy
7. Wait 2-3 minutes for deployment to complete
8. You'll get a live URL for your app!

## Troubleshooting

### If git commands don't work in Replit:
- Try the Replit Git integration (Option A)
- Or use the download/upload method (Option C)

### If you get permission errors:
- Make sure your repository is public
- Check that you're logged into the correct GitHub account

### If Railway deployment fails:
- Check that `railway.json` is in your repository
- Try Render or Vercel as alternatives (see DEPLOYMENT_GUIDE.md)

## What Happens Next

Once deployed:
- Your app will have a public URL
- It will automatically redeploy when you push changes to GitHub
- You can add a custom domain later
- Your health endpoints (/health, /ping) will be working

Your Keto Diet Tracker will be live and accessible to anyone with the URL!