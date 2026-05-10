# Supabase Storage Setup

## Memorial Photos Bucket

1. Go to Supabase Dashboard → Storage
2. Create new bucket: `memorial-photos`
3. Set as public bucket
4. Add RLS policy for authenticated users to upload

## Edge Functions

1. Set ANTHROPIC_API_KEY in Supabase dashboard → Edge Functions → Secrets
2. Deploy functions:
   ```bash
   supabase functions deploy send-message
   supabase functions deploy send-notification
   ```