# Payment Provider Options for Israel-Based Businesses

Since LemonSqueezy had issues, here are alternatives that work well for Israeli businesses:

## Current Implementation: Paddle

**Paddle** is now integrated as the payment provider. It:
- ✅ Works internationally (including Israel)
- ✅ Handles VAT/taxes automatically
- ✅ Supports subscriptions
- ✅ Good API and webhooks
- ✅ Merchant of Record (handles compliance)

### Setup Steps:
1. Sign up at [paddle.com](https://paddle.com)
2. Complete business verification
3. Create subscription products with recurring prices
4. Get API keys from Developer Tools
5. Set up webhooks
6. Configure environment variables (see README_SETUP.md)

## Alternative Options (if Paddle doesn't work)

### 1. **Payoneer** (Israeli company)
- ✅ Israeli-founded, works great for Israeli businesses
- ✅ Supports multiple currencies
- ⚠️ Less developer-friendly API
- ⚠️ May require manual integration

### 2. **2Checkout (Verifone)**
- ✅ International payment processor
- ✅ Supports subscriptions
- ✅ Works in Israel
- ⚠️ More complex setup

### 3. **PayPal Personal Account**
- ✅ Easy to set up
- ✅ Works internationally
- ⚠️ Not ideal for subscriptions (limited recurring payment features)
- ⚠️ Higher fees

### 4. **Direct Bank Transfer + Manual Credits**
- ✅ Simple, no fees
- ✅ Works anywhere
- ⚠️ Requires manual credit granting
- ⚠️ Not scalable

### 5. **Crypto Payments**
- ✅ Works internationally
- ✅ No chargebacks
- ⚠️ Complex for users
- ⚠️ Volatility risk

## Recommendation

**Start with Paddle** - it's the most similar to LemonSqueezy and should work well. If Paddle has issues:

1. **For quick MVP**: Use PayPal Personal with manual credit top-ups
2. **For production**: Consider Payoneer or 2Checkout
3. **For simplicity**: Direct bank transfer with manual processing

## Switching Payment Providers

To switch from Paddle to another provider:

1. Update `lib/paddle.js` with new provider's API
2. Update `api/webhooks/paddle.js` with new webhook format
3. Update `api/checkout/create.js` to use new checkout flow
4. Update environment variables
5. Update `README_SETUP.md` with new setup instructions

The rest of the system (auth, credits, subscriptions) remains the same.

