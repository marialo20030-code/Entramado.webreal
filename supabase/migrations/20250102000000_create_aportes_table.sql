/*
  # Create Aportes (Comments) Table

  ## Overview
  This migration creates the aportes table for comments on posts.
  Each aporte is linked to a post and a user.

  ## New Table
  
  ### `aportes`
  Comments/contributions on posts
  - `id` (uuid, primary key)
  - `post_id` (uuid) - References posts table
  - `user_id` (uuid) - References auth.users
  - `content` (text) - The aporte/comment content
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  
  ### Row Level Security (RLS)
  - Enable RLS on aportes table
  - Authenticated users can view all aportes
  - Authenticated users can create aportes
  - Users can only update/delete their own aportes
  
  ## Indexes
  - Index on aportes.post_id for efficient queries
  - Index on aportes.user_id for user queries
  - Index on aportes.created_at for sorting
*/

-- Create aportes table
CREATE TABLE IF NOT EXISTS aportes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_aportes_post_id ON aportes(post_id);
CREATE INDEX IF NOT EXISTS idx_aportes_user_id ON aportes(user_id);
CREATE INDEX IF NOT EXISTS idx_aportes_created_at ON aportes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE aportes ENABLE ROW LEVEL SECURITY;

-- Aportes policies
CREATE POLICY "Anyone authenticated can view all aportes"
  ON aportes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create aportes"
  ON aportes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own aportes"
  ON aportes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own aportes"
  ON aportes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update folders RLS to make them private (users can only see their own folders)
DROP POLICY IF EXISTS "Anyone authenticated can view all folders" ON folders;
CREATE POLICY "Users can only view their own folders"
  ON folders FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);


