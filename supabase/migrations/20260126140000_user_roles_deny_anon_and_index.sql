-- user_roles: explicit deny anon (defense-in-depth) + index for policy/user_id lookups
-- RLS already enabled. Adds deny-anon SELECT (recreate dropped one) + INSERT/UPDATE/DELETE.

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny anonymous access to user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Deny anonymous insert on user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Deny anonymous update on user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Deny anonymous delete on user_roles" ON public.user_roles;

CREATE POLICY "Deny anonymous access to user_roles"
ON public.user_roles FOR SELECT TO anon
USING (false);

CREATE POLICY "Deny anonymous insert on user_roles"
ON public.user_roles FOR INSERT TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update on user_roles"
ON public.user_roles FOR UPDATE TO anon
USING (false);

CREATE POLICY "Deny anonymous delete on user_roles"
ON public.user_roles FOR DELETE TO anon
USING (false);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
