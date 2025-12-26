import { getUserFromRequest } from '../../lib/auth.js';
import { createHostedCheckout } from '../../lib/paddle.js';
import { PLANS } from '../../lib/subscriptions.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { planId } = req.body;
    
    if (!planId || !PLANS[planId]) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const plan = PLANS[planId];
    
    if (!plan.priceId) {
      return res.status(500).json({ error: 'Plan not configured. Please set PADDLE_*_PRICE_ID environment variables.' });
    }

    // Create checkout session
    const checkoutUrl = await createHostedCheckout(plan.priceId, user.userId, user.email);

    return res.status(200).json({ 
      checkoutUrl,
      plan: {
        id: plan.id,
        name: plan.name,
        credits: plan.credits,
        price: plan.price
      }
    });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return res.status(500).json({ error: 'Failed to create checkout', message: error.message });
  }
}

