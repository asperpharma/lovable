/**
 * Image Cleanup Script
 * 
 * Finds and optionally removes orphaned, duplicate, or unused images.
 * 
 * Usage:
 *   deno run --allow-net --allow-env scripts/cleanup-images.ts
 * 
 * Options:
 *   --dry-run: Preview what would be deleted without actually deleting
 *   --remove-orphans: Remove images not referenced by any product
 *   --remove-duplicates: Remove duplicate images (same content, different paths)
 *   --remove-old: Remove images older than N days (use --days=N)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  Deno.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface CleanupStats {
  orphans: string[];
  duplicates: Array<{ paths: string[]; size: number }>;
  old: string[];
  totalSize: number;
  removed: number;
}

/**
 * Extract path from image URL
 */
function extractPath(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const match = urlObj.pathname.match(/\/storage\/v1\/object\/public\/product-images\/(.+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Find all image paths referenced by products
 */
async function getReferencedPaths(): Promise<Set<string>> {
  const { data: products, error } = await supabase
    .from("products")
    .select("image_url");

  if (error) {
    console.error("❌ Error fetching products:", error);
    return new Set();
  }

  const paths = new Set<string>();
  
  products?.forEach(product => {
    if (product.image_url) {
      const path = extractPath(product.image_url);
      if (path) {
        paths.add(path);
      }
    }
  });

  return paths;
}

/**
 * List all files in storage (recursively)
 */
async function listAllFiles(folder: string = ""): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const { data, error } = await supabase.storage
      .from("product-images")
      .list(folder, {
        limit: 1000,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error(`Error listing ${folder}:`, error);
      return files;
    }

    if (!data) return files;

    for (const item of data) {
      const fullPath = folder ? `${folder}/${item.name}` : item.name;
      
      if (item.id === null) {
        // It's a folder, recurse
        const subFiles = await listAllFiles(fullPath);
        files.push(...subFiles);
      } else {
        // It's a file
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error processing ${folder}:`, error);
  }

  return files;
}

/**
 * Find orphaned images (not referenced by any product)
 */
async function findOrphans(): Promise<string[]> {
  console.log("🔍 Finding orphaned images...");
  
  const referencedPaths = await getReferencedPaths();
  console.log(`   Found ${referencedPaths.size} referenced images`);
  
  const allFiles = await listAllFiles();
  console.log(`   Found ${allFiles.length} total files in storage`);
  
  const orphans = allFiles.filter(file => !referencedPaths.has(file));
  
  console.log(`   Found ${orphans.length} orphaned images`);
  return orphans;
}

/**
 * Find duplicate images (same content, different paths)
 * Note: This is a simplified check - full duplicate detection would need content hashing
 */
async function findDuplicates(): Promise<Array<{ paths: string[]; size: number }>> {
  console.log("🔍 Finding potential duplicates...");
  
  // This is a simplified version - in production, you'd want to:
  // 1. Download each image
  // 2. Calculate hash (MD5/SHA256)
  // 3. Group by hash
  // 4. Keep only one from each group
  
  // For now, we'll just check for files with same name in different folders
  const allFiles = await listAllFiles();
  const nameMap = new Map<string, string[]>();
  
  allFiles.forEach(file => {
    const fileName = file.split("/").pop() || "";
    if (!nameMap.has(fileName)) {
      nameMap.set(fileName, []);
    }
    nameMap.get(fileName)!.push(file);
  });
  
  const duplicates: Array<{ paths: string[]; size: number }> = [];
  
  nameMap.forEach((paths, fileName) => {
    if (paths.length > 1) {
      // Potential duplicate - same filename in different locations
      duplicates.push({
        paths,
        size: paths.length,
      });
    }
  });
  
  console.log(`   Found ${duplicates.length} potential duplicate groups`);
  return duplicates;
}

/**
 * Find old images (older than specified days)
 */
async function findOldImages(days: number): Promise<string[]> {
  console.log(`🔍 Finding images older than ${days} days...`);
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const allFiles = await listAllFiles();
  const oldFiles: string[] = [];
  
  // Note: Supabase storage doesn't expose creation date directly
  // This would need to be tracked separately or use file metadata
  // For now, we'll check files in old unorganized folders
  
  const oldPatterns = [
    /^products\//,  // Old products folder
    /^ai-generated\/[^/]+\/[^/]+\/[^/]+$/,  // Old flat structure
  ];
  
  allFiles.forEach(file => {
    if (oldPatterns.some(pattern => pattern.test(file))) {
      oldFiles.push(file);
    }
  });
  
  console.log(`   Found ${oldFiles.length} potentially old images`);
  return oldFiles;
}

/**
 * Remove files from storage
 */
async function removeFiles(paths: string[], dryRun: boolean): Promise<number> {
  if (paths.length === 0) return 0;
  
  if (dryRun) {
    console.log(`   Would remove ${paths.length} files:`);
    paths.slice(0, 10).forEach(path => {
      console.log(`     - ${path}`);
    });
    if (paths.length > 10) {
      console.log(`     ... and ${paths.length - 10} more`);
    }
    return paths.length;
  }
  
  // Remove in batches
  const batchSize = 100;
  let removed = 0;
  
  for (let i = 0; i < paths.length; i += batchSize) {
    const batch = paths.slice(i, i + batchSize);
    
    const { error } = await supabase.storage
      .from("product-images")
      .remove(batch);
    
    if (error) {
      console.error(`   Error removing batch:`, error);
    } else {
      removed += batch.length;
      console.log(`   Removed ${removed}/${paths.length} files...`);
    }
  }
  
  return removed;
}

/**
 * Main cleanup function
 */
async function cleanupImages(options: {
  dryRun: boolean;
  removeOrphans: boolean;
  removeDuplicates: boolean;
  removeOld: boolean;
  days?: number;
}) {
  console.log("🧹 Starting Image Cleanup");
  console.log(`   Mode: ${options.dryRun ? "DRY RUN (preview only)" : "LIVE (will delete)"}`);
  console.log("");

  const stats: CleanupStats = {
    orphans: [],
    duplicates: [],
    old: [],
    totalSize: 0,
    removed: 0,
  };

  // Find orphaned images
  if (options.removeOrphans) {
    stats.orphans = await findOrphans();
    console.log(`   Found ${stats.orphans.length} orphaned images\n`);
  }

  // Find duplicates
  if (options.removeDuplicates) {
    stats.duplicates = await findDuplicates();
    console.log(`   Found ${stats.duplicates.length} duplicate groups\n`);
  }

  // Find old images
  if (options.removeOld && options.days) {
    stats.old = await findOldImages(options.days);
    console.log(`   Found ${stats.old.length} old images\n`);
  }

  // Calculate total files to remove
  const filesToRemove = new Set<string>();
  
  if (options.removeOrphans) {
    stats.orphans.forEach(path => filesToRemove.add(path));
  }
  
  if (options.removeDuplicates) {
    // For duplicates, keep the first one, remove the rest
    stats.duplicates.forEach(group => {
      group.paths.slice(1).forEach(path => filesToRemove.add(path));
    });
  }
  
  if (options.removeOld) {
    stats.old.forEach(path => filesToRemove.add(path));
  }

  const totalToRemove = filesToRemove.size;

  if (totalToRemove === 0) {
    console.log("✅ No files to clean up!");
    return;
  }

  console.log(`📊 Cleanup Summary:`);
  console.log(`   Orphaned:    ${stats.orphans.length}`);
  console.log(`   Duplicates:  ${stats.duplicates.reduce((sum, d) => sum + d.size - 1, 0)}`);
  console.log(`   Old:         ${stats.old.length}`);
  console.log(`   Total:       ${totalToRemove} files\n`);

  // Remove files
  if (totalToRemove > 0) {
    const filesArray = Array.from(filesToRemove);
    stats.removed = await removeFiles(filesArray, options.dryRun);
    
    if (options.dryRun) {
      console.log(`\n💡 This was a dry run. Run without --dry-run to actually remove files.`);
    } else {
      console.log(`\n✅ Removed ${stats.removed} files`);
    }
  }
}

// Parse arguments
const args = Deno.args;
const dryRun = args.includes("--dry-run");
const removeOrphans = args.includes("--remove-orphans");
const removeDuplicates = args.includes("--remove-duplicates");
const removeOld = args.includes("--remove-old");
const daysArg = args.find(arg => arg.startsWith("--days="));
const days = daysArg ? parseInt(daysArg.split("=")[1]) : 30;

// Run cleanup
cleanupImages({
  dryRun,
  removeOrphans,
  removeDuplicates,
  removeOld,
  days,
}).catch(error => {
  console.error("❌ Cleanup failed:", error);
  Deno.exit(1);
});
