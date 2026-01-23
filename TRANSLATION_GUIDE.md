# Complete Arabic Translation Guide

## ✅ What Has Been Completed

### 1. Comprehensive Translation System
- **Expanded LanguageContext** with 200+ translation keys covering:
  - Navigation and menus
  - Product pages and components
  - Authentication and account management
  - Admin pages (Bulk Upload, Orders, Products, Audit Logs)
  - Driver dashboard
  - Contact, Wishlist, Track Order pages
  - Common UI elements and actions
  - Error messages and notifications

### 2. RTL Support
- Automatic RTL layout switching when Arabic is selected
- Document direction (`dir`) and language (`lang`) attributes are set automatically
- Language preference is saved in localStorage

### 3. Started Page Updates
- **BulkUpload.tsx** - Partially updated with translations
- All other pages need to be updated to use the translation system

## 📋 How to Use Translations in Your Components

### Basic Usage

```tsx
import { useLanguage } from "@/components/contexts/LanguageContext";

function MyComponent() {
  const { t, language, isRTL } = useLanguage();
  
  return (
    <div>
      <h1>{t.home}</h1>
      <p>{t.welcomeMessage}</p>
      <button>{t.submit}</button>
    </div>
  );
}
```

### Available Translation Keys

All translation keys are available through the `t` object. Common categories:

- **Navigation**: `t.home`, `t.collections`, `t.brands`, `t.cart`, etc.
- **Products**: `t.addToCart`, `t.price`, `t.inStock`, `t.outOfStock`, etc.
- **Auth**: `t.email`, `t.password`, `t.login`, `t.signUp`, etc.
- **Admin**: `t.bulkProductUpload`, `t.manageProducts`, `t.adminOrders`, etc.
- **Common**: `t.loading`, `t.error`, `t.success`, `t.save`, `t.cancel`, etc.

## 🔧 How to Update Pages

### Step 1: Import the Hook
```tsx
import { useLanguage } from "@/components/contexts/LanguageContext";
```

### Step 2: Use in Component
```tsx
export default function MyPage() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t.pageTitle}</h1>
      <p>{t.pageDescription}</p>
    </div>
  );
}
```

### Step 3: Replace Hardcoded Strings
Replace all hardcoded English strings with `t.keyName`:

**Before:**
```tsx
<h1>Welcome to Our Store</h1>
<button>Add to Cart</button>
```

**After:**
```tsx
<h1>{t.welcomeMessage}</h1>
<button>{t.addToCart}</button>
```

## 📝 Pages That Need Translation Updates

### High Priority (Customer-Facing)
1. ✅ **BulkUpload.tsx** - Partially done
2. ⬜ **Auth.tsx** - Login, Signup, Password Reset
3. ⬜ **Account.tsx** - User profile and settings
4. ⬜ **Contact.tsx** - Contact form
5. ⬜ **TrackOrder.tsx** - Order tracking
6. ⬜ **Wishlist.tsx** - Wishlist page
7. ⬜ **ProductDetail.tsx** - Product details
8. ⬜ **Shop.tsx** - Shop page
9. ⬜ **Collections.tsx** - Collections page
10. ⬜ **Brands.tsx** - Brands page

### Medium Priority (Admin)
11. ⬜ **AdminOrders.tsx** - Order management
12. ⬜ **ManageProducts.tsx** - Product management
13. ⬜ **AdminAuditLogs.tsx** - Audit logs
14. ⬜ **DriverDashboard.tsx** - Driver dashboard

### Components That Need Updates
- **Header.tsx** / **GlobalHeader.tsx** - Navigation
- **Footer.tsx** - Footer links and content
- **CartDrawer.tsx** - Shopping cart
- **ProductCard.tsx** - Product cards
- **ProductQuickView.tsx** - Quick view modal
- **Newsletter.tsx** - Newsletter signup
- All other UI components

## 🛍️ Shopify Multi-Language Setup

### Option 1: Shopify Markets (Recommended)

1. **Enable Markets in Shopify Admin**
   - Go to Settings → Markets
   - Click "Add market"
   - Create markets for:
     - English (Default)
     - Arabic (Middle East)

