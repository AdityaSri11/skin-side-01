-- Create table to store AI match results
CREATE TABLE public.ai_match_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_data jsonb NOT NULL,
  profile_snapshot jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.ai_match_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own match results"
ON public.ai_match_results
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own match results"
ON public.ai_match_results
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own match results"
ON public.ai_match_results
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own match results"
ON public.ai_match_results
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_ai_match_results_user_id ON public.ai_match_results(user_id);