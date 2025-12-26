import { createClient } from 'redis';

// Global Redis client instance (reused across requests)
let redisClient = null;

/**
 * Initialize Redis client
 * Uses KV_REST_API_REDIS_URL from Vercel KV connection
 */
async function getRedisClient() {
  const redisUrl = process.env.KV_REST_API_REDIS_URL;
  
  if (!redisUrl) {
    throw new Error(
      'Vercel KV credentials not configured. ' +
      'Need KV_REST_API_REDIS_URL environment variable. ' +
      'This should be automatically added when you connect KV database to your project.'
    );
  }

  // In serverless, create a new client each time to avoid connection issues
  // Connection pooling is handled by Redis
  if (!redisClient || !redisClient.isOpen) {
    redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            return new Error('Redis connection failed after 3 retries');
          }
          return Math.min(retries * 100, 1000);
        }
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
      // Reset client on error so it reconnects next time
      redisClient = null;
    });

    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('Redis client connected successfully');
      }
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      redisClient = null;
      throw new Error(`Redis connection failed: ${error.message}`);
    }
  }

  return redisClient;
}

/**
 * Get KV client (Redis client wrapper)
 */
export async function getKV() {
  return await getRedisClient();
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
  try {
    const kv = await getKV();
    const value = await kv.get(`user:${userId}`);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error getting user ${userId}:`, error);
    throw error;
  }
}

export async function setUser(userId, userData) {
  try {
    const kv = await getKV();
    await kv.set(`user:${userId}`, JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error(`Error setting user ${userId}:`, error);
    throw error;
  }
}

export async function updateUser(userId, updates) {
  const kv = await getKV();
  const user = await getUser(userId);
  if (!user) {
    throw new Error('User not found');
  }
  const updated = { ...user, ...updates };
  await kv.set(`user:${userId}`, JSON.stringify(updated));
  return updated;
}

export async function deleteUser(userId) {
  const kv = await getKV();
  await kv.del(`user:${userId}`);
}

