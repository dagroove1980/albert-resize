import { kv } from '@vercel/kv';

/**
 * Initialize KV client
 */
export function getKV() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    throw new Error('Vercel KV credentials not configured');
  }
  return kv;
}

/**
 * User data schema:
 * {
 *   userId: string,
 *   email: string,
 *   name: string,
 *   provider: 'google' | 'github',
 *   createdAt: timestamp,
 *   credits: number,
 *   subscriptionId: string | null,
 *   subscriptionStatus: 'active' | 'cancelled' | 'expired' | null
 * }
 */

export async function getUser(userId) {
  const kv = getKV();
  return await kv.get(`user:${userId}`);
}

export async function setUser(userId, userData) {
  const kv = getKV();
  return await kv.set(`user:${userId}`, userData);
}

export async function updateUser(userId, updates) {
  const kv = getKV();
  const user = await getUser(userId);
  if (!user) {
    throw new Error('User not found');
  }
  const updated = { ...user, ...updates };
  await kv.set(`user:${userId}`, updated);
  return updated;
}

export async function deleteUser(userId) {
  const kv = getKV();
  await kv.del(`user:${userId}`);
}

