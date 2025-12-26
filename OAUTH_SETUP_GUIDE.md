# OAuth Setup Guide

This guide walks you through setting up OAuth for Google and GitHub authentication.

## Google OAuth 2.0 Setup

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account
3. If you don't have a project, create one:
   - Click the project dropdown at the top
   - Click "New Project"
   - Name it: `AlbertResize` (or any name)
   - Click "Create"

### Step 2: Enable Google+ API (if needed)

1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for "Google+ API" or "People API"
3. Click on it and click **Enable**

### Step 3: Create OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** (unless you have a Google Workspace)
3. Fill in the required fields:
   - **App name**: `AlbertResize`
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **Save and Continue**
5. On **Scopes** page, click **Save and Continue** (no need to add scopes)
6. On **Test users** page, click **Save and Continue** (skip for now)
7. Review and click **Back to Dashboard**

### Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** at the top
3. Select **OAuth client ID**
4. If prompted, choose **Web application**
5. Fill in:
   - **Name**: `AlbertResize Web Client`
   - **Authorized JavaScript origins**:
     - `https://albert-resize.vercel.app`
     - `http://localhost:5173` (for local testing)
   - **Authorized redirect URIs**:
     - `https://albert-resize.vercel.app/api/auth/login?provider=google`
     - `http://localhost:5173/api/auth/login?provider=google` (for local testing)
6. Click **Create**
7. **IMPORTANT**: Copy the **Client ID** and **Client Secret** immediately
   - You'll see a popup with these values
   - Save them securely (you'll add them to Vercel)

### Step 5: Add to Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - **Name**: `GOOGLE_CLIENT_ID`
   - **Value**: (paste Client ID)
   - **Environments**: All Environments
   - **Sensitive**: Enabled ✅
3. Add:
   - **Name**: `GOOGLE_CLIENT_SECRET`
   - **Value**: (paste Client Secret)
   - **Environments**: All Environments
   - **Sensitive**: Enabled ✅
4. Click **Save** for each

---

## GitHub OAuth Setup

### Step 1: Go to GitHub Developer Settings

1. Visit: https://github.com/settings/developers
2. Sign in to GitHub
3. Click **OAuth Apps** in the left sidebar
4. Click **New OAuth App**

### Step 2: Create OAuth App

Fill in the form:

- **Application name**: `AlbertResize`
- **Homepage URL**: `https://albert-resize.vercel.app`
- **Authorization callback URL**: 
  - `https://albert-resize.vercel.app/api/auth/login?provider=github`
  - (This is the most important field - must match exactly!)

### Step 3: Register Application

1. Click **Register application**
2. You'll see your app details page
3. **IMPORTANT**: Click **Generate a new client secret**
4. Copy both:
   - **Client ID** (visible immediately)
   - **Client secret** (only shown once - copy it now!)

### Step 4: Add to Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - **Name**: `GITHUB_CLIENT_ID`
   - **Value**: (paste Client ID)
   - **Environments**: All Environments
   - **Sensitive**: Enabled ✅
3. Add:
   - **Name**: `GITHUB_CLIENT_SECRET`
   - **Value**: (paste Client Secret)
   - **Environments**: All Environments
   - **Sensitive**: Enabled ✅
4. Click **Save** for each

---

## Verify Setup

After adding all environment variables:

1. **Redeploy** your Vercel project (or wait for auto-deploy)
2. Visit: `https://albert-resize.vercel.app`
3. Click **Login** or **Sign in**
4. Try both Google and GitHub login buttons
5. You should be redirected to the provider's login page
6. After authorizing, you should be redirected back to your site

## Troubleshooting

### Google OAuth Issues

**Error: "redirect_uri_mismatch"**
- Check that the redirect URI in Google Console matches exactly:
  - `https://albert-resize.vercel.app/api/auth/login?provider=google`
- Make sure there are no trailing slashes or typos

**Error: "access_denied"**
- Check OAuth consent screen is configured
- Make sure you've added test users if app is in testing mode

**Error: "invalid_client"**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check they're added to Vercel environment variables
- Make sure "Sensitive" is enabled

### GitHub OAuth Issues

**Error: "redirect_uri_mismatch"**
- Check callback URL in GitHub OAuth App settings:
  - Must be: `https://albert-resize.vercel.app/api/auth/login?provider=github`
- Case-sensitive and must match exactly

**Error: "bad_verification_code"**
- Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct
- Check they're added to Vercel
- Make sure "Sensitive" is enabled

### General Issues

**Login button doesn't work**
- Check browser console for errors
- Verify environment variables are set in Vercel
- Check Vercel function logs: Project → Functions → View Logs

**Redirects to wrong page**
- Verify redirect URLs match exactly in both OAuth provider and your code
- Check `lib/oauth.js` has correct redirect paths

**Session not persisting**
- Check `AUTH_SECRET` is set in Vercel
- Verify cookies are being set (check browser DevTools → Application → Cookies)

## Quick Reference

### Google OAuth URLs
- **Console**: https://console.cloud.google.com/
- **Credentials**: https://console.cloud.google.com/apis/credentials
- **OAuth Consent**: https://console.cloud.google.com/apis/credentials/consent

### GitHub OAuth URLs
- **Developer Settings**: https://github.com/settings/developers
- **OAuth Apps**: https://github.com/settings/developers

### Your App URLs
- **Production**: https://albert-resize.vercel.app
- **Auth Endpoint**: https://albert-resize.vercel.app/api/auth/authorize?provider={google|github}
- **Callback**: https://albert-resize.vercel.app/api/auth/login?provider={google|github}

## Security Notes

1. **Never commit** Client IDs or Secrets to Git
2. Always mark them as **Sensitive** in Vercel
3. Use different credentials for development and production (optional)
4. Rotate secrets if they're ever exposed
5. Limit OAuth app access to only what's needed

