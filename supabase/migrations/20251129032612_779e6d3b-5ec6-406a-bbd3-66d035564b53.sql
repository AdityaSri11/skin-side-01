-- Update the trigger function to check for role metadata
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if the user metadata contains a role preference
  IF NEW.raw_user_meta_data->>'role' = 'doctor' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'doctor');
  ELSE
    -- Default to patient role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'patient');
  END IF;
  RETURN NEW;
END;
$$;