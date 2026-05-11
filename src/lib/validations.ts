/**
 * Input validation schemas for API requests
 * Uses simple validation with Vietnamese error messages
 */

import type {
  Timing,
  Frequency,
  GiLevel,
  LabResultType,
  MessageRole,
} from "./supabase/database.types";

// =====================================================
// Glucose Validation
// =====================================================

export const TIMING_OPTIONS: Timing[] = ["fasting", "before_meal", "after_meal", "bedtime"];

export interface GlucoseLogInput {
  value: number;
  timing?: Timing;
  notes?: string;
  measuredAt?: string;
}

export function validateGlucoseLogInput(data: unknown): {
  success: boolean;
  data?: GlucoseLogInput;
  error?: string;
} {
  if (typeof data !== "object" || data === null) {
    return { success: false, error: "Dữ liệu không hợp lệ" };
  }

  const input = data as Record<string, unknown>;

  if (typeof input.value !== "number") {
    return { success: false, error: "Giá trị đường huyết là bắt buộc" };
  }

  if (input.value < 2 || input.value > 35) {
    return { success: false, error: "Giá trị đường huyết không hợp lệ (2-35 mmol/L)" };
  }

  if (input.timing !== undefined && input.timing !== null) {
    if (!TIMING_OPTIONS.includes(input.timing as Timing)) {
      return { success: false, error: "Thời điểm đo không hợp lệ" };
    }
  }

  if (input.notes !== undefined && typeof input.notes !== "string") {
    return { success: false, error: "Ghi chú phải là chuỗi văn bản" };
  }

  if (input.measuredAt !== undefined && typeof input.measuredAt !== "string") {
    return { success: false, error: "Ngày đo không hợp lệ" };
  }

  return {
    success: true,
    data: {
      value: input.value,
      timing: input.timing as Timing | undefined,
      notes: input.notes as string | undefined,
      measuredAt: input.measuredAt as string | undefined,
    },
  };
}

// =====================================================
// Medication Validation
// =====================================================

export const FREQUENCY_OPTIONS: Frequency[] = ["daily", "twice_daily", "weekly", "as_needed"];

export interface MedicationInput {
  name: string;
  dosage?: string;
  instructions?: string;
  scheduleTime?: string;
  frequency?: Frequency;
}

export function validateMedicationInput(data: unknown): {
  success: boolean;
  data?: MedicationInput;
  error?: string;
} {
  if (typeof data !== "object" || data === null) {
    return { success: false, error: "Dữ liệu không hợp lệ" };
  }

  const input = data as Record<string, unknown>;

  if (typeof input.name !== "string" || input.name.trim() === "") {
    return { success: false, error: "Tên thuốc là bắt buộc" };
  }

  if (input.name.length > 200) {
    return { success: false, error: "Tên thuốc quá dài (tối đa 200 ký tự)" };
  }

  if (input.dosage !== undefined && typeof input.dosage !== "string") {
    return { success: false, error: "Liều lượng phải là chuỗi văn bản" };
  }

  if (input.instructions !== undefined && typeof input.instructions !== "string") {
    return { success: false, error: "Hướng dẫn sử dụng phải là chuỗi văn bản" };
  }

  if (input.scheduleTime !== undefined && typeof input.scheduleTime !== "string") {
    return { success: false, error: "Giờ uống thuốc không hợp lệ" };
  }

  if (input.frequency !== undefined && input.frequency !== null) {
    if (!FREQUENCY_OPTIONS.includes(input.frequency as Frequency)) {
      return { success: false, error: "Tần suất không hợp lệ" };
    }
  }

  return {
    success: true,
    data: {
      name: input.name as string,
      dosage: input.dosage as string | undefined,
      instructions: input.instructions as string | undefined,
      scheduleTime: input.scheduleTime as string | undefined,
      frequency: input.frequency as Frequency | undefined,
    },
  };
}

// =====================================================
// Meal Validation
// =====================================================

export const GI_LEVEL_OPTIONS: GiLevel[] = ["low", "medium", "high"];

export interface MealInput {
  name: string;
  giLevel?: GiLevel;
  notes?: string;
  time?: string;
}

export function validateMealInput(data: unknown): {
  success: boolean;
  data?: MealInput;
  error?: string;
} {
  if (typeof data !== "object" || data === null) {
    return { success: false, error: "Dữ liệu không hợp lệ" };
  }

  const input = data as Record<string, unknown>;

  if (typeof input.name !== "string" || input.name.trim() === "") {
    return { success: false, error: "Tên bữa ăn là bắt buộc" };
  }

  if (input.name.length > 200) {
    return { success: false, error: "Tên bữa ăn quá dài (tối đa 200 ký tự)" };
  }

  if (input.giLevel !== undefined && input.giLevel !== null) {
    if (!GI_LEVEL_OPTIONS.includes(input.giLevel as GiLevel)) {
      return { success: false, error: "Chỉ số GI không hợp lệ" };
    }
  }

  if (input.notes !== undefined && typeof input.notes !== "string") {
    return { success: false, error: "Ghi chú phải là chuỗi văn bản" };
  }

  if (input.time !== undefined && typeof input.time !== "string") {
    return { success: false, error: "Thời gian không hợp lệ" };
  }

  return {
    success: true,
    data: {
      name: input.name as string,
      giLevel: input.giLevel as GiLevel | undefined,
      notes: input.notes as string | undefined,
      time: input.time as string | undefined,
    },
  };
}

