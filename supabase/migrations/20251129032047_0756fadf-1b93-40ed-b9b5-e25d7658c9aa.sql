-- Remove the overly permissive anon policy (security issue)
DROP POLICY IF EXISTS "Allow role insertion during signup" ON public.user_roles;

-- Update the authenticated policy to allow deleting own roles too
CREATE POLICY "Users can delete their own roles during signup"
ON public.user_roles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);