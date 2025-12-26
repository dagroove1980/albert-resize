import { SignJWT, jwtVerify } from 'jose';
import { getUser, setUser } from './kv.js';

const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET) {
  throw new Error('AUTH_SECRET environment variable is required');
}

const secret = new TextEncoder().encode(AUTH_SECRET);

/**
 * Create a session token for a user
 */
export async function createSession(userId) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
  
  return token;
}

/**
 * Verify a session token and return userId
 */
export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.userId;
  } catch (error) {
    return null;
  }
}

/**
 * Get user from session cookie
 */
export async function getUserFromRequest(req) {
  const cookies = req.headers.cookie || '';
  const sessionCookie = cookies
    .split(';')
    .find(c => c.trim().startsWith('session='));
  
  if (!sessionCookie) {
    return null;
  }
  
  const token = sessionCookie.split('=')[1];
  const userId = await verifySession(token);
  
  if (!userId) {
    return null;
  }
  
  const user = await getUser(userId);
  return user;
}

/**
 * Create or update user from OAuth profile
 */
export async function createOrUpdateUser(profile) {
  const { id, email, name, provider } = profile;
  const userId = `${provider}:${id}`;
  
  const existingUser = await getUser(userId);
  
  if (existingUser) {
    // Update existing user
    const updated = {
      ...existingUser,
      email,
      name,
      updatedAt: Date.now()
    };
    await setUser(userId, updated);
    return { userId, user: updated };
  }
  
  // Create new user
  const newUser = {
    userId,
    email,
    name,
    provider,
    createdAt: Date.now(),
    credits: 0,
    subscriptionId: null,
    subscriptionStatus: null
  };
  
  await setUser(userId, newUser);
  return { userId, user: newUser };
}

