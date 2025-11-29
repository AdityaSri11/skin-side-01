-- Allow users to insert their own role during signup
CREATE POLICY "Users can insert their own role during signup"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Also allow during the signup process when user is not yet authenticated
CREATE POLICY "Allow role insertion during signup"
ON public.user_roles
FOR INSERT
TO anon
WITH CHECK (true);