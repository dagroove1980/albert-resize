/**
 * Paddle API client
 * Paddle is a payment processor that works internationally and handles VAT/taxes
 */

const PADDLE_API_URL = process.env.PADDLE_ENVIRONMENT === 'sandbox' 
  ? 'https://sandbox-api.paddle.com'
  : 'https://api.paddle.com';

const API_KEY = process.env.PADDLE_API_KEY;

/**
 * Create a hosted checkout session with Paddle
 * Uses Paddle's Transaction API to create a checkout link
 */
export async function createHostedCheckout(priceId, userId, email) {
  if (!API_KEY) {
    throw new Error('PADDLE_API_KEY not configured');
  }

  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

  // Paddle Transaction API - create a transaction with checkout
  const response = await fetch(`${PADDLE_API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [
        {
          price_id: priceId,
          quantity: 1
        }
      ],
      customer_email: email,
      custom_data: {
        user_id: userId
      },
      checkout: {
        url: `${baseUrl}/?checkout=success`
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Paddle API error:', errorText);
    throw new Error(`Failed to create checkout: ${errorText}`);
  }

  const data = await response.json();
  
  // Paddle returns checkout URL in data.checkout.url or data.data.checkout.url
  return data.data?.checkout?.url || data.checkout?.url || data.url;
}

/**
 * Verify webhook signature
 * Paddle signs webhooks with HMAC SHA256
 */
export function verifyWebhookSignature(payload, signature) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('PADDLE_WEBHOOK_SECRET not configured');
  }

  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  
  // Paddle sends signature in format: "signature=abc123"
  const receivedSig = signature.includes('=') ? signature.split('=')[1] : signature;
  
  return receivedSig === expectedSignature;
}

/**
 * Get subscription details from Paddle
 */
export async function getSubscription(subscriptionId) {
  if (!API_KEY) {
    throw new Error('PADDLE_API_KEY not configured');
  }

  const response = await fetch(`${PADDLE_API_URL}/subscriptions/${subscriptionId}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch subscription');
  }

  return await response.json();
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId) {
  if (!API_KEY) {
    throw new Error('PADDLE_API_KEY not configured');
  }

  const response = await fetch(`${PADDLE_API_URL}/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to cancel subscription: ${error}`);
  }

  return await response.json();
}

