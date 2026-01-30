-- Tightened RLS for driver_access_logs (Option 4)
-- Admins + service_role can SELECT; drivers INSERT own only; no UPDATE/DELETE.

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

-- SELECT: admins (authenticated) + service_role (auditing/backups)
CREATE POLICY "Admins can view all audit logs"
ON public.driver_access_logs FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can read audit logs"
ON public.driver_access_logs FOR SELECT TO service_role
USING (true);

CREATE POLICY "Deny anonymous access to audit logs"
ON public.driver_access_logs FOR SELECT TO anon
USING (false);

-- INSERT: drivers own rows only; deny anon
CREATE POLICY "Deny anonymous insert on audit logs"
ON public.driver_access_logs FOR INSERT TO anon
WITH CHECK (false);

CREATE POLICY "Drivers can insert their own access logs"
ON public.driver_access_logs FOR INSERT TO authenticated
WITH CHECK (
  (auth.uid() = driver_id)
  AND public.has_role(auth.uid(), 'driver'::app_role)
);

-- UPDATE / DELETE: no one
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
