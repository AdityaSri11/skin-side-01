
-- Drop the restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
