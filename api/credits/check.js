import { getUserFromRequest } from '../../lib/auth.js';
import { getCredits } from '../../lib/credits.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const credits = await getCredits(user.userId);
    
    return res.status(200).json({ credits });
  } catch (error) {
    console.error('Credit check error:', error);
    return res.status(500).json({ error: 'Failed to check credits' });
  }
}

