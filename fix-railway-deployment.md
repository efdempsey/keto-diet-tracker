# Fixing Railway Service Name Error

## Common Railway Service Name Issues

### Error: Invalid Service Name
Railway requires service names to follow specific rules:
- Only lowercase letters, numbers, and hyphens
- Cannot start or end with hyphen
- Maximum 63 characters
- No spaces or special characters

### Solutions

#### Option 1: Rename During Deployment
1. When deploying, Railway shows a service name field
2. Change it from `keto-diet-tracker` to `keto-tracker`
3. Or use: `ketoapp`, `diet-tracker`, `keto-app`

#### Option 2: Update Railway Config
If the error persists, update your railway.json:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node simple-server.js",
    "healthcheckPath": "/health"
  }
}
```

#### Option 3: Try Alternative Names
Use these valid service names:
- `ketotracker`
- `diet-app`
- `keto-app`
- `nutrition-tracker`
- `health-app`

### If Railway Still Doesn't Work

#### Try Render Instead:
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New Web Service"
4. Select your repository
5. Service name can be more flexible on Render

#### Try Vercel:
1. Go to [vercel.com](https://vercel.com)
2. Import your project from GitHub
3. No service name restrictions

## Quick Fix Steps

1. Go back to Railway deployment
2. Look for the service name field
3. Change it to `ketotracker` (no hyphens)
4. Continue deployment

Your app configuration is perfect - it's just a naming issue!