# Post-Deployment Checklist

## ✅ Completed
- ✅ KV database created and connected
- ✅ Code updated to use Redis URL
- ✅ Project deployed

## 📋 Next Steps

### 1. Add Remaining Environment Variables

Go to: **Project → Settings → Environment Variables**

Add these variables one by one:

#### Authentication
- [ ] **AUTH_SECRET** = `MbAj5lo/iGxcBGR6PQ87fY4CXxc9VzK+a5hGnCsz1dY=` (already generated)
  - Environments: All Environments
  - Sensitive: Enabled

#### Google OAuth
1. Go to: https://console.cloud.google.com/
2. Create OAuth 2.0 credentials
3. Add redirect URI: `https://albert-resize.vercel.app/api/auth/login?provider=google`
4. Copy Client ID and Secret

- [ ] **GOOGLE_CLIENT_ID** = (from Google Cloud Console)
- [ ] **GOOGLE_CLIENT_SECRET** = (from Google Cloud Console)
  - Both: All Environments, Sensitive: Enabled

#### GitHub OAuth
1. Go to: https://github.com/settings/developers
2. Create new OAuth App
3. Authorization callback URL: `https://albert-resize.vercel.app/api/auth/login?provider=github`

- [ ] **GITHUB_CLIENT_ID** = (from GitHub OAuth App)
- [ ] **GITHUB_CLIENT_SECRET** = (from GitHub OAuth App)
  - Both: All Environments, Sensitive: Enabled

#### Paddle
1. Go to: https://vendors.paddle.com/
2. Get API key from Developer Tools → API Keys
3. Create products and get Price IDs
4. Set up webhook

- [ ] **PADDLE_API_KEY** = (from Paddle dashboard)
- [ ] **PADDLE_WEBHOOK_SECRET** = (from Paddle webhook settings)
- [ ] **PADDLE_ENVIRONMENT** = `sandbox` (for testing) or `production`
- [ ] **PADDLE_STARTER_PRICE_ID** = (Price ID, e.g., `pri_01abc123`)
- [ ] **PADDLE_PRO_PRICE_ID** = (Price ID)
- [ ] **PADDLE_BUSINESS_PRICE_ID** = (Price ID)
  - API_KEY and WEBHOOK_SECRET: Sensitive: Enabled
  - Others: Sensitive: Disabled

#### Replicate (Already Added ✅)
- ✅ **REPLICATE_API_TOKEN** = (already set)

### 2. Test Basic Functionality

After adding variables, test:

- [ ] **Homepage loads**: Visit https://albert-resize.vercel.app
- [ ] **Login works**: Try Google/GitHub OAuth
- [ ] **User created in KV**: Check if user appears after login
- [ ] **Pricing page**: Visit /pages/pricing
- [ ] **Account page**: Visit /pages/account (after login)

### 3. Set Up Paddle Webhook

1. In Paddle dashboard → Developer Tools → Notifications
2. Add webhook URL: `https://albert-resize.vercel.app/api/webhooks/paddle`
3. Select events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `subscription.resumed`
   - `subscription.past_due`
   - `transaction.completed`
   - `transaction.payment_failed`
4. Copy webhook secret → Add as `PADDLE_WEBHOOK_SECRET`

### 4. Test Subscription Flow

- [ ] **Create subscription** in Paddle (sandbox mode)
- [ ] **Webhook receives event**: Check Vercel function logs
- [ ] **Credits granted**: Check user account after subscription
- [ ] **Image processing**: Upload image and process (should deduct credit)

### 5. Update OAuth Redirect URLs

After deployment, update OAuth apps with actual domain:

**Google:**
- Redirect URI: `https://albert-resize.vercel.app/api/auth/login?provider=google`

**GitHub:**
- Callback URL: `https://albert-resize.vercel.app/api/auth/login?provider=github`

### 6. Monitor & Debug

- [ ] **Check Vercel logs**: Project → Functions → View Logs
- [ ] **Test error handling**: Try processing without credits
- [ ] **Verify webhooks**: Check Paddle webhook delivery logs
- [ ] **Monitor KV usage**: Check Redis dashboard for data

## Quick Test Commands

```bash
# Check deployment
curl https://albert-resize.vercel.app/

# Test auth endpoint (should redirect)
curl -I https://albert-resize.vercel.app/api/auth/authorize?provider=google

# Check if API is protected
curl -X POST https://albert-resize.vercel.app/api/process
# Should return 401 Unauthorized
```

## Troubleshooting

### Login not working?
- Check OAuth redirect URLs match exactly
- Verify CLIENT_ID and CLIENT_SECRET are correct
- Check Vercel function logs for errors

### KV not working?
- Verify `KV_REST_API_REDIS_URL` is set
- Check Redis connection in Redis Labs dashboard
- Review Vercel function logs

### Webhooks not working?
- Verify webhook URL is correct in Paddle
- Check `PADDLE_WEBHOOK_SECRET` matches
- Review Vercel function logs for webhook errors

### Credits not deducting?
- Check user has credits in KV
- Verify credit deduction logic in logs
- Test with a user that has credits

## Production Checklist

Before going live:

- [ ] All environment variables set
- [ ] OAuth apps configured with production URLs
- [ ] Paddle set to `production` mode
- [ ] Webhook URL updated to production domain
- [ ] Test full user flow: Signup → Subscribe → Process Image
- [ ] Monitor for errors in first 24 hours
- [ ] Set up error alerts/notifications

