# SSH Setup for GitHub

This guide explains how to set up SSH keys for GitHub operations, which is recommended for secure git operations.

## Why Use SSH?

SSH (Secure Shell) provides:
- ✅ Secure authentication without passwords
- ✅ No need to enter credentials repeatedly
- ✅ Better security for automated workflows
- ✅ Support for multiple GitHub accounts

## Prerequisites

- Git installed on your system
- Access to terminal/command line
- GitHub account

## Setup Steps

### Step 1: Check for Existing SSH Keys

```bash
# Check for existing SSH keys
ls -al ~/.ssh
```

Look for files like:
- `id_rsa.pub` or `id_ed25519.pub` (public key)
- `id_rsa` or `id_ed25519` (private key)

If you have existing keys, you can use them or create new ones.

### Step 2: Generate a New SSH Key

```bash
# Generate a new SSH key (recommended: ed25519)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Or use RSA if ed25519 is not supported
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

**When prompted:**
- Press Enter to accept the default file location (`~/.ssh/id_ed25519`)
- Optionally enter a passphrase for extra security
- Confirm the passphrase if you set one

### Step 3: Start SSH Agent

```bash
# Start the ssh-agent
eval "$(ssh-agent -s)"

# Add your SSH key to the agent
ssh-add ~/.ssh/id_ed25519
# Or for RSA:
# ssh-add ~/.ssh/id_rsa
```

### Step 4: Copy Your Public Key

```bash
# Display and copy your public key
cat ~/.ssh/id_ed25519.pub
# Or for RSA:
# cat ~/.ssh/id_rsa.pub
```

**Copy the entire output** (starts with `ssh-ed25519` or `ssh-rsa`)

### Step 5: Add SSH Key to GitHub

1. **Go to GitHub Settings**
   - Click your profile picture → **Settings**
   - Or go to: https://github.com/settings/keys

2. **Add New SSH Key**
   - Click **SSH and GPG keys** in the left sidebar
   - Click **New SSH key** button

3. **Configure the Key**
   - **Title**: Give it a descriptive name (e.g., "My Laptop", "Work Computer")
   - **Key type**: Select "Authentication Key"
   - **Key**: Paste your public key (from Step 4)
   - Click **Add SSH key**

4. **Confirm**
   - Enter your GitHub password if prompted
   - The key should now appear in your list

### Step 6: Test SSH Connection

```bash
# Test the connection
ssh -T git@github.com
```

You should see:
```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

### Step 7: Update Git Remote URLs (If Needed)

If your repository is currently using HTTPS, switch to SSH:

```bash
# Check current remote URL
git remote -v

# Change to SSH (replace with your repo URL)
git remote set-url origin git@github.com:username/repository.git

# Verify the change
git remote -v
```

## Using the Setup Script

A convenience script is provided to automate the setup:

```bash
# Make script executable (Unix/Linux/Mac)
chmod +x scripts/setup-ssh-github.sh

# Run the script
./scripts/setup-ssh-github.sh
```

**Note**: The script will guide you through the process and prompt for your GitHub email.

## Windows Setup

### Using Git Bash

Follow the same steps above in Git Bash (comes with Git for Windows).

### Using PowerShell

```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Start SSH agent
Start-Service ssh-agent
ssh-add ~/.ssh/id_ed25519

# Display public key
Get-Content ~/.ssh/id_ed25519.pub
```

Then follow Step 5 above to add the key to GitHub.

## Troubleshooting

### Permission Denied Error

```bash
# Fix SSH key permissions
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

### SSH Agent Not Running

```bash
# Start SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### Multiple SSH Keys

If you have multiple GitHub accounts or keys:

1. Create a `~/.ssh/config` file:
```bash
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes
```

2. For multiple accounts, use different host aliases:
```bash
Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_work

Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_personal
```

Then use: `git@github-work:username/repo.git`

## Verification

After setup, verify everything works:

```bash
# Test SSH connection
ssh -T git@github.com

# Test git operations
git fetch
git pull
```

## Security Best Practices

- ✅ Use a passphrase for your SSH key
- ✅ Never share your private key (`id_ed25519` or `id_rsa`)
- ✅ Only share your public key (`.pub` file)
- ✅ Use different keys for different purposes/accounts
- ✅ Regularly rotate your SSH keys

## Related Documentation

- [README_SETUP.md](./README_SETUP.md) - Main setup guide
- [DISABLE_DEFAULT_CODEQL.md](./DISABLE_DEFAULT_CODEQL.md) - CodeQL setup guide

---

**Need Help?** Check GitHub's official documentation: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
