-- Defensive driver_access_logs setup (SQL Editor)
-- Ensures extensions, creates app_role if missing, defers cod_orders FK until table exists.
-- Prerequisite: public.user_roles must exist (has_role reads it).

-- 1) Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2) app_role: create if missing, else add 'driver' only
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'app_role' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'driver');
  ELSIF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE e.enumlabel = 'driver' AND t.typname = 'app_role' AND n.nspname = 'public'
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'driver';
  END IF;
END$$;

-- 3) has_role (requires user_roles)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4) Table without cod_orders FK; add FK only if cod_orders exists
CREATE TABLE IF NOT EXISTS public.driver_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID,
  action_type TEXT NOT NULL,
  accessed_fields TEXT[],
  metadata JSONB,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE INDEX IF NOT EXISTS idx_driver_access_logs_driver_id ON public.driver_access_logs(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_access_logs_order_id ON public.driver_access_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_driver_access_logs_created_at ON public.driver_access_logs(created_at);

-- 5) RLS and policies
ALTER TABLE public.driver_access_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.driver_access_logs;
DROP POLICY IF EXISTS "Service role can read audit logs" ON public.driver_access_logs;
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

CREATE POLICY "Service role can read audit logs"
ON public.driver_access_logs FOR SELECT TO service_role
USING (true);

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
