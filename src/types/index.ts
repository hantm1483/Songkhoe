// User types
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
}

// Glucose reading types
export interface GlucoseReading {
  id: string;
  user_id: string;
  value: number; // mmol/L
  measured_at: string;
  meal_context: "before_meal" | "after_meal" | "fasting" | "bedtime";
  note?: string;
  created_at: string;
}

// Medication types
export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  unit: string;
  frequency: string;
  time_slots: string[]; // ["morning", "afternoon", "evening"]
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationLog {
  id: string;
  medication_id: string;
  user_id: string;
  taken_at: string;
  skipped: boolean;
  note?: string;
}

// Meal types
export interface Meal {
  id: string;
  user_id: string;
  name: string;
  foods: FoodItem[];
  eaten_at: string;
  calories?: number;
  carbs?: number;
  note?: string;
}

export interface FoodItem {
  name: string;
  quantity: string;
  carbs: number;
  calories?: number;
}

// Test results
export interface TestResult {
  id: string;
  user_id: string;
  test_type: "hba1c" | "cholesterol" | "kidney" | "liver" | "other";
  value: number;
  unit: string;
  reference_min: number;
  reference_max: number;
  tested_at: string;
  note?: string;
  created_at: string;
}

// Knowledge article
export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  image_url?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

// Memory/candles
export interface Memory {
  id: string;
  user_id: string;
  title: string;
  message?: string;
  photo_url?: string;
  candle_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Navigation
export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
