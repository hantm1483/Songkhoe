# Phase 1: Database Table + Type Definitions

## Overview
- **Status:** pending
- **Priority:** P2
- **Effort:** 1h
- Create `screening_catalog` table in Supabase and add TypeScript types

## Key Insights
- Table requires unique constraint on (user_id, content) to prevent duplicates
- Demo users have user_id prefixed with "demo-"
- Use gen_random_uuid() for UUID generation

## Requirements
### Functional
- Create table with columns: id, user_id, content, target, frequency, meaning, created_at, updated_at
- Add unique constraint: unique_user_content (user_id, content)
- RLS policies for user isolation

### Non-Functional
- Follow existing column naming conventions from lab_results table

## Architecture
```sql
-- SQL to run in Supabase SQL Editor
CREATE TABLE screening_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  content VARCHAR NOT NULL,
  target VARCHAR,
  frequency VARCHAR,
  meaning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint per user
CREATE UNIQUE INDEX unique_user_content ON screening_catalog (user_id, content);

-- RLS policies (copy from lab_results)
ALTER TABLE screening_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own catalog" ON screening_catalog FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own catalog" ON screening_catalog FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own catalog" ON screening_catalog FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own catalog" ON screening_catalog FOR DELETE USING (auth.uid() = user_id);
```

## Related Code Files
- `src/lib/supabase/database.types.ts` - add ScreeningCatalog type

## Implementation Steps
1. Create SQL script for Supabase (separate file for reference)
2. Add `ScreeningCatalog` interface to database.types.ts
3. Add `ScreeningCatalogInsert` and `ScreeningCatalogUpdate` helper types

## Success Criteria
- TypeScript compiles without errors
- Table SQL tested in Supabase SQL Editor

## Next Steps
- Phase 2: API routes depend on type definitions