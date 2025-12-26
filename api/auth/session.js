import { getUserFromRequest } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return res.status(200).json({ authenticated: false });
    }
    
    // Don't expose sensitive data
    const { credits, subscriptionId, subscriptionStatus, email, name, provider } = user;
    
    return res.status(200).json({
      authenticated: true,
      user: {
        email,
        name,
        provider,
        credits,
        subscriptionId,
        subscriptionStatus
      }
    });
  } catch (error) {
    console.error('Session error:', error);
    return res.status(500).json({ error: 'Failed to get session' });
  }
}

