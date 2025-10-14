-- Add travel_distance column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN travel_distance text;