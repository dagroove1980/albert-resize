# Paddle Payment Integration Guide

This guide explains how to fully enable and test Paddle payments for AlbertResize.

## 1. Create Paddle Sandbox Account

1. Go to **[sandbox-login.paddle.com/signup](https://sandbox-login.paddle.com/signup)**
2. Create a new account (this is separate from the production Paddle account).
3. If asked for a website, put `https://albert-resize.vercel.app` (or your personal site).
4. Verify your email.

## 2. Get API Keys

1. Log in to the **Paddle Sandbox Dashboard**.
2. Go to **Developer Tools** > **Authentication**.
3. Copy the **API Key** (you may need to generate one).
4. Save this; you will set it as `PADDLE_API_KEY`.

## 3. Create Products (Subscription Plans)

You need to create 3 products in Paddle corresponding to the plans in `lib/subscriptions.js`.

### Starter Plan
1. Go to **Catalog** > **Products**.
2. Click **New Product**.
3. Name: `Starter Plan`
4. Tax Category: `Digital Goods` (or Standard Digital)
5. **Create Price**:
   - Currency: `USD`
   - Amount: `9.99` (matches code)
   - Frequency: `Monthly`
6. Save and Copy the **Price ID** (starts with `pri_...`).
   - This will be `PADDLE_STARTER_PRICE_ID`.

### Pro Plan
1. Create another product: `Pro Plan`
2. Price: `29.99` / Monthly
3. Copy **Price ID**.
   - This will be `PADDLE_PRO_PRICE_ID`.

### Business Plan
1. Create another product: `Business Plan`
2. Price: `99.99` / Monthly
3. Copy **Price ID**.
   - This will be `PADDLE_BUSINESS_PRICE_ID`.

## 4. Set Environment Variables

Go to your **Vercel Project Settings** > **Environment Variables** and add the following:

| Variable Name | Value | Description |
|---|---|---|
| `ENABLE_PAYMENTS` | `true` | Enables credit checks and deduction |
| `PADDLE_ENVIRONMENT` | `sandbox` | Use `sandbox` for testing, `production` for real $. |
| `PADDLE_API_KEY` | `(Your API Key)` | From Step 2 |
| `PADDLE_STARTER_PRICE_ID` | `pri_...` | From Step 3 (Starter) |
| `PADDLE_PRO_PRICE_ID` | `pri_...` | From Step 3 (Pro) |
| `PADDLE_BUSINESS_PRICE_ID` | `pri_...` | From Step 3 (Business) |
| `PADDLE_WEBHOOK_SECRET` | `(See Step 5)` | Webhook Secret |

## 5. Setup Webhooks

Paddle needs to notify your server when a payment happens.

1. Go to **Developer Tools** > **Notifications** (or Webhooks).
2. Click **New Destination**.
3. **URL**: `https://albert-resize.vercel.app/api/webhooks/paddle`
   - **Important**: This must be a publicly accessible URL.
   - If testing locally, you need a tunnel like `ngrok` (e.g., `https://your-ngrok.io/api/webhooks/paddle`).
4. **Events**: Select all relevant events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `subscription.activated` (or resumed)
   - `transaction.completed`
   - `transaction.payment_failed`
5. Save the destination.
6. Copy the **Secret Key** (starts with `nw_...` or similar).
   - This will be `PADDLE_WEBHOOK_SECRET`.

## 6. Testing

1. **Redeploy** to Vercel so the environment variables take effect.
2. Go to your site and log in.
3. Click "Subscribe" (or run out of credits to see the prompt).
4. Select a plan.
5. You should be redirected to a Paddle Checkout page.
   - Since it's Sandbox, you can use a test card.
   - Card Number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
6. Complete the payment.
7. You should be redirected back to the app (`/?checkout=success`).
8. Check your credits! They should be updated automatically via the webhook.

## 7. Going Live

1. Sign up for a **Production** Paddle account (requires verification).
2. Re-create your products in the Production dashboard.
3. Update your Vercel Environment Variables:
   - `PADDLE_ENVIRONMENT` -> `production`
   - `PADDLE_API_KEY` -> (Production Key)
   - `PADDLE_*_PRICE_ID` -> (Production Price IDs)
   - `PADDLE_WEBHOOK_SECRET` -> (Production Webhook Secret)
4. Update the Webhook URL in Paddle Production to your Vercel URL.
