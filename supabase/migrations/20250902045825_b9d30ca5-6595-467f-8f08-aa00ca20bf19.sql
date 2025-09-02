-- Create policy to allow public read access to test table
CREATE POLICY "Allow public read access to test table" 
ON public.test 
FOR SELECT 
USING (true);