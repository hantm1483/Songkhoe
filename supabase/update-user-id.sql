-- ============================================
-- UPDATE ALL EXISTING DATA TO NEW USER_ID
-- Run this to migrate data from old user_id to new user_id
-- NEW USER_ID: ab406c69-dc3a-4b76-b998-1723205d036a
-- ============================================

-- Check current data before update
SELECT 'Before Update:' as status;
SELECT 'profiles' as table_name, COUNT(*) as count FROM public.profiles WHERE id = 'ab406c69-dc3a-4b76-b998-1723205d036a' OR user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a';
SELECT 'glucose_logs' as table_name, COUNT(*) as count FROM public.glucose_logs WHERE user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a';
SELECT 'meals' as table_name, COUNT(*) as count FROM public.meals WHERE user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a';
SELECT 'activity_schedules' as table_name, COUNT(*) as count FROM public.activity_schedules WHERE user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a';
SELECT 'lab_results' as table_name, COUNT(*) as count FROM public.lab_results WHERE user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a';
SELECT 'health_events' as table_name, COUNT(*) as count FROM public.health_events WHERE user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a';
SELECT 'medications' as table_name, COUNT(*) as count FROM public.medications WHERE user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a';
SELECT 'medication_logs' as table_name, COUNT(*) as count FROM public.medication_logs WHERE user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a';

-- ============================================
-- UPDATE PROFILES TABLE
-- Note: profiles.id must match auth.users.id for RLS to work
-- ============================================
UPDATE public.profiles
SET id = 'ab406c69-dc3a-4b76-b998-1723205d036a',
    user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a'
WHERE id = '4afe1e5f-0c34-4b67-a432-715fa818f07c'
   OR user_id = '4afe1e5f-0c34-4b67-a432-715fa818f07c';

-- ============================================
-- UPDATE GLUCOSE LOGS
-- ============================================
UPDATE public.glucose_logs
SET user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a'
WHERE user_id = '4afe1e5f-0c34-4b67-a432-715fa818f07c';

-- ============================================
-- UPDATE MEALS
-- ============================================
UPDATE public.meals
SET user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a'
WHERE user_id = '4afe1e5f-0c34-4b67-a432-715fa818f07c';

-- ============================================
-- UPDATE ACTIVITY SCHEDULES
-- ============================================
UPDATE public.activity_schedules
SET user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a'
WHERE user_id = '4afe1e5f-0c34-4b67-a432-715fa818f07c';

-- ============================================
-- UPDATE LAB RESULTS
-- ============================================
UPDATE public.lab_results
SET user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a'
WHERE user_id = '4afe1e5f-0c34-4b67-a432-715fa818f07c';

-- ============================================
-- UPDATE HEALTH EVENTS
-- ============================================
UPDATE public.health_events
SET user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a'
WHERE user_id = '4afe1e5f-0c34-4b67-a432-715fa818f07c';

-- ============================================
-- UPDATE MEDICATIONS
-- ============================================
UPDATE public.medications
SET user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a'
WHERE user_id = '4afe1e5f-0c34-4b67-a432-715fa818f07c';

-- ============================================
-- UPDATE MEDICATION LOGS
-- ============================================
UPDATE public.medication_logs
SET user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a'
WHERE user_id = '4afe1e5f-0c34-4b67-a432-715fa818f07c';

-- ============================================
-- UPDATE BODY METRICS
-- ============================================
UPDATE public.body_metrics
SET user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a'
WHERE user_id = '4afe1e5f-0c34-4b67-a432-715fa818f07c';

-- ============================================
-- UPDATE CONVERSATIONS & MESSAGES
-- ============================================
UPDATE public.conversations
SET user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a'
WHERE user_id = '4afe1e5f-0c34-4b67-a432-715fa818f07c';

-- ============================================
-- UPDATE MEMORIAL TABLES
-- ============================================
UPDATE public.memorial_photos
SET user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a'
WHERE user_id = '4afe1e5f-0c34-4b67-a432-715fa818f07c';

UPDATE public.memorial_quotes
SET user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a'
WHERE user_id = '4afe1e5f-0c34-4b67-a432-715fa818f07c';

UPDATE public.memorial_stories
SET user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a'
WHERE user_id = '4afe1e5f-0c34-4b67-a432-715fa818f07c';

-- ============================================
-- UPDATE NOTIFICATION SCHEDULES
-- ============================================
UPDATE public.notification_schedules
SET user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a'
WHERE user_id = '4afe1e5f-0c34-4b67-a432-715fa818f07c';

-- ============================================
-- Check after update
-- ============================================
SELECT 'After Update:' as status;
SELECT 'profiles' as table_name, COUNT(*) as count FROM public.profiles WHERE id = 'ab406c69-dc3a-4b76-b998-1723205d036a';
SELECT 'glucose_logs' as table_name, COUNT(*) as count FROM public.glucose_logs WHERE user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a';
SELECT 'meals' as table_name, COUNT(*) as count FROM public.meals WHERE user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a';
SELECT 'activity_schedules' as table_name, COUNT(*) as count FROM public.activity_schedules WHERE user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a';
SELECT 'lab_results' as table_name, COUNT(*) as count FROM public.lab_results WHERE user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a';
SELECT 'health_events' as table_name, COUNT(*) as count FROM public.health_events WHERE user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a';
SELECT 'medications' as table_name, COUNT(*) as count FROM public.medications WHERE user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a';
SELECT 'medication_logs' as table_name, COUNT(*) as count FROM public.medication_logs WHERE user_id = 'ab406c69-dc3a-4b76-b998-1723205d036a';

-- ============================================
-- SUMMARY
-- ============================================
SELECT 'Update completed! New user_id: ab406c69-dc3a-4b76-b998-1723205d036a' as status;