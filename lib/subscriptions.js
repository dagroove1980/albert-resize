import { kv } from '@vercel/kv';
import { getUser, updateUser } from './kv.js';
import { addCredits } from './credits.js';

/**
 * Subscription plans configuration
 */
export const PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    credits: 25,
    price: 9.99,
    priceId: process.env.PADDLE_STARTER_PRICE_ID || ''
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    credits: 100,
    price: 29.99,
    priceId: process.env.PADDLE_PRO_PRICE_ID || ''
  },
  business: {
    id: 'business',
    name: 'Business',
    credits: 500,
    price: 99.99,
    priceId: process.env.PADDLE_BUSINESS_PRICE_ID || ''
  }
};

/**
 * Get plan by ID
 */
export function getPlan(planId) {
  return PLANS[planId] || null;
}

/**
 * Update user subscription
 */
export async function updateSubscription(userId, subscriptionData) {
  const user = await getUser(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  const updates = {
    subscriptionId: subscriptionData.id || subscriptionData.subscription_id,
    subscriptionStatus: subscriptionData.status || subscriptionData.subscription_status,
    subscriptionPlan: subscriptionData.plan || subscriptionData.variant_id,
    subscriptionUpdatedAt: Date.now()
  };
  
  await updateUser(userId, updates);
  
  // Store subscription details separately
  const subscriptionId = updates.subscriptionId;
  if (subscriptionId) {
    await kv.set(`subscription:${subscriptionId}`, {
      ...subscriptionData,
      userId,
      updatedAt: Date.now()
    });
  }
  
  return updates;
}

/**
 * Grant subscription credits
 */
export async function grantSubscriptionCredits(userId, planId) {
  const plan = getPlan(planId);
  if (!plan) {
    throw new Error('Invalid plan');
  }
  
  await addCredits(userId, plan.credits, `subscription:${planId}`);
  return plan.credits;
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId) {
  return await kv.get(`subscription:${subscriptionId}`);
}

