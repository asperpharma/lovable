-- Full setup: driver_access_logs (DDL + RLS)
-- Run in Supabase SQL Editor → project unjgpqdcdcatbrinitfu
-- Safe: create-only (IF NOT EXISTS / CREATE OR REPLACE). DROP POLICY then CREATE POLICY.

-- 1) Ensure 'driver' exists in app_role
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'driver' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'driver';
  END IF;
END$$;

-- 2) Create or replace has_role function
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

-- 3) Create table if not exists
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

-- 4) Enable RLS and apply policies (drop if exists then create)
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
