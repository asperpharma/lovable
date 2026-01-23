# Product Image Organization Guide

## 📁 Image Storage Structure

All product images are now organized in a structured folder hierarchy within the `product-images` Supabase storage bucket:

```
product-images/
├── bulk-upload/          # Images from bulk upload process
│   ├── skin-care/
│   │   ├── palmers/
│   │   │   ├── 737383722396.png
│   │   │   └── 737383722622.png
│   │   └── generic/
│   │       └── SKU-123.png
│   └── hair-care/
│       └── ...
├── ai-generated/          # AI-generated product images
│   ├── skin-care/
│   │   ├── palmers/
│   │   │   └── {productId}.png
│   │   └── generic/
│   └── ...
├── bg-removed/           # Background-removed images
│   ├── skin-care/
│   │   ├── palmers/
│   │   │   └── {productId}.png
│   └── ...
└── manual-upload/        # Manually uploaded images
    ├── skin-care/
    │   ├── palmers/
    │   │   └── {timestamp}.png
    └── ...
```

## 🎯 Path Structure

The image path follows this pattern:
```
{subfolder}/{category-slug}/{brand-slug}/{identifier}.{ext}
```

### Components:

1. **Subfolder**: Indicates the source/type of image
   - `bulk-upload` - From bulk product upload
   - `ai-generated` - AI-generated images
   - `bg-removed` - Background-removed images
   - `manual-upload` - Manually uploaded images

2. **Category Slug**: URL-friendly category name
   - Examples: `skin-care`, `hair-care`, `makeup`, `fragrances`
   - Falls back to `uncategorized` if no category

3. **Brand Slug**: URL-friendly brand name
   - Examples: `palmers`, `eucerin`, `bioderma`
   - Falls back to `generic` if no brand

4. **Identifier**: Unique product identifier
   - SKU for bulk uploads
   - Product ID for AI-generated images
   - Timestamp for manual uploads

## 🔧 Implementation Details

### Utility Functions

A utility module `src/lib/imagePathUtils.ts` provides helper functions:

- `getOrganizedImagePath()` - Generate organized paths
- `getBulkUploadImagePath()` - Specific for bulk uploads
- `parseImagePath()` - Extract metadata from paths
- `getCategorySlug()` - Standardize category names

### Updated Functions

All image upload/generation functions have been updated:

1. **Bulk Upload** (`supabase/functions/bulk-product-upload/index.ts`)
   - Uses: `bulk-upload/{category}/{brand}/{sku}.png`

2. **AI Generation** (`supabase/functions/generate-product-images/index.ts`)
   - Uses: `ai-generated/{category}/{brand}/{productId}.{ext}`

3. **Background Removal** (`supabase/functions/remove-background/index.ts`)
   - Uses: `bg-removed/{category}/{brand}/{productId}.{ext}`

4. **Manual Upload** (`src/pages/ManageProducts.tsx`)
   - Uses: `manual-upload/{category}/{brand}/{timestamp}.{ext}`

## ✅ Benefits

1. **Organization**: Easy to find images by category and brand
2. **Scalability**: Better performance with organized storage
3. **Maintainability**: Clear structure for management
4. **Consistency**: Uniform naming across all upload methods
5. **Debugging**: Easy to identify image sources

## 📝 Category Mapping

Standard category slugs:

| Category | Slug |
|----------|------|
| Skin Care | `skin-care` |
| Hair Care | `hair-care` |
| Body Care | `body-care` |
| Make Up / Makeup | `makeup` |
| Fragrances / Fragrance | `fragrances` |
| Health & Supplements | `health-supplements` |
| Medical Supplies | `medical-supplies` |
| Personal Care | `personal-care` |
| Tools & Devices | `tools-devices` |
| Baby Care | `baby-care` |

## 🔍 Finding Images

### By Category
All images for "Skin Care" are in:
- `bulk-upload/skin-care/`
- `ai-generated/skin-care/`
- `bg-removed/skin-care/`
- `manual-upload/skin-care/`

### By Brand
All images for "Palmer's" are in:
- `*/skin-care/palmers/`
- `*/hair-care/palmers/`
- etc.

### By Product
Search for product ID or SKU across all subfolders.

## 🚀 Migration Notes

Existing images in old locations will continue to work. New images will use the organized structure. To migrate existing images:

1. Query all products with images
2. Extract category and brand
3. Move images to organized paths
4. Update product `image_url` fields

## 📊 Storage Statistics

You can query storage to see organization:

```typescript
const { data } = await supabase.storage
  .from('product-images')
  .list('bulk-upload', { 
    limit: 1000,
    sortBy: { column: 'name', order: 'asc' }
  });
```

This will show the organized folder structure.
