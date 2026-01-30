# Product Publishing Guide - Image Upload

## How to Publish Products with Images

This guide explains how to publish products with images in the Asper Beauty Shop admin panel.

## Quick Start

1. **Access the Admin Panel**: Navigate to `/admin/products` 
2. **Click "Add Product"**: The button is in the top right corner
3. **Upload Your Image**: Use one of three methods (see below)
4. **Fill Product Details**: Title, price, category, and description
5. **Save**: Click "Create Product" to publish

## Image Upload Methods

### Method 1: Drag and Drop (Recommended)

The easiest way to upload images:

1. Open the "Add Product" dialog
2. Find the upload area with the dashed border
3. **Drag your image file** from your computer
4. **Drop it** onto the upload area
5. The image will upload automatically
6. Preview appears once upload is complete

**Visual Feedback:**
- Upload area highlights in gold when you drag over it
- Loading spinner shows during upload
- Success message appears when complete
- Preview thumbnail displays the uploaded image

### Method 2: Browse and Select

Traditional file selection:

1. Open the "Add Product" dialog
2. Click the **"Choose Image"** button
3. Browse your files in the dialog that opens
4. Select your image file
5. Click "Open"
6. Image uploads automatically

### Method 3: Paste Image URL

For images already hosted online:

1. Open the "Add Product" dialog
2. Scroll to the bottom of the image section
3. Find the text input labeled "Paste image URL directly..."
4. Paste your image URL
5. The URL is saved with the product

## Supported Image Formats

✅ **Accepted Formats:**
- PNG (.png)
- JPEG/JPG (.jpg, .jpeg)
- WEBP (.webp)
- GIF (.gif)

❌ **Not Accepted:**
- BMP, TIFF, SVG, or other formats
- Video files
- Document files

## Image Requirements

### File Size
- **Maximum**: 5 MB
- **Recommended**: 1-2 MB for optimal loading speed
- Files larger than 5MB will be rejected with an error message

### Image Dimensions
- **Recommended**: 800x800 pixels or larger
- **Aspect Ratio**: Square (1:1) works best for product displays
- **Minimum**: 400x400 pixels for acceptable quality

### Quality Guidelines
- Use high-quality, clear product images
- Ensure good lighting and focus
- Remove distracting backgrounds when possible
- Show the product clearly

## Image Storage

- Images are automatically uploaded to secure cloud storage (Supabase)
- Each image gets a unique filename to prevent conflicts
- Images are publicly accessible via CDN
- Original filename is not preserved for security

## Managing Product Images

### Preview Before Saving
- After upload, a preview appears showing your image
- Preview is 192x192 pixels (actual product display will scale appropriately)
- Image is not saved until you click "Create Product"

### Removing an Image
- Click the red trash icon in the top-right corner of the preview
- This removes the uploaded image
- You can upload a different image
- No image is required - products can use auto-generated placeholders

### Replacing an Image
When editing an existing product:
1. Click the edit button on the product row
2. Remove the existing image (trash icon)
3. Upload a new image using any method
4. Click "Update Product"

## Error Messages and Solutions

### "Please upload a valid image file (PNG, JPG, WEBP, or GIF)"
**Problem**: File format is not supported  
**Solution**: Convert your image to PNG or JPEG format

### "Image is too large (X.XX MB). Maximum size is 5MB."
**Problem**: File exceeds size limit  
**Solutions**:
- Compress the image using an online tool
- Reduce image dimensions
- Convert to WEBP format for smaller file size

### "Upload failed: An image with this name already exists"
**Problem**: Rare conflict with existing filename  
**Solution**: Try uploading again (new random filename will be generated)

### "Failed to upload image"
**Problem**: Network or server error  
**Solutions**:
- Check your internet connection
- Try again in a few moments
- Contact support if problem persists

## Advanced Features

### Auto-Enrich
- Button: "Auto-Enrich" in the admin toolbar
- Automatically fetches images for products that have source URLs
- Useful for bulk imports

### Generate AI Images
- Button: "Generate AI Images" in the admin toolbar
- Creates AI-generated product images
- Only for products without existing images
- Limited to 5 products at a time

### Remove Background
- Available on the product table
- Removes background from existing product images
- Useful for creating clean, professional product shots

## Best Practices

1. **Upload High-Quality Images**: Customers make decisions based on images
2. **Use Consistent Style**: Maintain similar lighting, angles, and backgrounds
3. **Optimize Before Upload**: Resize and compress images before uploading
4. **Test Mobile View**: Ensure images look good on small screens
5. **Use Descriptive Filenames**: Makes organization easier (though not preserved)

## Bulk Upload with Images

For uploading many products at once:

1. Navigate to `/admin/bulk-upload`
2. Upload Excel/CSV file with product data
3. System generates AI images automatically
4. Review and publish to Shopify

See the Bulk Upload documentation for more details.

## Troubleshooting

**Q: My image uploads but looks distorted**  
A: Use square images (1:1 aspect ratio) for best results

**Q: Can I upload multiple images per product?**  
A: Currently only one main image per product is supported

**Q: How do I change an image after publishing?**  
A: Edit the product and upload a new image

**Q: What happens to the old image when I replace it?**  
A: Old images remain in storage but are no longer linked to the product

**Q: Can I use images from other websites?**  
A: Yes, via URL paste, but ensure you have rights to use the image

## Support

For additional help:
- Email: support@asperbeauty.shop
- Contact page: `/contact`
- GitHub Issues: Report bugs or request features

## Security Note

- Only authenticated admin users can upload images
- All uploads are logged for security
- Images are scanned for malicious content
- Publicly accessible but stored securely

---

Last updated: January 2026  
Version: 1.0
