-- Create policy to allow public read access to derm table
CREATE POLICY "Allow public read access to derm table" 
ON public.derm 
FOR SELECT 
USING (true);