// =====================================================
// Lab Result Validation
// =====================================================

export const LAB_RESULT_TYPE_OPTIONS: LabResultType[] = ["hba1c", "cholesterol", "creatinine", "other"];

export interface LabResultInput {
  type: LabResultType;
  value: number;
  unit?: string;
  recordedAt?: string;
  notes?: string;
}

export function validateLabResultInput(data: unknown): {
  success: boolean;
  data?: LabResultInput;
  error?: string;
} {
  if (typeof data !== "object" || data === null) {
    return { success: false, error: "Dữ liệu không hợp lệ" };
  }

  const input = data as Record<string, unknown>;

  if (!LAB_RESULT_TYPE_OPTIONS.includes(input.type as LabResultType)) {
    return { success: false, error: "Loại xét nghiệm không hợp lệ" };
  }

  if (typeof input.value !== "number") {
    return { success: false, error: "Giá trị là bắt buộc" };
  }

  if (input.value < 0 || input.value > 10000) {
    return { success: false, error: "Giá trị xét nghiệm không hợp lệ" };
  }

  if (input.unit !== undefined && typeof input.unit !== "string") {
    return { success: false, error: "Đơn vị phải là chuỗi văn bản" };
  }

  if (input.recordedAt !== undefined && typeof input.recordedAt !== "string") {
    return { success: false, error: "Ngày xét nghiệm không hợp lệ" };
  }

  if (input.notes !== undefined && typeof input.notes !== "string") {
    return { success: false, error: "Ghi chú phải là chuỗi văn bản" };
  }

  return {
    success: true,
    data: {
      type: input.type as LabResultType,
      value: input.value,
      unit: input.unit as string | undefined,
      recordedAt: input.recordedAt as string | undefined,
      notes: input.notes as string | undefined,
    },
  };
}

// =====================================================
// Message Validation
// =====================================================

export const MESSAGE_ROLE_OPTIONS: MessageRole[] = ["user", "assistant"];

export interface MessageInput {
  content: string;
  role: MessageRole;
}

export function validateMessageInput(data: unknown): {
  success: boolean;
  data?: MessageInput;
  error?: string;
} {
  if (typeof data !== "object" || data === null) {
    return { success: false, error: "Dữ liệu không hợp lệ" };
  }

  const input = data as Record<string, unknown>;

  if (typeof input.content !== "string" || input.content.trim() === "") {
    return { success: false, error: "Nội dung tin nhắn là bắt buộc" };
  }

  if (input.content.length > 10000) {
    return { success: false, error: "Nội dung tin nhắn quá dài (tối đa 10000 ký tự)" };
  }

  if (!MESSAGE_ROLE_OPTIONS.includes(input.role as MessageRole)) {
    return { success: false, error: "Vai trò không hợp lệ" };
  }

  return {
    success: true,
    data: {
      content: input.content as string,
      role: input.role as MessageRole,
    },
  };
}

// =====================================================
// Memorial Photo Validation
// =====================================================

export interface MemorialPhotoInput {
  title?: string;
  description?: string;
  imageUrl: string;
  date?: string;
}

export function validateMemorialPhotoInput(data: unknown): {
  success: boolean;
  data?: MemorialPhotoInput;
  error?: string;
} {
  if (typeof data !== "object" || data === null) {
    return { success: false, error: "Dữ liệu không hợp lệ" };
  }

  const input = data as Record<string, unknown>;

  if (typeof input.imageUrl !== "string" || input.imageUrl.trim() === "") {
    return { success: false, error: "URL hình ảnh là bắt buộc" };
  }

  if (input.title !== undefined && typeof input.title !== "string") {
    return { success: false, error: "Tiêu đề phải là chuỗi văn bản" };
  }

  if (input.description !== undefined && typeof input.description !== "string") {
    return { success: false, error: "Mô tả phải là chuỗi văn bản" };
  }

  if (input.date !== undefined && typeof input.date !== "string") {
    return { success: false, error: "Ngày không hợp lệ" };
  }

  return {
    success: true,
    data: {
      title: input.title as string | undefined,
      description: input.description as string | undefined,
      imageUrl: input.imageUrl as string,
      date: input.date as string | undefined,
    },
  };
}

// =====================================================
// Memorial Quote Validation
// =====================================================

export interface MemorialQuoteInput {
  content: string;
  author?: string;
}

