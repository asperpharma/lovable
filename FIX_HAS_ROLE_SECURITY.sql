-- Fix has_role: make it SECURITY DEFINER and revoke EXECUTE from anon
-- Non-destructive: CREATE OR REPLACE updates the function, REVOKE removes privileges only.

-- 1) Recreate has_role as SECURITY DEFINER (matches our setup script)
-- Note: This will work even if the current function uses p_user_id/p_role parameters
-- because CREATE OR REPLACE matches by name + argument types, not parameter names.
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

-- 2) Revoke EXECUTE from PUBLIC first (if granted), then from anon explicitly
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;

-- 3) Ensure authenticated and service_role retain EXECUTE (needed for RLS)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
