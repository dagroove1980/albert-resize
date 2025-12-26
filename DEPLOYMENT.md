# Deployment Guide for AlbertResize

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install if not already installed
   ```bash
   npm install -g vercel
   ```

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Navigate to project directory**:
   ```bash
   cd "/Users/david.scebat/Documents/Geek Automation/products/websites/AlbertResize"
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Login to Vercel** (if not already logged in):
   ```bash
   vercel login
   ```

4. **Deploy to preview**:
   ```bash
   vercel
   ```

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `Geek Automation/products/websites/AlbertResize`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables (see below)
6. Click "Deploy"

## Required Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

### Vercel KV
- `KV_REST_API_URL` - From Vercel KV dashboard
- `KV_REST_API_TOKEN` - From Vercel KV dashboard

### Authentication
- `AUTH_SECRET` - Generate with: `openssl rand -base64 32`

### Google OAuth
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

### GitHub OAuth
- `GITHUB_CLIENT_ID` - From GitHub OAuth App
- `GITHUB_CLIENT_SECRET` - From GitHub OAuth App

### Paddle
- `PADDLE_API_KEY` - From Paddle dashboard
- `PADDLE_WEBHOOK_SECRET` - From Paddle webhook settings
- `PADDLE_ENVIRONMENT` - `sandbox` or `production`
- `PADDLE_STARTER_PRICE_ID` - Price ID for Starter plan
- `PADDLE_PRO_PRICE_ID` - Price ID for Pro plan
- `PADDLE_BUSINESS_PRICE_ID` - Price ID for Business plan

### Replicate
- `REPLICATE_API_TOKEN` - Your Replicate API token

## Post-Deployment Setup

### 1. Set up Vercel KV Database
1. Go to Vercel Dashboard → Storage
2. Create a new KV database
3. Copy connection details to environment variables

### 2. Configure OAuth Redirect URLs
Update your OAuth app redirect URLs to match your Vercel domain:
- Google: `https://your-domain.vercel.app/api/auth/login?provider=google`
- GitHub: `https://your-domain.vercel.app/api/auth/login?provider=github`

### 3. Configure Paddle Webhook
1. In Paddle dashboard → Developer Tools → Notifications
2. Add webhook URL: `https://your-domain.vercel.app/api/webhooks/paddle`
3. Select all subscription and transaction events
4. Copy webhook secret to `PADDLE_WEBHOOK_SECRET`

### 4. Test the Deployment
1. Visit your deployed site
2. Test OAuth login
3. Test subscription checkout (use sandbox mode first)
4. Verify webhooks are working

## Troubleshooting

### API Routes Not Working
- Ensure `vercel.json` includes the functions configuration
- Check that API files are in the `api/` directory
- Verify Node.js runtime is set correctly

### Environment Variables Not Loading
- Make sure variables are set for the correct environment (Production/Preview)
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### OAuth Redirect Errors
- Verify redirect URLs match exactly in OAuth provider settings
- Check that `VERCEL_URL` environment variable is set (auto-set by Vercel)

### Webhook Issues
- Verify webhook URL is accessible (should return 200 OK)
- Check webhook secret matches in both Paddle and Vercel
- Review Vercel function logs for webhook errors

## Continuous Deployment

If connected to Git:
- Every push to main branch → Production deployment
- Every push to other branches → Preview deployment

## Monitoring

- View logs: Vercel Dashboard → Project → Functions → View Logs
- Monitor errors: Vercel Dashboard → Project → Analytics
- Check webhook deliveries: Paddle Dashboard → Developer Tools → Webhooks

