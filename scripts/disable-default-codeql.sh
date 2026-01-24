#!/bin/bash

# Script to disable default CodeQL workflow in GitHub
# This script helps disable the default CodeQL workflow before merging custom CodeQL configuration

set -e

echo "=========================================="
echo "Disable Default CodeQL Workflow"
echo "=========================================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    echo "Please install it first:"
    echo "  - macOS: brew install gh"
    echo "  - Linux: See https://cli.github.com/manual/installation"
    echo "  - Windows: winget install GitHub.cli"
    echo ""
    echo "Or disable manually via GitHub UI:"
    echo "  1. Go to Repository → Settings → Security → Code scanning"
    echo "  2. Find the default CodeQL workflow"
    echo "  3. Click ⋮ → Disable"
    echo ""
    echo "See DISABLE_DEFAULT_CODEQL.md for detailed instructions."
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo ""
    echo "Please authenticate first:"
    echo "  gh auth login"
    exit 1
fi

echo "📋 Listing current workflows..."
echo ""

# List workflows
gh workflow list

echo ""
echo "⚠️  Please identify the default CodeQL workflow from the list above."
echo ""
read -p "Enter the workflow name to disable (or 'skip' to exit): " workflow_name

if [ "$workflow_name" = "skip" ] || [ -z "$workflow_name" ]; then
    echo "Skipping workflow disable."
    echo ""
    echo "You can disable it manually:"
    echo "  1. Go to Repository → Settings → Security → Code scanning"
    echo "  2. Find the default CodeQL workflow"
    echo "  3. Click ⋮ → Disable"
    exit 0
fi

echo ""
echo "🔄 Disabling workflow: $workflow_name"
echo ""

# Disable the workflow
if gh workflow disable "$workflow_name"; then
    echo "✅ Successfully disabled workflow: $workflow_name"
    echo ""
    echo "Next steps:"
    echo "  1. Verify the workflow is disabled in GitHub UI"
    echo "  2. Merge the branch with custom CodeQL workflow"
    echo "  3. Monitor the Actions tab to ensure custom workflow runs"
else
    echo "❌ Failed to disable workflow: $workflow_name"
    echo ""
    echo "Please disable manually via GitHub UI:"
    echo "  1. Go to Repository → Settings → Security → Code scanning"
    echo "  2. Find the default CodeQL workflow"
    echo "  3. Click ⋮ → Disable"
    exit 1
fi

echo ""
echo "=========================================="
echo "Done!"
echo "=========================================="
