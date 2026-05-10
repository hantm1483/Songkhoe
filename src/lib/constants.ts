export const NAV_ITEMS = [
  { label: "Trang chủ", href: "/trangchu", icon: "Home" },
  { label: "Nhật ký", href: "/nhatky", icon: "BookHeart" },
  { label: "Trợ lý AI", href: "/troly-ai", icon: "Bot" },
  { label: "Thuốc", href: "/thuoc", icon: "Pill" },
  { label: "Bữa ăn", href: "/bua-an", icon: "Utensils" },
  { label: "Xét nghiệm", href: "/xet-nghiem", icon: "TestTube" },
  { label: "Kiến thức", href: "/kien-thuc", icon: "Lightbulb" },
  { label: "Hồ sơ", href: "/profile", icon: "User" },
] as const;

export const GLUCOSE_LABELS = {
  before_meal: "Trước bữa ăn",
  after_meal: "Sau bữa ăn",
  fasting: "Lúc đói",
  bedtime: "Trước khi ngủ",
} as const;

export const GLUCOSE_RANGES = {
  low: { min: 0, max: 3.9, color: "text-secondary" },
  normal: { min: 3.9, max: 7.8, color: "text-primary" },
  high: { min: 7.8, max: 10, color: "text-tertiary" },
  very_high: { min: 10, max: Infinity, color: "text-error" },
} as const;

export const MEAL_CONTEXT_OPTIONS = [
  { value: "fasting", label: "Lúc đói ( Fasting )" },
  { value: "before_meal", label: "Trước bữa ăn" },
  { value: "after_meal", label: "Sau bữa ăn" },
  { value: "bedtime", label: "Trước khi ngủ" },
] as const;

export const TIME_SLOTS = [
  { value: "morning", label: "Sáng" },
  { value: "afternoon", label: "Trưa" },
  { value: "evening", label: "Chiều" },
  { value: "night", label: "Tối" },
] as const;

export const TEST_TYPES = [
  { value: "hba1c", label: "HbA1c" },
  { value: "cholesterol", label: "Cholesterol" },
  { value: "kidney", label: "Chức năng thận" },
  { value: "liver", label: "Chức năng gan" },
  { value: "other", label: "Khác" },
] as const;
