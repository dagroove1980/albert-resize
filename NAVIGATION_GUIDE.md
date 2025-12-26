# Vercel Navigation Guide - Step by Step

Follow these steps to set up your AlbertResize project in Vercel.

## Step 1: Access Your Project

1. Go to **https://vercel.com/dashboard**
2. Log in with your Vercel account
3. Find and click on **"albert-resize"** project
   - If you don't see it, click **"Add New"** → **"Project"** → Import from Git → Select `dagroove1980/albert-resize`

## Step 2: Set Up Vercel KV Database

### 2a. Navigate to Storage
1. In your project, look at the **top navigation bar**
2. Click on your **account/team name** (top right)
3. In the dropdown, click **"Storage"** (or go directly to: https://vercel.com/dashboard/storage)

### 2b. Create KV Database
1. Click **"Create Database"** or **"Add"** button
2. Select **"KV"** (Redis)
3. Name it: `albert-resize-kv`
4. Choose a region (closest to your users)
5. Click **"Create"**

### 2c. Connect KV to Project
1. After creation, click **"Connect Project"** button
2. Search for: `albert-resize`
3. Select your project
4. **IMPORTANT**: Change **Custom Prefix** from `STORAGE` to `KV_REST_API`
5. Check all environments: Development, Preview, Production
6. Click **"Connect"**

### 2d. Verify KV Variables (Optional)
1. Go back to your project: Click **"albert-resize"** in top left
2. Go to **Settings** → **Environment Variables**
3. You should see:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - ✅ These are automatically added!

## Step 3: Add Other Environment Variables

### 3a. Navigate to Environment Variables
1. In your project dashboard
2. Click **"Settings"** tab (top navigation)
3. Click **"Environment Variables"** (left sidebar)

### 3b. Generate AUTH_SECRET
**In your terminal:**
```bash
openssl rand -base64 32
```
Copy the output (long random string)

**In Vercel:**
1. Click **"Create new"** tab (if not already selected)
2. **Key**: `AUTH_SECRET`
3. **Value**: Paste the generated secret
4. **Environments**: Click dropdown → Select **"All Environments"**
5. **Sensitive**: Toggle ON (should show "Enabled")
6. Click **"Save"**

### 3c. Add Google OAuth Variables

**First, get credentials from Google:**
1. Go to: https://console.cloud.google.com/
2. Select or create a project
3. Go to: **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth client ID"**
5. Application type: **Web application**
6. Authorized redirect URIs: `https://albert-resize.vercel.app/api/auth/login?provider=google`
   - (Replace with your actual Vercel domain)
7. Click **"Create"**
8. Copy **Client ID** and **Client Secret**

**Back in Vercel:**
1. Click **"Add Another"** button
2. **Key**: `GOOGLE_CLIENT_ID`
3. **Value**: Paste Client ID from Google
4. **Environments**: All Environments
5. **Sensitive**: Enabled
6. Click **"Save"**

7. Click **"Add Another"** again
8. **Key**: `GOOGLE_CLIENT_SECRET`
9. **Value**: Paste Client Secret from Google
10. **Environments**: All Environments
11. **Sensitive**: Enabled
12. Click **"Save"**

### 3d. Add GitHub OAuth Variables

**First, get credentials from GitHub:**
1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Application name: `AlbertResize`
4. Homepage URL: `https://albert-resize.vercel.app`
5. Authorization callback URL: `https://albert-resize.vercel.app/api/auth/login?provider=github`
6. Click **"Register application"**
7. Copy **Client ID**
8. Click **"Generate a new client secret"**
9. Copy the **Client Secret**

**Back in Vercel:**
1. Click **"Add Another"**
2. **Key**: `GITHUB_CLIENT_ID`
3. **Value**: Paste Client ID
4. **Environments**: All Environments
5. **Sensitive**: Enabled
6. Click **"Save"**

7. Click **"Add Another"**
8. **Key**: `GITHUB_CLIENT_SECRET`
9. **Value**: Paste Client Secret
10. **Environments**: All Environments
11. **Sensitive**: Enabled
12. Click **"Save"**

### 3e. Add Paddle Variables

**First, get credentials from Paddle:**
1. Go to: https://vendors.paddle.com/ (log in as dagroove1980)
2. Go to: **Developer Tools** → **API Keys**
3. Copy your **API Key**
4. Go to: **Developer Tools** → **Notifications** → **Webhooks**
5. Create webhook URL: `https://albert-resize.vercel.app/api/webhooks/paddle`
6. Copy the **Webhook Secret**
7. Create products and get **Price IDs** (they start with `pri_`)

**Back in Vercel:**
Add these one by one:

1. **PADDLE_API_KEY**
   - Value: Your Paddle API Key
   - Environments: All Environments
   - Sensitive: Enabled

2. **PADDLE_WEBHOOK_SECRET**
   - Value: Webhook secret from Paddle
   - Environments: All Environments
   - Sensitive: Enabled

3. **PADDLE_ENVIRONMENT**
   - Value: `sandbox` (for testing) or `production`
   - Environments: All Environments
   - Sensitive: Disabled

4. **PADDLE_STARTER_PRICE_ID**
   - Value: Your Starter plan price ID (e.g., `pri_01abc123`)
   - Environments: All Environments
   - Sensitive: Disabled

5. **PADDLE_PRO_PRICE_ID**
   - Value: Your Pro plan price ID
   - Environments: All Environments
   - Sensitive: Disabled

6. **PADDLE_BUSINESS_PRICE_ID**
   - Value: Your Business plan price ID
   - Environments: All Environments
   - Sensitive: Disabled

### 3f. Add Replicate Token

**Get token from Replicate:**
1. Go to: https://replicate.com/account/api-tokens
2. Copy your API token (starts with `r8_`)

**Back in Vercel:**
1. Click **"Add Another"**
2. **Key**: `REPLICATE_API_TOKEN`
3. **Value**: Paste Replicate token
4. **Environments**: All Environments
5. **Sensitive**: Enabled
6. Click **"Save"**

## Step 4: Verify All Variables

1. In **Settings** → **Environment Variables**
2. Scroll through the list
3. Verify you have all 13 variables:
   - ✅ KV_REST_API_URL (auto-added)
   - ✅ KV_REST_API_TOKEN (auto-added)
   - ✅ AUTH_SECRET
   - ✅ GOOGLE_CLIENT_ID
   - ✅ GOOGLE_CLIENT_SECRET
   - ✅ GITHUB_CLIENT_ID
   - ✅ GITHUB_CLIENT_SECRET
   - ✅ PADDLE_API_KEY
   - ✅ PADDLE_WEBHOOK_SECRET
   - ✅ PADDLE_ENVIRONMENT
   - ✅ PADDLE_STARTER_PRICE_ID
   - ✅ PADDLE_PRO_PRICE_ID
   - ✅ PADDLE_BUSINESS_PRICE_ID
   - ✅ REPLICATE_API_TOKEN

## Step 5: Redeploy

1. Go to **"Deployments"** tab (top navigation)
2. Find the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Or trigger a new deployment by pushing to GitHub

## Quick Navigation Shortcuts

- **Dashboard**: https://vercel.com/dashboard
- **Storage**: https://vercel.com/dashboard/storage
- **Your Project**: https://vercel.com/[team]/albert-resize
- **Environment Variables**: https://vercel.com/[team]/albert-resize/settings/environment-variables
- **Deployments**: https://vercel.com/[team]/albert-resize/deployments

## Troubleshooting

### Can't find Storage?
- Make sure you're on a Pro plan or higher
- Click your account name (top right) → Storage

### Variables not showing?
- Make sure you clicked "Save" after adding each one
- Refresh the page
- Check you're in the right project

### Need to edit a variable?
- Click on the variable name in the list
- Edit the value
- Click "Save"

### Want to delete a variable?
- Click on the variable
- Click "Delete" button
- Confirm deletion

