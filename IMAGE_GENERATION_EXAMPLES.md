# Image Generation Examples

## 🎯 Overview
This document shows examples of how the automatic product image generation works in your system.

---

## Example 1: Creating a New Product Without Image

### User Action:
1. Admin goes to `/admin/products`
2. Clicks "Add Product" button
3. Fills in form:
   - **Title**: "Luxury Hyaluronic Acid Serum"
   - **Price**: 45.00
   - **Category**: "Skin Care"
   - **Description**: "Intensive hydration formula"
   - **Image URL**: (left empty)

### What Happens Behind the Scenes:

```typescript
// 1. Product is created in database
const productData = {
  title: "Luxury Hyaluronic Acid Serum",
  price: 45.00,
  category: "Skin Care",
  image_url: null  // ← No image provided
};

// 2. System detects missing image and auto-generates
if (!productData.image_url && data) {
  // Calls the generate-product-images function
  const { data: imageData } = await supabase.functions.invoke(
    "generate-product-images",
    {
      body: { productIds: [data.id] }
    }
  );
}
```

### AI Prompt Generated:
```
professional skincare product photography, luxury cosmetic bottle or tube, 
minimalist white background, soft studio lighting, premium beauty product, 
high-end dermatological. Product: Luxury Hyaluronic Acid Serum. 
Ultra high resolution, professional e-commerce product shot, clean background, 
no text or labels, photorealistic.
```

### Result:
✅ Product created with AI-generated image automatically
- Image saved to: `product-images/ai-generated/{product-id}.png`
- Image URL stored in database
- User sees: "Product created with AI-generated image!" toast

---

## Example 2: Bulk Generating Images for Existing Products

### User Action:
1. Admin sees "Generate AI Images (12)" button
2. Clicks the button
3. System processes all 12 products without images

### What Happens:

```typescript
// 1. Find all products without images
const productsNeedingImages = products.filter(
  (p) => !p.image_url || p.image_url.trim() === ""
);
// Result: 12 products found

// 2. Process in batches of 5
for (let i = 0; i < productsNeedingImages.length; i += 5) {
  const batch = productsNeedingImages.slice(i, i + 5);
  const productIds = batch.map((p) => p.id);
  
  // Generate images for this batch
  await supabase.functions.invoke("generate-product-images", {
    body: { productIds }
  });
  
  // Wait 2 seconds between batches (rate limiting)
  await new Promise(resolve => setTimeout(resolve, 2000));
}
```

### Example Products Processed:

| Product Title | Category | Generated Prompt Style |
|--------------|----------|----------------------|
| "Vitamin C Brightening Cream" | Skin Care | Professional skincare product photography... |
| "Rose Gold Eye Palette" | Makeup | Professional makeup product photography... |
| "Nourishing Hair Oil" | Hair Care | Professional hair care product photography... |
| "Signature Eau de Parfum" | Fragrances | Luxury perfume bottle photography... |
| "Retinol Night Treatment" | Skin Care | Professional skincare product photography... |

### Progress Updates:
```
🖼️ Generating image for: Vitamin C Brightening Cream...
   ✅ Success! Image saved: https://...supabase.co/storage/v1/object/public/product-images/ai-generated/abc123.png

🖼️ Generating image for: Rose Gold Eye Palette...
   ✅ Success! Image saved: https://...supabase.co/storage/v1/object/public/product-images/ai-generated/def456.png

... (continues for all 12 products)
```

### Final Result:
✅ 12/12 images generated successfully
- All products now have images
- Button shows: "Generate AI Images (0)" (disabled)
- Toast notification: "Generated 12 AI product images"

---

## Example 3: Category-Specific Image Prompts

The system generates different prompts based on product category:

### Skin Care Products:
```typescript
const prompt = `professional skincare product photography, luxury cosmetic bottle or tube, 
minimalist white background, soft studio lighting, premium beauty product, 
high-end dermatological. Product: ${product.title}. 
Ultra high resolution, professional e-commerce product shot...`;
```

**Example**: "Hyaluronic Acid Serum"
- **Result**: Clean, professional skincare bottle image
- **Style**: Minimalist, medical-grade aesthetic

### Makeup Products:
```typescript
const prompt = `professional makeup product photography, elegant cosmetic packaging, 
beauty product, studio lighting, white background, luxury makeup brand. 
Product: ${product.title}...`;
```

**Example**: "Rose Gold Eye Palette"
- **Result**: Glamorous makeup product with rich colors
- **Style**: Luxury beauty brand aesthetic

### Fragrances:
```typescript
const prompt = `luxury perfume bottle photography, elegant fragrance packaging, 
premium glass bottle, studio lighting, sophisticated beauty product. 
Product: ${product.title}...`;
```

**Example**: "Signature Eau de Parfum"
- **Result**: Elegant perfume bottle with artistic lighting
- **Style**: High-end perfumery aesthetic

---

## Example 4: API Request/Response Flow

### Request to Generate Image:
```json
POST /functions/v1/generate-product-images
Headers: {
  "Authorization": "Bearer {user_token}",
  "Content-Type": "application/json"
}
Body: {
  "productIds": ["550e8400-e29b-41d4-a716-446655440000"]
}
```

