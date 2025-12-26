# Supabase Keys Explained

## Two Types of Keys

Supabase provides two API keys:

### 1. **anon key** (Public/Anonymous Key)
- **Purpose**: For client-side code (browser, mobile apps)
- **Security**: Limited by Row Level Security (RLS) policies
- **Use**: Frontend applications
- **Starts with**: `eyJ...` (JWT token)

### 2. **service_role key** (Service Role Key)
- **Purpose**: For server-side code (backend, serverless functions)
- **Security**: **Bypasses RLS** - full database access
- **Use**: Backend API, serverless functions, admin operations
- **Starts with**: `eyJ...` (JWT token, but different from anon key)
- **⚠️ IMPORTANT**: Keep this secret! Never expose to client-side code

## Which One to Use?

For **Vercel serverless functions** (your case):
- ✅ **Use `SUPABASE_SERVICE_KEY`** (service_role key)
- This bypasses RLS and allows your backend to manage users

## Where to Find Them

1. Go to: **Supabase Dashboard** → Your Project
2. Click: **Settings** (gear icon) → **API**
3. You'll see:

```
Project URL: https://xxxxx.supabase.co

Project API keys
┌─────────────────────────────────────────┐
│ anon public                            │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │ ← This is SUPABASE_ANON_KEY
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ service_role (secret)                   │ ← This is SUPABASE_SERVICE_KEY
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │
└─────────────────────────────────────────┘
```

## For Your Vercel Environment Variables

Add these:

1. **SUPABASE_URL**
   - Value: Your Project URL (e.g., `https://xxxxx.supabase.co`)

2. **SUPABASE_SERVICE_KEY** ⭐ **USE THIS ONE**
   - Value: The `service_role` key (the secret one)
   - Mark as **Sensitive** ✅

3. **SUPABASE_ANON_KEY** (Optional)
   - Value: The `anon public` key
   - Only needed if you have client-side code accessing Supabase

## Quick Check

If you're not sure which one you added:
- **service_role key**: Usually longer, and Supabase shows it as "secret"
- **anon key**: Shorter, shown as "public"

## Security Note

⚠️ **Never** use `service_role` key in:
- Browser JavaScript
- Mobile apps
- Any client-side code

✅ **Only** use `service_role` key in:
- Server-side code (Node.js, Python, etc.)
- Serverless functions (Vercel, AWS Lambda, etc.)
- Backend APIs

## Current Code

Your code in `lib/db.js` uses:
```javascript
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
```

This means:
1. It prefers `SUPABASE_SERVICE_KEY` (service_role) ✅
2. Falls back to `SUPABASE_ANON_KEY` if service key not found

**Recommendation**: Use `SUPABASE_SERVICE_KEY` (service_role) for your Vercel functions.

