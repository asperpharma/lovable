# Apply `driver_access_logs` to Supabase

Use **one** of the methods below. Project: `unjgpqdcdcatbrinitfu`.

---

## Option 1: Supabase SQL Editor (simplest)

1. Open **[SQL Editor](https://supabase.com/dashboard/project/unjgpqdcdcatbrinitfu/sql/new)**.
2. Open **`DRIVER_ACCESS_LOGS_FULL_SETUP.sql`** in your editor, select all (Ctrl+A), copy.
3. Paste into the SQL Editor and click **Run**.
4. Confirm you see “Success. No rows returned” (or similar). Done.

---

## Option 2: `psql` with connection string

1. Get your **Database** connection string:
   - [Supabase Dashboard](https://supabase.com/dashboard/project/unjgpqdcdcatbrinitfu/settings/database) → **Project Settings** → **Database** → **Connection string** → **URI**.
   - Use the **Transaction** pooler URI (port `6543`) or **Session** (port `5432`). Replace `[YOUR-PASSWORD]` with your DB password.

2. From the project root, run (replace `CONNECTION_URI` with the URI from the Dashboard, including your password):

   ```bash
   psql "CONNECTION_URI" -f DRIVER_ACCESS_LOGS_FULL_SETUP.sql
   ```

   Example **Transaction** pooler (port 6543):

   ```
   postgresql://postgres.unjgpqdcdcatbrinitfu:[YOUR-PASSWORD]@aws-0-XX-XXXX-X.pooler.supabase.com:6543/postgres
   ```

   Example **Session** direct (port 5432):

   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.unjgpqdcdcatbrinitfu.supabase.co:5432/postgres
   ```

   Use the exact URI shown in **Project Settings → Database** for your project.

3. No errors → setup applied.

---

## Option 3: Supabase CLI migrations

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli) and link the project:

   ```bash
   cd "c:\Users\C-R\Desktop\Asper Beauty Box\Asper Beauty shop prodcuts\product apify\lovable"
   supabase login
   supabase link --project-ref unjgpqdcdcatbrinitfu
   ```

2. Push migrations (applies `20260126115900_driver_access_logs_table` + `20260126120000_driver_access_logs_rls`):

   ```bash
   supabase db push
   ```

3. Confirm the command reports applied migrations. Done.

---

## Verify

- **Table:** Supabase Dashboard → **Table Editor** → `driver_access_logs` exists.
- **RLS:** **Authentication** → **Policies** → `driver_access_logs` has the expected policies.
- **App:** Driver app logs actions; Admin → **Audit Logs** shows entries.

---

## After setup

### 1. Harden `has_role` (recommended)

Run **once** in [SQL Editor](https://supabase.com/dashboard/project/unjgpqdcdcatbrinitfu/sql/new):

```sql
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
```

- **Only** revoke from `anon`. Do **not** revoke from `authenticated` or `service_role` (RLS needs them).

### 2. LOVABLE secrets (Edge Functions)

If you use beauty-assistant, bulk-product-upload, generate-product-images, remove-background, or create-cod-order:

1. [Supabase Dashboard](https://supabase.com/dashboard/project/unjgpqdcdcatbrinitfu) → **Project Settings** → **Edge Functions** → **Secrets**.
2. **Add** `LOVABLE_API_KEY` = your Lovable API key → **Save**.
3. **Add** `SITE_URL` = `https://asperbeautyshop.lovable.app` (or your live URL) → **Save**.
4. Redeploy or restart affected Edge Functions so they pick up the new secrets.

See [LOVABLE_SETUP_GUIDE.md](./LOVABLE_SETUP_GUIDE.md) for details.

---

## SQL syntax check

The statements in `DRIVER_ACCESS_LOGS_FULL_SETUP.sql` are valid PostgreSQL (DO block, `CREATE OR REPLACE`, `IF NOT EXISTS`, `DROP POLICY IF EXISTS`). If you hit errors, they’re usually due to:

- Missing `app_role` / `user_roles` / `cod_orders` → run your existing migrations first.
- Wrong project or DB → confirm you’re connected to `unjgpqdcdcatbrinitfu`.

If you paste the exact error message, we can fix the SQL or connection steps.
