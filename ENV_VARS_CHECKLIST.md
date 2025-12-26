# Environment Variables Checklist

## Required Variables for Login to Work

After migrating to the new Vercel account, make sure these are set:

### 1. Authentication
- [ ] **AUTH_SECRET** = `MbAj5lo/iGxcBGR6PQ87fY4CXxc9VzK+a5hGnCsz1dY=`
  - Go to: Vercel → Project → Settings → Environment Variables
  - Add: `AUTH_SECRET`
  - Value: `MbAj5lo/iGxcBGR6PQ87fY4CXxc9VzK+a5hGnCsz1dY=`
  - Environments: **All Environments**
  - Sensitive: ✅ Enabled

### 2. Google OAuth
- [ ] **GOOGLE_CLIENT_ID** = (from Google Cloud Console)
- [ ] **GOOGLE_CLIENT_SECRET** = (from Google Cloud Console)
  - Both: **All Environments**, Sensitive: ✅ Enabled

### 3. Vercel KV (Database)
- [ ] **KV_REST_API_REDIS_URL** = (from Vercel KV connection)
  - Go to: Vercel → Project → Storage → KV
  - If not connected, click "Create Database"
  - Copy the `KV_REST_API_REDIS_URL` value
  - Add to Environment Variables
  - Environments: **All Environments**
  - Sensitive: ✅ Enabled

### 4. Replicate API (for image processing)
- [ ] **REPLICATE_API_TOKEN** = (your Replicate API token)
  - Environments: **All Environments**
  - Sensitive: ✅ Enabled

## How to Add Variables

1. Go to: https://vercel.com/davids-projects-794668e3/albert-resize/settings/environment-variables
2. Click **"Add New"**
3. Enter:
   - **Key**: Variable name (e.g., `AUTH_SECRET`)
   - **Value**: Variable value
   - **Environments**: Select "Production", "Preview", "Development" (or "All Environments")
   - **Sensitive**: Enable for secrets
4. Click **"Save"**
5. **Redeploy** after adding variables (or wait for auto-deploy)

## Quick Copy-Paste Values

If you have these from the old account, copy them:

```bash
# AUTH_SECRET (same for all projects)
AUTH_SECRET=MbAj5lo/iGxcBGR6PQ87fY4CXxc9VzK+a5hGnCsz1dY=

# GOOGLE_CLIENT_ID (from Google Console)
GOOGLE_CLIENT_ID=your-client-id-here

# GOOGLE_CLIENT_SECRET (from Google Console)
GOOGLE_CLIENT_SECRET=your-client-secret-here

# KV_REST_API_REDIS_URL (from Vercel KV)
KV_REST_API_REDIS_URL=redis://default:password@host:port

# REPLICATE_API_TOKEN (from Replicate)
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxx
```

## After Adding Variables

1. **Redeploy** the project:
   - Go to: Deployments → Latest → "..." → Redeploy
   - OR push a commit to trigger auto-deploy

2. **Test login**:
   - Visit: https://albert-resize.vercel.app
   - Click "Login with Google"
   - Should work now!

## Troubleshooting

**Error: "AUTH_SECRET environment variable is required"**
→ Add `AUTH_SECRET` to environment variables

**Error: "KV_REST_API_REDIS_URL not configured"**
→ Connect Vercel KV database in Storage tab

**Error: "Google OAuth credentials not configured"**
→ Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

**Error: "Redis Client Error"**
→ Check `KV_REST_API_REDIS_URL` is correct and KV database is active

