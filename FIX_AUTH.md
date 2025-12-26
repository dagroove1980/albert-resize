# Fixing GitHub Authentication for dagroove1980

## Problem
Git is trying to authenticate with the wrong GitHub account (davidscebat instead of dagroove1980).

## Solution Options

### Option 1: Use SSH (Recommended)

**Step 1: Check if you have SSH key for dagroove1980**
```bash
ls -la ~/.ssh/id_ed25519* ~/.ssh/id_rsa*
```

**Step 2: Generate SSH key for dagroove1980 (if needed)**
```bash
ssh-keygen -t ed25519 -C "dagroove1980@users.noreply.github.com" -f ~/.ssh/id_ed25519_dagroove1980
```

**Step 3: Add SSH key to GitHub**
1. Copy the public key:
   ```bash
   cat ~/.ssh/id_ed25519_dagroove1980.pub
   ```
2. Go to GitHub → dagroove1980 account → Settings → SSH and GPG keys
3. Click "New SSH key"
4. Paste the key and save

**Step 4: Configure SSH to use the correct key**
```bash
# Add to ~/.ssh/config
cat >> ~/.ssh/config << EOF

Host github.com-dagroove1980
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_dagroove1980
EOF
```

**Step 5: Update remote URL**
```bash
cd "/Users/david.scebat/Documents/Geek Automation/products/websites/AlbertResize"
git remote set-url origin git@github.com-dagroove1980:dagroove1980/albert-resize.git
```

**Step 6: Test connection**
```bash
ssh -T git@github.com-dagroove1980
# Should say: Hi dagroove1980! You've successfully authenticated...
```

**Step 7: Push**
```bash
git push -u origin main
```

### Option 2: Use Personal Access Token

**Step 1: Create Personal Access Token**
1. Log in to GitHub as **dagroove1980**
2. Go to Settings → Developer settings → Personal access tokens → Tokens (classic)
3. Click "Generate new token (classic)"
4. Name: "AlbertResize Repo"
5. Select scopes: `repo` (all repo permissions)
6. Generate token
7. **Copy the token immediately** (you won't see it again!)

**Step 2: Update remote URL with token**
```bash
cd "/Users/david.scebat/Documents/Geek Automation/products/websites/AlbertResize"
git remote set-url origin https://dagroove1980:YOUR_TOKEN_HERE@github.com/dagroove1980/albert-resize.git
```

Replace `YOUR_TOKEN_HERE` with the actual token.

**Step 3: Push**
```bash
git push -u origin main
```

### Option 3: Use Git Credential Helper

**Step 1: Clear cached credentials**
```bash
git credential-osxkeychain erase
host=github.com
protocol=https
```

Press Enter twice.

**Step 2: Update remote to HTTPS**
```bash
cd "/Users/david.scebat/Documents/Geek Automation/products/websites/AlbertResize"
git remote set-url origin https://github.com/dagroove1980/albert-resize.git
```

**Step 3: Push (will prompt for credentials)**
```bash
git push -u origin main
```

When prompted:
- Username: `dagroove1980`
- Password: Use a Personal Access Token (not your GitHub password)

## Quick Fix (If SSH is already set up)

If you already have SSH keys configured for dagroove1980:

```bash
cd "/Users/david.scebat/Documents/Geek Automation/products/websites/AlbertResize"
git remote set-url origin git@github.com:dagroove1980/albert-resize.git
git push -u origin main
```

## Verify Authentication

After fixing, verify:
```bash
git remote -v
# Should show the correct URL

git push -u origin main
# Should work without authentication errors
```

## Troubleshooting

### Still getting 403 errors?
- Make sure you're logged into GitHub as dagroove1980
- Verify the repository exists and you have access
- Check that SSH key is added to dagroove1980 account (not davidscebat)

### SSH key not working?
```bash
# Test SSH connection
ssh -T git@github.com

# If it says "Hi davidscebat!", you need to use the dagroove1980-specific SSH config
```

### Want to use different credentials per repo?
Use Git credential helper with different URLs or SSH config as shown in Option 1.

