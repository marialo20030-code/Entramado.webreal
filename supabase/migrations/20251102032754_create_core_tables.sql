/*
  # Create Core Tables for Collaborative Content Platform

  ## Overview
  This migration creates the foundation for a collaborative content sharing platform
  where multiple users can upload ideas, images, and text in a Pinterest-style feed.

  ## New Tables
  
  ### `folders`
  Organizational categories for posts (e.g., música, escritura)
  - `id` (uuid, primary key)
  - `name` (text) - Folder name
  - `color` (text) - Visual identifier color
  - `created_at` (timestamptz)
  - `created_by` (uuid) - References auth.users

  ### `posts`
  Main content entries with images, text, and ideas
  - `id` (uuid, primary key)
  - `title` (text) - Post title
  - `description` (text) - Post content/idea
  - `image_url` (text) - Stored image URL
  - `folder_id` (uuid) - References folders table
  - `created_at` (timestamptz) - For calendar organization
  - `created_by` (uuid) - References auth.users
  - `updated_at` (timestamptz)

  ## Security
  
  ### Row Level Security (RLS)
  - Enable RLS on all tables
  - Authenticated users can read all content (collaborative viewing)
  - Authenticated users can create new posts and folders
  - Users can only update/delete their own posts and folders
  
  ## Indexes
  - Index on posts.created_at for efficient calendar queries
  - Index on posts.folder_id for category filtering
*/

-- Create folders table
CREATE TABLE IF NOT EXISTS folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text DEFAULT '#94a3b8',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  folder_id uuid REFERENCES folders(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_folder_id ON posts(folder_id);
CREATE INDEX IF NOT EXISTS idx_folders_created_by ON folders(created_by);

-- Enable Row Level Security
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Folders policies
CREATE POLICY "Anyone authenticated can view all folders"
  ON folders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create folders"
  ON folders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own folders"
  ON folders FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own folders"
  ON folders FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Posts policies
CREATE POLICY "Anyone authenticated can view all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

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