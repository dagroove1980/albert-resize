# Supabase Setup Guide

## Why Supabase?
- ✅ Free tier (500MB database, 2GB bandwidth)
- ✅ Works perfectly with Vercel serverless functions
- ✅ No connection pooling issues
- ✅ Simple JavaScript client
- ✅ Built-in REST API

## Step 1: Create Supabase Project

1. Go to: https://supabase.com/
2. Sign up / Log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `albert-resize`
   - **Database Password**: (choose a strong password - save it!)
   - **Region**: Choose closest to your users
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup

## Step 2: Get Connection Details

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

3. Go to **Settings** → **Database**
4. Copy **Connection string** → **URI** (starts with `postgresql://...`)

## Step 3: Create Database Tables

In Supabase dashboard, go to **SQL Editor** and run:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  provider TEXT NOT NULL,
  credits INTEGER DEFAULT 0,
  subscription_id TEXT,
  subscription_status TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT
);

-- Credit transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id),
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT,
  balance INTEGER NOT NULL,
  timestamp BIGINT NOT NULL
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  subscription_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id),
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
```

## Step 4: Add to Vercel Environment Variables

Go to: Vercel → Project → Settings → Environment Variables

Add these:

- **SUPABASE_URL** = (your Project URL)
- **SUPABASE_ANON_KEY** = (your anon/public key)
- **SUPABASE_SERVICE_KEY** = (your service_role key) - Sensitive ✅

All set for: **All Environments**

## Step 5: Deploy

After adding variables, redeploy and test!

