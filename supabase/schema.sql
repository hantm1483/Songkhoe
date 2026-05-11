-- ============================================
-- Sổ Tay Tiểu Đường - Database Schema
-- Run this in Supabase SQL Editor FIRST
-- https://app.supabase.com/project/{project}/sql
-- ============================================

-- ============================================
-- PROFILES
-- Note: id is a primary key, not FK to auth.users for flexibility
-- Use auth.users id when linking authentication
-- ============================================
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  user_id UUID, -- Optional link to auth.users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- GLUCOSE LOGS
-- ============================================
DROP TABLE IF EXISTS public.glucose_logs CASCADE;
CREATE TABLE IF NOT EXISTS public.glucose_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Removed FK for demo flexibility
  value DECIMAL(4,1) NOT NULL CHECK (value > 0 AND value < 50),
  unit TEXT DEFAULT 'mmol/L',
  timing TEXT CHECK (timing IN ('fasting', 'before_meal', 'after_meal', 'bedtime')),
  notes TEXT,
  measured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MEDICATIONS
-- ============================================
DROP TABLE IF EXISTS public.medications CASCADE;
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Removed FK for demo flexibility
  name TEXT NOT NULL,
  dosage TEXT,
  instructions TEXT,
  schedule_time TEXT,
  frequency TEXT CHECK (frequency IN ('daily', 'twice_daily', 'weekly', 'as_needed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MEDICATION LOGS
-- ============================================
DROP TABLE IF EXISTS public.medication_logs CASCADE;
CREATE TABLE IF NOT EXISTS public.medication_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE,
  user_id UUID, -- Removed FK for demo flexibility
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT CHECK (status IN ('taken', 'skipped', 'delayed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MEALS
-- ============================================
DROP TABLE IF EXISTS public.meals CASCADE;
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Removed FK for demo flexibility
  name TEXT NOT NULL,
  gi_level TEXT CHECK (gi_level IN ('low', 'medium', 'high')),
  time TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- LAB RESULTS
-- ============================================
DROP TABLE IF EXISTS public.lab_results CASCADE;
CREATE TABLE IF NOT EXISTS public.lab_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Removed FK for demo flexibility
  type TEXT CHECK (type IN ('hba1c', 'cholesterol', 'creatinine', 'other')),
  value DECIMAL(6,2) NOT NULL,
  unit TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ARTICLES
-- ============================================
DROP TABLE IF EXISTS public.articles CASCADE;
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MEMORIAL PHOTOS
-- ============================================
DROP TABLE IF EXISTS public.memorial_photos CASCADE;
CREATE TABLE IF NOT EXISTS public.memorial_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Removed FK to auth.users for demo flexibility
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MEMORIAL QUOTES
-- ============================================
DROP TABLE IF EXISTS public.memorial_quotes CASCADE;
CREATE TABLE IF NOT EXISTS public.memorial_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Removed FK to auth.users for demo flexibility
  content TEXT NOT NULL,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MEMORIAL STORIES
-- ============================================
DROP TABLE IF EXISTS public.memorial_stories CASCADE;
CREATE TABLE IF NOT EXISTS public.memorial_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Removed FK to auth.users for demo flexibility
  title TEXT NOT NULL,
  content TEXT,
  date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CONVERSATIONS
-- ============================================
DROP TABLE IF EXISTS public.conversations CASCADE;
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Removed FK for demo flexibility
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MESSAGES
-- ============================================
DROP TABLE IF EXISTS public.messages CASCADE;
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PUSH SUBSCRIPTIONS
-- ============================================
DROP TABLE IF EXISTS public.push_subscriptions CASCADE;
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Removed FK for demo flexibility
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NOTIFICATION SCHEDULES
-- ============================================
DROP TABLE IF EXISTS public.notification_schedules CASCADE;
CREATE TABLE IF NOT EXISTS public.notification_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Removed FK for demo flexibility
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- RATE LIMITS
-- ============================================
DROP TABLE IF EXISTS public.rate_limits CASCADE;
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Removed FK for demo flexibility
  action TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glucose_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorial_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorial_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorial_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Glucose Logs: Users can only access their own logs
CREATE POLICY "Users can view own glucose logs" ON public.glucose_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own glucose logs" ON public.glucose_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own glucose logs" ON public.glucose_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own glucose logs" ON public.glucose_logs FOR DELETE USING (auth.uid() = user_id);

-- Medications: Users can only access their own medications
CREATE POLICY "Users can view own medications" ON public.medications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own medications" ON public.medications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own medications" ON public.medications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own medications" ON public.medications FOR DELETE USING (auth.uid() = user_id);

-- Medication Logs
CREATE POLICY "Users can view own medication logs" ON public.medication_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own medication logs" ON public.medication_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Meals: Users can only access their own meals
CREATE POLICY "Users can view own meals" ON public.meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meals" ON public.meals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meals" ON public.meals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meals" ON public.meals FOR DELETE USING (auth.uid() = user_id);

-- Lab Results: Users can only access their own results
CREATE POLICY "Users can view own lab results" ON public.lab_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lab results" ON public.lab_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lab results" ON public.lab_results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own lab results" ON public.lab_results FOR DELETE USING (auth.uid() = user_id);

-- Memorial Photos
CREATE POLICY "Users can view own memorial photos" ON public.memorial_photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own memorial photos" ON public.memorial_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memorial photos" ON public.memorial_photos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own memorial photos" ON public.memorial_photos FOR DELETE USING (auth.uid() = user_id);

-- Memorial Quotes
CREATE POLICY "Users can view own memorial quotes" ON public.memorial_quotes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own memorial quotes" ON public.memorial_quotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memorial quotes" ON public.memorial_quotes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own memorial quotes" ON public.memorial_quotes FOR DELETE USING (auth.uid() = user_id);

-- Memorial Stories
CREATE POLICY "Users can view own memorial stories" ON public.memorial_stories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own memorial stories" ON public.memorial_stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memorial stories" ON public.memorial_stories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own memorial stories" ON public.memorial_stories FOR DELETE USING (auth.uid() = user_id);

-- Conversations: Users can only access their own conversations
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.conversations FOR DELETE USING (auth.uid() = user_id);

-- Messages: Users can only access messages in their own conversations
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own messages" ON public.messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND user_id = auth.uid())
);

-- Push Subscriptions
CREATE POLICY "Users can view own push subscriptions" ON public.push_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own push subscriptions" ON public.push_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own push subscriptions" ON public.push_subscriptions FOR DELETE USING (auth.uid() = user_id);

-- Notification Schedules
CREATE POLICY "Users can view own notification schedules" ON public.notification_schedules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notification schedules" ON public.notification_schedules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notification schedules" ON public.notification_schedules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notification schedules" ON public.notification_schedules FOR DELETE USING (auth.uid() = user_id);

-- Rate Limits
CREATE POLICY "Users can view own rate limits" ON public.rate_limits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rate limits" ON public.rate_limits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rate limits" ON public.rate_limits FOR UPDATE USING (auth.uid() = user_id);

-- Articles: Public read for all users
CREATE POLICY "Anyone can view articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Anyone can insert articles" ON public.articles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Anyone can update articles" ON public.articles FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Anyone can delete articles" ON public.articles FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_glucose_logs_user_id ON public.glucose_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_glucose_logs_measured_at ON public.glucose_logs(measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_medications_user_id ON public.medications(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON public.meals(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_user_id ON public.lab_results(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_type ON public.lab_results(type);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
SELECT 'Schema created successfully! Tables: profiles, glucose_logs, medications, medication_logs, meals, lab_results, articles, memorial_photos, memorial_quotes, memorial_stories, conversations, messages, push_subscriptions, notification_schedules, rate_limits' as status;
