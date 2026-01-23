# 🚀 Complete Setup and Deployment Guide

This guide will walk you through the complete setup and deployment process for Asper Beauty Shop.

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js 18+** installed
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`
   
2. **Git** installed and configured
   - Verify: `git --version`
   
3. **Supabase CLI** (will be installed automatically if missing)
   - Or install manually: `npm install -g supabase`

4. **Access to:**
   - Supabase Dashboard
   - Shopify Admin (if using Shopify integration)
   - All API keys listed in `.env.template`

## 🔧 Step-by-Step Setup

### Step 1: Install Node.js (if not already installed)

1. Visit https://nodejs.org/
2. Download the LTS version (18.x or higher)
3. Run the installer
4. Restart your terminal/PowerShell
5. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

### Step 2: Navigate to Project Directory

```powershell
cd "C:\Users\C-R\Desktop\Asper Beauty Box\Asper Beauty shop prodcuts\product apify\lovable"
```

### Step 3: Configure Environment Variables

1. Copy the template file:
   ```powershell
   Copy-Item .env.template .env
   ```

2. Edit `.env` file with your actual values:
   - Open `.env` in a text editor
   - Fill in all required API keys and configuration values
   - Refer to `.env.template` for descriptions

### Step 4: Install Dependencies

```powershell
npm install
```

This will install all required packages listed in `package.json`.

### Step 5: Verify Environment Configuration

Check that your `.env` file has all required variables:

```powershell
# Required variables:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_SUPABASE_PUBLISHABLE_KEY
```

### Step 6: Build the Project

```powershell
npm run build
```

This creates a production-ready build in the `dist` folder.

### Step 7: Configure Supabase Secrets

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to: **Settings → Edge Functions → Secrets**
3. Add all secrets listed in `.env.template`:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - OPENAI_API_KEY
   - REMOVE_BG_API_KEY
   - FIRECRAWL_API_KEY
   - LOVABLE_API_KEY
   - SHOPIFY_ACCESS_TOKEN
   - HCAPTCHA_SECRET_KEY
   - RESEND_API_KEY

### Step 8: Deploy Supabase Edge Functions

1. Login to Supabase CLI:
   ```powershell
   supabase login
   ```

2. Deploy all functions:
   ```powershell
   # Deploy individual functions
   supabase functions deploy bulk-product-upload --no-verify-jwt
   supabase functions deploy generate-product-images --no-verify-jwt
   supabase functions deploy remove-background --no-verify-jwt
   supabase functions deploy create-cod-order --no-verify-jwt
   supabase functions deploy get-order-status --no-verify-jwt
   supabase functions deploy beauty-assistant --no-verify-jwt
   supabase functions deploy enrich-products --no-verify-jwt
   supabase functions deploy delete-account --no-verify-jwt
   supabase functions deploy verify-captcha --no-verify-jwt
   supabase functions deploy scrape-product --no-verify-jwt
   ```

### Step 9: Run Database Migrations

```powershell
supabase db push
```

This applies all database migrations to your Supabase project.

### Step 10: Verify Deployment

Test critical endpoints:

```powershell
# Test order creation endpoint
$response = Invoke-WebRequest -Uri "$env:VITE_SUPABASE_URL/functions/v1/create-cod-order" -Method OPTIONS
Write-Host "Status: $($response.StatusCode)"
```

## 🎯 Automated Deployment

For automated deployment, use the PowerShell script:

```powershell
.\deploy.ps1
```

This script will:
- ✅ Check environment configuration
- ✅ Verify required variables
- ✅ Install dependencies
- ✅ Build the frontend
- ✅ Deploy edge functions
- ✅ Run migrations
- ✅ Verify deployment

## 📦 Git Operations

### Stage and Commit Changes

```powershell
# Check status
git status

# Stage all changes
git add .

# Commit with message
git commit -m "chore: Complete setup and deployment configuration"

# Push to remote
git push
```

### Current Branch Status

You're currently on branch: `copilot/vscode-mkoqctri-ikan`

To push your changes:
```powershell
git push origin copilot/vscode-mkoqctri-ikan
```

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend builds successfully (`npm run build`)
- [ ] All environment variables are set
- [ ] Supabase CLI is authenticated
- [ ] All edge functions are deployed
- [ ] Database migrations are applied
- [ ] Frontend is accessible at: https://asperbeautyshop.lovable.app
- [ ] Admin panel is accessible at: https://asperbeautyshop.lovable.app/admin/bulk-upload

## 🐛 Troubleshooting

### Node.js not found
- Install Node.js from https://nodejs.org/
- Restart terminal after installation
- Verify with `node --version`

### npm install fails
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Supabase CLI not found
- Install globally: `npm install -g supabase`
- Verify: `supabase --version`

### Build fails
- Check for TypeScript errors: `npx tsc --noEmit`
- Check for linting errors: `npm run lint`
- Review error messages in terminal

### Edge function deployment fails
- Verify you're logged in: `supabase projects list`
- Check function secrets in Supabase Dashboard
- Review function logs: `supabase functions logs <function-name>`

## 📚 Additional Resources

- **README.md** - Project overview and features
- **README_DEPLOYMENT.md** - Quick deployment reference
- **.env.template** - Environment variable documentation
- **validate-production.sh** - Validation script (Linux/Mac)
- **deploy.sh** - Deployment script (Linux/Mac)
- **deploy.ps1** - Deployment script (Windows/PowerShell)

## 🎉 Success!

Once all steps are completed, your Asper Beauty Shop is ready for production!

**Live URLs:**
- Frontend: https://asperbeautyshop.lovable.app
- Admin Panel: https://asperbeautyshop.lovable.app/admin/bulk-upload

**Security Features:**
- ✅ JWT verification for admin functions
- ✅ Rate limiting on order creation
- ✅ CAPTCHA verification
- ✅ Input validation and sanitization

---

**Need Help?** Check the troubleshooting section above or review the project documentation.
