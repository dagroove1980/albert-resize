import { getUser, setUser } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test Supabase connection
    const testUserId = 'test:123';
    const testUser = {
      userId: testUserId,
      email: 'test@example.com',
      name: 'Test User',
      provider: 'google',
      createdAt: Date.now(),
      credits: 0,
      subscriptionId: null,
      subscriptionStatus: null
    };

    // Try to set a test user
    await setUser(testUserId, testUser);
    
    // Try to get it back
    const retrieved = await getUser(testUserId);

    return res.status(200).json({
      success: true,
      message: 'Database connection works!',
      testUser: retrieved,
      envCheck: {
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
        hasAnonKey: !!process.env.SUPABASE_ANON_KEY,
        urlPrefix: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 30) : 'missing'
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause
    });
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      errorName: error.name,
      envCheck: {
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
        hasAnonKey: !!process.env.SUPABASE_ANON_KEY,
        urlPrefix: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 30) : 'missing'
      }
    });
  }
}

