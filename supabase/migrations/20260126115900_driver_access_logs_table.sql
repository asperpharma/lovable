-- driver_access_logs table (DDL)
-- Prerequisites: app_role, user_roles, cod_orders. Run before 20260126120000_driver_access_logs_rls.

-- 1) Ensure 'driver' in app_role
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'driver' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'driver';
  END IF;
END$$;

-- 2) has_role (idempotent)
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

-- 3) Table + indexes
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
