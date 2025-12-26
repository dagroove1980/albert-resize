# Supabase Troubleshooting

## Test Your Setup

### 1. Verify Tables Exist

Run this in Supabase SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'credit_transactions', 'subscriptions');
```

Should return 3 rows.

### 2. Test Insert (Manual)

Try inserting a test user:
```sql
INSERT INTO users (user_id, email, name, provider, credits, created_at)
VALUES ('test:123', 'test@example.com', 'Test User', 'google', 0, EXTRACT(EPOCH FROM NOW())::BIGINT * 1000);
```

Should succeed.

### 3. Test Query

```sql
SELECT * FROM users WHERE user_id = 'test:123';
```

Should return the test user.

### 4. Check RLS Policies

Go to: Supabase → Authentication → Policies

For `users` table:
- If RLS is enabled, you need policies
- For service_role (backend), you can disable RLS OR add policy:
  ```sql
  CREATE POLICY "Allow service role full access"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
  ```

### 5. Verify Environment Variables

In Vercel, check:
- `SUPABASE_URL` starts with `https://`
- `SUPABASE_SERVICE_KEY` starts with `eyJ` (JWT token)
- Both are set for **Production** environment

### 6. Check Function Logs

After trying to log in:
1. Go to: Vercel Dashboard → Project → Functions
2. Click on `/api/auth/login`
3. View recent logs
4. Look for error messages

## Common Errors

### "relation 'users' does not exist"
→ Tables not created. Run the SQL from `SUPABASE_SETUP.md`

### "new row violates row-level security policy"
→ RLS is blocking. Disable RLS or add policy (see #4 above)

### "column 'xxx' does not exist"
→ Column name mismatch. Check table schema matches code

### "invalid input syntax for type bigint"
→ Timestamp format issue. Code uses milliseconds (Date.now()), SQL expects bigint

## Quick Fix: Disable RLS (Testing Only)

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
```

**Note**: Re-enable RLS in production with proper policies!

