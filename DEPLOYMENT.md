# 🚀 Deployment Guide

## GitHub Pages Deployment (Recommended)

This application is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Quick Setup

1. **Create GitHub Repository:**
   ```bash
   # Create a new repository on GitHub named 'meerut-culture-guide'
   # Then push this code:
   git remote add origin https://github.com/yourusername/meerut-culture-guide.git
   git branch -M main
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions"
   - The deployment will start automatically on the next push

3. **Access Your App:**
   - Your app will be available at: `https://yourusername.github.io/meerut-culture-guide/`
   - Deployment typically takes 2-3 minutes

### Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- ✅ Trigger on every push to `main` branch
- ✅ Install Node.js dependencies
- ✅ Build the React application
- ✅ Deploy to GitHub Pages
- ✅ Handle all configuration automatically

### Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file to `frontend/public/` with your domain
2. Configure DNS to point to `yourusername.github.io`
3. Enable custom domain in GitHub Pages settings

## Alternative Deployment Options

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/dist`
4. Deploy automatically on git push

### Vercel
1. Connect your GitHub repository to Vercel
2. Set root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`

### Manual Static Hosting
```bash
cd frontend
npm install
npm run build
# Upload contents of 'dist' folder to your web server
```

## Environment Configuration

### Production Build
- No environment variables required
- All processing happens client-side
- API keys are entered by users in the application

### Base Path Configuration
The application automatically configures the base path for GitHub Pages:
- Development: `/` (localhost)
- Production: `/meerut-culture-guide/` (GitHub Pages)

## Troubleshooting

### Build Fails
```bash
cd frontend
npm install
npm run build
```

### GitHub Actions Fails
- Check the Actions tab in your GitHub repository
- Ensure GitHub Pages is enabled with "GitHub Actions" source
- Verify the workflow file is in `.github/workflows/deploy.yml`

### 404 on GitHub Pages
- Ensure the repository name matches the base path in `vite.config.ts`
- Check that GitHub Pages is enabled and source is set to "GitHub Actions"

## Performance Notes

- ✅ Static files only - no server required
- ✅ CDN-ready for global distribution
- ✅ Caches effectively in browsers
- ✅ Works offline after initial load (except LLM API calls)