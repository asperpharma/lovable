# Image Management & Organization Guide

Complete guide for managing your organized product image system.

## 🚀 Quick Start

### 1. Test Your System
```bash
deno run --allow-net --allow-env scripts/test-image-organization.ts
```

### 2. Validate Existing Images
```bash
deno run --allow-net --allow-env scripts/validate-images.ts
```

### 3. Migrate Existing Images (Preview First!)
```bash
# Preview what will happen
deno run --allow-net --allow-env --allow-read scripts/migrate-images.ts --dry-run

# Actually migrate
deno run --allow-net --allow-env --allow-read scripts/migrate-images.ts
```

### 4. Clean Up Orphaned Images
```bash
# Preview cleanup
deno run --allow-net --allow-env scripts/cleanup-images.ts --dry-run --remove-orphans

# Actually clean up
deno run --allow-net --allow-env scripts/cleanup-images.ts --remove-orphans
```

## 📋 Scripts Overview

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `test-image-organization.ts` | Test system functionality | After setup, before migrations |
| `validate-images.ts` | Check image organization | Regularly, weekly/monthly |
| `migrate-images.ts` | Move images to organized structure | Once, after initial setup |
| `cleanup-images.ts` | Remove orphaned/duplicate images | Monthly/quarterly maintenance |

## 🔧 Detailed Usage

### Migration Script

**Purpose**: Move existing unorganized images to the new folder structure.

```bash
# Dry run (preview only)
deno run --allow-net --allow-env --allow-read scripts/migrate-images.ts --dry-run

# Migrate all images
deno run --allow-net --allow-env --allow-read scripts/migrate-images.ts

# Test with limited products
deno run --allow-net --allow-env --allow-read scripts/migrate-images.ts --limit=10

# Migrate specific category only
deno run --allow-net --allow-env --allow-read scripts/migrate-images.ts --category="Skin Care"
```

**What it does:**
- ✅ Finds all products with images
- ✅ Checks if images are already organized
- ✅ Moves unorganized images to: `{subfolder}/{category}/{brand}/{productId}.{ext}`
- ✅ Updates product records with new URLs
- ✅ Preserves original files (safe migration)

### Validation Script

**Purpose**: Verify images are properly organized and identify issues.

```bash
# Basic validation
deno run --allow-net --allow-env scripts/validate-images.ts

# Validate and auto-fix issues
deno run --allow-net --allow-env scripts/validate-images.ts --fix

# Validate specific category
deno run --allow-net --allow-env scripts/validate-images.ts --category="Hair Care"
```

**What it checks:**
- ✅ Images follow organized folder structure
- ✅ Paths match product categories
- ✅ Paths match product brands
- ✅ Image URLs are accessible
- ✅ No broken or missing links

**Output:**
- Summary of valid/invalid images
- List of issues by severity (error/warning/info)
- Option to auto-fix fixable issues

### Cleanup Script

**Purpose**: Remove orphaned, duplicate, or old images to save storage space.

```bash
# Preview what would be removed
deno run --allow-net --allow-env scripts/cleanup-images.ts --dry-run --remove-orphans

# Remove orphaned images (not referenced by any product)
deno run --allow-net --allow-env scripts/cleanup-images.ts --remove-orphans

# Remove duplicate images
deno run --allow-net --allow-env scripts/cleanup-images.ts --remove-duplicates

# Remove old images (older than 30 days)
deno run --allow-net --allow-env scripts/cleanup-images.ts --remove-old --days=30

# Full cleanup (all options)
deno run --allow-net --allow-env scripts/cleanup-images.ts \
  --remove-orphans \
  --remove-duplicates \
  --remove-old \
  --days=30
```

**What it finds:**
- 🗑️ **Orphaned images**: Images in storage but not referenced by any product
- 🔄 **Duplicates**: Same image content in different locations
- 📅 **Old images**: Images in deprecated folder structures

### Test Script

