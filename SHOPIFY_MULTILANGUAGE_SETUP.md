# Shopify Multi-Language Setup Guide

## Overview
This guide will help you set up your Shopify store to support both English and Arabic languages, matching your Lovable website.

## Method 1: Shopify Markets (Recommended - Easiest)

### Step 1: Enable Markets
1. Log in to your Shopify Admin
2. Go to **Settings** → **Markets**
3. Click **"Add market"**
4. Create two markets:
   - **Default Market (English)**
     - Name: "English Market"
     - Countries: Select your primary markets
     - Language: English
   - **Arabic Market**
     - Name: "Arabic Market"
     - Countries: Select Arabic-speaking countries (Jordan, UAE, Saudi Arabia, etc.)
     - Language: Arabic

### Step 2: Configure Language Settings
1. Go to **Settings** → **Languages**
2. Click **"Add language"**
3. Select **Arabic (العربية)**
4. Click **"Save"**

### Step 3: Translate Store Content
1. Go to **Settings** → **Languages**
2. Click **"Manage translations"** next to Arabic
3. Translate:
   - **Store content**: Navigation, footer, policies
   - **Product pages**: Product titles, descriptions, variants
   - **Collection pages**: Collection titles and descriptions
   - **Checkout**: Checkout page text
   - **Email notifications**: Order confirmations, shipping updates

### Step 4: Set Up Domain/Subdomain (Optional)
- **Option A**: Use subdirectories
  - `yoursite.com` (English)
  - `yoursite.com/ar` (Arabic)
  
- **Option B**: Use subdomains
  - `en.yoursite.com` (English)
  - `ar.yoursite.com` (Arabic)

- **Option C**: Use different domains
  - `yoursite.com` (English)
  - `yoursite.ae` (Arabic)

### Step 5: Update Your Lovable Website
Your website already detects language preference. Make sure your Shopify integration respects the language:

```tsx
// In your Shopify API calls
const language = language === 'ar' ? 'AR' : 'EN';
const market = language === 'ar' ? 'arabic-market' : 'default-market';
```

## Method 2: Translation Apps (Faster Setup)

### Recommended Apps:

#### 1. Weglot (Most Popular)
- **Price**: Starting at $15/month
- **Features**:
  - Automatic translation
  - SEO-friendly
  - Professional translations available
  - Works with all themes

**Setup:**
1. Install Weglot from Shopify App Store
2. Add your languages (English, Arabic)
3. Configure display rules
4. Weglot automatically translates your store
5. Review and edit translations as needed

#### 2. GTranslate
- **Price**: Free (with limitations) or $9.99/month
- **Features**:
  - Google Translate integration
  - Automatic translation
  - SEO support

**Setup:**
1. Install GTranslate from Shopify App Store
2. Select languages
3. Configure settings
4. Translations are automatic

#### 3. Langify
- **Price**: $17.50/month
- **Features**:
  - Manual translation management
  - Professional translation services
  - Full control over translations

## Method 3: Manual Translation with Metafields

### Step 1: Create Metafield Definitions

1. Go to **Settings** → **Custom data** → **Products**
2. Click **"Add definition"**
3. Create these metafields:

**Product Title (Arabic)**
- Name: "Title (Arabic)"
- Namespace and key: `translations.title_ar`
- Type: Single line text

**Product Description (Arabic)**
- Name: "Description (Arabic)"
- Namespace and key: `translations.description_ar`
- Type: Multi-line text

**Product Short Description (Arabic)**
- Name: "Short Description (Arabic)"
- Namespace and key: `translations.short_description_ar`
- Type: Multi-line text

### Step 2: Add Translations to Products

For each product:
1. Go to **Products** → Select a product
2. Scroll to **Metafields** section
3. Fill in:
   - Title (Arabic): Arabic product name
   - Description (Arabic): Arabic product description
   - Short Description (Arabic): Brief Arabic description

### Step 3: Update Your Code

In your Lovable website, when fetching products:

```tsx
// Fetch product with metafields
const product = await fetchShopifyProduct(handle, {
  includeMetafields: true
});

// Use Arabic translation if available
const { language } = useLanguage();
const title = language === 'ar' 
  ? product.metafields?.translations?.title_ar || product.title
  : product.title;

const description = language === 'ar'
  ? product.metafields?.translations?.description_ar || product.description
  : product.description;
```

## Method 4: Storefront API with Localization

### Step 1: Enable Localization in API

Your Storefront API queries should include language:

```graphql
query getProduct($handle: String!, $language: LanguageCode!) {
  product(handle: $handle) {
    id
    title
    description
    # Fetch translations if available
    translations(locale: $language) {
      title
      description
    }
  }
}
```

### Step 2: Update Your API Calls

```tsx
// In your shopify.ts file
export async function fetchProduct(handle: string, language: 'en' | 'ar' = 'en') {
  const languageCode = language === 'ar' ? 'AR' : 'EN';
  
  const query = `
    query getProduct($handle: String!, $language: LanguageCode!) {
      product(handle: $handle) {
        id
        title
        description
        translations(locale: $language) {
          title
          description
        }
      }
    }
  `;
  
  return await storefrontApiRequest(query, {
    handle,
    language: languageCode
  });
}
```

## Recommended Approach for Your Store

### For Quick Setup (1-2 days):
1. **Use Weglot or GTranslate** app
2. Install and configure
3. Review automatic translations
4. Edit as needed

### For Professional Setup (1-2 weeks):
1. **Use Shopify Markets**
2. Set up Arabic market
3. Manually translate key products
4. Use translation app for remaining content
5. Review and refine all translations

### For Complete Control (Ongoing):
1. **Use Metafields** for product translations
2. **Use Markets** for store structure
3. **Manual translation** for all content
4. Maintain translations as you add products

## Testing Your Setup

### 1. Test Language Switching
- Switch language on your Lovable website
- Verify Shopify checkout reflects the language
- Check email notifications

### 2. Test Product Display
- View products in English
- Switch to Arabic
- Verify titles and descriptions are translated

### 3. Test Checkout Flow
- Add product to cart in English
- Switch to Arabic
- Complete checkout
- Verify order confirmation email language

## Common Issues and Solutions

### Issue: Translations not showing
**Solution**: 
- Clear browser cache
- Check if language is properly set in Shopify
- Verify API calls include language parameter

### Issue: Checkout still in English
**Solution**:
- Ensure Markets are properly configured
- Check if checkout language setting is enabled
- Verify domain/subdomain routing

### Issue: Product images not changing
**Solution**:
- Product images are usually language-agnostic
- If you need different images, use metafields for image URLs

## Best Practices

1. **Consistency**: Use the same translation approach across all content
2. **SEO**: Ensure Arabic URLs are SEO-friendly
3. **Testing**: Test thoroughly in both languages
4. **Maintenance**: Keep translations updated as you add new products
5. **Quality**: Review automatic translations for accuracy

## Integration with Your Lovable Website

Your Lovable website already has:
- ✅ Language detection and switching
- ✅ RTL support for Arabic
- ✅ Translation system for UI elements
- ✅ Product translation utilities

**Next Steps:**
1. Set up Shopify Markets or install translation app
2. Translate your Shopify store content
3. Ensure your API calls respect the language setting
4. Test the complete flow

## Support Resources

- [Shopify Markets Documentation](https://help.shopify.com/en/manual/markets)
- [Shopify Translation Apps](https://apps.shopify.com/browse/store-management-translation)
- [Storefront API Localization](https://shopify.dev/api/storefront/latest/queries/localization)

---

**Note**: The easiest and fastest way is to use a translation app like Weglot. It will automatically translate your entire store and you can refine translations as needed.
