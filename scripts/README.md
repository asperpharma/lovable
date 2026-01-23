# Image Organization Scripts

This directory contains scripts for managing and maintaining the organized image structure.

## Available Scripts

### 1. Migration Script (`migrate-images.ts`)

Migrates existing product images to the new organized folder structure.

```bash
# Preview what would be migrated (dry run)
deno run --allow-net --allow-env --allow-read scripts/migrate-images.ts --dry-run

# Migrate all images
deno run --allow-net --allow-env --allow-read scripts/migrate-images.ts

# Migrate only first 10 products (for testing)
deno run --allow-net --allow-env --allow-read scripts/migrate-images.ts --limit=10

# Migrate only specific category
deno run --allow-net --allow-env --allow-read scripts/migrate-images.ts --category="Skin Care"
```

**What it does:**
- Finds all products with images
- Checks if images are already organized
- Moves unorganized images to proper folder structure
- Updates product records with new image URLs
- Preserves original files (optionally can delete after migration)

### 2. Validation Script (`validate-images.ts`)

Validates that product images are properly organized and reports issues.

```bash
# Validate all images
deno run --allow-net --allow-env scripts/validate-images.ts

# Validate and attempt to fix issues
deno run --allow-net --allow-env scripts/validate-images.ts --fix

# Validate specific category
deno run --allow-net --allow-env scripts/validate-images.ts --category="Skin Care"
```

**What it checks:**
- ✅ Images are in organized folder structure
- ✅ Image paths match product categories
- ✅ Image paths match product brands
- ✅ Image URLs are accessible
- ✅ No missing or broken image links

### 3. Cleanup Script (`cleanup-images.ts`)

Finds and optionally removes orphaned, duplicate, or unused images.

```bash
# Preview what would be cleaned (dry run)
deno run --allow-net --allow-env scripts/cleanup-images.ts --dry-run

# Remove orphaned images (not referenced by any product)
deno run --allow-net --allow-env scripts/cleanup-images.ts --remove-orphans

# Remove duplicate images
deno run --allow-net --allow-env scripts/cleanup-images.ts --remove-duplicates

# Remove old images (older than 30 days)
deno run --allow-net --allow-env scripts/cleanup-images.ts --remove-old --days=30

# Combine all cleanup options
deno run --allow-net --allow-env scripts/cleanup-images.ts \
  --remove-orphans \
  --remove-duplicates \
  --remove-old \
  --days=30
```

**What it finds:**
- 🗑️ Orphaned images (not referenced by any product)
- 🔄 Duplicate images (same content, different paths)
- 📅 Old images (in deprecated folder structures)

### 4. Test Script (`test-image-organization.ts`)

Tests the image organization system to ensure everything works correctly.

```bash
# Run all tests
deno run --allow-net --allow-env scripts/test-image-organization.ts
```

**What it tests:**
- ✅ Utility functions (slugification, path generation)
- ✅ Organized path structure
- ✅ Category matching
- ✅ Storage bucket structure
- ✅ Image URL accessibility

## Environment Variables

All scripts require these environment variables:

```bash
export SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Or create a `.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Recommended Workflow

### Initial Setup

1. **Test the system:**
   ```bash
   deno run --allow-net --allow-env scripts/test-image-organization.ts
   ```

2. **Validate existing images:**
   ```bash
   deno run --allow-net --allow-env scripts/validate-images.ts
   ```

3. **Preview migration:**
   ```bash
   deno run --allow-net --allow-env --allow-read scripts/migrate-images.ts --dry-run --limit=10
   ```

4. **Migrate images:**
   ```bash
   deno run --allow-net --allow-env --allow-read scripts/migrate-images.ts
   ```

### Regular Maintenance

1. **Weekly validation:**
   ```bash
   deno run --allow-net --allow-env scripts/validate-images.ts --fix
   ```

2. **Monthly cleanup:**
   ```bash
   deno run --allow-net --allow-env scripts/cleanup-images.ts \
     --dry-run \
     --remove-orphans \
     --remove-duplicates
   ```

3. **Quarterly deep cleanup:**
   ```bash
   deno run --allow-net --allow-env scripts/cleanup-images.ts \
     --remove-orphans \
     --remove-duplicates \
     --remove-old \
     --days=90
   ```

## Safety Features

- **Dry run mode**: All scripts support `--dry-run` to preview changes
- **Batch processing**: Operations are done in batches to avoid rate limits
- **Error handling**: Scripts continue processing even if individual items fail
- **Detailed logging**: All operations are logged with progress indicators

## Troubleshooting

### "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
- Make sure environment variables are set
- Check your `.env` file if using one

### "Permission denied" errors
- Ensure you're using the service role key (not anon key)
- Check that the key has proper permissions

### "Rate limit" errors
- Scripts include delays between operations
- Reduce batch sizes if needed
- Wait and retry

### Migration fails for some products
- Check the error messages in the summary
- Some images might be external URLs (not in storage)
- Some paths might be malformed

## Notes

- **Backup first**: Always backup your database and storage before running migration/cleanup
- **Test in staging**: Run scripts on a staging environment first
- **Monitor storage**: Keep an eye on storage usage before/after cleanup
- **Gradual migration**: Use `--limit` to migrate in batches
