# Push Instructions for dagroove1980 Account

## Current Issue
Git is trying to authenticate with the wrong account (davidscebat instead of dagroove1980).

## Solution: Use Personal Access Token

### Step 1: Create Personal Access Token

1. **Log in to GitHub as dagroove1980**
   - Go to https://github.com/login
   - Log in with dagroove1980 credentials

2. **Create Token**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name: `AlbertResize Repo Access`
   - Expiration: Choose your preference (90 days recommended)
   - Select scopes:
     - ✅ `repo` (all repository permissions)
   - Click "Generate token"
   - **IMPORTANT**: Copy the token immediately! You won't see it again.

### Step 2: Push Using Token

**Option A: Use token in URL (one-time)**
```bash
cd "/Users/david.scebat/Documents/Geek Automation/products/websites/AlbertResize"

# Replace YOUR_TOKEN with the actual token
git remote set-url origin https://dagroove1980:YOUR_TOKEN@github.com/dagroove1980/albert-resize.git

git push -u origin main
```

**Option B: Use token when prompted (recommended)**
```bash
cd "/Users/david.scebat/Documents/Geek Automation/products/websites/AlbertResize"

git push -u origin main
```

When prompted:
- **Username**: `dagroove1980`
- **Password**: Paste your Personal Access Token (NOT your GitHub password)

### Step 3: Store Credentials (Optional)

To avoid entering the token every time:

```bash
# Store credentials in macOS Keychain
git config --global credential.helper osxkeychain

# Then push (will prompt once, then remember)
git push -u origin main
```

## Alternative: Set Up SSH for dagroove1980

If you prefer SSH:

1. **Generate SSH key for dagroove1980**
   ```bash
   ssh-keygen -t ed25519 -C "dagroove1980@users.noreply.github.com" -f ~/.ssh/id_ed25519_dagroove1980
   ```

2. **Add to SSH config**
   ```bash
   cat >> ~/.ssh/config << 'EOF'
   
   Host github-dagroove1980
       HostName github.com
       User git
       IdentityFile ~/.ssh/id_ed25519_dagroove1980
   EOF
   ```

3. **Add public key to GitHub**
   ```bash
   cat ~/.ssh/id_ed25519_dagroove1980.pub
   # Copy and add to: https://github.com/settings/keys
   ```

4. **Update remote**
   ```bash
   git remote set-url origin git@github-dagroove1980:dagroove1980/albert-resize.git
   git push -u origin main
   ```

## Quick Test

After setting up, test the connection:

```bash
git remote -v
# Should show: https://github.com/dagroove1980/albert-resize.git

git push -u origin main
# Should push successfully
```

## Current Status

✅ Repository configured for dagroove1980
✅ Remote URL set to HTTPS
⏳ Need Personal Access Token to push
⏳ Need to push to GitHub

## Next Steps

1. Create Personal Access Token (see Step 1 above)
2. Push using one of the methods above
3. Verify on GitHub that code is pushed
4. Connect to Vercel from dagroove1980 GitHub account

