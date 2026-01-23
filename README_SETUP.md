# Setup Guide

This document provides setup status, quick reference, and merge/use instructions for this repository.

## Setup Status

✅ **CodeQL Workflow**: Configured and ready
- Location: `.github/workflows/codeql.yml`
- Languages: Actions, JavaScript/TypeScript
- Triggers: Push to `main`, PRs to `main`, Weekly schedule (Saturdays 17:20 UTC)

⚠️ **Action Required**: Disable default CodeQL in GitHub UI before merging
- See [DISABLE_DEFAULT_CODEQL.md](./DISABLE_DEFAULT_CODEQL.md) for detailed instructions

## Quick Reference

### Repository Structure

```
.github/
└── workflows/
    ├── codeql.yml          # CodeQL Advanced workflow
    └── deno.yml            # Deno workflow
```

### Setup Scripts

- `scripts/disable-default-codeql.sh` - Disable default CodeQL workflow
- `scripts/setup-ssh-github.sh` - Setup SSH for GitHub operations

### Documentation

- [DISABLE_DEFAULT_CODEQL.md](./DISABLE_DEFAULT_CODEQL.md) - Instructions for disabling default CodeQL
- [SSH_SETUP.md](./SSH_SETUP.md) - SSH configuration guide

## Merge Instructions

### Before Merging

1. **Disable Default CodeQL** (Required)
   - Navigate to repository Settings → Security → Code scanning
   - Disable the default CodeQL workflow
   - See [DISABLE_DEFAULT_CODEQL.md](./DISABLE_DEFAULT_CODEQL.md) for step-by-step instructions

2. **Verify SSH Setup** (If using SSH)
   - Ensure SSH keys are configured for GitHub
   - See [SSH_SETUP.md](./SSH_SETUP.md) for setup instructions
   - Or use the provided setup script: `scripts/setup-ssh-github.sh`

### Merge Steps

1. Review the CodeQL workflow configuration in `.github/workflows/codeql.yml`
2. Ensure you've disabled the default CodeQL workflow in GitHub UI
3. Merge the branch: `cursorcodeql-workflow-configuration-99e1`
4. Verify the workflow runs successfully on the next push/PR

## Usage

After merging:

- The CodeQL workflow will automatically run on:
  - Pushes to `main` branch
  - Pull requests targeting `main`
  - Weekly schedule (Saturdays at 17:20 UTC)

- View results in:
  - Repository → Security → Code scanning alerts
  - Pull request checks (for PRs)

## Branch Information

- **Branch**: `cursorcodeql-workflow-configuration-99e1`
- **Status**: Ready for review and merge
- **Commit**: e3d80e0

## Dependencies

- GitHub Actions enabled
- CodeQL analysis requires appropriate repository permissions
- SSH-based git operations (if using SSH setup)

## Testing

Reviewers should verify:
- ✅ Presence and content of `README_SETUP.md`
- ✅ CodeQL workflow file exists at `.github/workflows/codeql.yml`
- ✅ Related documentation files are present
- ✅ UI steps for disabling default CodeQL are followed before merge

---

**Note**: This is a documentation-driven change with workflow configurations. No code runtime changes are introduced.
