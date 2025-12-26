# Switch to New Vercel Account

## Steps to Deploy to dagroove1980 Account

### 1. Log in to Correct Account
```bash
cd "/Users/david.scebat/Documents/Geek Automation/products/websites/AlbertResize"
vercel login
```
- When prompted, log in with the **dagroove1980** account credentials

### 2. Link Project to New Account
```bash
vercel link
```
- Select the existing project: `albert-resize`
- Or create a new one if it doesn't exist yet

### 3. Deploy
```bash
vercel --prod
```

## Alternative: Use Vercel Dashboard

If you prefer using the dashboard:

1. **Log in** to Vercel with dagroove1980 account
2. Go to: https://vercel.com/dagroove1980/albert-resize
3. Click **"Deployments"** tab
4. Find the latest deployment
5. Click **"..."** → **"Redeploy"**
   - OR push a commit to trigger auto-deploy

## Verify Deployment

After deploying, check:
- Visit: https://albert-resize.vercel.app (or your custom domain)
- Verify GitHub button is **removed**
- Only Google login button should be visible

## Environment Variables

Make sure all environment variables are set in the **dagroove1980** account:

1. Go to: Vercel Dashboard → Project → Settings → Environment Variables
2. Verify these are set:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `KV_REST_API_REDIS_URL`
   - `AUTH_SECRET`
   - `REPLICATE_API_TOKEN`

