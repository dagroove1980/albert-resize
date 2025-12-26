export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provider } = req.query;

  if (!provider || provider !== 'google') {
    return res.status(400).json({ error: 'Invalid provider. Only Google OAuth is supported.' });
  }

  // Use production URL or fallback to VERCEL_URL or localhost
  const baseUrl = process.env.VERCEL_ENV === 'production' 
    ? 'https://albert-resize.vercel.app'
    : process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:5173';
  
  const redirectUri = `${baseUrl}/api/auth/login?provider=${provider}`;
  
  // Validate required env vars
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error('GOOGLE_CLIENT_ID is not set');
    return res.status(500).json({ error: 'OAuth configuration error' });
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  });
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  res.redirect(authUrl);
}

