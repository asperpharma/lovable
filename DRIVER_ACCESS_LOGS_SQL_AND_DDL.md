# driver_access_logs — SQL + DDL (Option 2: paste for debugging)

Use this when you can't access the DB schema directly. Paste the **RLS snippet** and **DDL** sections below.

---

## Prerequisites (DDL)

Your DB must have:

1. **`app_role`** enum with `'admin'`, `'user'`, and **`'driver'`**
2. **`public.has_role(_user_id uuid, _role app_role)`** function
3. **`public.driver_access_logs`** table
4. **`public.cod_orders`** table (referenced by `order_id`)

### 1. app_role + driver (if missing)

```sql
-- Only if 'driver' not in app_role yet
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'driver' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'driver';
  END IF;
END$$;
```

### 2. has_role function

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

### 3. driver_access_logs table (only if it doesn’t exist)

```sql
CREATE TABLE IF NOT EXISTS public.driver_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.cod_orders(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  accessed_fields TEXT[],
  metadata JSONB,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_driver_access_logs_driver_id ON public.driver_access_logs(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_access_logs_order_id ON public.driver_access_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_driver_access_logs_created_at ON public.driver_access_logs(created_at);
```

---

## RLS snippet (driver_access_logs)

Run this **after** the table and `has_role` exist:

```sql
ALTER TABLE public.driver_access_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.driver_access_logs;
DROP POLICY IF EXISTS "Deny anonymous access to audit logs" ON public.driver_access_logs;
DROP POLICY IF EXISTS "Deny anonymous insert on audit logs" ON public.driver_access_logs;
DROP POLICY IF EXISTS "Drivers can insert their own access logs" ON public.driver_access_logs;
DROP POLICY IF EXISTS "Deny anonymous update on audit logs" ON public.driver_access_logs;
DROP POLICY IF EXISTS "No updates allowed on audit logs" ON public.driver_access_logs;
DROP POLICY IF EXISTS "Deny anonymous delete on audit logs" ON public.driver_access_logs;
DROP POLICY IF EXISTS "No deletes allowed on audit logs" ON public.driver_access_logs;

CREATE POLICY "Admins can view all audit logs"
ON public.driver_access_logs FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Deny anonymous access to audit logs"
ON public.driver_access_logs FOR SELECT TO anon
USING (false);

CREATE POLICY "Deny anonymous insert on audit logs"
ON public.driver_access_logs FOR INSERT TO anon
WITH CHECK (false);

CREATE POLICY "Drivers can insert their own access logs"
ON public.driver_access_logs FOR INSERT TO authenticated
WITH CHECK (
  (auth.uid() = driver_id)
  AND public.has_role(auth.uid(), 'driver'::app_role)
);

CREATE POLICY "Deny anonymous update on audit logs"
ON public.driver_access_logs FOR UPDATE TO anon
USING (false);

CREATE POLICY "No updates allowed on audit logs"
ON public.driver_access_logs FOR UPDATE TO authenticated
USING (false);

CREATE POLICY "Deny anonymous delete on audit logs"
ON public.driver_access_logs FOR DELETE TO anon
USING (false);

CREATE POLICY "No deletes allowed on audit logs"
ON public.driver_access_logs FOR DELETE TO authenticated
USING (false);
```

---

## Summary

| Policy | Command | Role | Rule |
|--------|---------|------|------|
| Admins can view all audit logs | SELECT | authenticated | `has_role(auth.uid(), 'admin')` |
| Deny anonymous access to audit logs | SELECT | anon | `false` |
| Deny anonymous insert on audit logs | INSERT | anon | `WITH CHECK (false)` |
| Drivers can insert their own access logs | INSERT | authenticated | `auth.uid() = driver_id AND has_role(auth.uid(), 'driver')` |
| Deny anonymous update on audit logs | UPDATE | anon | `false` |
| No updates allowed on audit logs | UPDATE | authenticated | `false` |
| Deny anonymous delete on audit logs | DELETE | anon | `false` |
| No deletes allowed on audit logs | DELETE | authenticated | `false` |

**Common failures:**

- `relation "driver_access_logs" does not exist` → run the **CREATE TABLE** block first.
- `type "app_role" does not exist` or `invalid input value for enum app_role: "driver"` → ensure `app_role` exists and includes `'driver'` (use the `DO $$ ... ADD VALUE 'driver'` block).
- `function has_role(uuid, app_role) does not exist` → run the **has_role** DDL.

---

## Options checklist (for Lovable / Supabase tooling)

**Choose:**

1. **Validate and run** → **Create missing only (safe)**. Do not drop/recreate.
4. **Tightened RLS** → Use `DRIVER_ACCESS_LOGS_TIGHTENED_RLS.sql`: admins + **service_role** can SELECT; drivers INSERT own only.
6. **Test plan** → Use `DRIVER_ACCESS_LOGS_TEST_PLAN.sql`: policy checks + app-side verification steps.
