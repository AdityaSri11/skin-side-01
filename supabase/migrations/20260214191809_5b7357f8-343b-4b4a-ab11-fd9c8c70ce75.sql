
-- Make date_of_birth nullable so the trigger can create a minimal profile
-- (the health questionnaire will fill in the real value later)
ALTER TABLE public.user_profiles ALTER COLUMN date_of_birth DROP NOT NULL;

-- Make first_name, last_name, email_address have defaults for trigger compatibility
ALTER TABLE public.user_profiles ALTER COLUMN first_name SET DEFAULT '';
ALTER TABLE public.user_profiles ALTER COLUMN last_name SET DEFAULT '';
ALTER TABLE public.user_profiles ALTER COLUMN email_address SET DEFAULT '';

-- Drop the conflicting handle_new_auth_user trigger (it also tries to insert
-- into user_profiles but with even fewer fields, causing conflicts)
DROP TRIGGER IF EXISTS auth_user_created ON auth.users;

-- Update handle_new_user to work with the current schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.id IS NULL THEN
    RETURN NEW;
  END IF;

  BEGIN
    INSERT INTO public.user_profiles (
      id, user_id, first_name, last_name, email_address, created_at, updated_at
    ) VALUES (
      gen_random_uuid(),
      NEW.id,
      '',
      '',
      COALESCE(NEW.email, ''),
      NOW(),
      NOW()
    );
  EXCEPTION WHEN unique_violation THEN
    -- profile already exists, ignore
    NULL;
  WHEN OTHERS THEN
    RAISE LOG 'handle_new_user: error for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$function$;
