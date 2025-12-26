# Vercel Account Migration Guide

This guide will help you migrate AlbertResize from your current Vercel account to a new one.

## Pre-Migration Checklist

Before starting, gather this information:

- [ ] Current Vercel project name
- [ ] Current Vercel domain/URL
- [ ] List of all environment variables (export from current account)
- [ ] Vercel KV database credentials (if using)
- [ ] Custom domain configuration (if any)
- [ ] GitHub/GitLab repository connection (if using)

## Method 1: Transfer via Git Repository (Recommended)

This is the cleanest method and preserves all history.

### Step 1: Ensure Code is in Git

```bash
cd "/Users/david.scebat/Documents/Geek Automation/products/websites/AlbertResize"

# Check git status
git status

# If not initialized, initialize git
git init
git add .
git commit -m "Pre-migration commit"

# Push to your Git provider (GitHub/GitLab/Bitbucket)
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Export Environment Variables from Current Account

1. Go to current Vercel Dashboard → Your Project → Settings → Environment Variables
2. Copy all environment variables to a secure document:
   - KV_REST_API_URL
   - KV_REST_API_TOKEN
   - AUTH_SECRET
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - GITHUB_CLIENT_ID
   - GITHUB_CLIENT_SECRET
   - PADDLE_API_KEY
   - PADDLE_WEBHOOK_SECRET
   - PADDLE_ENVIRONMENT
   - PADDLE_STARTER_PRICE_ID
   - PADDLE_PRO_PRICE_ID
   - PADDLE_BUSINESS_PRICE_ID
   - REPLICATE_API_TOKEN

### Step 3: Create New Vercel Account

1. Sign up at [vercel.com](https://vercel.com) with new account
2. Verify email address

### Step 4: Import Project in New Account

1. Go to new Vercel Dashboard
2. Click "Add New" → "Project"
3. Import from Git:
   - Select your Git provider
   - Choose the repository
   - Click "Import"

### Step 5: Configure Project Settings

1. **Framework Preset**: Vite
2. **Root Directory**: `Geek Automation/products/websites/AlbertResize` (or leave blank if repo root)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### Step 6: Add Environment Variables

1. Go to Project Settings → Environment Variables
2. Add all variables from Step 2
3. Set environment for each (Production, Preview, Development)
4. Click "Save" for each variable

### Step 7: Set Up Vercel KV (if using)

**Option A: Create New KV Database**
1. New Vercel Dashboard → Storage → Create Database
2. Select "KV" (Redis)
3. Copy new credentials
4. Update environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

**Option B: Migrate Existing Data**
If you need to migrate existing user data:
1. Export data from old KV database (if possible)
2. Import to new KV database
3. Update environment variables

### Step 8: Update OAuth Redirect URLs

Update your OAuth provider redirect URLs to match the new domain:

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Edit OAuth 2.0 Client
4. Update Authorized redirect URIs:
   - `https://your-new-domain.vercel.app/api/auth/login?provider=google`

**GitHub OAuth:**
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Edit your OAuth App
3. Update Authorization callback URL:
   - `https://your-new-domain.vercel.app/api/auth/login?provider=github`

### Step 9: Update Paddle Webhook URL

1. Go to Paddle Dashboard → Developer Tools → Notifications
2. Edit webhook
3. Update webhook URL:
   - `https://your-new-domain.vercel.app/api/webhooks/paddle`
4. Save changes

### Step 10: Deploy and Test

1. In new Vercel account, the project should auto-deploy
2. Or manually trigger: Click "Deployments" → "Redeploy"
3. Test all functionality:
   - [ ] Homepage loads
   - [ ] OAuth login works
   - [ ] Pricing page loads
   - [ ] Checkout flow works
   - [ ] Webhooks receive events
   - [ ] Image processing works

## Method 2: Direct Transfer (Without Git)

If you don't want to use Git, you can manually transfer:

### Step 1: Download Project Files

```bash
cd "/Users/david.scebat/Documents/Geek Automation/products/websites/AlbertResize"

# Create a backup
tar -czf albert-resize-backup.tar.gz .
```

### Step 2: Create New Project

1. New Vercel account → "Add New" → "Project"
2. Choose "Deploy without Git"
3. Upload the project folder or drag & drop

### Step 3: Follow Steps 5-10 from Method 1

## Method 3: Transfer Existing Project (Vercel Team Feature)

If you have Vercel Team/Enterprise, you can transfer projects:

1. Current account → Project Settings → General
2. Scroll to "Transfer Project"
3. Enter new account email
4. Accept transfer in new account

**Note**: This requires Team plan or special permissions.

## Post-Migration Steps

### 1. Update Custom Domain (if applicable)

1. New Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Remove domain from old account

### 2. Update External References

Update any external references to the old URL:
- Documentation
- Marketing materials
- Social media links
- Email templates

### 3. Monitor for Issues

For the first 24-48 hours, monitor:
- Error logs in Vercel Dashboard
- User reports
- Webhook deliveries
- Payment processing

### 4. Clean Up Old Account

Once everything is working:
1. Verify new deployment is stable
2. Remove project from old Vercel account (optional)
3. Cancel old account subscription (if applicable)

## Troubleshooting

### Environment Variables Not Working
- Verify all variables are set correctly
- Check for typos in variable names
- Ensure variables are set for correct environment (Production/Preview)
- Redeploy after adding variables

### OAuth Not Working
- Verify redirect URLs match exactly
- Check OAuth credentials are correct
- Clear browser cache and cookies
- Check Vercel function logs for errors

### Webhooks Not Receiving Events
- Verify webhook URL is correct in Paddle
- Check webhook secret matches
- Review Vercel function logs
- Test webhook endpoint manually

### KV Database Issues
- Verify new KV credentials are correct
- Check KV database is active
- Review connection limits
- Export/import data if needed

## Quick Migration Checklist

- [ ] Code pushed to Git repository
- [ ] Environment variables exported from old account
- [ ] New Vercel account created
- [ ] Project imported to new account
- [ ] Environment variables added to new account
- [ ] Vercel KV database set up (if using)
- [ ] OAuth redirect URLs updated
- [ ] Paddle webhook URL updated
- [ ] Project deployed successfully
- [ ] All features tested
- [ ] Custom domain updated (if applicable)
- [ ] Old account cleaned up

## Important Notes

1. **Downtime**: There may be brief downtime during migration. Plan for a maintenance window if needed.

2. **Data Migration**: If you have existing users/data in KV, you'll need to export and import it separately.

3. **Domain**: The new deployment will have a different `.vercel.app` URL. Update all references.

4. **Backup**: Always keep a backup of your code and environment variables before migration.

5. **Testing**: Test thoroughly in the new account before removing the old deployment.

## Need Help?

If you encounter issues:
1. Check Vercel function logs: Dashboard → Project → Functions → Logs
2. Review deployment logs: Dashboard → Project → Deployments → View Logs
3. Check Vercel status: [status.vercel.com](https://status.vercel.com)

