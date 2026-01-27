-- Run this in Supabase Dashboard → SQL Editor (project unjgpqdcdcatbrinitfu)
-- RLS policies for driver_access_logs

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
