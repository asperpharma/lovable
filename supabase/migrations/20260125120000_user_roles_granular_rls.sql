-- Granular RLS policies for user_roles
-- Replace "Admins can manage all roles" (FOR ALL) with separate SELECT/INSERT/UPDATE/DELETE policies.
-- Prevents admins from creating, updating to, or deleting admin roles.

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Admins can view all roles ("Users can view their own roles" already exists from prior migration)
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert roles (only non-admin)
CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role)
  AND (role <> 'admin'::app_role)
);

-- Admins can update roles (cannot set role to admin)
CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role)
  AND (role <> 'admin'::app_role)
);

-- Admins can delete non-admin roles only
CREATE POLICY "Admins can delete non-admin roles"
ON public.user_roles FOR DELETE TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  AND (role <> 'admin'::app_role)
);
