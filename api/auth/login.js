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

  if (provider !== 'google') {
    return res.status(400).json({ error: 'Invalid provider. Only Google OAuth is supported.' });
  }

  try {
    // Check required environment variables
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('Google OAuth credentials not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to environment variables.');
    }

    if (!process.env.AUTH_SECRET) {
      throw new Error('AUTH_SECRET not configured. Please add AUTH_SECRET to environment variables.');
    }

    if (!process.env.SUPABASE_URL || (!process.env.SUPABASE_SERVICE_KEY && !process.env.SUPABASE_ANON_KEY)) {
      throw new Error('Supabase credentials not configured. Please add SUPABASE_URL and SUPABASE_SERVICE_KEY to environment variables.');
    }

    // Use production URL or fallback to VERCEL_URL or localhost
    const baseUrl = process.env.VERCEL_ENV === 'production'
      ? 'https://albert-resize.vercel.app'
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:5173';
    const redirectUri = `${baseUrl}/api/auth/login?provider=${provider}`;

    console.log('Starting OAuth callback:', { provider, hasCode: !!code, redirectUri });

    // Exchange code for user profile
    let profile;
    try {
      profile = await handleOAuthCallback(provider, code, redirectUri);
      console.log('OAuth profile received:', { hasProfile: !!profile, profileId: profile?.id });
    } catch (error) {
      console.error('OAuth callback failed:', error);
      throw error;
    }

    // Create or update user
    let userId, user;
    try {
      const result = await createOrUpdateUser(profile);
      userId = result.userId;
      user = result.user;
      console.log('User created/updated:', { userId, email: user?.email });
    } catch (error) {
      console.error('User creation failed:', error);
      throw error;
    }

    // Create session
    let sessionToken;
    try {
      sessionToken = await createSession(userId);
      console.log('Session created:', { hasToken: !!sessionToken });
    } catch (error) {
      console.error('Session creation failed:', error);
      throw error;
    }

    res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${30 * 24 * 60 * 60}`);
    res.redirect(`${baseUrl}/app?logged_in=true`);
  } catch (error) {
    console.error('OAuth error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error cause:', error.cause);
    console.error('Environment check:', {
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
      hasSupabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
      hasAuthSecret: !!process.env.AUTH_SECRET,
      vercelEnv: process.env.VERCEL_ENV,
      vercelUrl: process.env.VERCEL_URL
    });

    // Return more detailed error in development
    const isDev = process.env.VERCEL_ENV !== 'production';
    res.status(500).json({
      error: 'Authentication failed',
      message: error.message,
      errorName: error.name,
      stack: isDev ? error.stack : undefined,
      details: isDev ? {
        cause: error.cause,
        code: error.code
      } : undefined
    });
  }
}