**Purpose**: Verify the image organization system is working correctly.

```bash
deno run --allow-net --allow-env scripts/test-image-organization.ts
```

**What it tests:**
- ✅ Utility functions (slugification, path generation)
- ✅ Organized path structure compliance
- ✅ Category matching accuracy
- ✅ Storage bucket structure
- ✅ Image URL accessibility

## 📅 Recommended Maintenance Schedule

### Daily
- New images automatically organized (no action needed)

### Weekly
```bash
# Quick validation check
deno run --allow-net --allow-env scripts/validate-images.ts
```

### Monthly
```bash
# Full validation with auto-fix
deno run --allow-net --allow-env scripts/validate-images.ts --fix

# Cleanup orphaned images
deno run --allow-net --allow-env scripts/cleanup-images.ts \
  --dry-run \
  --remove-orphans \
  --remove-duplicates
```

### Quarterly
```bash
# Deep cleanup
deno run --allow-net --allow-env scripts/cleanup-images.ts \
  --remove-orphans \
  --remove-duplicates \
  --remove-old \
  --days=90
```

## 🔐 Environment Setup

All scripts require these environment variables:

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Or create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## ⚠️ Safety Features

All scripts include safety measures:

1. **Dry Run Mode**: Preview changes without making them
2. **Batch Processing**: Process in small batches to avoid rate limits
3. **Error Handling**: Continue processing even if individual items fail
4. **Detailed Logging**: See exactly what's happening at each step
5. **Backup Recommendation**: Scripts preserve original files during migration

## 🐛 Troubleshooting

### Common Issues

**"Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"**
- Set environment variables or create `.env` file
- Use service role key (not anon key)

**"Permission denied" errors**
- Ensure you're using service role key
- Check key has proper permissions

**"Rate limit" errors**
- Scripts include automatic delays
- Reduce batch sizes if needed
- Wait and retry later

**Migration fails for some products**
- Check error messages in summary
- Some images might be external URLs (not in storage)
- Some paths might be malformed

### Getting Help

1. Run test script first: `test-image-organization.ts`
2. Check validation: `validate-images.ts`
3. Review error messages in script output
4. Check Supabase storage dashboard

## 📊 Understanding Results

### Migration Results
- **Migrated**: Successfully moved to organized structure
- **Skipped**: Already organized or no image
- **Failed**: Errors during migration (check error list)

### Validation Results
- **Valid**: Images properly organized
- **Errors**: Critical issues (not organized, broken links)
- **Warnings**: Category/brand mismatches
- **Info**: Minor inconsistencies

### Cleanup Results
- **Orphaned**: Images not referenced by products
- **Duplicates**: Same content in multiple locations
- **Old**: Images in deprecated structures
- **Removed**: Successfully deleted files

## 🎯 Best Practices

1. **Always dry-run first**: Preview changes before executing
2. **Test in staging**: Run scripts on test data first
3. **Backup before cleanup**: Save important data before deletion
4. **Monitor storage**: Check usage before/after cleanup
5. **Gradual migration**: Use `--limit` for large datasets
6. **Regular validation**: Catch issues early with weekly checks

## 📚 Related Documentation

- `IMAGE_ORGANIZATION_GUIDE.md` - Technical details
- `PRODUCT_ORGANIZATION_SUMMARY.md` - Implementation overview
- `scripts/README.md` - Detailed script documentation

## ✅ Checklist

Before running scripts:

- [ ] Environment variables set
- [ ] Service role key has proper permissions
- [ ] Backup database and storage (for migration/cleanup)
- [ ] Test in staging environment first
- [ ] Run dry-run mode first
- [ ] Review output before executing

After running scripts:

- [ ] Verify results match expectations
- [ ] Check a few products manually
- [ ] Monitor storage usage
- [ ] Document any issues encountered

---

**Need help?** Check the script output for detailed error messages and refer to `scripts/README.md` for more information.
