# Disable Default CodeQL Workflow

This guide explains how to disable GitHub's default CodeQL workflow before
merging the custom CodeQL configuration.

## Why Disable Default CodeQL?

GitHub automatically enables a default CodeQL workflow when code scanning is
first set up. Since we're using a custom CodeQL workflow
(`.github/workflows/codeql.yml`), we need to disable the default one to avoid
duplicate scans and conflicts.

## Steps to Disable Default CodeQL

### Method 1: Via GitHub Web UI

1. **Navigate to Repository Settings**
   - Go to your repository on GitHub
   - Click on **Settings** (top navigation bar)

2. **Access Code Scanning Settings**
   - In the left sidebar, click **Security**
   - Under "Code security and analysis", click **Code scanning**

3. **Disable Default Workflow**
   - Look for "Code scanning workflows" section
   - Find the default CodeQL workflow (usually named "CodeQL" or "Default
     CodeQL")
   - Click the **⋮** (three dots) menu next to it
   - Select **Disable** or **Delete**

4. **Confirm Disable**
   - Confirm the action in the dialog
   - The default workflow should now be disabled

### Method 2: Via GitHub CLI

```bash
# List current workflows
gh workflow list

# Disable the default CodeQL workflow
gh workflow disable "CodeQL" --repo <owner>/<repo>
```

### Method 3: Using the Provided Script

```bash
# Make script executable (Unix/Linux/Mac)
chmod +x scripts/disable-default-codeql.sh

# Run the script
./scripts/disable-default-codeql.sh
```

## Verification

After disabling, verify:

1. **Check Workflow Status**
   - Go to **Actions** tab in your repository
   - The default CodeQL workflow should no longer appear or should show as
     disabled

2. **Verify Custom Workflow**
   - Ensure `.github/workflows/codeql.yml` is present
   - The custom workflow should be the only active CodeQL workflow

## Troubleshooting

### Default Workflow Still Running

- Wait a few minutes for GitHub to process the change
- Check if there are any pending runs in the Actions tab
- Ensure you have admin permissions on the repository

### Cannot Find Code Scanning Settings

- Ensure you have admin/owner permissions
- Code scanning may not be available on free GitHub plans
- Check if code scanning is enabled for your repository

### Multiple CodeQL Workflows

- Review all workflows in `.github/workflows/`
- Ensure only one CodeQL workflow is active
- The custom workflow should be named "CodeQL Advanced" (as defined in the
  workflow file)

## After Disabling

Once the default CodeQL is disabled:

1. ✅ Merge the branch with the custom CodeQL workflow
2. ✅ The custom workflow will handle all CodeQL analysis
3. ✅ Monitor the Actions tab to ensure the workflow runs successfully

## Related Documentation

- [README_SETUP.md](./README_SETUP.md) - Main setup guide
- [SSH_SETUP.md](./SSH_SETUP.md) - SSH configuration guide

---

**Important**: Complete this step **before** merging the branch to avoid
workflow conflicts.
