# Product Image Attachment Guide

This document explains how the automatic product image attachment feature works.

## Overview

The system now automatically links product images from the `src/assets/products/` directory to products during bulk upload or individual product creation.

## How It Works

### 1. Image Naming Convention

For automatic matching to work, name your product image files to match the product names. The system normalizes both image filenames and product names by:

- Converting to lowercase
- Removing special characters (hyphens, underscores, dots)
- Removing common suffixes like "gen", "new", "gold"
- Matching significant words (length > 3 characters)

### 2. Matching Examples

**Perfect matches:**
- Product: "Cetaphil Gentle Skin Cleanser" → Image: `cetaphil-cleanser.jpg` ✓
- Product: "Eucerin Dual Serum" → Image: `eucerin-dual-serum.webp` ✓
- Product: "OLAPLEX No.3 Hair Perfector" → Image: `olaplex-no3.webp` ✓

**Partial matches (requires 2+ word matches):**
- Product: "Bioten Day Cream Gold Edition" → Image: `bioten-day-cream-gold.jpg` ✓
- Product: "Vichy Normaderm Phytosolution" → Image: `vichy-normaderm-gen.png` ✓

## Database Schema

### SKU Field

A new `sku` column has been added to the products table:

```sql
ALTER TABLE public.products ADD COLUMN sku TEXT;
CREATE INDEX idx_products_sku ON public.products(sku);
```

This allows for:
- Better product identification
- Inventory tracking
- Matching products to images by SKU/barcode

## Bulk Upload Process

When uploading products via the Bulk Upload page:

1. **Upload Excel File**: Contains SKU, product name, cost price, selling price
2. **Categorization**: Products are categorized and existing images are matched
3. **Image Generation**: Only products WITHOUT matched images will generate AI images
4. **Review**: See which products have existing images vs. generated images

### Step-by-Step

1. Navigate to `/bulk-upload` (admin access required)
2. Upload your Excel file with product data
3. The system will:
   - Parse product information
   - Search for matching images in `src/assets/products/`
   - Mark products as "completed" if an image is found
   - Mark products as "pending" for AI generation if no image found
4. Click "Start Image Generation" for products that need AI images
5. Review and upload to Shopify

## Adding New Product Images

To add images for new products:

1. Save the product image in `src/assets/products/` directory
2. Name it according to the product (e.g., `brand-product-name.jpg`)
3. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
4. The image will be automatically detected on next product upload

## Image Fallback Order

When displaying a product, the system tries to find an image in this order:

1. **Database `image_url`**: If the product has a stored image URL
2. **Asset Image**: Searches `src/assets/products/` for matching image
3. **Placeholder**: Uses category-based Unsplash placeholder

## Technical Details

### productImageMapper.ts

This utility handles:
- Scanning all images from `src/assets/products/`
- Normalizing image names for matching
- Finding best match for a product name/SKU
- Providing fallback logic

Key functions:
- `findProductImage(productName, sku?)`: Find matching image
- `getProductImageWithFallback(productName, sku?, category?)`: Get image with fallback
- `getAllProductImages()`: List all available images
- `listAvailableImages()`: Debug function to see normalized names

### Integration Points

The image mapper is used in:
- `BulkUpload.tsx`: During product categorization
- `Shop.tsx`: When displaying product cards
- `ManageProducts.tsx`: In the product management interface
- `productImageUtils.ts`: As fallback in `getProductImage()`

## Best Practices

1. **Consistent Naming**: Use product brand and key descriptors in filenames
2. **Optimize Images**: Keep images under 500KB for faster loading
3. **Use WebP**: Modern format for better compression
4. **Quality**: Use high-resolution product photos (minimum 800x800px)
5. **SKU Matching**: If you have SKU/barcode, name images with SKU for perfect matching

## Troubleshooting

### Image Not Found

If an image isn't being matched:

1. Check the filename in `src/assets/products/`
2. Ensure it contains key words from the product name
3. Use the debug function to see normalized names:
   ```typescript
   import { listAvailableImages } from '@/lib/productImageMapper';
   console.log(listAvailableImages());
   ```

### Wrong Image Matched

If the wrong image is being matched:
1. Make the filename more specific
2. Include brand name and product type
3. Ensure at least 2 significant words match

## Example Excel File Format

Your Excel file should contain these columns (Arabic or English):

| الرمز (SKU) | اسم المادة (Name) | الكلفة (Cost) | سعر البيع (Price) |
|-------------|-------------------|---------------|-------------------|
| 12345       | Cetaphil Cleanser | 8.5           | 12.0             |
| 67890       | Eucerin Serum     | 15.0          | 22.0             |

## Summary

The image attachment feature streamlines the product upload process by:
- ✓ Automatically matching 49 existing product images
- ✓ Reducing AI image generation costs
- ✓ Ensuring product images are used when available
- ✓ Providing easy fallback to AI generation when needed
