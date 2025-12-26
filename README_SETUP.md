# AlbertResize Setup Guide

## Environment Variables

Add these to your Vercel project settings:

### Vercel KV
- `KV_REST_API_URL` - From Vercel KV dashboard
- `KV_REST_API_TOKEN` - From Vercel KV dashboard

### Authentication
- `AUTH_SECRET` - Generate a random secret (e.g., `openssl rand -base64 32`)

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-domain.vercel.app/api/auth/login?provider=google`
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `https://your-domain.vercel.app/api/auth/login?provider=github`
- `GITHUB_CLIENT_ID` - From GitHub OAuth App
- `GITHUB_CLIENT_SECRET` - From GitHub OAuth App

### Paddle
1. Create an account at [Paddle](https://paddle.com) (works internationally, including Israel)
2. Set up your business details
3. Create 3 subscription products (Starter, Pro, Business) with recurring prices
4. Get price IDs for each product (they start with `pri_`)
- `PADDLE_API_KEY` - From Paddle dashboard > Developer Tools > API Keys
- `PADDLE_WEBHOOK_SECRET` - Set in Paddle webhook settings
- `PADDLE_ENVIRONMENT` - Set to `sandbox` for testing or `production` for live
- `PADDLE_STARTER_PRICE_ID` - Price ID for Starter plan (e.g., `pri_01abc123`)
- `PADDLE_PRO_PRICE_ID` - Price ID for Pro plan
- `PADDLE_BUSINESS_PRICE_ID` - Price ID for Business plan

### Replicate (existing)
- `REPLICATE_API_TOKEN` - Your Replicate API token

## Paddle Webhook Setup

1. In Paddle dashboard, go to Developer Tools > Notifications
2. Add webhook URL: `https://your-domain.vercel.app/api/webhooks/paddle`
3. Select events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `subscription.resumed`
   - `subscription.past_due`
   - `transaction.completed`
   - `transaction.payment_failed`
4. Copy the webhook secret and set as `PADDLE_WEBHOOK_SECRET`

## Vercel KV Setup

1. In Vercel dashboard, go to Storage > Create Database
2. Select "KV" (Redis)
3. Copy the connection details to environment variables

## Testing

1. Deploy to Vercel
2. Test OAuth login flow
3. Test subscription checkout
4. Test webhook with Paddle sandbox mode
5. Verify credits are granted on subscription

## Notes

- Paddle automatically handles VAT/taxes for international customers
- Set `PADDLE_ENVIRONMENT=sandbox` for testing, `production` for live
- Webhook signature verification is currently lenient for development - enable strict checking in production
- Credits are deducted optimistically (before processing) - consider implementing refund logic for failed processing
- Paddle price IDs start with `pri_` - make sure to use the correct format

