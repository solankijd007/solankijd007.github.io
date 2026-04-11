# GitHub Pages Deployment Guide

## ⚡ Critical Setup Step

**Your GitHub Pages site will NOT work until you complete this:**

1. Go to your repository on GitHub: https://github.com/solankijd007/solankijd007
2. Click **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Select branch: **gh-pages** ← (Important!)
5. Select folder: **/(root)**
6. Click **Save**

⏳ **Wait 1-2 minutes** for GitHub Pages to process and activate.

## How It Works

- Your code stays on `main` branch
- GitHub Actions automatically builds and pushes to `gh-pages` branch
- GitHub Pages serves from `gh-pages` branch
- Your site will appear at: **https://solankijd007.github.io/**

## Automatic Deployment

Every time you push to `main`:
```bash
git push origin main
```

The workflow automatically:
1. ✅ Installs dependencies
2. ✅ Builds the project (`npm run export`)
3. ✅ Pushes static files to `gh-pages` branch
4. ✅ GitHub Pages serves your site

## Manual Build Test (Local)

```bash
npm run export
ls -la out/  # Verify build output
```

## Troubleshooting

**Site still shows 404?**
1. ✅ Verify you set Pages source to `gh-pages` branch (not `main`)
2. Wait 2-3 minutes after configuration
3. Hard refresh browser: `Ctrl+Shift+R`
4. Check Actions tab for workflow errors

**Workflow failing?**
- Go to Actions tab in GitHub
- Check "Deploy to GitHub Pages" workflow
- Click on failed run to see error details

## File Structure

```
Repository (main branch)
├── src/
├── public/
├── next.config.mjs
├── package.json
└── ... (source files)

gh-pages branch (auto-generated)
└── out/ (static HTML, auto-deployed)
    ├── index.html
    ├── 404.html
    ├── _next/
    └── assets/
```
