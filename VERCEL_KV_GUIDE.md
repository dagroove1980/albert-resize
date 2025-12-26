# Vercel KV Dashboard Guide

## How to Access Vercel KV Dashboard

### Step 1: Log into Vercel
1. Go to [vercel.com](https://vercel.com)
2. Log in with your Vercel account

### Step 2: Navigate to Storage
There are two ways to access KV:

**Method A: From Dashboard**
1. Click on your **account/team name** in the top right
2. Go to **Storage** tab (in the left sidebar)
3. You'll see all your databases (KV, Postgres, etc.)

**Method B: Direct URL**
- Go directly to: `https://vercel.com/[your-team]/storage`
- Replace `[your-team]` with your team/account name

### Step 3: Create or Access KV Database

**If you don't have a KV database yet:**
1. Click **"Create Database"** or **"Add"**
2. Select **"KV"** (Redis)
3. Choose a name (e.g., `albert-resize-kv`)
4. Select a region (choose closest to your users)
5. Click **"Create"**

**If you already have a KV database:**
1. Click on your KV database name
2. You'll see the dashboard with:
   - Connection details
   - Usage statistics
   - Keys/values browser (if available)

### Step 4: Get Connection Details

Once you're in the KV database dashboard:

1. **Find the connection details:**
   - Look for **"REST API"** section
   - You'll see:
     - `KV_REST_API_URL` - The API endpoint URL
     - `KV_REST_API_TOKEN` - The authentication token

2. **Copy these values:**
   - Click the copy icon next to each value
   - Save them securely

### Step 5: Add to Environment Variables

1. Go to your **Project** → **Settings** → **Environment Variables**
2. Add:
   - `KV_REST_API_URL` = (paste the URL)
   - `KV_REST_API_TOKEN` = (paste the token)
3. Select environment: **Production**, **Preview**, **Development**
4. Click **"Save"**

## Visual Guide

```
Vercel Dashboard
├── [Your Account/Team] (top right)
│   └── Storage (left sidebar)
│       └── KV Databases
│           └── [Your KV Database]
│               ├── Overview
│               ├── REST API (connection details)
│               ├── Usage
│               └── Settings
```

## Alternative: From Project Settings

You can also access KV from within a project:

1. Go to your **Project** dashboard
2. Click **Settings** tab
3. Click **Storage** (in left sidebar)
4. You'll see connected databases or option to create new ones

## Important Notes

- **KV is a paid feature**: Requires a Vercel Pro plan or higher
- **Free tier**: Limited storage and requests
- **Region selection**: Choose a region close to your users for better performance
- **Security**: Never commit KV credentials to Git (use environment variables)

## Troubleshooting

### Can't find Storage option?
- Make sure you're on a paid plan (Pro or higher)
- Check that you're logged into the correct account
- Try the direct URL: `https://vercel.com/dashboard/storage`

### Need to create KV database?
- Go to: `https://vercel.com/dashboard/storage`
- Click "Create Database"
- Select "KV"

### Can't see connection details?
- Make sure you're viewing the correct database
- Check that you have admin/owner permissions
- Try refreshing the page

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Storage Dashboard**: https://vercel.com/dashboard/storage
- **Documentation**: https://vercel.com/docs/storage/vercel-kv

## For AlbertResize Project

Once you have your KV credentials:

1. Add to Vercel environment variables:
   ```
   KV_REST_API_URL=https://your-kv-url.upstash.io
   KV_REST_API_TOKEN=your-token-here
   ```

2. Redeploy your project:
   ```bash
   vercel --prod
   ```

3. Test the connection by logging in (should create user in KV)

