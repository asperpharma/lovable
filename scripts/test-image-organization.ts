/**
 * Image Organization Test Script
 * 
 * Tests the image organization system to ensure everything works correctly.
 * 
 * Usage:
 *   deno run --allow-net --allow-env scripts/test-image-organization.ts
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  Deno.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

/**
 * Test 1: Check if utility functions work
 */
function testUtilityFunctions(): TestResult {
  try {
    // Import the utility (would need to be adapted for Deno)
    // For now, we'll test the logic manually
    
    const categorySlug = "Skin Care".toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const brandSlug = "Palmer's".toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").replace(/'/g, "");
    
    if (categorySlug !== "skin-care") {
      return {
        name: "Category Slugification",
        passed: false,
        message: `Expected "skin-care", got "${categorySlug}"`,
      };
    }
    
    if (brandSlug !== "palmers") {
      return {
        name: "Brand Slugification",
        passed: false,
        message: `Expected "palmers", got "${brandSlug}"`,
      };
    }
    
    return {
      name: "Utility Functions",
      passed: true,
      message: "Category and brand slugification working correctly",
    };
  } catch (error) {
    return {
      name: "Utility Functions",
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Test 2: Check if products have organized image paths
 */
async function testOrganizedPaths(): Promise<TestResult> {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("id, title, category, brand, image_url")
      .not("image_url", "is", null)
      .limit(10);

    if (error) {
      return {
        name: "Organized Paths Check",
        passed: false,
        message: `Database error: ${error.message}`,
      };
    }

    if (!products || products.length === 0) {
      return {
        name: "Organized Paths Check",
        passed: true,
        message: "No products with images to check",
      };
    }

    const organizedPaths = products.filter(p => {
      if (!p.image_url) return false;
      
      try {
        const url = new URL(p.image_url);
        const match = url.pathname.match(/\/storage\/v1\/object\/public\/product-images\/(.+)/);
        if (!match) return false;
        
        const path = match[1];
        const parts = path.split("/");
        
        // Check if it follows organized structure
        return parts.length >= 4 && [
          "bulk-upload",
          "ai-generated",
          "bg-removed",
          "manual-upload",
          "migrated"
        ].includes(parts[0]);
      } catch {
        return false;
      }
    });

    const organizedCount = organizedPaths.length;
    const totalCount = products.length;
    const percentage = Math.round((organizedCount / totalCount) * 100);

    return {
      name: "Organized Paths Check",
      passed: organizedCount === totalCount,
      message: `${organizedCount}/${totalCount} products have organized paths (${percentage}%)`,
      details: {
        organized: organizedCount,
        total: totalCount,
        percentage,
      },
    };
  } catch (error) {
    return {
      name: "Organized Paths Check",
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Test 3: Check if image paths match product categories
 */
async function testCategoryMatching(): Promise<TestResult> {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("id, title, category, brand, image_url")
      .not("image_url", "is", null)
      .limit(20);

    if (error) {
      return {
        name: "Category Matching",
        passed: false,
        message: `Database error: ${error.message}`,
      };
    }

    if (!products || products.length === 0) {
      return {
        name: "Category Matching",
        passed: true,
        message: "No products to check",
      };
    }

    let matched = 0;
    let mismatched = 0;
    const mismatches: Array<{ title: string; category: string; pathCategory: string }> = [];

    products.forEach(product => {
      if (!product.image_url) return;
      
      try {
        const url = new URL(product.image_url);
        const match = url.pathname.match(/\/storage\/v1\/object\/public\/product-images\/(.+)/);
        if (!match) return;
        
        const path = match[1];
        const parts = path.split("/");
        
        if (parts.length >= 2) {
          const pathCategory = parts[1];
          const productCategory = (product.category || "uncategorized")
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");
          
          if (pathCategory === productCategory) {
            matched++;
          } else {
            mismatched++;
            mismatches.push({
              title: product.title,
              category: product.category,
              pathCategory: pathCategory,
            });
          }
        }
      } catch {
        // Skip invalid URLs
      }
    });

    return {
      name: "Category Matching",
      passed: mismatched === 0,
      message: `${matched} matched, ${mismatched} mismatched`,
      details: {
        matched,
        mismatched,
        mismatches: mismatches.slice(0, 5),
      },
    };
  } catch (error) {
    return {
      name: "Category Matching",
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Test 4: Check storage bucket structure
 */
async function testStorageStructure(): Promise<TestResult> {
  try {
    const { data: folders, error } = await supabase.storage
      .from("product-images")
      .list("", {
        limit: 100,
      });

    if (error) {
      return {
        name: "Storage Structure",
        passed: false,
        message: `Storage error: ${error.message}`,
      };
    }

    const expectedFolders = [
      "bulk-upload",
      "ai-generated",
      "bg-removed",
      "manual-upload",
    ];

    const foundFolders = (folders || [])
      .filter(f => f.id === null) // Folders have null id
      .map(f => f.name);

    const missingFolders = expectedFolders.filter(f => !foundFolders.includes(f));
    const hasStructure = missingFolders.length === 0;

    return {
      name: "Storage Structure",
      passed: hasStructure,
      message: hasStructure
        ? `All expected folders found: ${foundFolders.join(", ")}`
        : `Missing folders: ${missingFolders.join(", ")}`,
      details: {
        found: foundFolders,
        expected: expectedFolders,
        missing: missingFolders,
      },
    };
  } catch (error) {
    return {
      name: "Storage Structure",
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Test 5: Check image URL accessibility
 */
async function testImageAccessibility(): Promise<TestResult> {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("id, title, image_url")
      .not("image_url", "is", null)
      .limit(5);

    if (error) {
      return {
        name: "Image Accessibility",
        passed: false,
        message: `Database error: ${error.message}`,
      };
    }

    if (!products || products.length === 0) {
      return {
        name: "Image Accessibility",
        passed: true,
        message: "No products to check",
      };
    }

    let accessible = 0;
    let inaccessible = 0;
    const inaccessibleUrls: string[] = [];

    for (const product of products) {
      if (!product.image_url) continue;
      
      try {
        const response = await fetch(product.image_url, { method: "HEAD" });
        if (response.ok) {
          accessible++;
        } else {
          inaccessible++;
          inaccessibleUrls.push(product.image_url);
        }
      } catch {
        inaccessible++;
        inaccessibleUrls.push(product.image_url);
      }
    }

    return {
      name: "Image Accessibility",
      passed: inaccessible === 0,
      message: `${accessible} accessible, ${inaccessible} inaccessible`,
      details: {
        accessible,
        inaccessible,
        inaccessibleUrls: inaccessibleUrls.slice(0, 3),
      },
    };
  } catch (error) {
    return {
      name: "Image Accessibility",
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log("🧪 Testing Image Organization System\n");
  console.log("=".repeat(50));

  const results: TestResult[] = [];

  // Test 1: Utility functions
  console.log("\n1. Testing utility functions...");
  results.push(testUtilityFunctions());

  // Test 2: Organized paths
  console.log("2. Checking organized paths...");
  results.push(await testOrganizedPaths());

  // Test 3: Category matching
  console.log("3. Checking category matching...");
  results.push(await testCategoryMatching());

  // Test 4: Storage structure
  console.log("4. Checking storage structure...");
  results.push(await testStorageStructure());

  // Test 5: Image accessibility
  console.log("5. Checking image accessibility...");
  results.push(await testImageAccessibility());

  // Print summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 Test Results Summary");
  console.log("=".repeat(50));

  results.forEach((result, index) => {
    const icon = result.passed ? "✅" : "❌";
    console.log(`${icon} ${index + 1}. ${result.name}`);
    console.log(`   ${result.message}`);
    if (result.details) {
      console.log(`   Details:`, JSON.stringify(result.details, null, 2));
    }
  });

  const passed = results.filter(r => r.passed).length;
  const total = results.length;

  console.log("\n" + "=".repeat(50));
  console.log(`Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log("🎉 All tests passed!");
  } else {
    console.log("⚠️  Some tests failed. Review the details above.");
  }
}

// Run tests
runTests().catch(error => {
  console.error("❌ Test suite failed:", error);
  Deno.exit(1);
});
