-- Screening Catalog Table SQL
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS screening_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content VARCHAR NOT NULL,
  target VARCHAR,
  frequency VARCHAR,
  meaning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint per user (no duplicate content)
CREATE UNIQUE INDEX IF NOT EXISTS screening_catalog_user_content_idx
ON screening_catalog (user_id, content) WHERE user_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE screening_catalog ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own screening_catalog" ON screening_catalog;
DROP POLICY IF EXISTS "Users can insert own screening catalog" ON screening_catalog;
DROP POLICY IF EXISTS "Users can update own screening catalog" ON screening_catalog;
DROP POLICY IF EXISTS "Users can delete own screening catalog" ON screening_catalog;

CREATE POLICY "Users can view own screening_catalog" ON screening_catalog
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own screening catalog" ON screening_catalog
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own screening catalog" ON screening_catalog
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own screening catalog" ON screening_catalog
  FOR DELETE USING (auth.uid() = user_id);

-- Seed default catalog items for new users
-- This trigger inserts default screening items when a new user is created
-- (Optional - requires separate trigger function)