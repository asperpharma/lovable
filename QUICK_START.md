# Product Import & Shopify Sync - Quick Reference

## 🚀 Quick Commands

```bash
# 1. Process your Excel file
npm run import:products

# 2. Sync to Shopify (requires API key)
npm run import:shopify

# Or do both at once:
npm run import:products && npm run import:shopify
```

## 📋 Setup Checklist

- [ ] Excel file at `/public/data/products-data.xlsx`
- [ ] Run `npm run import:products` to process data
- [ ] Get Shopify Admin API token (optional, for direct import)
- [ ] Set `SHOPIFY_ADMIN_API_KEY` environment variable
- [ ] Run `npm run import:shopify` to sync

## 📊 What Gets Processed

✅ **Automatic categorization** - Products sorted into 9 categories  
✅ **Brand extraction** - Recognizes 40+ major beauty brands  
✅ **SEO tags** - Auto-generated tags for better discoverability  
✅ **Price validation** - Verifies pricing data  
✅ **Stock management** - Inventory quantities included  
✅ **Image handling** - Image URLs validated and included  

## 📁 Output Files

After running `npm run import:products`:

- `/public/data/products.csv` - Clean CSV format
- `/public/data/products.json` - Structured JSON data
- Console output with statistics and insights

## 🔑 Required Excel Columns

Your Excel file should have these columns (flexible naming):

| Column Type | Accepted Names |
|-------------|----------------|
| Product Name | `name`, `title`, `product_name` |
| SKU | `sku`, `SKU`, `code` |
| Price | `price`, `selling_price` |
| Cost | `cost`, `cost_price` |
| Brand | `brand`, `vendor` |
| Stock | `stock`, `quantity` |
| Image | `image`, `image_url` |

## 🎯 Categories Supported

1. **Skin Care** - Creams, serums, cleansers, sunscreens
2. **Hair Care** - Shampoos, conditioners, treatments
3. **Body Care** - Lotions, soaps, deodorants
4. **Make Up** - Mascara, lipstick, foundation, etc.
5. **Fragrances** - Perfumes, colognes
6. **Health & Supplements** - Vitamins, supplements
7. **Personal Care** - Toothpaste, hygiene products
8. **Medical Supplies** - Medical equipment
9. **Baby Care** - Baby products

## 🏷️ Recognized Brands

Vichy • Eucerin • Cetaphil • La Roche-Posay • Bioderma • CeraVe  
Neutrogena • Nivea • Dove • Garnier • L'Oréal • Maybelline  
Revlon • Bourjois • Isadora • Essence • Bioten • Olaplex  
And 25+ more...

## 📞 Need Help?

Check the full guide: [PRODUCT_IMPORT_GUIDE.md](./PRODUCT_IMPORT_GUIDE.md)
