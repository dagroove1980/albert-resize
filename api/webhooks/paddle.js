import { verifyWebhookSignature } from '../../lib/paddle.js';
import { getUser, updateUser } from '../../lib/kv.js';
import { updateSubscription, grantSubscriptionCredits, getPlan } from '../../lib/subscriptions.js';
import { kv } from '@vercel/kv';

/**
 * Map Paddle price IDs to plan IDs
 * Set these based on your actual Paddle product prices
 */
const PRICE_TO_PLAN = {
  // Example: 'pri_01abc123': 'starter'
  // Set these in environment variables or here directly
};

/**
 * Get plan ID from Paddle price ID
 */
function getPlanFromPrice(priceId) {
  // First check environment variables
  if (process.env.PADDLE_STARTER_PRICE_ID === priceId) return 'starter';
  if (process.env.PADDLE_PRO_PRICE_ID === priceId) return 'pro';
  if (process.env.PADDLE_BUSINESS_PRICE_ID === priceId) return 'business';
  
  // Then check mapping
  return PRICE_TO_PLAN[priceId] || 'starter'; // Default to starter
}

/**
 * Handle Paddle webhook events
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['paddle-signature'] || req.headers['x-paddle-signature'];
  const rawBody = JSON.stringify(req.body);

  // Verify webhook signature
  if (signature) {
    try {
      if (!verifyWebhookSignature(rawBody, signature)) {
        console.warn('Paddle webhook signature verification failed');
        // In production, uncomment:
        // return res.status(401).json({ error: 'Invalid signature' });
      }
    } catch (error) {
      console.error('Webhook verification error:', error);
      // In production, return error
    }
  }

  const event = req.body;
  const eventType = event.event_type || event.type;

  console.log('Paddle webhook event:', eventType);

  try {
    switch (eventType) {
      case 'subscription.created':
        await handleSubscriptionCreated(event);
        break;
      
      case 'subscription.updated':
        await handleSubscriptionUpdated(event);
        break;
      
      case 'subscription.canceled':
        await handleSubscriptionCancelled(event);
        break;
      
      case 'subscription.resumed':
        await handleSubscriptionResumed(event);
        break;
      
      case 'subscription.past_due':
        await handleSubscriptionPastDue(event);
        break;
      
      case 'transaction.completed':
        await handleTransactionCompleted(event);
        break;
      
      case 'transaction.payment_failed':
        await handlePaymentFailed(event);
        break;
      
      default:
        console.log('Unhandled webhook event:', eventType);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({ error: 'Webhook processing failed', message: error.message });
  }
}

/**
 * Handle subscription.created event
 */
async function handleSubscriptionCreated(event) {
  const subscription = event.data;
  const customData = subscription.custom_data || {};
  let userId = customData.user_id;

  if (!userId) {
    // Try to find user by subscription ID
    const user = await findUserBySubscriptionId(subscription.id);
    if (!user) {
      console.error('No user_id in subscription custom data');
      return;
    }
    userId = user.userId;
  }

  // Determine plan from price
  const priceId = subscription.items?.[0]?.price_id || subscription.price_id;
  const planId = getPlanFromPrice(priceId);

  // Update user subscription
  await updateSubscription(userId, {
    id: subscription.id,
    status: subscription.status,
    price_id: priceId,
    plan: planId
  });

  // Store subscription -> user mapping
  await kv.set(`subscription_user:${subscription.id}`, userId);

  // Grant initial credits
  await grantSubscriptionCredits(userId, planId);

  console.log(`Subscription created for user ${userId}, plan: ${planId}`);
}

/**
 * Handle subscription.updated event
 */
async function handleSubscriptionUpdated(event) {
  const subscription = event.data;
  const user = await findUserBySubscriptionId(subscription.id);
  
  if (!user) {
    console.error('Could not find user for subscription update');
    return;
  }

  const priceId = subscription.items?.[0]?.price_id || subscription.price_id;
  const planId = getPlanFromPrice(priceId);

  await updateSubscription(user.userId, {
    id: subscription.id,
    status: subscription.status,
    price_id: priceId,
    plan: planId
  });
}

/**
 * Handle subscription.canceled event
 */
async function handleSubscriptionCancelled(event) {
  const subscription = event.data;
  const user = await findUserBySubscriptionId(subscription.id);
  
  if (user) {
    await updateSubscription(user.userId, {
      id: subscription.id,
      status: 'cancelled'
    });
  }
}

/**
 * Handle subscription.resumed event
 */
async function handleSubscriptionResumed(event) {
  const subscription = event.data;
  const user = await findUserBySubscriptionId(subscription.id);
  
  if (user) {
    await updateSubscription(user.userId, {
      id: subscription.id,
      status: 'active'
    });
  }
}

/**
 * Handle subscription.past_due event
 */
async function handleSubscriptionPastDue(event) {
  const subscription = event.data;
  const user = await findUserBySubscriptionId(subscription.id);
  
  if (user) {
    await updateSubscription(user.userId, {
      id: subscription.id,
      status: 'past_due'
    });
  }
}

/**
 * Handle transaction.completed event (monthly renewal)
 */
async function handleTransactionCompleted(event) {
  const transaction = event.data;
  const subscriptionId = transaction.subscription_id;
  
  if (!subscriptionId) {
    // One-time payment, not subscription
    return;
  }

  const user = await findUserBySubscriptionId(subscriptionId);
  
  if (!user) {
    console.error('Could not find user for transaction');
    return;
  }

  // Get subscription to determine plan
  const subscription = await kv.get(`subscription:${subscriptionId}`);
  if (subscription && subscription.plan) {
    // Grant monthly credits
    await grantSubscriptionCredits(user.userId, subscription.plan);
    
    // Update subscription status
    await updateSubscription(user.userId, {
      id: subscriptionId,
      status: 'active'
    });

    console.log(`Transaction completed for user ${user.userId}, granted ${getPlan(subscription.plan)?.credits} credits`);
  }
}

/**
 * Handle payment.failed event
 */
async function handlePaymentFailed(event) {
  const transaction = event.data;
  const subscriptionId = transaction.subscription_id;
  
  if (subscriptionId) {
    const user = await findUserBySubscriptionId(subscriptionId);
    if (user) {
      console.log(`Payment failed for user ${user.userId}`);
      // Optionally update subscription status
    }
  }
}

/**
 * Helper to find user by subscription ID
 */
async function findUserBySubscriptionId(subscriptionId) {
  // Check subscription -> user mapping
  const userId = await kv.get(`subscription_user:${subscriptionId}`);
  
  if (userId) {
    return await getUser(userId);
  }
  
  // Try to get from subscription data
  const subscription = await kv.get(`subscription:${subscriptionId}`);
  if (subscription && subscription.userId) {
    return await getUser(subscription.userId);
  }
  
  return null;
}

