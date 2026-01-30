-- Verification: driver_access_logs table, RLS policies, and has_role
-- Run in SQL Editor after setup. Read-only.

-- 1) Table exists?
SELECT 'driver_access_logs' AS check_type, 'table' AS obj,
  CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'driver_access_logs')
    THEN 'exists' ELSE 'missing' END AS result;

-- 2) RLS enabled on driver_access_logs?
SELECT 'driver_access_logs' AS check_type, 'rls_enabled' AS obj,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'driver_access_logs' AND c.relrowsecurity
  ) THEN 'yes' ELSE 'no' END AS result;

-- 3) Policies on driver_access_logs (name, cmd, roles)
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'driver_access_logs'
ORDER BY policyname;

-- 4) has_role and other relevant functions (name, args)
SELECT n.nspname AS schema, p.proname AS name, pg_get_function_identity_arguments(p.oid) AS args
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname IN ('has_role', 'handle_new_user')
ORDER BY p.proname;
