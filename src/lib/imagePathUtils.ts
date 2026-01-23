/**
 * Image Path Organization Utilities
 * 
 * Optimized utilities for generating organized image paths in a structured hierarchy:
 * {subfolder}/{category-slug}/{brand-slug}/{identifier}.{ext}
 * 
 * Features:
 * - Consistent slugification with caching
 * - Category mapping for standardized slugs
 * - Flexible path generation for different image types
 * - Path parsing for metadata extraction
 */

// Category slug mapping for consistency
const CATEGORY_SLUG_MAP: Record<string, string> = {
  "Skin Care": "skin-care",
  "Hair Care": "hair-care",
  "Body Care": "body-care",
  "Make Up": "makeup",
  "Makeup": "makeup",
  "Fragrances": "fragrances",
  "Fragrance": "fragrances",
  "Health & Supplements": "health-supplements",
  "Medical Supplies": "medical-supplements",
  "Personal Care": "personal-care",
  "Tools & Devices": "tools-devices",
  "Baby Care": "baby-care",
} as const;

// Cache for slugified values to avoid repeated processing
const slugCache = new Map<string, string>();

/**
 * Convert a string to a URL-friendly slug with caching
 * Optimized to avoid redundant processing of the same values
 */
function slugify(text: string | null | undefined, defaultValue: string = "uncategorized"): string {
  if (!text) return defaultValue;
  
  // Check cache first
  const cacheKey = `${text}:${defaultValue}`;
  if (slugCache.has(cacheKey)) {
    return slugCache.get(cacheKey)!;
  }
  
  // Process and cache
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  
  // Limit cache size to prevent memory issues (keep last 1000 entries)
  if (slugCache.size > 1000) {
    const firstKey = slugCache.keys().next().value;
    slugCache.delete(firstKey);
  }
  
  slugCache.set(cacheKey, slug);
  return slug;
}

/**
 * Get standardized category slug using mapping or fallback to slugification
 */
export function getCategorySlug(category: string | null | undefined): string {
  if (!category) return "uncategorized";
  
  // Check mapping first (O(1) lookup)
  if (category in CATEGORY_SLUG_MAP) {
    return CATEGORY_SLUG_MAP[category];
  }
  
  // Fallback to slugification
  return slugify(category, "uncategorized");
}

/**
 * Get brand slug with special handling for apostrophes
 */
function getBrandSlug(brand: string | null | undefined): string {
  if (!brand) return "generic";
  
  return slugify(brand.replace(/'/g, ""), "generic");
}

/**
 * Normalize file extension (remove leading dot, lowercase)
 */
function normalizeExtension(ext: string): string {
  return ext.replace(/^\./, "").toLowerCase();
}

/**
 * Core function to build organized image paths
 * Consolidates common path building logic
 */
function buildImagePath(
  subfolder: string,
  category: string | null | undefined,
  brand: string | null | undefined,
  identifier: string,
  extension: string = "png"
): string {
  const parts = [
    subfolder,
    getCategorySlug(category),
    getBrandSlug(brand),
    `${slugify(identifier)}.${normalizeExtension(extension)}`
  ];
  
  return parts.join("/");
}

/**
 * Get organized image path for a product
 * 
 * @param category - Product category (e.g., "Skin Care")
 * @param brand - Product brand (e.g., "Palmer's")
 * @param sku - Product SKU or ID
 * @param extension - File extension (default: "png")
 * @param subfolder - Optional subfolder (e.g., "ai-generated", "bg-removed")
 * 
 * @example
 * getOrganizedImagePath("Skin Care", "Palmer's", "123", "png", "ai-generated")
 * // Returns: "ai-generated/skin-care/palmers/123.png"
 */
export function getOrganizedImagePath(
  category: string | null | undefined,
  brand: string | null | undefined,
  sku: string,
  extension: string = "png",
  subfolder?: string
): string {
  return buildImagePath(
    subfolder || "products",
    category,
    brand,
    sku,
    extension
  );
}

/**
 * Get organized image path for bulk upload products
 * Includes timestamp for uniqueness
 * 
 * @param category - Product category
 * @param brand - Product brand
 * @param sku - Product SKU
 * @param productName - Product name (used as fallback if SKU missing)
 * @param extension - File extension (default: "png")
 * 
 * @example
 * getBulkUploadImagePath("Skin Care", "Palmer's", "123", "Product Name", "png")
 * // Returns: "bulk-upload/skin-care/palmers/123-1705123456789.png"
 */
export function getBulkUploadImagePath(
  category: string | null | undefined,
  brand: string | null | undefined,
  sku: string,
  productName: string,
  extension: string = "png"
): string {
  const identifier = sku || slugify(productName).slice(0, 50);
  const timestampedId = `${identifier}-${Date.now()}`;
  
  return buildImagePath(
    "bulk-upload",
    category,
    brand,
    timestampedId,
    extension
  );
}

/**
 * Parse image path to extract metadata
 * Handles both organized and legacy path structures
 * 
 * @param path - Image path (e.g., "bulk-upload/skin-care/palmers/123.png")
 * @returns Parsed path metadata or empty object if invalid
 * 
 * @example
 * parseImagePath("bulk-upload/skin-care/palmers/123.png")
 * // Returns: { subfolder: "bulk-upload", category: "skin-care", brand: "palmers", sku: "123", extension: "png" }
 */
export function parseImagePath(path: string): {
  subfolder?: string;
  category?: string;
  brand?: string;
  sku?: string;
  extension?: string;
} {
  if (!path) return {};
  
  const parts = path.split("/");
  const filename = parts[parts.length - 1];
  const [sku, extension] = filename?.split(".") || [];
  
  // Organized structure: subfolder/category/brand/sku.ext (4+ parts)
  if (parts.length >= 4) {
    return {
      subfolder: parts[0],
      category: parts[1],
      brand: parts[2],
      sku,
      extension,
    };
  }
  
  // Legacy structure: category/brand/sku.ext (3 parts)
  if (parts.length === 3) {
    return {
      category: parts[0],
      brand: parts[1],
      sku,
      extension,
    };
  }
  
  return {};
}

/**
 * Check if a path follows the organized structure
 * 
 * @param path - Image path to validate
 * @returns true if path is organized, false otherwise
 */
export function isOrganizedPath(path: string): boolean {
  if (!path) return false;
  
  const parts = path.split("/");
  if (parts.length < 4) return false;
  
  const organizedSubfolders = [
    "bulk-upload",
    "ai-generated",
    "bg-removed",
    "manual-upload",
    "migrated",
    "products",
  ] as const;
  
  return organizedSubfolders.includes(parts[0] as any);
}

/**
 * Extract path from full Supabase storage URL
 * 
 * @param url - Full Supabase storage URL
 * @returns Extracted path or null if invalid
 * 
 * @example
 * extractPathFromUrl("https://...supabase.co/storage/v1/object/public/product-images/bulk-upload/skin-care/palmers/123.png")
 * // Returns: "bulk-upload/skin-care/palmers/123.png"
 */
export function extractPathFromUrl(url: string): string | null {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    const match = urlObj.pathname.match(/\/storage\/v1\/object\/public\/product-images\/(.+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Clear the slug cache (useful for testing or memory management)
 */
export function clearSlugCache(): void {
  slugCache.clear();
}
