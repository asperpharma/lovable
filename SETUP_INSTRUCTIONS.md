# 🚀 Complete Setup Instructions

## Prerequisites

Before running the setup, ensure you have:

1. **Node.js 18+** installed
   - Download from: https://nodejs.org/
   - Or install **Bun**: https://bun.sh/
   - Verify installation: `node --version` or `bun --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

## Quick Setup (Windows PowerShell)

### Option 1: Automated Setup Script

```powershell
# Navigate to project directory
cd "C:\Users\C-R\Desktop\Asper Beauty Box\Asper Beauty shop prodcuts\product apify\lovable"

# Run the setup script
.\setup.ps1
```

### Option 2: Manual Setup

```powershell
# 1. Navigate to project directory
cd "C:\Users\C-R\Desktop\Asper Beauty Box\Asper Beauty shop prodcuts\product apify\lovable"

# 2. Install dependencies
npm install

# 3. Verify environment variables
# Check that .env file exists and has required values:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY

# 4. Start development server
npm run dev
```

## Environment Configuration

### 1. Check .env File

The `.env` file should contain at minimum:

```env
VITE_SUPABASE_URL=https://rgehleqcubtmcwyipyvi.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_key_here
```

### 2. Optional: Add Additional API Keys

If you need additional features, add these to `.env`:

```env
# hCaptcha (for forms)
VITE_HCAPTCHA_SITE_KEY=your_key_here

# Shopify Integration
SHOPIFY_ACCESS_TOKEN=your_token_here
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com

# AI Services (for edge functions)
OPENAI_API_KEY=your_key_here
LOVABLE_API_KEY=your_key_here
```

**Note:** Backend API keys should be set in **Supabase Dashboard → Settings → Edge Functions → Secrets**, not in `.env`.

## Post-Setup Steps

### 1. Verify Installation

```powershell
# Check if dependencies are installed
Test-Path "node_modules"

# Check if build works
npm run build
```

### 2. Start Development Server

```powershell
npm run dev
```

The app will be available at: `http://localhost:5173`

### 3. Configure Supabase Edge Functions (Optional)

If you need to deploy edge functions:

1. Install Supabase CLI:
   ```powershell
   npm install -g supabase
   ```

2. Login to Supabase:
   ```powershell
   supabase login
   ```

3. Set edge function secrets in Supabase Dashboard:
   - Go to: **Settings → Edge Functions → Secrets**
   - Add required secrets (see `.env.template` for list)

4. Deploy functions:
   ```powershell
   supabase functions deploy function-name
   ```

## Troubleshooting

### Node.js Not Found

**Error:** `node : The term 'node' is not recognized`

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart your terminal/PowerShell
3. Verify: `node --version`

### npm Not Found

**Error:** `npm : The term 'npm' is not recognized`

**Solution:**
1. Node.js includes npm - reinstall Node.js
2. Or use Bun: https://bun.sh/

### Permission Errors

**Error:** Permission denied when running scripts

**Solution:**
```powershell
# Allow script execution (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use

**Error:** Port 5173 is already in use

**Solution:**
```powershell
# Use a different port
npm run dev -- --port 3000
```

## Next Steps

After setup is complete:

1. ✅ **Development**: Run `npm run dev` to start developing
2. ✅ **Build**: Run `npm run build` to create production build
3. ✅ **Deploy**: Follow `DEPLOYMENT_GUIDE.md` for production deployment
4. ✅ **Verify**: Use `PRODUCTION_CHECKLIST.md` to verify everything works

## Documentation

- **Quick Start**: `QUICK_START.md`
- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Production Checklist**: `PRODUCTION_CHECKLIST.md`
- **Monitoring**: `MONITORING_GUIDE.md`

## Support

If you encounter issues:

1. Check that Node.js is installed and in PATH
2. Verify `.env` file has required variables
3. Check `package.json` for correct scripts
4. Review error messages in terminal

---

**Setup Status**: ✅ Ready to execute

Run `.\setup.ps1` to begin automated setup!
