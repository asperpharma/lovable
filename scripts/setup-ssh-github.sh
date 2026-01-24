#!/bin/bash

# Script to set up SSH keys for GitHub
# This script helps automate the SSH key generation and GitHub configuration

set -e

echo "=========================================="
echo "GitHub SSH Setup"
echo "=========================================="
echo ""

# Check if SSH is available
if ! command -v ssh &> /dev/null; then
    echo "❌ SSH is not installed or not in PATH."
    echo "Please install OpenSSH and try again."
    exit 1
fi

# Get user email
read -p "Enter your GitHub email address: " github_email

if [ -z "$github_email" ]; then
    echo "❌ Email address is required."
    exit 1
fi

# Determine key type (prefer ed25519, fallback to rsa)
key_type="ed25519"
key_file="$HOME/.ssh/id_ed25519"

# Check if ed25519 is supported
if ! ssh-keygen -t ed25519 -f /dev/null -N "" &> /dev/null 2>&1; then
    echo "⚠️  ed25519 not supported, using RSA instead."
    key_type="rsa"
    key_file="$HOME/.ssh/id_rsa"
fi

# Check if key already exists
if [ -f "$key_file" ]; then
    echo ""
    echo "⚠️  SSH key already exists: $key_file"
    read -p "Do you want to use the existing key? (y/n): " use_existing
    
    if [ "$use_existing" != "y" ] && [ "$use_existing" != "Y" ]; then
        echo "Skipping key generation. Using existing key."
        existing_key=true
    else
        existing_key=true
    fi
else
    existing_key=false
fi

# Generate new key if needed
if [ "$existing_key" = false ]; then
    echo ""
    echo "🔑 Generating new SSH key..."
    echo "Press Enter to accept default location, or enter a custom path."
    read -p "SSH key file [$key_file]: " custom_key_file
    
    if [ -n "$custom_key_file" ]; then
        key_file="$custom_key_file"
    fi
    
    echo ""
    echo "You can optionally set a passphrase for extra security."
    echo "Press Enter to skip passphrase, or enter one now."
    ssh-keygen -t "$key_type" -C "$github_email" -f "$key_file"
fi

# Start SSH agent
echo ""
echo "🔄 Starting SSH agent..."
eval "$(ssh-agent -s)" > /dev/null

# Add key to agent
echo "Adding key to SSH agent..."
ssh-add "$key_file" 2>/dev/null || {
    echo "⚠️  Could not add key to agent. You may need to run: ssh-add $key_file"
}

# Display public key
echo ""
echo "=========================================="
echo "Your Public SSH Key"
echo "=========================================="
echo ""
cat "${key_file}.pub"
echo ""
echo "=========================================="
echo ""

# Copy to clipboard if possible
if command -v pbcopy &> /dev/null; then
    # macOS
    cat "${key_file}.pub" | pbcopy
    echo "✅ Public key copied to clipboard (macOS)"
elif command -v xclip &> /dev/null; then
    # Linux
    cat "${key_file}.pub" | xclip -selection clipboard
    echo "✅ Public key copied to clipboard (Linux)"
elif command -v clip &> /dev/null; then
    # Windows (Git Bash)
    cat "${key_file}.pub" | clip
    echo "✅ Public key copied to clipboard (Windows)"
else
    echo "⚠️  Could not copy to clipboard. Please copy the key above manually."
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Go to GitHub: https://github.com/settings/keys"
echo "2. Click 'New SSH key'"
echo "3. Give it a title (e.g., 'My Laptop')"
echo "4. Paste the public key above (or from clipboard)"
echo "5. Click 'Add SSH key'"
echo ""
read -p "Press Enter after you've added the key to GitHub..."

# Test connection
echo ""
echo "🧪 Testing SSH connection to GitHub..."
echo ""

if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ SSH connection successful!"
    echo ""
    echo "You can now use SSH URLs for git operations:"
    echo "  git@github.com:username/repository.git"
else
    echo "⚠️  SSH connection test returned unexpected result."
    echo "This might be normal. Try manually:"
    echo "  ssh -T git@github.com"
    echo ""
    echo "If you see 'Hi username! You've successfully authenticated', you're all set!"
fi

# Check if repository remote needs updating
echo ""
if [ -d ".git" ]; then
    current_remote=$(git remote get-url origin 2>/dev/null || echo "")
    if [[ "$current_remote" == https://* ]]; then
        echo "📝 Your repository is currently using HTTPS."
        read -p "Do you want to switch to SSH? (y/n): " switch_ssh
        
        if [ "$switch_ssh" = "y" ] || [ "$switch_ssh" = "Y" ]; then
            # Extract repo path from HTTPS URL
            repo_path=$(echo "$current_remote" | sed -E 's|https://github.com/(.*)\.git|\1|')
            new_remote="git@github.com:${repo_path}.git"
            
            git remote set-url origin "$new_remote"
            echo "✅ Updated remote URL to SSH: $new_remote"
        fi
    fi
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "For more information, see SSH_SETUP.md"
