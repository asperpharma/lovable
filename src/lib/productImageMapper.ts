/**
 * Product Image Mapper
 * Maps product names/SKUs to their corresponding image files in the assets folder
 */

// Import all product images from assets
const productImages = import.meta.glob('@/assets/products/*.(jpg|jpeg|png|webp)', { eager: true, as: 'url' });

// Create a normalized mapping of image names to URLs
const imageMap = new Map<string, string>();

// Populate the image map with normalized names
Object.entries(productImages).forEach(([path, url]) => {
  // Extract filename without extension from path like '@/assets/products/cetaphil-cleanser.jpg'
  const filename = path.split('/').pop()?.replace(/\.(jpg|jpeg|png|webp)$/i, '') || '';
  const normalized = normalizeProductName(filename);
  imageMap.set(normalized, url as string);
});

/**
 * Normalize product name for matching
 * Removes special characters, converts to lowercase, removes common suffixes
 */
function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/\.(jpg|jpeg|png|webp)$/i, '') // Remove extensions
    .replace(/\s+(gen|new|gold)$/i, '') // Remove common suffixes
    .trim();
}

/**
 * Find the best matching image for a product
 * @param productName - The product name or title
 * @param sku - Optional SKU/barcode
 * @returns The image URL if found, null otherwise
 */
export function findProductImage(productName: string, sku?: string): string | null {
  const normalizedProduct = normalizeProductName(productName);
  
  // Try exact match first
  if (imageMap.has(normalizedProduct)) {
    return imageMap.get(normalizedProduct) || null;
  }
  
  // Try SKU match if provided
  if (sku) {
    const normalizedSku = normalizeProductName(sku);
    if (imageMap.has(normalizedSku)) {
      return imageMap.get(normalizedSku) || null;
    }
  }
  
  // Try partial match - find image name that contains product name words
  const productWords = normalizedProduct.split(' ').filter(w => w.length > 3);
  
  for (const [imageName] of imageMap) {
    const imageWords = imageName.split(' ');
    
    // Check if most significant words match
    const matchCount = productWords.filter(word => 
      imageWords.some(imgWord => imgWord.includes(word) || word.includes(imgWord))
    ).length;
    
    // If at least 2 significant words match, consider it a match
    if (matchCount >= 2 || (matchCount >= 1 && productWords.length === 1)) {
      return imageMap.get(imageName) || null;
    }
  }
  
  return null;
}

/**
 * Get all available product images
 * @returns Map of normalized names to image URLs
 */
export function getAllProductImages(): Map<string, string> {
  return new Map(imageMap);
}

/**
 * Get product image with fallback to placeholder
 * @param productName - The product name or title
 * @param sku - Optional SKU/barcode
 * @param category - Product category for placeholder
 * @returns Image URL (existing or placeholder)
 */
export function getProductImageWithFallback(
  productName: string,
  sku?: string,
  category?: string
): string {
  // First try to find existing image
  const existingImage = findProductImage(productName, sku);
  if (existingImage) {
    return existingImage;
  }
  
  // Fall back to placeholder logic
  const { getPlaceholderImage } = require('./productImageUtils');
  return getPlaceholderImage(category || 'Featured', productName);
}

/**
 * Debug: List all available product images
 */
export function listAvailableImages(): string[] {
  return Array.from(imageMap.keys()).sort();
}
