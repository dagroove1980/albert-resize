# Git Repository Setup for dagroove1980

This repository is configured for the **dagroove1980** GitHub account.

## Current Status

✅ Git repository initialized
✅ Git user configured: `dagroove1980`
✅ Initial commit created
⏳ Remote repository needs to be created and connected

## Next Steps

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in as **dagroove1980**
2. Click the "+" icon → "New repository"
3. Repository settings:
   - **Name**: `albert-resize` (or your preferred name)
   - **Description**: "AI-powered image extension service with authentication and subscriptions"
   - **Visibility**: Private (recommended) or Public
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

### 2. Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
cd "/Users/david.scebat/Documents/Geek Automation/products/websites/AlbertResize"

# Add remote (replace YOUR_USERNAME with dagroove1980 and REPO_NAME with your repo name)
git remote add origin https://github.com/dagroove1980/albert-resize.git

# Or if using SSH:
git remote add origin git@github.com:dagroove1980/albert-resize.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Verify Configuration

```bash
# Check remote is set correctly
git remote -v

# Should show:
# origin  https://github.com/dagroove1980/albert-resize.git (fetch)
# origin  https://github.com/dagroove1980/albert-resize.git (push)

# Check git user for this repo
git config user.name
# Should show: dagroove1980

git config user.email
# Should show: dagroove1980@users.noreply.github.com
```

## Git Configuration

This repository uses **local** git configuration (only for this repo):
- **User**: dagroove1980
- **Email**: dagroove1980@users.noreply.github.com

This means:
- ✅ Commits from this repo will show as dagroove1980
- ✅ Your global git config remains unchanged
- ✅ Other repos are not affected

## Future Commits

All commits made in this directory will automatically use the dagroove1980 identity:

```bash
git add .
git commit -m "Your commit message"
git push
```

## Troubleshooting

### Authentication Issues

If you get authentication errors when pushing:

**Option 1: Use Personal Access Token**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use token as password when pushing

**Option 2: Use SSH**
1. Generate SSH key: `ssh-keygen -t ed25519 -C "dagroove1980@users.noreply.github.com"`
2. Add to GitHub: Settings → SSH and GPG keys → New SSH key
3. Use SSH URL for remote: `git@github.com:dagroove1980/albert-resize.git`

### Wrong User Showing in Commits

If commits show wrong user:
```bash
# Verify local config
git config --local user.name
git config --local user.email

# Reset if needed
git config --local user.name "dagroove1980"
git config --local user.email "dagroove1980@users.noreply.github.com"
```

## Repository Structure

```
albert-resize/
├── api/              # Serverless API functions
├── lib/              # Shared libraries
├── pages/            # Static pages (pricing, terms, etc.)
├── public/           # Static assets
├── index.html        # Main app page
├── landing.html      # Landing page
├── package.json      # Dependencies
├── vercel.json       # Vercel configuration
└── vite.config.js    # Build configuration
```

## Important Files

- `.gitignore` - Excludes node_modules, dist, .env files
- `.vercel/` - Vercel deployment config (excluded from git)
- `MIGRATION_GUIDE.md` - Guide for migrating to new Vercel account
- `README_SETUP.md` - Setup instructions for the application

## Connecting to Vercel

After pushing to GitHub:

1. Go to Vercel Dashboard
2. Add New Project
3. Import from Git → Select dagroove1980/albert-resize
4. Configure and deploy

See `MIGRATION_GUIDE.md` for detailed Vercel setup instructions.

