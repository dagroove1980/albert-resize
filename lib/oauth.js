// Google OAuth configuration
export function getGoogleProvider() {
  return {
    id: 'google',
    name: 'Google',
    type: 'oauth',
    authorization: {
      url: 'https://accounts.google.com/o/oauth2/v2/auth',
      params: {
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent'
      }
    },
    token: 'https://oauth2.googleapis.com/token',
    userinfo: 'https://www.googleapis.com/oauth2/v2/userinfo',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    async profile(profile) {
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        image: profile.picture
      };
    }
  };
}

/**
 * GitHub OAuth configuration
 */
export function getGitHubProvider() {
  return {
    id: 'github',
    name: 'GitHub',
    type: 'oauth',
    authorization: {
      url: 'https://github.com/login/oauth/authorize',
      params: {
        scope: 'read:user user:email'
      }
    },
    token: 'https://github.com/login/oauth/access_token',
    userinfo: 'https://api.github.com/user',
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    async profile(profile) {
      // Fetch email separately if not included
      let email = profile.email;
      if (!email) {
        const emailResponse = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `token ${profile.access_token}`
          }
        });
        const emails = await emailResponse.json();
        email = emails.find(e => e.primary)?.email || emails[0]?.email;
      }
      
      return {
        id: profile.id.toString(),
        email: email,
        name: profile.name || profile.login,
        image: profile.avatar_url
      };
    }
  };
}

/**
 * Handle OAuth callback and exchange code for token
 */
export async function handleOAuthCallback(provider, code, redirectUri) {
  const providerConfig = provider === 'google' ? getGoogleProvider() : getGitHubProvider();
  
  // Exchange code for token
  const tokenResponse = await fetch(providerConfig.token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    },
    body: new URLSearchParams({
      client_id: providerConfig.clientId,
      client_secret: providerConfig.clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });
  
  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error('Token exchange failed:', {
      status: tokenResponse.status,
      statusText: tokenResponse.statusText,
      body: errorText
    });
    throw new Error(`Failed to exchange code for token: ${tokenResponse.status} ${tokenResponse.statusText}`);
  }
  
  const tokens = await tokenResponse.json();
  const accessToken = tokens.access_token;
  
  if (!accessToken) {
    console.error('No access token in response:', tokens);
    throw new Error('No access token received from OAuth provider');
  }
  
  // Get user profile
  const profileResponse = await fetch(providerConfig.userinfo, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  
  if (!profileResponse.ok) {
    const errorText = await profileResponse.text();
    console.error('Profile fetch failed:', {
      status: profileResponse.status,
      statusText: profileResponse.statusText,
      body: errorText
    });
    throw new Error(`Failed to fetch user profile: ${profileResponse.status} ${profileResponse.statusText}`);
  }
  
  let profile = await profileResponse.json();
  
  if (!profile || !profile.id) {
    console.error('Invalid profile response:', profile);
    throw new Error('Invalid profile data received from OAuth provider');
  }
  
  // Apply profile transformation if exists
  if (providerConfig.profile) {
    profile = await providerConfig.profile({ ...profile, access_token: accessToken });
  }
  
  return {
    ...profile,
    provider: providerConfig.id
  };
}

