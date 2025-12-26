# Domain Setup Guide

## Current Situation
- **Old account**: `albert-resize.vercel.app`
- **New account (dagroove1980)**: `albert-resize-amber.vercel.app`

## Option 1: Transfer Domain by Renaming Project (Recommended)

Vercel project domains are based on project names. To get `albert-resize.vercel.app`:

### Step 1: Rename Project in New Account
1. Go to: Vercel Dashboard → Project → Settings → General
2. Scroll to **Project Name**
3. Change from `albert-resize-amber` to `albert-resize`
4. Save

This will give you: `albert-resize.vercel.app`

### Step 2: Rename/Delete Old Project (Optional)
If you want to free up the name in the old account:
1. Log in to old Vercel account
2. Go to the old project
3. Settings → General → Rename to something else (e.g., `albert-resize-old`)
   - OR delete the project if you don't need it

## Option 2: Add Custom Domain

If you have your own domain (e.g., `albertresize.com`):

1. Go to: Vercel Dashboard → Project → Settings → Domains
2. Click **Add Domain**
3. Enter your domain (e.g., `albertresize.com`)
4. Follow DNS configuration instructions:
   - Add CNAME record pointing to Vercel
   - Or add A record if using apex domain

## Option 3: Use Different Vercel Domain

Keep `albert-resize-amber.vercel.app` - it's unique and works fine!

## Quick Steps to Rename Project

```bash
# Or use Vercel Dashboard:
# Settings → General → Project Name → Change to "albert-resize"
```

After renaming, your site will be available at:
- `https://albert-resize.vercel.app`

**Note**: It may take a few minutes for DNS to propagate.

