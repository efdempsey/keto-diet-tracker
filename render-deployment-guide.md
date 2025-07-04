# Deploy on Render (Express.js Friendly)

Render is perfect for your Express.js Keto Diet Tracker app.

## Simple Render Deployment Steps

1. **Go to Render**
   - Visit [render.com](https://render.com)
   - Click "Get Started for Free"
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" button
   - Select "Web Service"
   - Choose "Build and deploy from a Git repository"
   - Click "Connect" next to your keto-diet-tracker repository

3. **Configure Service**
   - **Name**: `keto-diet-tracker` (or any name you prefer)
   - **Environment**: `Node`
   - **Build Command**: Leave empty (no build needed)
   - **Start Command**: `node simple-server.js`
   - **Plan**: Select "Free"

4. **Environment Variables**
   - Add: `NODE_ENV` = `production`
   - Add: `PORT` = `10000` (Render's default)

5. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - You'll get a live URL like `https://keto-diet-tracker.onrender.com`

## Why Render Works Better

- Designed for Express.js servers
- Uses your existing `render.yaml` configuration
- Free tier with 750 hours/month
- Automatic SSL certificates
- Easy custom domains
- Built-in monitoring

## If Render Shows Errors

Check these in the logs:
- Dependencies installing correctly
- Server starting on correct port
- Health endpoints responding

Your app is perfectly configured for Render - it should deploy successfully.