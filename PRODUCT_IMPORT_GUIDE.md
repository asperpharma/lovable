# Product Import & Shopify Sync Tools

Comprehensive utilities for importing products from Excel/CSV files and syncing them with Shopify.

## 📁 Files Created

- **`scripts/product-importer.ts`** - Processes Excel/CSV files and prepares products for import
- **`scripts/shopify-bulk-import.ts`** - Directly imports products to Shopify via Admin API
- **Updated `package.json`** - Added convenience scripts

## 🚀 Quick Start

### Step 1: Process Your Excel File

Your product data is in `/public/data/products-data.xlsx`. Run the importer to process it:

```bash
npm run import:products
```

This will:

- ✅ Read your Excel file
- ✅ Automatically categorize products (Skin Care, Make Up, Hair Care, etc.)
- ✅ Extract brand names
- ✅ Generate SEO-friendly tags
- ✅ Export to CSV and JSON formats
- ✅ Show detailed statistics

**Output files:**

- `/public/data/products.csv` - Clean CSV format
- `/public/data/products.json` - Structured JSON data

### Step 2: Sync with Shopify

#### Option A: Using the Shopify Admin API (Direct)

1. **Get your Shopify Admin API token:**
   - Go to Shopify Admin → Settings → Apps and sales channels
   - Click "Develop apps"
   - Create a private app with these permissions:
     - `write_products`
     - `read_products`
     - `write_inventory`
   - Copy the Admin API access token

2. **Set the environment variable:**

   ```bash
   export SHOPIFY_ADMIN_API_KEY=your_admin_api_token_here
   ```

3. **Run the import:**

   ```bash
   npm run import:shopify
   ```

This will:

- ✅ Upload all products to Shopify
- ✅ Update existing products (matches by SKU)
- ✅ Include images, prices, inventory
- ✅ Show real-time progress
- ✅ Provide detailed error reports

#### Option B: Using Your Existing Bulk Upload Page

1. Go to `http://localhost:8080/bulk-upload` in your app
2. Upload your Excel file
3. Use the built-in UI to review and sync products

## 📊 Product Data Format

The importer automatically handles various Excel column formats:

### Recognized Column Names

- **Product Name:** `name`, `title`, `product_name`, `Product`, `Title`
- **SKU:** `sku`, `SKU`, `Code`, `code`
- **Price:** `price`, `selling_price`, `Price`
- **Cost:** `cost`, `cost_price`, `Cost`
- **Brand:** `brand`, `vendor`, `Brand`, `Vendor`
- **Description:** `description`, `Description`, `desc`
- **Image:** `image`, `image_url`, `Image`
- **Stock:** `stock`, `quantity`, `Stock`, `Quantity`

### Example Excel Format

| SKU | Name | Brand | Price | Cost | Stock | Image URL |
|-----|------|-------|-------|------|-------|-----------|
| PROD-001 | Vichy Mineral 89 | Vichy | 29.99 | 18.00 | 50 | https://... |
| PROD-002 | Cetaphil Cleanser | Cetaphil | 15.99 | 9.50 | 100 | https://... |

## 🎯 Features

### Automatic Categorization

Products are automatically categorized based on keywords:

- **Skin Care** - creams, serums, sunscreens, cleansers
- **Hair Care** - shampoos, conditioners, treatments
- **Body Care** - lotions, soaps, deodorants
- **Make Up** - mascara, lipstick, foundation
- **Fragrances** - perfumes, colognes
- **Health & Supplements** - vitamins, supplements
- **Personal Care** - toothpaste, razors, hygiene products
- **Baby Care** - baby products, diapers

### Smart Brand Extraction

Recognizes 40+ major brands including:

- Vichy, Eucerin, Cetaphil, La Roche-Posay
- Neutrogena, CeraVe, Nivea, Dove
- Maybelline, L'Oréal, Revlon, Bourjois
- And many more...

### SEO Tag Generation

Automatically generates tags for:

- Skin types (Oily, Dry, Sensitive, Combination)
- Concerns (Acne, Anti-Aging, Brightening, Sun Protection)
- Gender (Men, Women)
- Category and brand

## 🔧 Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
# Shopify Configuration
SHOPIFY_STORE=your-store.myshopify.com
SHOPIFY_ADMIN_API_KEY=your_admin_api_token

# Supabase (already configured)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Excel File Location

Place your product data file at:

```
/public/data/products-data.xlsx
```

Or modify the path in `scripts/product-importer.ts`:

```typescript
const EXCEL_FILE_PATH = join(process.cwd(), 'your/custom/path.xlsx');
```

## 📈 Statistics & Reporting

After running the importer, you'll see:

```
📊 Product Statistics:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Products: 500
Products with Images: 450 (90%)
Total Inventory Value: $45,000.00

Top Categories:
  Skin Care: 180
  Make Up: 120
  Hair Care: 85
  Body Care: 65
  Fragrances: 50

Top Brands:
  Vichy: 45
  Cetaphil: 38
  Eucerin: 32
  ...
```

## 🛠️ Advanced Usage

### Processing Products Programmatically

```typescript
import { readExcelFile, processProducts } from './scripts/product-importer';

const rawProducts = readExcelFile('/path/to/file.xlsx');
const products = processProducts(rawProducts);

// Do something with the processed products
products.forEach(product => {
  console.log(`${product.name} - $${product.price}`);
});
```

### Custom Shopify Import

```typescript
import { createShopifyProduct } from './scripts/shopify-bulk-import';

const product = {
  sku: 'CUSTOM-001',
  name: 'Custom Product',
  brand: 'My Brand',
  category: 'Skin Care',
  price: 29.99,
  costPrice: 18.00,
  description: 'Amazing product',
  stock: 100,
  tags: ['bestseller', 'new']
};

await createShopifyProduct(product);
```

## ⚠️ Important Notes

### Rate Limiting

- The Shopify importer respects API rate limits (2 requests/second)
- Large catalogs may take time to import
- Progress is shown in real-time

### Data Validation

- Products without names are automatically skipped
- Missing prices default to $0 (review before importing!)
- SKUs are auto-generated if not provided
- Stock defaults to 100 if not specified

### Image URLs

- Must be publicly accessible HTTPS URLs
- Shopify will download and host the images
- Invalid URLs will cause product creation to fail

## 🔄 Updating Products

To update existing products:

1. Modify your Excel file
2. Run the importer again: `bun run import:products`
3. Run the Shopify sync: `bun run import:shopify`

Products are matched by SKU - existing products will be updated, new ones created.

## 📝 Troubleshooting

### "File not found" error

- Check that your Excel file exists at `/public/data/products-data.xlsx`
- Verify the file path in the script

### "Shopify API error"

- Verify your Admin API token is correct
- Check that your app has the required permissions
- Ensure your Shopify store is active

### Products not categorizing correctly

- Update the `CATEGORY_KEYWORDS` in `product-importer.ts`
- Add more specific keywords for your products

### Rate limit errors

- The script automatically handles rate limiting
- If you see errors, wait a few minutes and retry

## 📞 Support

For issues or questions:

1. Check the console output for detailed error messages
2. Review the generated CSV file to verify data
3. Test with a small batch (5-10 products) first

## ✨ Best Practices

1. **Start Small** - Test with 10-20 products first
2. **Review Data** - Check the generated CSV before importing
3. **Backup** - Export your current Shopify products first
4. **Validate Images** - Ensure all image URLs are accessible
5. **Use SKUs** - Always include unique SKUs for proper tracking
6. **Test Environment** - Use a development store for testing

---

**Ready to import? Run:**

```bash
npm run import:products && npm run import:shopify
```
