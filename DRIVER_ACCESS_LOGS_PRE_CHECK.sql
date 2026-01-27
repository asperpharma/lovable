-- Pre-check: dependencies for DRIVER_ACCESS_LOGS setup
-- Run in SQL Editor first to see what exists / is missing. Read-only.

SELECT 'pgcrypto' AS obj,
  CASE WHEN EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN 'present' ELSE 'missing' END AS status
UNION ALL
SELECT 'app_role',
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'app_role' AND n.nspname = 'public'
  ) THEN 'present' ELSE 'missing' END
UNION ALL
SELECT 'user_roles',
  CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_roles') THEN 'present' ELSE 'missing' END
UNION ALL
SELECT 'cod_orders',
  CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cod_orders') THEN 'present' ELSE 'missing' END
UNION ALL
SELECT 'driver_access_logs',
  CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'driver_access_logs') THEN 'present' ELSE 'missing' END
UNION ALL
SELECT 'has_role',
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'has_role' AND n.nspname = 'public'
  ) THEN 'present' ELSE 'missing' END
UNION ALL
SELECT 'driver_access_logs_order_id_fkey',
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public' AND t.relname = 'driver_access_logs' AND c.conname = 'driver_access_logs_order_id_fkey'
  ) THEN 'present' ELSE 'missing' END
ORDER BY 1;
