-- Run this ONCE in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Adds membership_plan and membership_expiry columns to the profiles table

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS membership_plan  TEXT CHECK (membership_plan IN ('Gold', 'Diamond', 'Platinum')),
  ADD COLUMN IF NOT EXISTS membership_expiry TIMESTAMPTZ;

-- Optional: verify the columns were added
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name IN ('membership_plan', 'membership_expiry', 'is_premium');
