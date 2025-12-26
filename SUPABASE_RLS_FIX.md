# Fix Row Level Security (RLS) Issue

If you're getting errors when trying to insert users, RLS might be blocking the operation.

## Quick Fix: Disable RLS (For Testing)

Run this in Supabase SQL Editor:

```sql
-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
```

## Better Fix: Add Service Role Policy

If you want to keep RLS enabled, add policies for service_role:

```sql
-- Allow service_role full access to users
CREATE POLICY "Service role can manage users"
ON users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow service_role full access to credit_transactions
CREATE POLICY "Service role can manage credit_transactions"
ON credit_transactions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow service_role full access to subscriptions
CREATE POLICY "Service role can manage subscriptions"
ON subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

## Verify RLS Status

Check if RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'credit_transactions', 'subscriptions');
```

`rowsecurity = true` means RLS is enabled.

## After Fixing

1. Try logging in again
2. Check Vercel function logs for any remaining errors
3. Verify user was created in Supabase Table Editor

