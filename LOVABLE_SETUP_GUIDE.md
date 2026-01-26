# Lovable Connection Setup Guide

## ✅ Current Status

### GitHub Connection
- **Repository**: `asperpharma/lovable`
- **Remote URL**: `https://github.com/asperpharma/lovable.git`
- **Status**: ✅ Connected

### Lovable Integration
- **Lovable Tagger**: ✅ Installed (`lovable-tagger` in `vite.config.ts`)
- **Live Site**: https://asperbeautyshop.lovable.app
- **Lovable Project**: https://lovable.dev/projects/77495a61-2517-4bbc-b7c9-0c86fefea9be
- **Auto-sync**: ✅ Enabled (changes sync between Lovable ↔ GitHub)

---

## 🔗 Step 1: Access Your Lovable Project

### Option A: Direct Access
1. Go to **https://lovable.dev**
2. Sign in with your **GitHub account** (the one with access to `asperpharma/lovable`)
3. Your project should appear in your dashboard

### Option B: Import from GitHub (if project doesn't appear)
1. Go to **https://lovable.dev**
2. Click **"New Project"** or **"Import from GitHub"**
3. Select the **`asperpharma/lovable`** repository
4. Lovable will automatically sync your code

### Your Lovable Project URL
- **Direct link**: [https://lovable.dev/projects/77495a61-2517-4bbc-b7c9-0c86fefea9be](https://lovable.dev/projects/77495a61-2517-4bbc-b7c9-0c86fefea9be)

**Note:** If you received a link with a `?magic_link=...` parameter, that’s a one-time sign-in token. Use it to log in, but don’t share it—treat it like a password.

---

## 🔑 Step 2: Set Up LOVABLE_API_KEY for Supabase Functions

Your Supabase Edge Functions require `LOVABLE_API_KEY` to use Lovable's AI services. This key is used in:

1. **`beauty-assistant`** - AI chat assistant
2. **`bulk-product-upload`** - Product categorization and image generation
3. **`generate-product-images`** - AI product image generation
4. **`remove-background`** - Background removal service

### How to Get Your Lovable API Key

1. **Sign in to Lovable**: https://lovable.dev
2. **Go to Settings/API**: Look for "API Keys" or "Settings" in your project
3. **Generate API Key**: Create a new API key for your project
4. **Copy the Key**: Save it securely

### Setting Up in Supabase

#### Method 1: Supabase Dashboard (Recommended)

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: `rgehleqcubtmcwyipyvi`
3. Navigate to **Project Settings** → **Edge Functions** → **Secrets**
4. Click **"Add new secret"**
5. Add:
   - **Name**: `LOVABLE_API_KEY`
   - **Value**: `[your-lovable-api-key]`
6. Click **"Save"**

#### Method 2: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref rgehleqcubtmcwyipyvi

# Set the secret
supabase secrets set LOVABLE_API_KEY=your-api-key-here
```

### Verify the Setup

After setting the secret, test one of your functions:

```bash
# Test the beauty-assistant function
curl -X POST https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'
```

If you get an error about `LOVABLE_API_KEY not configured`, the secret wasn't set correctly.

---

## ✅ Step 3: Verify GitHub Connection

### Check Remote Configuration
```bash
git remote -v
```

Should show:
```
origin  https://github.com/asperpharma/lovable.git (fetch)
origin  https://github.com/asperpharma/lovable.git (push)
```

### Test Sync
1. Make a small change locally (e.g., update README)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test sync"
   git push origin main
   ```
3. Check Lovable dashboard - changes should appear within a few minutes
4. Make a change in Lovable
5. Check GitHub - changes should sync to the `main` branch

---

## 🚀 Development Mode

When running locally:

```bash
npm run dev
```

The `lovable-tagger` plugin automatically:
- Tracks component changes
- Enables Lovable to understand your code structure
- Helps with AI-powered suggestions

**Note**: The tagger only runs in development mode (`mode === "development"`).

---

## 📋 Checklist

- [ ] Signed in to Lovable.dev with GitHub account
- [ ] Project appears in Lovable dashboard
- [ ] Obtained LOVABLE_API_KEY from Lovable settings
- [ ] Set LOVABLE_API_KEY in Supabase secrets
- [ ] Verified GitHub remote is correct
- [ ] Tested sync between Lovable and GitHub
- [ ] Tested Supabase functions with API key

---

## 🆘 Troubleshooting

### Project doesn't appear in Lovable
- Ensure you're signed in with the correct GitHub account
- Check that the GitHub account has access to `asperpharma/lovable`
- Try importing the project manually from GitHub

### LOVABLE_API_KEY errors in Supabase Functions
- Verify the secret is set in Supabase dashboard
- Check the secret name is exactly `LOVABLE_API_KEY` (case-sensitive)
- Ensure you're using the correct project reference
- Wait a few minutes after setting the secret for it to propagate

### Changes not syncing
- Check that auto-sync is enabled in Lovable project settings
- Ensure you're pushing to the `main` branch (Lovable syncs from `main`)
- Wait a few minutes - sync can take 1-5 minutes
- Check GitHub repository permissions

### Lovable Tagger not working
- Ensure you're running `npm run dev` (not `npm run build`)
- Check that `mode === "development"` in `vite.config.ts`
- Verify `lovable-tagger` is installed: `npm list lovable-tagger`

---

## 📚 Additional Resources

- [Lovable Documentation](https://docs.lovable.dev)
- [Lovable GitHub Integration](https://docs.lovable.dev/integrations/github)
- [Supabase Edge Functions Secrets](https://supabase.com/docs/guides/functions/secrets)
- [Your Repository](https://github.com/asperpharma/lovable)

---

**Need Help?** If you encounter issues, check the Lovable Discord community or Supabase support.
