export type Timing = "fasting" | "before_meal" | "after_meal" | "bedtime";
export type Frequency = "daily" | "twice_daily" | "weekly" | "as_needed";
export type GiLevel = "low" | "medium" | "high";
export type LabResultType = "hba1c" | "cholesterol" | "creatinine" | "other";
export type MedicationStatus = "taken" | "skipped" | "delayed";
export type MessageRole = "user" | "assistant";

export interface Profile {
  id: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at: string;
}

export interface GlucoseLog {
  id: string;
  user_id: string | null;
  value: number;
  unit: string;
  timing: Timing | null;
  notes: string | null;
  measured_at: string;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  id: string;
  user_id: string | null;
  name: string;
  dosage: string | null;
  instructions: string | null;
  schedule_time: string | null;
  frequency: Frequency | null;
  created_at: string;
  updated_at: string;
}

export interface MedicationLog {
  id: string;
  medication_id: string | null;
  user_id: string | null;
  taken_at: string;
  status: MedicationStatus | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Meal {
  id: string;
  user_id: string | null;
  name: string;
  gi_level: GiLevel | null;
  time: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LabResult {
  id: string;
  user_id: string | null;
  type: LabResultType | null;
  value: number;
  unit: string | null;
  recorded_at: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  category: string | null;
  content: string;
  image_url: string | null;
  created_at: string;
}

export interface MemorialPhoto {
  id: string;
  user_id: string | null;
  title: string | null;
  description: string | null;
  image_url: string;
  date: string | null;
  created_at: string;
}

export interface MemorialQuote {
  id: string;
  user_id: string | null;
  content: string;
  author: string | null;
  created_at: string;
}

export interface MemorialStory {
  id: string;
  user_id: string | null;
  title: string;
  content: string;
  date: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string | null;
  role: MessageRole | null;
  content: string;
  created_at: string;
}

export interface PushSubscription {
  id: string;
  user_id: string | null;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}

export interface NotificationSchedule {
  id: string;
  user_id: string | null;
  medication_id: string | null;
  scheduled_time: string;
  is_active: boolean;
  last_sent_at: string | null;
  created_at: string;
}

export interface RateLimit {
  id: string;
  user_id: string | null;
  action: string;
  count: number;
  window_start: string;
}

// =====================================================
// Helper types for inserts
// =====================================================

export type ProfileInsert = Omit<Profile, "created_at"> & { avatar_url?: string | null };
export type ProfileUpdate = Partial<Omit<Profile, "id">>;

export type GlucoseLogInsert = Omit<GlucoseLog, "id" | "created_at" | "updated_at">;
export type GlucoseLogUpdate = Partial<Omit<GlucoseLog, "id">>;

export type MedicationInsert = Omit<Medication, "id" | "created_at" | "updated_at">;
export type MedicationUpdate = Partial<Omit<Medication, "id">>;

export type MedicationLogInsert = Omit<MedicationLog, "id" | "created_at" | "updated_at">;
export type MedicationLogUpdate = Partial<Omit<MedicationLog, "id">>;

export type MealInsert = Omit<Meal, "id" | "created_at" | "updated_at">;
export type MealUpdate = Partial<Omit<Meal, "id">>;

export type LabResultInsert = Omit<LabResult, "id" | "created_at" | "updated_at">;
export type LabResultUpdate = Partial<Omit<LabResult, "id">>;

export type ArticleInsert = Omit<Article, "id" | "created_at">;
export type ArticleUpdate = Partial<Omit<Article, "id">>;

export type MemorialPhotoInsert = Omit<MemorialPhoto, "id" | "created_at">;
export type MemorialPhotoUpdate = Partial<Omit<MemorialPhoto, "id">>;

export type MemorialQuoteInsert = Omit<MemorialQuote, "id" | "created_at">;
export type MemorialQuoteUpdate = Partial<Omit<MemorialQuote, "id">>;

export type MemorialStoryInsert = Omit<MemorialStory, "id" | "created_at">;
export type MemorialStoryUpdate = Partial<Omit<MemorialStory, "id">>;

export type ConversationInsert = Omit<Conversation, "id" | "created_at">;
export type ConversationUpdate = Partial<Omit<Conversation, "id">>;

export type MessageInsert = Omit<Message, "id" | "created_at">;
export type MessageUpdate = Partial<Omit<Message, "id">>;

export type PushSubscriptionInsert = Omit<PushSubscription, "id" | "created_at">;
export type PushSubscriptionUpdate = Partial<Omit<PushSubscription, "id">>;

export type NotificationScheduleInsert = Omit<NotificationSchedule, "id" | "created_at" | "last_sent_at">;
export type NotificationScheduleUpdate = Partial<Omit<NotificationSchedule, "id">>;

export type RateLimitInsert = Omit<RateLimit, "id" | "window_start">;
export type RateLimitUpdate = Partial<Omit<RateLimit, "id">>;

// =====================================================
// Enums for type safety
// =====================================================

export const TIMING_VALUES = ["fasting", "before_meal", "after_meal", "bedtime"] as const;
export const FREQUENCY_VALUES = ["daily", "twice_daily", "weekly", "as_needed"] as const;
export const GI_LEVEL_VALUES = ["low", "medium", "high"] as const;
export const LAB_RESULT_TYPE_VALUES = ["hba1c", "cholesterol", "creatinine", "other"] as const;
export const MEDICATION_STATUS_VALUES = ["taken", "skipped", "delayed"] as const;
export const MESSAGE_ROLE_VALUES = ["user", "assistant"] as const;