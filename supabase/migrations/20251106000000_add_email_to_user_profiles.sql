/*
  # Add email to user_profiles table

  This migration adds an email field to user_profiles to enable login with username.
  The email will be stored when a user registers, allowing them to log in with either
  their username or email address.
*/

-- Add email column to user_profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_profiles'
    AND column_name = 'email'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email text;
  END IF;
END $$;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Create index on name for faster username lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_name ON user_profiles(name);

