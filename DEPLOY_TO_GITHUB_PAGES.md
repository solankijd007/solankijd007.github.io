# GitHub Pages Deployment Guide

## Setup

1. **Repository Settings**
   - Go to your GitHub repository: `https://github.com/solankijd007/spider-porfolio`
   - Navigate to Settings → Pages
   - Under "Source", select **Deploy from a branch**
   - Select branch: **main**
   - Select folder: **/(root)** (for root domain deployment)

2. **Verify Workflow**
   - Go to Actions tab in your repo
   - Confirm the "Deploy to GitHub Pages" workflow exists
   - Workflow will run automatically on every push to `main`

## Local Testing

```bash
# Build for export
npm run export

# Verify the `out/` directory was created with .nojekyll
ls -la out/
```

## Deployment

```bash
# Push to main branch
git add .
git commit -m "Configure for GitHub Pages"
git push origin main
```

The GitHub Actions workflow will:
1. ✅ Install dependencies
2. ✅ Build and export static site to `out/`
3. ✅ Create `.nojekyll` file (prevents Jekyll processing)
4. ✅ Upload to GitHub Pages

Your site will be live at: **https://solankijd007.github.io/**

## Notes

- `output: 'export'` → Static HTML export (required for GitHub Pages)
- `images.unoptimized: true` → Images work without Next.js Image Optimization
- `.nojekyll` → Tells GitHub Pages to skip Jekyll processing
- Assets (images, CSS) are self-contained in the `out/` folder

## Troubleshooting

If the site doesn't appear:
1. Wait 1-2 minutes for GitHub Pages to process
2. Check Actions tab for workflow errors
3. Verify Settings → Pages shows successful deployment
4. Clear browser cache (Ctrl+Shift+Delete)
5. Check browser console for broken asset paths
