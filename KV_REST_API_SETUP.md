# Getting REST API Credentials from Redis URL

## Current Situation

You have: `KV_REST_API_REDIS_URL` (Redis connection string)
You need: `KV_REST_API_URL` + `KV_REST_API_TOKEN` (REST API credentials)

## Solution: Extract from Redis URL

From your Redis URL:
```
redis://default:NCTk4bYhV2v4Lsyh0hE7qwkm31RVapUN@redis-16733.c91.us-east-1-3.ec2.cloud.redislabs.com:16733
```

**Token extracted**: `NCTk4bYhV2v4Lsyh0hE7qwkm31RVapUN`

## Get REST API URL

### Option 1: Check Upstash Dashboard

1. Click **"Open in Redis"** button (you saw this on the KV page)
2. This opens Upstash dashboard
3. Look for **"REST API"** section
4. Copy the REST API URL (should be like `https://xxxx.upstash.io`)

### Option 2: Convert Redis Host to REST API

The REST API URL is usually:
- Format: `https://[database-id].upstash.io`
- Your Redis host: `redis-16733.c91.us-east-1-3.ec2.cloud.redislabs.com`
- Try: `https://16733-c91.upstash.io` or similar

But this might not work - **Option 1 is better**.

### Option 3: Use Redis URL Directly (Alternative)

If REST API isn't available, we can switch to using `redis` package instead of `@vercel/kv`.

## Quick Fix: Add Variables Manually

Once you have the REST API URL:

1. Go to: **Settings** → **Environment Variables**
2. Add:
   - **Key**: `KV_REST_API_URL`
   - **Value**: `https://xxxx.upstash.io` (from Upstash dashboard)
   - **Environments**: All Environments
   - **Sensitive**: Enabled
3. Add:
   - **Key**: `KV_REST_API_TOKEN`
   - **Value**: `NCTk4bYhV2v4Lsyh0hE7qwkm31RVapUN` (from Redis URL)
   - **Environments**: All Environments
   - **Sensitive**: Enabled

## Next Steps

1. **Click "Open in Redis"** button on your KV database page
2. In Upstash dashboard, find **"REST API"** section
3. Copy the REST API URL
4. Add both variables to Vercel Environment Variables
5. Redeploy

Let me know what you find in the Upstash dashboard!

