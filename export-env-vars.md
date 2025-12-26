# Environment Variables Export Template

Copy this template and fill in your values from the current Vercel account:

## Vercel KV
```
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

## Authentication
```
AUTH_SECRET=
```

## Google OAuth
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## GitHub OAuth
```
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## Paddle
```
PADDLE_API_KEY=
PADDLE_WEBHOOK_SECRET=
PADDLE_ENVIRONMENT=sandbox (or production)
PADDLE_STARTER_PRICE_ID=
PADDLE_PRO_PRICE_ID=
PADDLE_BUSINESS_PRICE_ID=
```

## Replicate
```
REPLICATE_API_TOKEN=
```

## Instructions

1. Go to your current Vercel Dashboard
2. Navigate to: Project → Settings → Environment Variables
3. Copy each value above
4. Save this file securely (it contains sensitive data!)
5. Use these values when setting up the new account

## Security Note

⚠️ **DO NOT commit this file to Git if it contains actual values!**
This file should only contain the template structure.

