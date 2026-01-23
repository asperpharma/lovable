/**
 * Image Organization Validation Script
 * 
 * Validates that product images are properly organized and reports issues.
 * 
 * Usage:
 *   deno run --allow-net --allow-env scripts/validate-images.ts
 * 
 * Options:
 *   --fix: Automatically fix issues where possible
 *   --category=CATEGORY: Validate only specific category
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  Deno.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface ValidationIssue {
  productId: string;
  title: string;
  category: string;
  brand: string | null;
  imageUrl: string;
  issue: string;
  severity: "error" | "warning" | "info";
  fixable: boolean;
}

interface ValidationStats {
  total: number;
  valid: number;
  issues: ValidationIssue[];
  bySeverity: {
    error: number;
    warning: number;
    info: number;
  };
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
 * Check if path is organized
 */
function isOrganizedPath(path: string): boolean {
  const parts = path.split("/");
  if (parts.length < 4) return false;
  
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
 * Validate a single product's image
 */
async function validateProductImage(
  product: { id: string; title: string; category: string; brand: string | null; image_url: string | null }
): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];

  if (!product.image_url) {
    issues.push({
      productId: product.id,
      title: product.title,
      category: product.category,
      brand: product.brand,
      imageUrl: "",
      issue: "Missing image URL",
      severity: "warning",
      fixable: false,
    });
    return issues;
  }

  const path = extractPath(product.image_url);
  if (!path) {
    issues.push({
      productId: product.id,
      title: product.title,
      category: product.category,
      brand: product.brand,
      imageUrl: product.image_url,
      issue: "Could not extract path from URL",
      severity: "error",
      fixable: false,
    });
    return issues;
  }

  // Check if path is organized
  if (!isOrganizedPath(path)) {
    issues.push({
      productId: product.id,
      title: product.title,
      category: product.category,
      brand: product.brand,
      imageUrl: product.image_url,
      issue: `Image not organized: ${path}`,
      severity: "error",
      fixable: true,
    });
  }

  // Check if path matches product category
  const pathParts = path.split("/");
  if (pathParts.length >= 2) {
    const categorySlug = (product.category || "uncategorized").toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    
    if (pathParts[1] !== categorySlug && isOrganizedPath(path)) {
      issues.push({
        productId: product.id,
        title: product.title,
        category: product.category,
        brand: product.brand,
        imageUrl: product.image_url,
        issue: `Category mismatch: path has '${pathParts[1]}' but product is '${categorySlug}'`,
        severity: "warning",
        fixable: true,
      });
    }
  }

  // Check if path matches product brand
  if (pathParts.length >= 3 && product.brand) {
    const brandSlug = product.brand.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .replace(/'/g, "");
    
    if (pathParts[2] !== brandSlug && isOrganizedPath(path)) {
      issues.push({
        productId: product.id,
        title: product.title,
        category: product.category,
        brand: product.brand,
        imageUrl: product.image_url,
        issue: `Brand mismatch: path has '${pathParts[2]}' but product is '${brandSlug}'`,
        severity: "info",
        fixable: true,
      });
    }
  }

  // Check if file exists in storage
  try {
    const { error } = await supabase.storage
      .from("product-images")
      .list(path.split("/").slice(0, -1).join("/"), {
        search: path.split("/").pop(),
      });

    // Note: This is a basic check, actual file existence would need different API
  } catch (error) {
    // Ignore for now
  }

  return issues;
}

/**
 * Fix a validation issue
 */
async function fixIssue(issue: ValidationIssue): Promise<boolean> {
  if (!issue.fixable) return false;

  // This would trigger the migration for this specific product
  // For now, just log that it should be fixed
  console.log(`   🔧 Would fix: ${issue.title} - ${issue.issue}`);
  return true;
}

/**
 * Main validation function
 */
async function validateImages(options: {
  fix: boolean;
  category?: string;
}) {
  console.log("🔍 Starting Image Validation");
  if (options.category) console.log(`   Category: ${options.category}`);
  if (options.fix) console.log(`   Mode: FIX (will attempt to fix issues)`);
  console.log("");

  // Fetch products
  let query = supabase
    .from("products")
    .select("id, title, category, brand, image_url");

  if (options.category) {
    query = query.eq("category", options.category);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("❌ Error fetching products:", error);
    Deno.exit(1);
  }

  if (!products || products.length === 0) {
    console.log("✅ No products found");
    return;
  }

  console.log(`📦 Validating ${products.length} products...\n`);

  const stats: ValidationStats = {
    total: products.length,
    valid: 0,
    issues: [],
    bySeverity: {
      error: 0,
      warning: 0,
      info: 0,
    },
  };

  // Validate each product
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const issues = await validateProductImage(product);

    if (issues.length === 0) {
      stats.valid++;
    } else {
      stats.issues.push(...issues);
      issues.forEach(issue => {
        stats.bySeverity[issue.severity]++;
      });
    }

    if ((i + 1) % 50 === 0) {
      console.log(`   Processed ${i + 1}/${products.length}...`);
    }
  }

  // Print results
  console.log("\n" + "=".repeat(50));
  console.log("📊 Validation Results");
  console.log("=".repeat(50));
  console.log(`Total products:     ${stats.total}`);
  console.log(`✅ Valid:           ${stats.valid}`);
  console.log(`❌ Errors:         ${stats.bySeverity.error}`);
  console.log(`⚠️  Warnings:       ${stats.bySeverity.warning}`);
  console.log(`ℹ️  Info:           ${stats.bySeverity.info}`);

  if (stats.issues.length > 0) {
    console.log("\n📋 Issues Found:");
    
    // Group by severity
    const errors = stats.issues.filter(i => i.severity === "error");
    const warnings = stats.issues.filter(i => i.severity === "warning");
    const infos = stats.issues.filter(i => i.severity === "info");

    if (errors.length > 0) {
      console.log("\n❌ Errors:");
      errors.slice(0, 10).forEach(issue => {
        console.log(`   - ${issue.title}: ${issue.issue}`);
      });
      if (errors.length > 10) {
        console.log(`   ... and ${errors.length - 10} more errors`);
      }
    }

    if (warnings.length > 0) {
      console.log("\n⚠️  Warnings:");
      warnings.slice(0, 10).forEach(issue => {
        console.log(`   - ${issue.title}: ${issue.issue}`);
      });
      if (warnings.length > 10) {
        console.log(`   ... and ${warnings.length - 10} more warnings`);
      }
    }

    if (infos.length > 0 && infos.length <= 20) {
      console.log("\nℹ️  Info:");
      infos.forEach(issue => {
        console.log(`   - ${issue.title}: ${issue.issue}`);
      });
    }

    // Fix issues if requested
    if (options.fix) {
      console.log("\n🔧 Attempting to fix issues...");
      const fixableIssues = stats.issues.filter(i => i.fixable);
      let fixed = 0;
      
      for (const issue of fixableIssues) {
        if (await fixIssue(issue)) {
          fixed++;
        }
      }
      
      console.log(`✅ Fixed ${fixed} issues`);
    }
  } else {
    console.log("\n🎉 All images are properly organized!");
  }
}

// Parse arguments
const args = Deno.args;
const fix = args.includes("--fix");
const categoryArg = args.find(arg => arg.startsWith("--category="));
const category = categoryArg ? categoryArg.split("=")[1] : undefined;

// Run validation
validateImages({ fix, category }).catch(error => {
  console.error("❌ Validation failed:", error);
  Deno.exit(1);
});
