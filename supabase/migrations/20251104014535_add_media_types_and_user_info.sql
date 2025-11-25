/*
  # Add Media Types and User Information

  ## Changes
  
  ### Update posts table
  - Add `media_type` field ('image' | 'spotify' | 'youtube')
  - Add `media_url` field for streaming links
  - Add `thumbnail_url` field for custom thumbnails
  - Add `aspect_ratio` field to preserve original image proportions
  
  ## Indexes
  - Index on media_type for filtering
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'media_type'
  ) THEN
    ALTER TABLE posts ADD COLUMN media_type text DEFAULT 'image';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'media_url'
  ) THEN
    ALTER TABLE posts ADD COLUMN media_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'thumbnail_url'
  ) THEN
    ALTER TABLE posts ADD COLUMN thumbnail_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'aspect_ratio'
  ) THEN
    ALTER TABLE posts ADD COLUMN aspect_ratio numeric DEFAULT 1.0;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_posts_media_type ON posts(media_type);