-- Script para ejecutar manualmente en Supabase SQL Editor
-- Copia y pega este código en el SQL Editor de Supabase

-- Add is_draft column to posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'is_draft'
  ) THEN
    ALTER TABLE posts ADD COLUMN is_draft boolean DEFAULT false;
  END IF;
END $$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_posts_is_draft ON posts(is_draft);

-- Update RLS policy to handle drafts
DROP POLICY IF EXISTS "Public posts are viewable by anyone, private posts only by owner" ON posts;

CREATE POLICY "Public posts are viewable by anyone, private posts only by owner, drafts only by creator"
  ON posts FOR SELECT
  TO public
  USING (
    -- Drafts: only visible to creator
    (is_draft = true AND auth.uid() = created_by)
    OR
    -- Published posts: visible based on privacy settings
    (is_draft = false AND (
      is_private = false 
      OR (auth.uid() = created_by AND is_private = true)
    ))
  );

