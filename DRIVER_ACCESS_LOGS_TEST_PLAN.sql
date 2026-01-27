-- Minimal test plan for driver_access_logs RLS (Option 6)
-- Run in Supabase SQL Editor. Use service_role for setup; verify via app as admin/driver/anon.

-- ========== 1. PREP (run as service_role / postgres) ==========
-- Ensure test data exists. Replace UUIDs with real admin/driver user IDs from auth.users.

/*
-- Example: insert a test log (service_role bypasses RLS, or use policy if FORCE ROW LEVEL SECURITY).
INSERT INTO public.driver_access_logs (driver_id, order_id, action_type, accessed_fields, metadata, user_agent)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,  -- replace with real driver user id
  NULL,
  'view_orders_list',
  ARRAY['order_count'],
  '{"order_count": 5}'::jsonb,
  'Mozilla/5.0 Test'
);
*/

-- ========== 2. VERIFY POLICIES EXIST ==========
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'driver_access_logs'
ORDER BY policyname;

-- ========== 3. WHAT TO TEST (by role) ==========

-- As ADMIN (authenticated, has admin role):
--   SELECT * FROM public.driver_access_logs;
--   Expected: all rows.

-- As DRIVER (authenticated, has driver role):
--   INSERT: driver_id = auth.uid() -> OK.
--   INSERT: driver_id != auth.uid() -> FAIL (violates WITH CHECK).
--   SELECT * FROM public.driver_access_logs;
--   Expected: 0 rows (no SELECT policy for drivers).

-- As ANON:
--   SELECT * FROM public.driver_access_logs;
--   Expected: 0 rows.
--   INSERT any row -> FAIL.

-- As SERVICE_ROLE (e.g. Edge Functions, backends):
--   SELECT * FROM public.driver_access_logs;
--   Expected: all rows (if using tightened RLS with "Service role can read audit logs").

-- ========== 4. EXAMPLE APP-SIDE CHECKS ==========
-- Admin: /admin/audit-logs -> fetches from driver_access_logs -> should see logs.
-- Driver: Driver Dashboard -> actions insert logs -> no errors; must not see audit list.
-- Logged out: must not fetch logs.
