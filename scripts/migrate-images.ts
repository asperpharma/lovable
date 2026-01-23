/**
 * Image Migration Script
 * 
 * Migrates existing product images to the new organized folder structure:
 * {subfolder}/{category}/{brand}/{identifier}.{ext}
 * 
 * Usage:
 *   deno run --allow-net --allow-env --allow-read scripts/migrate-images.ts
 * 
 * Options:
 *   --dry-run: Preview changes without actually moving files
 *   --limit=N: Process only N products (for testing)
 *   --category=CATEGORY: Migrate only specific category
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  Deno.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface MigrationStats {
  total: number;
  migrated: number;
  skipped: number;
  failed: number;
  errors: Array<{ productId: string; title: string; error: string }>;
}

/**
 * Extract path from full image URL
 */
function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Extract path after /storage/v1/object/public/product-images/
    const match = urlObj.pathname.match(/\/storage\/v1\/object\/public\/product-images\/(.+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Generate organized path for a product
 */
function getOrganizedPath(
  category: string | null,
  brand: string | null,
  productId: string,
  currentPath: string,
  extension: string
): string {
  const categorySlug = (category || "uncategorized").toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
  
  const brandSlug = (brand || "generic").toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/'/g, "");

  // Determine subfolder based on current path
  let subfolder = "migrated";
  if (currentPath.includes("ai-generated")) {
    subfolder = "ai-generated";
  } else if (currentPath.includes("bg-removed")) {
    subfolder = "bg-removed";
  } else if (currentPath.includes("bulk-upload")) {
    subfolder = "bulk-upload";
  } else if (currentPath.includes("manual-upload")) {
    subfolder = "manual-upload";
  }

  return `${subfolder}/${categorySlug}/${brandSlug}/${productId}.${extension}`;
}

/**
 * Check if path is already organized
 */
function isOrganized(path: string): boolean {
  // Check if path follows organized structure: subfolder/category/brand/identifier.ext
  const parts = path.split("/");
  if (parts.length < 4) return false;
  
  // Check if it's in one of our organized subfolders
  const organizedSubfolders = [
    "bulk-upload",
    "ai-generated",
    "bg-removed",
    "manual-upload",
    "migrated"
  ];
  
  return organizedSubfolders.includes(parts[0]);
}

/**
 * Migrate a single product's image
 */
async function migrateProductImage(
  product: { id: string; title: string; category: string; brand: string | null; image_url: string | null },
  dryRun: boolean
): Promise<{ success: boolean; error?: string; newPath?: string }> {
  if (!product.image_url) {
    return { success: false, error: "No image URL" };
  }

  const currentPath = extractPathFromUrl(product.image_url);
  if (!currentPath) {
    return { success: false, error: "Could not extract path from URL" };
  }

  // Skip if already organized
  if (isOrganized(currentPath)) {
    return { success: false, error: "Already organized" };
  }

  // Get file extension
  const extension = currentPath.split(".").pop() || "png";

  // Generate new organized path
  const newPath = getOrganizedPath(
    product.category,
    product.brand,
    product.id,
    currentPath,
    extension
  );

  if (dryRun) {
    console.log(`  📋 Would migrate: ${currentPath} → ${newPath}`);
    return { success: true, newPath };
  }

  try {
    // Copy file to new location
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("product-images")
      .download(currentPath);

    if (downloadError) {
      return { success: false, error: `Download failed: ${downloadError.message}` };
    }

    // Convert blob to array buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to new location
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(newPath, uint8Array, {
        contentType: `image/${extension}`,
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    // Get new public URL
    const { data: publicUrl } = supabase.storage
      .from("product-images")
      .getPublicUrl(newPath);

    // Update product record
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_url: publicUrl.publicUrl })
      .eq("id", product.id);

    if (updateError) {
      return { success: false, error: `Update failed: ${updateError.message}` };
    }

    // Optionally delete old file (uncomment if you want to clean up)
    // await supabase.storage.from("product-images").remove([currentPath]);

    return { success: true, newPath };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Main migration function
 */
async function migrateImages(options: {
  dryRun: boolean;
  limit?: number;
  category?: string;
}) {
  console.log("🚀 Starting Image Migration");
  console.log(`   Mode: ${options.dryRun ? "DRY RUN (preview only)" : "LIVE (will migrate)"}`);
  if (options.limit) console.log(`   Limit: ${options.limit} products`);
  if (options.category) console.log(`   Category: ${options.category}`);
  console.log("");

  // Fetch products with images
  let query = supabase
    .from("products")
    .select("id, title, category, brand, image_url")
    .not("image_url", "is", null);

  if (options.category) {
    query = query.eq("category", options.category);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("❌ Error fetching products:", error);
    Deno.exit(1);
  }

  if (!products || products.length === 0) {
    console.log("✅ No products found to migrate");
    return;
  }

  console.log(`📦 Found ${products.length} products with images\n`);

  const stats: MigrationStats = {
    total: products.length,
    migrated: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  };

  // Process each product
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const progress = `[${i + 1}/${products.length}]`;
    
    console.log(`${progress} Processing: ${product.title}`);

    const result = await migrateProductImage(product, options.dryRun);

    if (result.success) {
      stats.migrated++;
      if (result.newPath) {
        console.log(`   ✅ Migrated to: ${result.newPath}`);
      }
    } else if (result.error === "Already organized") {
      stats.skipped++;
      console.log(`   ⏭️  Skipped (already organized)`);
    } else {
      stats.failed++;
      stats.errors.push({
        productId: product.id,
        title: product.title,
        error: result.error || "Unknown error",
      });
      console.log(`   ❌ Failed: ${result.error}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Print summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 Migration Summary");
  console.log("=".repeat(50));
  console.log(`Total products:     ${stats.total}`);
  console.log(`✅ Migrated:        ${stats.migrated}`);
  console.log(`⏭️  Skipped:         ${stats.skipped}`);
  console.log(`❌ Failed:          ${stats.failed}`);

  if (stats.errors.length > 0) {
    console.log("\n❌ Errors:");
    stats.errors.forEach(err => {
      console.log(`   - ${err.title}: ${err.error}`);
    });
  }

  if (options.dryRun) {
    console.log("\n💡 This was a dry run. Run without --dry-run to perform actual migration.");
  }
}

// Parse command line arguments
const args = Deno.args;
const dryRun = args.includes("--dry-run");
const limitArg = args.find(arg => arg.startsWith("--limit="));
const limit = limitArg ? parseInt(limitArg.split("=")[1]) : undefined;
const categoryArg = args.find(arg => arg.startsWith("--category="));
const category = categoryArg ? categoryArg.split("=")[1] : undefined;

// Run migration
migrateImages({ dryRun, limit, category }).catch(error => {
  console.error("❌ Migration failed:", error);
  Deno.exit(1);
});
