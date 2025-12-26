export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provider } = req.query;

  if (!provider || (provider !== 'google' && provider !== 'github')) {
    return res.status(400).json({ error: 'Invalid provider' });
  }

  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
  const redirectUri = `${baseUrl}/api/auth/login?provider=${provider}`;

  let authUrl;

  if (provider === 'google') {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent'
    });
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  } else if (provider === 'github') {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: redirectUri,
      scope: 'read:user user:email'
    });
    authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  res.redirect(authUrl);
}

