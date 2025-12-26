import { handleOAuthCallback } from '../../lib/oauth.js';
import { createOrUpdateUser } from '../../lib/auth.js';
import { createSession } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provider, code } = req.query;

  if (!provider || !code) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (provider !== 'google' && provider !== 'github') {
    return res.status(400).json({ error: 'Invalid provider' });
  }

  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/auth/login?provider=${provider}`;
    
    // Exchange code for user profile
    const profile = await handleOAuthCallback(provider, code, redirectUri);
    
    // Create or update user
    const { userId, user } = await createOrUpdateUser(profile);
    
    // Create session
    const sessionToken = await createSession(userId);
    
    // Set cookie and redirect
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${30 * 24 * 60 * 60}`);
    res.redirect(`${baseUrl}/?logged_in=true`);
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: 'Authentication failed', message: error.message });
  }
}

