# Fix SUPABASE_URL

## Problem
Your `SUPABASE_URL` is set to `https://supabase.com/dashboard` - this is **WRONG**!

It should be your **project URL**, not the dashboard URL.

## How to Find Your Project URL

1. Go to: Supabase Dashboard → Your Project
2. Click: **Settings** (gear icon) → **API**
3. Look for: **Project URL**
   - It should look like: `https://xxxxx.supabase.co`
   - NOT: `https://supabase.com/dashboard`

## Fix in Vercel

1. Go to: Vercel Dashboard → Project → Settings → Environment Variables
2. Find: `SUPABASE_URL`
3. Click to edit it
4. Change the value to your **Project URL** from Supabase
   - Example: `https://abcdefghijklmnop.supabase.co`
5. Click **Save**

## Verify

After updating, test again:
- Visit: https://albert-resize.vercel.app/api/test-db
- Should work now!

## Quick Check

Your `SUPABASE_URL` should:
- ✅ Start with `https://`
- ✅ End with `.supabase.co`
- ✅ Be unique to your project
- ❌ NOT be `https://supabase.com/dashboard`

