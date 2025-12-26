import { createClient } from '@supabase/supabase-js';

// In serverless, create a new client each time (no reuse across invocations)
function getSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase config check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
      hasAnonKey: !!process.env.SUPABASE_ANON_KEY,
      urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 20) : 'missing'
    });
    throw new Error(
      'Supabase credentials not configured. ' +
      'Need SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY) environment variables.'
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false // Important for serverless
    }
  });
}

/**
 * User data schema matches Redis version:
 * {
 *   userId: string,
 *   email: string,
 *   name: string,
 *   provider: 'google' | 'github',
 *   createdAt: timestamp,
 *   credits: number,
 *   subscriptionId: string | null,
 *   subscriptionStatus: 'active' | 'cancelled' | 'expired' | null
 * }
 */

export async function getUser(userId) {
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // PGRST116 = not found (this is OK)
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error getting user:', {
        userId,
        errorCode: error.code,
        errorMessage: error.message,
        errorDetails: error
      });
      throw new Error(`Failed to get user: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    // Convert to same format as Redis version
    return {
      userId: data.user_id,
      email: data.email,
      name: data.name,
      provider: data.provider,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      credits: data.credits || 0,
      subscriptionId: data.subscription_id,
      subscriptionStatus: data.subscription_status
    };
  } catch (error) {
    console.error(`Error getting user ${userId}:`, error);
    throw error;
  }
}

export async function setUser(userId, userData) {
  try {
    const client = getSupabase();
    
    // Prepare data for insert/update
    const insertData = {
      user_id: userId,
      email: userData.email || '',
      name: userData.name || null,
      provider: userData.provider || 'google',
      credits: userData.credits || 0,
      subscription_id: userData.subscriptionId || null,
      subscription_status: userData.subscriptionStatus || null,
      created_at: userData.createdAt || Date.now(),
      updated_at: Date.now()
    };

    console.log('Attempting to upsert user:', {
      userId,
      email: insertData.email,
      hasEmail: !!insertData.email
    });

    console.log('Calling Supabase upsert with:', {
      table: 'users',
      insertData,
      hasClient: !!client
    });

    const result = await client
      .from('users')
      .upsert(insertData, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    console.log('Supabase response:', {
      hasData: !!result.data,
      hasError: !!result.error,
      errorType: result.error ? typeof result.error : 'none',
      errorString: result.error ? String(result.error) : 'none',
      fullResult: JSON.stringify(result, null, 2)
    });

    const { data, error } = result;

    if (error) {
      // Log full error details
      const errorInfo = {
        userId,
        error: error,
        errorType: typeof error,
        errorString: String(error),
        errorCode: error?.code,
        errorMessage: error?.message,
        errorDetails: error,
        errorHint: error?.hint,
        errorStatus: error?.status,
        insertData,
        supabaseUrl: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 30) : 'missing'
      };
      
      console.error('Error setting user:', JSON.stringify(errorInfo, null, 2));
      
      // Create a more descriptive error message
      let errorMsg = 'Unknown Supabase error';
      if (error?.message) {
        errorMsg = error.message;
      } else if (error?.code) {
        errorMsg = `Error code: ${error.code}`;
      } else if (typeof error === 'object') {
        errorMsg = JSON.stringify(error);
      } else {
        errorMsg = String(error);
      }
      
      const fullError = `Failed to set user: ${errorMsg}${error?.hint ? ` (${error?.hint})` : ''}${error?.code ? ` [Code: ${error?.code}]` : ''}`;
      throw new Error(fullError);
    }

    if (!data) {
      throw new Error('Upsert succeeded but no data returned');
    }

    // Return in same format
    return {
      userId: data.user_id,
      email: data.email,
      name: data.name,
      provider: data.provider,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      credits: data.credits || 0,
      subscriptionId: data.subscription_id,
      subscriptionStatus: data.subscription_status
    };
  } catch (error) {
    console.error(`Error setting user ${userId}:`, error);
    throw error;
  }
}

export async function updateUser(userId, updates) {
  try {
    const user = await getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updated = { ...user, ...updates };
    return await setUser(userId, updated);
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
}

export async function deleteUser(userId) {
  try {
    const client = getSupabase();
    const { error } = await client
      .from('users')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
}

/**
 * Log credit transaction
 */
export async function logCreditTransaction(userId, transaction) {
  try {
    const client = getSupabase();
    const { error } = await client
      .from('credit_transactions')
      .insert({
        user_id: userId,
        type: transaction.type,
        amount: transaction.amount,
        reason: transaction.reason || null,
        balance: transaction.balance,
        timestamp: transaction.timestamp || Date.now()
      });

    if (error) {
      console.error('Failed to log credit transaction:', error);
      // Don't throw - logging failure shouldn't break the flow
    }
  } catch (error) {
    console.error('Failed to log credit transaction:', error);
    // Don't throw - logging failure shouldn't break the flow
  }
}

/**
 * Get credit history
 */
export async function getCreditHistory(userId, limit = 50) {
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to get credit history:', error);
      return [];
    }

    return (data || []).map(tx => ({
      type: tx.type,
      amount: tx.amount,
      reason: tx.reason,
      balance: tx.balance,
      timestamp: tx.timestamp
    }));
  } catch (error) {
    console.error('Failed to get credit history:', error);
    return [];
  }
}

/**
 * Store subscription details
 */
export async function setSubscription(subscriptionId, subscriptionData) {
  try {
    const client = getSupabase();
    const { error } = await client
      .from('subscriptions')
      .upsert({
        subscription_id: subscriptionId,
        user_id: subscriptionData.userId,
        plan: subscriptionData.plan,
        status: subscriptionData.status,
        created_at: subscriptionData.createdAt || Date.now(),
        updated_at: Date.now()
      }, {
        onConflict: 'subscription_id'
      });

    if (error) {
      console.error('Error setting subscription:', error);
      throw error;
    }
  } catch (error) {
    console.error(`Error setting subscription ${subscriptionId}:`, error);
    throw error;
  }
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId) {
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from('subscriptions')
      .select('*')
      .eq('subscription_id', subscriptionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting subscription:', error);
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.subscription_id,
      userId: data.user_id,
      plan: data.plan,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error(`Error getting subscription ${subscriptionId}:`, error);
    throw error;
  }
}

/**
 * Find user by subscription ID
 */
export async function findUserBySubscriptionId(subscriptionId) {
  try {
    const subscription = await getSubscription(subscriptionId);
    if (!subscription) {
      return null;
    }
    return await getUser(subscription.userId);
  } catch (error) {
    console.error(`Error finding user by subscription ${subscriptionId}:`, error);
    return null;
  }
}

/**
 * Store subscription -> user mapping (for quick lookup)
 */
export async function setSubscriptionUserMapping(subscriptionId, userId) {
  // This is handled by the subscriptions table, but keeping for compatibility
  // The subscription already has user_id, so we can query it directly
  return;
}

