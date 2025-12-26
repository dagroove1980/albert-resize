# OAuth Troubleshooting: Error 401 invalid_client

## Problem
Getting "The OAuth client was not found" error when trying to sign in with Google.

## Common Causes

### 1. Environment Variable Not Set
**Check:** Is `GOOGLE_CLIENT_ID` set in Vercel?

**Fix:**
1. Go to Vercel → Project → Settings → Environment Variables
2. Verify `GOOGLE_CLIENT_ID` exists
3. Check it's not empty or has wrong value
4. Make sure it's set for **Production** environment

### 2. Redirect URI Mismatch
**Check:** Does the redirect URI in Google Console match exactly?

**Required redirect URI:**
```
https://albert-resize.vercel.app/api/auth/login?provider=google
```

**Fix:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth client
3. Under "Authorised redirect URIs", verify it matches exactly:
   - `https://albert-resize.vercel.app/api/auth/login?provider=google`
4. No trailing slashes, exact case, exact path

### 3. Wrong Client ID
**Check:** Is the Client ID in Vercel the same as in Google Console?

**Fix:**
1. Google Console → Copy the Client ID
2. Vercel → Settings → Environment Variables
3. Update `GOOGLE_CLIENT_ID` with the exact value
4. **Redeploy** after updating

### 4. OAuth Consent Screen Not Configured
**Check:** Is the OAuth consent screen set up?

**Fix:**
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Make sure it's configured (at least "External" user type)
3. Add your email as support email
4. Save

## Quick Fix Checklist

- [ ] `GOOGLE_CLIENT_ID` is set in Vercel (Production)
- [ ] `GOOGLE_CLIENT_SECRET` is set in Vercel (Production)
- [ ] Redirect URI in Google Console matches: `https://albert-resize.vercel.app/api/auth/login?provider=google`
- [ ] OAuth consent screen is configured
- [ ] Client ID in Vercel matches Google Console exactly
- [ ] Redeployed after adding/updating environment variables

## Verify Configuration

### Check Vercel Environment Variables
1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
2. Look for:
   - `GOOGLE_CLIENT_ID` (should show masked value)
   - `GOOGLE_CLIENT_SECRET` (should show masked value)
3. If missing, add them
4. Make sure they're set for **All Environments** or at least **Production**

### Check Google Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth client
3. Verify:
   - **Client ID** matches what's in Vercel
   - **Authorised redirect URIs** includes: `https://albert-resize.vercel.app/api/auth/login?provider=google`

## After Fixing

1. **Redeploy** your Vercel project:
   - Go to Deployments → Click "..." → Redeploy
   - OR push a commit to trigger auto-deploy

2. **Test again:**
   - Visit: https://albert-resize.vercel.app
   - Click "Login with Google"
   - Should redirect to Google login page

## Still Not Working?

Check Vercel function logs:
1. Go to: Vercel Dashboard → Your Project → Functions
2. Click on `/api/auth/authorize`
3. View recent logs
4. Look for errors mentioning `GOOGLE_CLIENT_ID` or redirect URI