### AI API Call:
```json
POST https://ai.gateway.lovable.dev/v1/chat/completions
Headers: {
  "Authorization": "Bearer {LOVABLE_API_KEY}",
  "Content-Type": "application/json"
}
Body: {
  "model": "google/gemini-2.5-flash-image-preview",
  "messages": [{
    "role": "user",
    "content": "professional skincare product photography..."
  }],
  "modalities": ["image", "text"]
}
```

### Response:
```json
{
  "choices": [{
    "message": {
      "images": [{
        "image_url": {
          "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
        }
      }]
    }
  }]
}
```

### Storage Upload:
```typescript
// Convert base64 to binary
const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

// Upload to Supabase Storage
await supabase.storage
  .from("product-images")
  .upload(`ai-generated/${product.id}.png`, bytes, {
    contentType: "image/png",
    upsert: true
  });

// Get public URL
const { data: publicUrl } = supabase.storage
  .from("product-images")
  .getPublicUrl(`ai-generated/${product.id}.png`);
// Result: "https://rgehleqcubtmcwyipyvi.supabase.co/storage/v1/object/public/product-images/ai-generated/550e8400-e29b-41d4-a716-446655440000.png"
```

### Database Update:
```sql
UPDATE products 
SET image_url = 'https://...supabase.co/.../ai-generated/550e8400-e29b-41d4-a716-446655440000.png'
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

---

## Example 5: Error Handling

### Scenario: Rate Limit Exceeded
```typescript
// If too many requests
if (response.status === 429) {
  return {
    error: "Rate limited. Please wait before generating more images.",
    retryAfter: 60
  };
}
```

### Scenario: AI API Failure
```typescript
// If AI generation fails
results.push({
  id: product.id,
  title: product.title,
  status: "ai_error"
});
// Product still created, but without image
// User can retry manually
```

### Scenario: Storage Upload Failure
```typescript
// If storage upload fails
if (uploadError) {
  results.push({
    id: product.id,
    title: product.title,
    status: "upload_error"
  });
  // Logs error but continues with next product
}
```

---

## Example 6: UI Flow

### Before Image Generation:
```
┌─────────────────────────────────────────┐
│  Manage Products                       │
├─────────────────────────────────────────┤
│  [Generate AI Images (12)]  [Auto-Enrich]  [Add Product] │
├─────────────────────────────────────────┤
│  Image │ Title              │ Category │ Price │ Actions │
│  ───── │ ────────────────── │ ──────── │ ───── │ ─────── │
│  📷    │ Vitamin C Cream   │ Skin    │ 52.00 │ ✏️ 🗑️   │
│  📷    │ Rose Gold Palette  │ Makeup  │ 38.00 │ ✏️ 🗑️   │
│  📷    │ Hair Oil           │ Hair    │ 32.00 │ ✏️ 🗑️   │
└─────────────────────────────────────────┘
```

### During Image Generation:
```
┌─────────────────────────────────────────┐
│  Manage Products                       │
├─────────────────────────────────────────┤
│  [🔄 Generating...]  [Auto-Enrich]  [Add Product] │
├─────────────────────────────────────────┤
│  🎨 Generating images for 12 products... │
│  Progress: 5/12 completed              │
└─────────────────────────────────────────┘
```

### After Image Generation:
```
┌─────────────────────────────────────────┐
│  Manage Products                       │
├─────────────────────────────────────────┤
│  [Generate AI Images (0)]  [Auto-Enrich]  [Add Product] │
│  ✅ Generated 12 AI product images     │
├─────────────────────────────────────────┤
│  Image │ Title              │ Category │ Price │ Actions │
│  ───── │ ────────────────── │ ──────── │ ───── │ ─────── │
│  🖼️    │ Vitamin C Cream   │ Skin    │ 52.00 │ ✏️ 🗑️   │
│  🖼️    │ Rose Gold Palette  │ Makeup  │ 38.00 │ ✏️ 🗑️   │
│  🖼️    │ Hair Oil           │ Hair    │ 32.00 │ ✏️ 🗑️   │
└─────────────────────────────────────────┘
```

---

## Example 7: Real-World Usage

### Step-by-Step Workflow:

1. **Admin creates product**:
   ```
   Title: "Luxury Retinol Night Cream"
   Price: 68.00
   Category: "Skin Care"
   Image: (skips upload)
   ```

2. **System automatically**:
   - Creates product in database
   - Detects missing image
   - Generates AI image with prompt:
     ```
     "professional skincare product photography, luxury cosmetic bottle or tube, 
      minimalist white background... Product: Luxury Retinol Night Cream..."
     ```
   - Uploads to Supabase Storage
   - Updates product with image URL
   - Shows success message

3. **Result**:
   - Product appears in shop with professional AI-generated image
   - Image matches category aesthetic
   - No manual work needed!

---

## Summary

✅ **Automatic**: New products get images automatically  
✅ **Bulk Processing**: Generate images for all missing products at once  
✅ **Category-Aware**: Different styles for different product types  
✅ **Error Handling**: Graceful failures with retry options  
✅ **User-Friendly**: Clear progress indicators and notifications  

The system ensures every product has a professional image! 🎨
