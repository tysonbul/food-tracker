import { MealType } from '../types'

export interface MealTypeMeta {
  value: MealType
  label: string
  emoji: string
}

export const MEAL_TYPE_ORDER: (MealType | 'none')[] = [
  'breakfast',
  'lunch',
  'dinner',
  'snack',
  'none',
]

export const MEAL_TYPE_META: Record<MealType | 'none', { emoji: string; label: string }> = {
  breakfast: { emoji: '🌅', label: 'Breakfast' },
  lunch: { emoji: '☀️', label: 'Lunch' },
  dinner: { emoji: '🌙', label: 'Dinner' },
  snack: { emoji: '🍿', label: 'Snack' },
  none: { emoji: '🍽', label: 'Other' },
}

/** Just the selectable meal types (without 'none') */
export const MEAL_TYPES: MealTypeMeta[] = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  { value: 'snack', label: 'Snack', emoji: '🍿' },
]
