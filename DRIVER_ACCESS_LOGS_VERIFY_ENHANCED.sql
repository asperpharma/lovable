-- Enhanced verification: driver_access_logs table, schema, RLS, policies, and functions
-- Run in SQL Editor after setup. Read-only.

-- Result set 1: Table existence + column schema
SELECT table_schema, table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'driver_access_logs'
ORDER BY ordinal_position;

-- Result set 2: RLS enabled on driver_access_logs?
SELECT 
  relname AS table_name, 
  relrowsecurity AS rls_enabled,
  relforcerowsecurity AS force_rls
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'driver_access_logs';

-- Result set 3: Policies on driver_access_logs (using pg_policies view - safe)
SELECT schemaname, tablename, policyname, cmd, roles, qual AS using_clause, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'driver_access_logs'
ORDER BY policyname;

-- Result set 4: Helper functions (has_role, handle_new_user) with definitions
SELECT 
  n.nspname AS schema, 
  p.proname AS function_name, 
  pg_get_function_identity_arguments(p.oid) AS args,
  pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname IN ('has_role', 'handle_new_user')
ORDER BY p.proname;
