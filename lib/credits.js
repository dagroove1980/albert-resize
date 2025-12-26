import { getUser, updateUser, logCreditTransaction, getCreditHistory } from './db.js';

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

// Re-export getCreditHistory for convenience
export { getCreditHistory } from './db.js';

