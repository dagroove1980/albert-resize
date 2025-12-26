import { getUserFromRequest } from '../../lib/auth.js';
import { getCreditHistory } from '../../lib/credits.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const limit = parseInt(req.query.limit) || 50;
    const history = await getCreditHistory(user.userId, limit);
    
    return res.status(200).json({ history });
  } catch (error) {
    console.error('Credit history error:', error);
    return res.status(500).json({ error: 'Failed to get credit history' });
  }
}

