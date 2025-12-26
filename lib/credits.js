import { kv } from '@vercel/kv';
import { getUser, updateUser } from './kv.js';

/**
 * Check if user has sufficient credits
 */
export async function hasCredits(userId, amount = 1) {
  const user = await getUser(userId);
  if (!user) {
    return false;
  }
  return (user.credits || 0) >= amount;
}

/**
 * Deduct credits from user account
 */
export async function deductCredits(userId, amount = 1, reason = 'api_call') {
  const user = await getUser(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  const currentCredits = user.credits || 0;
  if (currentCredits < amount) {
    throw new Error('Insufficient credits');
  }
  
  const newCredits = currentCredits - amount;
  await updateUser(userId, { credits: newCredits });
  
  // Log credit transaction
  await logCreditTransaction(userId, {
    type: 'deduction',
    amount,
    reason,
    balance: newCredits,
    timestamp: Date.now()
  });
  
  return newCredits;
}

/**
 * Add credits to user account
 */
export async function addCredits(userId, amount, reason = 'subscription') {
  const user = await getUser(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  const currentCredits = user.credits || 0;
  const newCredits = currentCredits + amount;
  await updateUser(userId, { credits: newCredits });
  
  // Log credit transaction
  await logCreditTransaction(userId, {
    type: 'addition',
    amount,
    reason,
    balance: newCredits,
    timestamp: Date.now()
  });
  
  return newCredits;
}

/**
 * Get credit balance
 */
export async function getCredits(userId) {
  const user = await getUser(userId);
  if (!user) {
    return 0;
  }
  return user.credits || 0;
}

/**
 * Log credit transaction
 */
async function logCreditTransaction(userId, transaction) {
  try {
    const key = `credits:${userId}:history`;
    // Use lpush to add to the beginning of the list
    await kv.lpush(key, JSON.stringify(transaction));
    // Keep only last 100 transactions
    await kv.ltrim(key, 0, 99);
  } catch (error) {
    console.error('Failed to log credit transaction:', error);
    // Don't throw - logging failure shouldn't break the flow
  }
}

/**
 * Get credit history
 */
export async function getCreditHistory(userId, limit = 50) {
  try {
    const key = `credits:${userId}:history`;
    const history = await kv.lrange(key, 0, limit - 1);
    // Parse JSON strings back to objects
    return (history || []).map(item => {
      try {
        return typeof item === 'string' ? JSON.parse(item) : item;
      } catch {
        return item;
      }
    });
  } catch (error) {
    console.error('Failed to get credit history:', error);
    return [];
  }
}

