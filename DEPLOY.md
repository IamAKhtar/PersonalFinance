# Deployment Guide

## Deploy to Vercel (Recommended - 5 minutes)

### Step 1: Prepare Your Code

```bash
# Navigate to the project folder
cd finance-planner-india

# Install dependencies
npm install
```

### Step 2: Test Locally

```bash
# Run development server
npm run dev

# Open http://localhost:3000 in your browser
# Test all features
```

### Step 3: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Finance Planner India"

# Create a new repository on GitHub
# Then link it:
git remote add origin https://github.com/YOUR_USERNAME/finance-planner-india.git

# Push
git push -u origin main
```

### Step 4: Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your `finance-planner-india` repository
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"
7. Wait ~2 minutes
8. Done! Your app is live 🎉

**Your live URL will be**: `https://finance-planner-india-XXXXX.vercel.app`

You can customize the domain in Vercel settings.

## Alternative: Deploy Without GitHub

### Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to project
cd finance-planner-india

# Deploy
vercel

# Follow the prompts
# Your app will be live in ~2 minutes
```

## Post-Deployment

### Custom Domain

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Settings" → "Domains"
4. Add your custom domain
5. Update DNS records as instructed

### Analytics

Vercel provides free analytics:
- Go to your project dashboard
- Click "Analytics" tab
- View traffic, performance, and errors

### Continuous Deployment

After initial setup:
- Every push to `main` branch → Auto-deploys to production
- Every push to other branches → Creates preview deployments
- No manual steps needed!

## Troubleshooting

### Build Fails

```bash
# Check build locally first
npm run build

# If it succeeds locally, check Vercel build logs
```

### Environment Variables

This app doesn't need any environment variables.
If you add backend features later:

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add your variables
3. Redeploy

## Updating Your App

```bash
# Make changes to code
# Test locally
npm run dev

# Commit and push
git add .
git commit -m "Updated feature X"
git push

# Vercel automatically deploys the update!
```

## Performance Tips

Vercel automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Image optimization
- ✅ Edge caching
- ✅ DDoS protection

No configuration needed!

---

**Need help?** Open an issue on GitHub or check Vercel's documentation.
