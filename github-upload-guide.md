# GitHub Upload Options Guide

## If "Upload files" is not visible:

### Option 1: Look for "uploading an existing file" link
- On your empty repository page, look for text that says "or uploading an existing file"
- This is usually near the bottom of the quick setup section
- Click on that link

### Option 2: Navigate directly to upload
- Go to your repository
- Add `/upload/main` to the end of the URL
- Example: `https://github.com/yourusername/keto-diet-tracker/upload/main`

### Option 3: Create repository differently
1. Delete your current repository
2. Create a new one
3. This time, CHECK "Add a README file"
4. After creation, you'll see an "Upload files" button

### Option 4: Use the "Add file" button
- Look for a green "Add file" button on your repository page
- Click it and select "Upload files"

### Option 5: Initialize with web interface
1. Click "creating a new file" on your repository page
2. Name it `simple-server.js`
3. Copy and paste the server code
4. Commit the file
5. Repeat for other files

## Alternative: Use Git from Shell

If upload still doesn't work, use the shell method:

```bash
# In Replit Shell:
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/keto-diet-tracker.git
git push -u origin main
```