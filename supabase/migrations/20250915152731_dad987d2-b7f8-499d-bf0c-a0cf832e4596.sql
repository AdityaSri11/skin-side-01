-- Create user profiles table with comprehensive health information
CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Personal Information
  first_name text NOT NULL CHECK (length(first_name) <= 150),
  last_name text NOT NULL CHECK (length(last_name) <= 150),
  date_of_birth date NOT NULL,
  gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  address text CHECK (length(address) <= 150),
  phone_number text CHECK (length(phone_number) <= 150),
  email_address text NOT NULL CHECK (length(email_address) <= 150),
  
  -- Medical History
  previous_medical_conditions text CHECK (length(previous_medical_conditions) <= 150),
  existing_medical_conditions text CHECK (length(existing_medical_conditions) <= 150),
  previous_surgical_history text CHECK (length(previous_surgical_history) <= 150),
  allergies text CHECK (length(allergies) <= 150),
  immunization_status text CHECK (immunization_status IN ('up_to_date', 'partial', 'none', 'unknown')),
  
  -- Medications
  current_prescription_medications text CHECK (length(current_prescription_medications) <= 150),
  over_counter_medications text CHECK (length(over_counter_medications) <= 150),
  recent_medication_changes text CHECK (length(recent_medication_changes) <= 150),
  
  -- Primary Condition
  primary_condition text CHECK (length(primary_condition) <= 150),
  condition_stage_severity text CHECK (condition_stage_severity IN ('mild', 'moderate', 'severe', 'unknown')),
  date_of_diagnosis date,
  recent_test_results text CHECK (length(recent_test_results) <= 150),
  prior_clinical_trials text CHECK (prior_clinical_trials IN ('yes', 'no', 'unsure')),
  treatments_for_condition text CHECK (length(treatments_for_condition) <= 150),
  
  -- Lifestyle Factors
  smoke_history text CHECK (smoke_history IN ('never', 'former', 'current_light', 'current_moderate', 'current_heavy')),
  alcohol_intake text CHECK (alcohol_intake IN ('none', 'occasional', 'moderate', 'heavy')),
  pregnant_breastfeeding text CHECK (pregnant_breastfeeding IN ('pregnant', 'breastfeeding', 'neither', 'not_applicable')),
  other_substances text CHECK (length(other_substances) <= 150),
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Don't automatically create profile, let the user fill it out via the form
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup (placeholder for future use)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();