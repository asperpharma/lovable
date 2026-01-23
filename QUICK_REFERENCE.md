# 🚀 Quick Reference Card - Asper Beauty Shop

## ⚡ Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → Opens at http://localhost:8080

# Build for production
npm run build

# Preview production build
npm run preview

# Import products
npm run import:products

# Lint code
npm run lint
```

## 🔑 Environment Variables

Already configured in `.env`:
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`
- ✅ `VITE_SUPABASE_PUBLISHABLE_KEY`
- ✅ `VITE_SUPABASE_PROJECT_ID`

## 📍 Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Home page |
| `/shop` | Product catalog |
| `/admin/bulk-upload` | Bulk product upload |
| `/admin/orders` | Order management |
| `/driver` | Driver dashboard |
| `/auth` | Login/Signup |

## 🗂️ Important Files

- `src/App.tsx` - Main app & routing
- `src/pages/BulkUpload.tsx` - Bulk upload feature
- `.env` - Environment variables
- `package.json` - Dependencies
- `vite.config.ts` - Build config

## ✅ Status Check

- ✅ No merge conflicts
- ✅ No linter errors
- ✅ All dependencies listed
- ✅ Environment configured
- ✅ Ready to run

## 🆘 Quick Troubleshooting

**Port in use?** → Change port in `vite.config.ts`  
**Module errors?** → Run `npm install`  
**Build fails?** → Delete `node_modules` and reinstall  
**TypeScript errors?** → Restart IDE TypeScript server

---

**Full documentation**: See `SETUP_COMPLETE.md`
