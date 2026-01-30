# Step A – Get Lovable API key (do it now)

Your Lovable project should be open in your browser.

---

## 1. Open Settings

- Click your **project name** (top left of the Lovable editor).
- Click **Settings** in the menu.

## 2. Find the API key

Try, in order:

**Option A – Connectors**

- **Settings** → **Connectors** → **Shared connectors** → **Lovable AI**
- Look for **API key**, **Generate**, or **Use externally** / programmatic access.
- Copy the key if shown, or create one.

**Option B – Integrations / API**

- **Settings** → **Integrations** (or **API** / **API Keys**).
- Look for a key for the **Lovable AI gateway** (`ai.gateway.lovable.dev`).
- Copy or create the key.

## 3. Store the key

- Paste it somewhere safe (e.g. a temporary note).
- You’ll add it as **`LOVABLE_API_KEY`** in Supabase (Step B).

---

## Next

- Add **`LOVABLE_API_KEY`** (and **`SITE_URL`**) in [Supabase Dashboard](https://supabase.com/dashboard) → project **unjgpqdcdcatbrinitfu** → **Project Settings** → **Edge Functions** → **Secrets**.
- Or run `.\scripts\apply-domain-setup.ps1` and paste the key when prompted.
