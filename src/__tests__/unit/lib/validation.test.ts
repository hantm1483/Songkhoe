import { describe, it, expect } from 'vitest'
import {
  validateGlucoseLogInput,
  validateMedicationInput,
  validateMealInput,
  validateLabResultInput,
  validateChatSendInput,
  TIMING_OPTIONS,
  GI_LEVEL_OPTIONS,
  FREQUENCY_OPTIONS,
} from '@/lib/validations'

describe('validateGlucoseLogInput', () => {
  it('validates valid glucose input', () => {
    const result = validateGlucoseLogInput({
      value: 6.5,
      timing: 'fasting',
    })
    expect(result.success).toBe(true)
    expect(result.data?.value).toBe(6.5)
    expect(result.data?.timing).toBe('fasting')
  })

  it('rejects missing value', () => {
    const result = validateGlucoseLogInput({ timing: 'fasting' })
    expect(result.success).toBe(false)
    expect(result.error).toBe('Giá trị đường huyết là bắt buộc')
  })

  it('rejects value below minimum', () => {
    const result = validateGlucoseLogInput({ value: 10 })
    expect(result.success).toBe(false)
    expect(result.error).toContain('không hợp lệ')
  })

  it('rejects value above maximum', () => {
    const result = validateGlucoseLogInput({ value: 650 })
    expect(result.success).toBe(false)
    expect(result.error).toContain('không hợp lệ')
  })

  it('accepts boundary values', () => {
    expect(validateGlucoseLogInput({ value: 20 }).success).toBe(true)
    expect(validateGlucoseLogInput({ value: 600 }).success).toBe(true)
  })

  it('rejects invalid timing', () => {
    const result = validateGlucoseLogInput({ value: 100, timing: 'invalid' })
    expect(result.success).toBe(false)
    expect(result.error).toBe('Thời điểm đo không hợp lệ')
  })

  it('accepts all valid timing options', () => {
    TIMING_OPTIONS.forEach((timing) => {
      const result = validateGlucoseLogInput({ value: 100, timing })
      expect(result.success).toBe(true)
    })
  })

  it('rejects non-object input', () => {
    expect(validateGlucoseLogInput(null).success).toBe(false)
    expect(validateGlucoseLogInput('string').success).toBe(false)
    expect(validateGlucoseLogInput([1]).success).toBe(false)
  })

  it('accepts optional notes', () => {
    const result = validateGlucoseLogInput({
      value: 7.0,
      notes: 'Sau khi tập thể dục',
    })
    expect(result.success).toBe(true)
    expect(result.data?.notes).toBe('Sau khi tập thể dục')
  })
})

describe('validateMedicationInput', () => {
  it('validates valid medication input', () => {
    const result = validateMedicationInput({
      name: 'Metformin 500mg',
      dosage: '1 viên',
      frequency: 'twice_daily',
    })
    expect(result.success).toBe(true)
    expect(result.data?.name).toBe('Metformin 500mg')
  })

  it('rejects missing name', () => {
    const result = validateMedicationInput({ dosage: '1 viên' })
    expect(result.success).toBe(false)
    expect(result.error).toBe('Tên thuốc là bắt buộc')
  })

  it('rejects empty name', () => {
    const result = validateMedicationInput({ name: '   ' })
    expect(result.success).toBe(false)
    expect(result.error).toBe('Tên thuốc là bắt buộc')
  })

  it('rejects name too long', () => {
    const result = validateMedicationInput({
      name: 'a'.repeat(201),
    })
    expect(result.success).toBe(false)
    expect(result.error).toContain('quá dài')
  })

  it('accepts all frequency options', () => {
    FREQUENCY_OPTIONS.forEach((freq) => {
      const result = validateMedicationInput({ name: 'Aspirin', frequency: freq })
      expect(result.success).toBe(true)
    })
  })

  it('rejects invalid frequency', () => {
    const result = validateMedicationInput({ name: 'Aspirin', frequency: 'invalid' })
    expect(result.success).toBe(false)
  })
})

describe('validateMealInput', () => {
  it('validates valid meal input', () => {
    const result = validateMealInput({
      name: 'Cơm gạo lứt',
      giLevel: 'low',
    })
    expect(result.success).toBe(true)
    expect(result.data?.name).toBe('Cơm gạo lứt')
  })

  it('rejects missing name', () => {
    const result = validateMealInput({ giLevel: 'low' })
    expect(result.success).toBe(false)
    expect(result.error).toBe('Tên bữa ăn là bắt buộc')
  })

  it('accepts all GI levels', () => {
    GI_LEVEL_OPTIONS.forEach((gi) => {
      const result = validateMealInput({ name: 'Test meal', giLevel: gi })
      expect(result.success).toBe(true)
    })
  })

  it('rejects invalid GI level', () => {
    const result = validateMealInput({ name: 'Test', giLevel: 'invalid' })
    expect(result.success).toBe(false)
  })
})

describe('validateLabResultInput', () => {
  it('validates valid lab result', () => {
    const result = validateLabResultInput({
      type: 'hba1c',
      value: 6.5,
      unit: '%',
    })
    expect(result.success).toBe(true)
    expect(result.data?.type).toBe('hba1c')
  })

  it('rejects missing type', () => {
    const result = validateLabResultInput({ value: 100 })
    expect(result.success).toBe(false)
    expect(result.error).toBe('Loại xét nghiệm không hợp lệ')
  })

  it('rejects missing value', () => {
    const result = validateLabResultInput({ type: 'hba1c' })
    expect(result.success).toBe(false)
    expect(result.error).toBe('Giá trị là bắt buộc')
  })

  it('rejects negative value', () => {
    const result = validateLabResultInput({ type: 'hba1c', value: -1 })
    expect(result.success).toBe(false)
  })
})

describe('validateChatSendInput', () => {
  it('validates valid chat input', () => {
    const result = validateChatSendInput({
      conversation_id: 'conv-123',
      message: 'Tôi cần tư vấn',
    })
    expect(result.success).toBe(true)
    expect(result.data?.message).toBe('Tôi cần tư vấn')
  })

  it('rejects missing conversation_id', () => {
    const result = validateChatSendInput({ message: 'Hello' })
    expect(result.success).toBe(false)
    expect(result.error).toBe('conversation_id là bắt buộc')
  })

  it('rejects empty message', () => {
    const result = validateChatSendInput({
      conversation_id: 'conv-123',
      message: '   ',
    })
    expect(result.success).toBe(false)
  })

  it('rejects message too long', () => {
    const result = validateChatSendInput({
      conversation_id: 'conv-123',
      message: 'a'.repeat(5001),
    })
    expect(result.success).toBe(false)
    expect(result.error).toContain('quá dài')
  })

  it('accepts idempotency key', () => {
    const result = validateChatSendInput({
      conversation_id: 'conv-123',
      message: 'Test',
      idempotency_key: 'key-123',
    })
    expect(result.success).toBe(true)
    expect(result.data?.idempotency_key).toBe('key-123')
  })
})