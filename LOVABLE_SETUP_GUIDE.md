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

## 🔑 Step 2: Get Lovable API Key & Set Supabase Secrets

Your Supabase Edge Functions use **LOVABLE_API_KEY** (and optionally **SITE_URL**) for our domain. These are used in:

1. **`beauty-assistant`** – AI chat assistant
2. **`bulk-product-upload`** – Product categorization and image generation
3. **`generate-product-images`** – AI product image generation
4. **`remove-background`** – Background removal service
5. **`create-cod-order`** – `SITE_URL` for tracking links (default: `https://asperbeautyshop.lovable.app`)

### A. Get Your Lovable API Key

1. Open your project: [Lovable project](https://lovable.dev/projects/77495a61-2517-4bbc-b7c9-0c86fefea9be)
2. In the project, open **Settings** (gear icon or project menu)
3. Find **API** or **API Keys** / **Integrations**
4. Create or copy an API key for the **Lovable AI gateway** (used by `ai.gateway.lovable.dev`)
5. Store it securely; you’ll add it to Supabase next.

See [Lovable Security & API keys](https://docs.lovable.dev/features/security) for more.

### B. Set Secrets in Supabase

#### Method 1: Supabase Dashboard (recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → project **unjgpqdcdcatbrinitfu**
2. **Project Settings** → **Edge Functions** → **Secrets**
3. **Add new secret** for each:
   - **Name**: `LOVABLE_API_KEY` → **Value**: `[your-lovable-api-key]`
   - **Name**: `SITE_URL` → **Value**: `https://asperbeautyshop.lovable.app` (or your custom domain)
4. **Save**

#### Method 2: Apply-domain-setup scripts (CLI)

From the project root:

**Windows (PowerShell):**
```powershell
.\scripts\apply-domain-setup.ps1
```

**Mac / Linux:**
```bash
chmod +x scripts/apply-domain-setup.sh
./scripts/apply-domain-setup.sh
```

Each script will:

- Link the Supabase project `unjgpqdcdcatbrinitfu`
- Prompt for **LOVABLE_API_KEY** and **SITE_URL** (default: `https://asperbeautyshop.lovable.app`)
- Run `supabase secrets set` for both

Requires [Supabase CLI](https://supabase.com/docs/guides/cli) and `supabase login` first.

### Verify the Setup

After setting the secrets, test a function:

```bash
# Replace YOUR_ANON_KEY with VITE_SUPABASE_PUBLISHABLE_KEY from .env
curl -X POST https://unjgpqdcdcatbrinitfu.supabase.co/functions/v1/beauty-assistant \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'
```

If you see `LOVABLE_API_KEY not configured`, the secret wasn’t set correctly.

---

## 🌐 Apply Everything in Our Domain

Domain-related config lives in one place and is used across the app.

| What | Where |
|------|--------|
| **Domain config** | `src/lib/domain.ts` – `SITE_URL`, `CANONICAL_URL`, `CONTACT_EMAIL`, Supabase ref, Lovable project URL |
| **Env template** | `.env.example` – `VITE_*` and notes for `LOVABLE_API_KEY` / `SITE_URL` (Supabase only) |
| **Apply scripts** | `scripts/apply-domain-setup.ps1` (Windows), `scripts/apply-domain-setup.sh` (Mac/Linux) |

- **Frontend**: Footer contact email uses `DOMAIN.CONTACT_EMAIL` from `@/lib/domain`.
- **Edge Functions**: `create-cod-order` uses `SITE_URL` from Supabase secrets (fallback: `https://asperbeautyshop.lovable.app`).
- **Secrets**: Set `LOVABLE_API_KEY` and `SITE_URL` via Dashboard or the apply-domain-setup scripts above.

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
- Verify **LOVABLE_API_KEY** is set in Supabase Dashboard → Project Settings → Edge Functions → Secrets
- Ensure the name is exactly `LOVABLE_API_KEY` (case-sensitive)
- Project ref: `unjgpqdcdcatbrinitfu`
- Wait a few minutes after setting secrets for them to propagate
- Use `scripts/apply-domain-setup.ps1` or `apply-domain-setup.sh` to set via CLI if needed

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
