# 🏗️ How to Build Asper Beauty Shop

## Quick Commands

```bash
# Development (with hot reload)
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview

# Import Products from Excel
npm run import:products

# Sync to Shopify
npm run import:shopify
```

## 📦 Build Process

### 1. Development Mode

```bash
npm run dev
```

- Opens at: `http://localhost:8080`
- Hot module reload (instant updates)
- Development optimizations
- Source maps enabled

### 2. Production Build

```bash
npm run build
```

- Minifies code
- Optimizes assets
- Removes debug code
- Output: `dist/` folder
- Ready for deployment

### 3. Preview Production

```bash
npm run preview
```

- Test production build locally
- Same as deployed version
- Performance testing

## 🚀 Deployment

### Option 1: Lovable.app (Current)

Your site is already deployed at:
**<https://asperbeautyshop.lovable.app>**

To update:

1. Push changes to GitHub
2. Lovable auto-deploys

### Option 2: Custom Hosting

After building (`npm run build`), deploy the `dist/` folder to:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag `dist/` folder to Netlify
- **GitHub Pages**: Push `dist/` to gh-pages branch
- **Your Server**: Upload `dist/` contents

## 🌐 Domain Setup

### Current Domain

`asperbeautyshop.lovable.app`

### Custom Domain

1. Add DNS CNAME record:

   ```
   www.yourstore.com → asperbeautyshop.lovable.app
   ```

2. Configure in Lovable dashboard
3. SSL auto-configured

## 📊 Product Management

### Import Products

```bash
# Process Excel file
npm run import:products

# Results:
# ✅ public/data/products.csv
# ✅ public/data/products.json
```

### Sync to Shopify

```bash
# Setup
export SHOPIFY_ADMIN_API_KEY=your_key

# Import
npm run import:shopify
```

### Or Use Web Interface

1. Start dev server: `npm run dev`
2. Go to: `http://localhost:8080/bulk-upload`
3. Upload and sync products

## 🛠️ Requirements

- **Node.js**: 18+ (check: `node --version`)
- **npm**: 9+ (check: `npm --version`)
- **Git**: Any version

## 📁 Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── images/
└── public/
    └── data/
```

## 🎯 Build Optimization

Already optimized with:

- Code splitting
- Tree shaking
- Asset optimization
- Lazy loading
- Gzip compression

## 🔍 Troubleshooting

### Build Fails

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use

```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Missing Dependencies

```bash
npm install
```

## 📱 Testing

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit

# Test build
npm run build && npm run preview
```

## 🎨 Environment Variables

Create `.env` file:

```env
# Shopify
SHOPIFY_STORE=your-store.myshopify.com
SHOPIFY_ADMIN_API_KEY=your_admin_api_token

# Supabase (already set)
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

# Optional
VITE_LOVABLE_API_KEY=your_lovable_key
```

## ✅ Success Checklist

- [ ] Dependencies installed: `npm install`
- [ ] Development works: `npm run dev`
- [ ] Production builds: `npm run build`
- [ ] Products imported: `npm run import:products`
- [ ] Site accessible: Check localhost or deployment
- [ ] Images displaying
- [ ] Cart functioning
- [ ] Checkout working

## 🎉 You're Ready

Your Asper Beauty Shop is built and ready to serve customers!

**Current Status:**

- ✅ 1,524 products imported
- ✅ Multi-language support (EN/AR)
- ✅ Shopify integration active
- ✅ Responsive design
- ✅ Production ready

### Launch Checklist

1. ✅ Build site: `npm run build`
2. ⏳ Add product images (use `/bulk-upload`)
3. ⏳ Set up custom domain
4. ⏳ Configure payment methods
5. ⏳ Test checkout process
6. ⏳ Launch marketing campaign

**Need help? Check:**

- [SUCCESS_SUMMARY.md](./SUCCESS_SUMMARY.md)
- [PRODUCT_IMPORT_GUIDE.md](./PRODUCT_IMPORT_GUIDE.md)
- [QUICK_START.md](./QUICK_START.md)
