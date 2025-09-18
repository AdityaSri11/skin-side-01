-- Ensure the recent_test_results column stores file references (not binary data)
-- Check if we need to update the column type to ensure it's for file references
-- Also create proper RLS policies for the storage bucket

-- Create RLS policies for the derm_test_results storage bucket
CREATE POLICY "Users can view their own test results" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'derm_test_results' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own test results" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'derm_test_results' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own test results" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'derm_test_results' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own test results" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'derm_test_results' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add a comment to clarify that recent_test_results stores file references
COMMENT ON COLUMN user_profiles.recent_test_results IS 'Stores filename reference to PDF file in derm_test_results storage bucket';