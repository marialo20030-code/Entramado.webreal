/*
  # Update Schema for Enhanced Features

  ## Changes
  
  ### 1. Add user_profiles table
  - Store user names and metadata
  - Links to auth.users via user_id
  
  ### 2. Update posts table
  - Add `is_private` field (boolean) - controls visibility
  - Add `published_at` field (timestamptz) - when post became public
  - Add `images` field (text array) - store multiple image URLs
  - Keep `image_url` as primary image for backward compatibility
  
  ### 3. Add extracted_colors table
  - Store dominant colors from each image
  - Used for dynamic background rendering
  
  ## Security
  - RLS policies updated for private posts
  - Users can only see their private posts
  - All authenticated users can see public posts
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles (public read, own write)
CREATE POLICY "Public profiles are viewable"
  ON user_profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create their own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Update posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'is_private'
  ) THEN
    ALTER TABLE posts ADD COLUMN is_private boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'published_at'
  ) THEN
    ALTER TABLE posts ADD COLUMN published_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'images'
  ) THEN
    ALTER TABLE posts ADD COLUMN images text[] DEFAULT ARRAY[]::text[];
  END IF;
END $$;

-- Create extracted_colors table
CREATE TABLE IF NOT EXISTS extracted_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  colors text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on extracted_colors
ALTER TABLE extracted_colors ENABLE ROW LEVEL SECURITY;

-- Anyone can view extracted colors (used for UI rendering)
CREATE POLICY "Public colors are viewable"
  ON extracted_colors FOR SELECT
  TO public
  USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_posts_is_private ON posts(is_private);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_extracted_colors_post_id ON extracted_colors(post_id);

-- Drop old policies for posts to replace them with new ones that consider privacy
DROP POLICY IF EXISTS "Anyone authenticated can view all posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

-- New posts policies with privacy support
CREATE POLICY "Public posts are viewable by anyone, private posts only by owner"
  ON posts FOR SELECT
  TO public
  USING (
    is_private = false 
    OR (
      auth.uid() = created_by AND is_private = true
    )
  );

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);