2. **Configure Language Settings**
   - Go to Settings → Languages
   - Add Arabic as a language
   - Set up translations for:
     - Product titles and descriptions
     - Collection names
     - Navigation menus
     - Checkout pages
     - Email notifications

3. **Translate Content**
   - Use Shopify's built-in translation tools
   - Or use apps like:
     - **Weglot** - Automatic translation
     - **GTranslate** - Google Translate integration
     - **Langify** - Professional translation management

### Option 2: Manual Translation with Metafields

1. **Create Metafield Definitions**
   ```
   Namespace: translations
   Key: title_ar
   Type: Single line text
   ```

2. **Store Arabic Translations**
   - For each product, add metafields:
     - `translations.title_ar` - Arabic title
     - `translations.description_ar` - Arabic description

3. **Update Your Code**
   ```tsx
   // In your product fetching code
   const arabicTitle = product.metafields?.find(
     m => m.namespace === 'translations' && m.key === 'title_ar'
   )?.value || product.title;
   ```

### Option 3: Use Shopify Storefront API with Localization

1. **Enable Storefront API Localization**
   ```graphql
   query {
     shop {
       localization {
         availableLanguages {
           isoCode
           name
         }
       }
     }
   }
   ```

2. **Fetch Localized Content**
   ```tsx
   const { data } = await storefrontApiRequest(`
     query getProduct($handle: String!, $language: LanguageCode!) {
       product(handle: $handle) {
         title
         description
         translations(locale: $language) {
           title
           description
         }
       }
     }
   `, {
     handle: productHandle,
     language: language === 'ar' ? 'AR' : 'EN'
   });
   ```

### Recommended Approach

**For Your Lovable Website:**
- Use the existing `translateTitle` and `getLocalizedDescription` functions in `productUtils.ts`
- These already handle Arabic translations for product names and descriptions
- The translation system is working for UI elements

**For Shopify Store:**
- Use **Shopify Markets** for the best experience
- Set up Arabic as a market language
- Translate product content through Shopify admin
- Your website will automatically sync with Shopify translations

## 🎨 RTL Styling Best Practices

### CSS Classes for RTL
Tailwind CSS automatically handles RTL with the `dir="rtl"` attribute. However, you can use:

```tsx
const { isRTL } = useLanguage();

<div className={isRTL ? 'text-right' : 'text-left'}>
  {content}
</div>
```

### Common RTL Patterns
```tsx
// Icons and arrows
<ArrowRight className={isRTL ? 'rotate-180' : ''} />

// Margins and padding
<div className={isRTL ? 'mr-4' : 'ml-4'} />

// Flex direction
<div className={isRTL ? 'flex-row-reverse' : 'flex-row'} />
```

## 📚 Adding New Translations

### Step 1: Add to Interface
In `LanguageContext.tsx`, add to the `Translations` interface:

```tsx
interface Translations {
  // ... existing keys
  myNewKey: string;
}
```

### Step 2: Add Translations
Add to both `en` and `ar` objects:

```tsx
const translations: Record<Language, Translations> = {
  en: {
    // ... existing
    myNewKey: 'My New Text',
  },
  ar: {
    // ... existing
    myNewKey: 'نصي الجديد',
  },
};
```

## ✅ Testing Checklist

- [ ] Switch language using language switcher
- [ ] Verify RTL layout in Arabic mode
- [ ] Test all pages in both languages
- [ ] Check product names and descriptions
- [ ] Verify form labels and buttons
- [ ] Test error messages
- [ ] Check navigation menus
- [ ] Verify footer content
- [ ] Test cart and checkout flow
- [ ] Verify admin pages

## 🚀 Next Steps

1. **Update Remaining Pages** - Use the pattern shown above to update all pages
2. **Update Components** - Translate all reusable components
3. **Test Thoroughly** - Test in both languages
4. **Set Up Shopify** - Configure Shopify Markets for Arabic
5. **Add Missing Translations** - Add any missing keys as you find them

## 📞 Support

If you need help:
1. Check existing translation keys in `LanguageContext.tsx`
2. Add new keys following the pattern above
3. Use the `translateTitle` and `getLocalizedDescription` functions for product content
4. Ensure RTL styling is applied correctly

---

**Note**: The translation system is now fully set up. You just need to replace hardcoded strings with `t.keyName` throughout your application. The Arabic translations are already complete and ready to use!