export function validateMemorialQuoteInput(data: unknown): {
  success: boolean;
  data?: MemorialQuoteInput;
  error?: string;
} {
  if (typeof data !== "object" || data === null) {
    return { success: false, error: "Dữ liệu không hợp lệ" };
  }

  const input = data as Record<string, unknown>;

  if (typeof input.content !== "string" || input.content.trim() === "") {
    return { success: false, error: "Nội dung trích dẫn là bắt buộc" };
  }

  if (input.content.length > 2000) {
    return { success: false, error: "Nội dung quá dài (tối đa 2000 ký tự)" };
  }

  if (input.author !== undefined && typeof input.author !== "string") {
    return { success: false, error: "Tác giả phải là chuỗi văn bản" };
  }

  return {
    success: true,
    data: {
      content: input.content as string,
      author: input.author as string | undefined,
    },
  };
}

// =====================================================
// Memorial Story Validation
// =====================================================

export interface MemorialStoryInput {
  title: string;
  content: string;
  date?: string;
}

export function validateMemorialStoryInput(data: unknown): {
  success: boolean;
  data?: MemorialStoryInput;
  error?: string;
} {
  if (typeof data !== "object" || data === null) {
    return { success: false, error: "Dữ liệu không hợp lệ" };
  }

  const input = data as Record<string, unknown>;

  if (typeof input.title !== "string" || input.title.trim() === "") {
    return { success: false, error: "Tiêu đề câu chuyện là bắt buộc" };
  }

  if (input.title.length > 500) {
    return { success: false, error: "Tiêu đề quá dài (tối đa 500 ký tự)" };
  }

  if (typeof input.content !== "string" || input.content.trim() === "") {
    return { success: false, error: "Nội dung câu chuyện là bắt buộc" };
  }

  if (input.content.length > 50000) {
    return { success: false, error: "Nội dung quá dài (tối đa 50000 ký tự)" };
  }

  if (input.date !== undefined && typeof input.date !== "string") {
    return { success: false, error: "Ngày không hợp lệ" };
  }

  return {
    success: true,
    data: {
      title: input.title as string,
      content: input.content as string,
      date: input.date as string | undefined,
    },
  };
}

// =====================================================
// Conversation Validation
// =====================================================

export interface ConversationInput {
  title?: string;
}

export function validateConversationInput(data: unknown): {
  success: boolean;
  data?: ConversationInput;
  error?: string;
} {
  if (typeof data !== "object" || data === null) {
    return { success: false, error: "Dữ liệu không hợp lệ" };
  }

  const input = data as Record<string, unknown>;

  if (input.title !== undefined && typeof input.title !== "string") {
    return { success: false, error: "Tiêu đề phải là chuỗi văn bản" };
  }

  return {
    success: true,
    data: {
      title: input.title as string | undefined,
    },
  };
}

// =====================================================
// Medication Log Validation
// =====================================================

export interface MedicationLogInput {
  status: "taken" | "skipped" | "delayed";
  notes?: string;
}

export function validateMedicationLogInput(data: unknown): {
  success: boolean;
  data?: MedicationLogInput;
  error?: string;
} {
  if (typeof data !== "object" || data === null) {
    return { success: false, error: "Dữ liệu không hợp lệ" };
  }

  const input = data as Record<string, unknown>;

  const validStatuses = ["taken", "skipped", "delayed"];
  if (!validStatuses.includes(input.status as string)) {
    return { success: false, error: "Trạng thái không hợp lệ" };
  }

  if (input.notes !== undefined && typeof input.notes !== "string") {
    return { success: false, error: "Ghi chú phải là chuỗi văn bản" };
  }

  return {
    success: true,
    data: {
      status: input.status as "taken" | "skipped" | "delayed",
      notes: input.notes as string | undefined,
    },
  };
}

// =====================================================
// Chat Input Validation
// =====================================================

export interface ChatSendInput {
  conversation_id: string;
  message: string;
  idempotency_key?: string;
}

export function validateChatSendInput(data: unknown): {
  success: boolean;
  data?: ChatSendInput;
  error?: string;
} {
  if (typeof data !== "object" || data === null) {
    return { success: false, error: "Dữ liệu không hợp lệ" };
  }

  const input = data as Record<string, unknown>;

  if (typeof input.conversation_id !== "string" || input.conversation_id.trim() === "") {
    return { success: false, error: "conversation_id là bắt buộc" };
  }

  if (typeof input.message !== "string" || input.message.trim() === "") {
    return { success: false, error: "message là bắt buộc" };
  }

  if (input.message.length > 5000) {
    return { success: false, error: "Tin nhắn quá dài (tối đa 5000 ký tự)" };
  }

  return {
    success: true,
    data: {
      conversation_id: input.conversation_id as string,
      message: input.message as string,
      idempotency_key: input.idempotency_key as string | undefined,
    },
  };
}