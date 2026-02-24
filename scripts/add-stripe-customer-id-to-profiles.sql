-- Add stripe_customer_id column to profiles table if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id 
ON profiles(stripe_customer_id);

-- Add a comment to document the column
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe customer ID for subscription management';
