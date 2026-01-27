# Apply `driver_access_logs` to Supabase

Use **one** of the methods below. Project: `unjgpqdcdcatbrinitfu`.

---

## Optional: Pre-check (see what exists / is missing)

Run **`DRIVER_ACCESS_LOGS_PRE_CHECK.sql`** in the [SQL Editor](https://supabase.com/dashboard/project/unjgpqdcdcatbrinitfu/sql/new) first. It returns a table of objects (`pgcrypto`, `app_role`, `user_roles`, `cod_orders`, `driver_access_logs`, `has_role`, `driver_access_logs_order_id_fkey`) with `present` or `missing`. Use it to decide whether to run the **original** or **defensive** setup.

---

## Option 1: Supabase SQL Editor (simplest)

1. Open **[SQL Editor](https://supabase.com/dashboard/project/unjgpqdcdcatbrinitfu/sql/new)**.
2. Open **`DRIVER_ACCESS_LOGS_FULL_SETUP.sql`** in your editor, select all (Ctrl+A), copy.
3. Paste into the SQL Editor and click **Run**.
4. Confirm you see “Success. No rows returned” (or similar). Done.

**If you hit** `app_role` / `gen_random_uuid` / `cod_orders` **errors:** use **`DRIVER_ACCESS_LOGS_FULL_SETUP_DEFENSIVE.sql`** instead. It ensures `pgcrypto`, creates `app_role` if missing, and defers the `cod_orders` FK until that table exists. **`user_roles` must still exist** (from base migrations).

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
- **Catalog check:** Run **`DRIVER_ACCESS_LOGS_VERIFY.sql`** in the [SQL Editor](https://supabase.com/dashboard/project/unjgpqdcdcatbrinitfu/sql/new). It confirms the table exists, RLS is enabled, lists policies on `driver_access_logs`, and shows `has_role` (and related) function signatures.

**Verify script: expected results & interpretation**

The script returns **4 result sets** (one per `SELECT`), not 4 rows in a single table.

| Result set | What it checks | How to interpret |
|------------|----------------|------------------|
| **1** | Table `driver_access_logs` exists | `result = 'exists'` → table present; `'missing'` → create it or check schema. |
| **2** | RLS enabled on `driver_access_logs` | `result = 'yes'` → RLS on; `'no'` → run `ALTER TABLE public.driver_access_logs ENABLE ROW LEVEL SECURITY;` if you use policies. |
| **3** | Policies on `driver_access_logs` | Rows = policies (`policyname`, `cmd`, `roles`). Expect SELECT/INSERT/UPDATE/DELETE for `authenticated` and/or `service_role`. Empty → add policies (see setup scripts). |
| **4** | Helper functions `has_role`, `handle_new_user` | Rows = functions (`schema`, `name`, `args`). Missing → app may fail; create them (see setup scripts). |

**Run verify & paste results (quick steps)**

Nobody can run SQL in your Supabase project from here. **You** must run it and paste the results.

1. **Copy** the exact SQL from **`DRIVER_ACCESS_LOGS_VERIFY.sql`** (or the block in the "Defensive script" section below).
2. **Go to** [Supabase Dashboard](https://supabase.com/dashboard) → sign in → select project **unjgpqdcdcatbrinitfu**.
3. **Database** → **SQL Editor** → **New query**.
4. **Paste** the SQL and click **Run**.
5. You’ll get **4 result sets**. Copy each (or screenshot), then **paste them here** labeled **Result set 1**, **Result set 2**, **Result set 3**, **Result set 4** (in order).

**Once you paste the four result sets here**, we will:

- Interpret each (table exists, RLS enabled, policies, functions).
- Flag missing pieces and any security or performance concerns.
- Provide exact, **non-destructive** SQL for recommended RLS policies and safe helper stubs (`has_role`, `handle_new_user`).
- Ask for **explicit confirmation** before proposing any **destructive** changes.

**Two safe options (verify SQL is read-only)**

The assistant cannot run the verify SQL in your project without **organization data-sharing** (e.g. Bedrock) enabled in Supabase. You have two choices:

| Option | What to do | What happens next |
|--------|------------|-------------------|
| **A — Assistant runs it** | Enable **organization data-sharing consent** in Supabase settings, then tell the assistant. | They run `list_tables` / `list_extensions` first, then the verify SQL. They validate results in 1–2 lines and summarize. |
| **B — You run it** | Copy **`DRIVER_ACCESS_LOGS_VERIFY.sql`** into the SQL Editor, run it, then **paste the four result sets here** (labeled Result set 1–4). | We interpret them, **point out missing pieces**, and provide **exact SQL** for RLS policies and helper functions (**non-destructive**). We ask for **explicit confirmation** before any **destructive** changes. |

**If you run it yourself (Option B):** Result set 1 = table exists/missing; 2 = RLS yes/no; 3 = policies on `driver_access_logs`; 4 = `has_role` / `handle_new_user`. Empty policy list → add policies; missing functions → create them (see setup scripts).

**Pick one (next steps)**

| Reply | What happens |
|-------|----------------|
| **"ENABLE DONE"** | You enable org data-sharing (Bedrock) in Supabase, then reply. We run `list_tables` + `list_extensions`, then **`DRIVER_ACCESS_LOGS_VERIFY.sql`**. We validate in 1–2 lines, summarize missing pieces, and provide exact non-destructive SQL. |
| **Run verify yourself** | You run **`DRIVER_ACCESS_LOGS_VERIFY.sql`** in the SQL Editor, paste Result sets 1–4 here. We interpret, flag gaps, provide non-destructive SQL, and ask before any destructive changes. |
| **"PRE_CHECK"** | We paste **`DRIVER_ACCESS_LOGS_PRE_CHECK.sql`** for you to run (see what exists / is missing). |
| **"FULL_DEFENSIVE"** | We paste **`DRIVER_ACCESS_LOGS_FULL_SETUP_DEFENSIVE.sql`** (safe; use when unsure about extensions / referenced tables). |
| **"FULL"** | We paste **`DRIVER_ACCESS_LOGS_FULL_SETUP.sql`** (assumes `app_role`, `user_roles`, `cod_orders` exist). |
| **"VERIFY"** | We paste **`DRIVER_ACCESS_LOGS_VERIFY.sql`** for you to run, then paste Result sets 1–4 back. |

**Run it yourself or have an assistant run it**

- **Your run:** Copy `DRIVER_ACCESS_LOGS_VERIFY.sql` into the SQL Editor, run it, then **paste the four result sets here**. We’ll interpret them, **point out missing pieces** and any **security/performance concerns**, and provide **exact SQL** for recommended RLS policies and safe helper function stubs (**non-destructive**). If any **destructive** changes are needed, we'll ask for **explicit confirmation** before producing those.
- **Assistant run:** Enable organization data-sharing in Supabase settings, tell the assistant, and they’ll run `list_tables` / `list_extensions` plus the verify SQL, then summarize in 1–2 lines.

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

### 3. `user_roles` explicit deny anon + index (PostgREST)

If PostgREST recommends explicit deny-anon or indexing `user_id`:

- **Migrations:** `supabase db push` applies `20260126140000_user_roles_deny_anon_and_index.sql`.
- **Manual:** Run **`USER_ROLES_DENY_ANON_AND_INDEX.sql`** in the [SQL Editor](https://supabase.com/dashboard/project/unjgpqdcdcatbrinitfu/sql/new). It adds deny-anon SELECT/INSERT/UPDATE/DELETE and `idx_user_roles_user_id`.

---

## Defensive script: FK-only-when-`cod_orders`-exists snippet

The defensive script adds the `cod_orders` FK only when the table exists and the constraint is missing. Exact logic:

```sql
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cod_orders')
     AND NOT EXISTS (
       SELECT 1 FROM pg_constraint c
       JOIN pg_class t ON t.oid = c.conrelid
       JOIN pg_namespace n ON n.oid = t.relnamespace
       WHERE n.nspname = 'public' AND t.relname = 'driver_access_logs'
         AND c.conname = 'driver_access_logs_order_id_fkey'
     ) THEN
    ALTER TABLE public.driver_access_logs
      ADD CONSTRAINT driver_access_logs_order_id_fkey
      FOREIGN KEY (order_id) REFERENCES public.cod_orders(id) ON DELETE SET NULL;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END$$;
```

`driver_access_logs` is created with `order_id UUID` (no FK). This block runs after; it adds the FK only if `cod_orders` exists and the constraint does not. `duplicate_object` is ignored (e.g. constraint already added).

---

## SQL syntax check

The statements in `DRIVER_ACCESS_LOGS_FULL_SETUP.sql` are valid PostgreSQL (DO block, `CREATE OR REPLACE`, `IF NOT EXISTS`, `DROP POLICY IF EXISTS`). If you hit errors, they’re usually due to:

- Missing `app_role` / `user_roles` / `cod_orders` → run your existing migrations first.
- Wrong project or DB → confirm you’re connected to `unjgpqdcdcatbrinitfu`.

If you paste the exact error message, we can fix the SQL or connection steps.
