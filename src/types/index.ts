/** Food categories that count towards the 30-plant goal */
export type PlantCategory =
  | 'fruit'
  | 'vegetable'
  | 'grain'
  | 'legume'
  | 'nut'
  | 'seed'
  | 'herb_spice'
  | 'other_plant'

/** All categories including non-counting ones */
export type FoodCategory = PlantCategory | 'fermented'

/** Point value for a food item — herbs/spices are 1/4, everything else is 1 */
export function getPointValue(category: FoodCategory): number {
  if (category === 'herb_spice') return 0.25
  if (category === 'other_plant') return 0.25
  if (category === 'fermented') return 0 // recommended but doesn't count
  return 1
}

/** A food item from the built-in database or custom entry */
export interface FoodItem {
  name: string
  category: FoodCategory
  /** If true, this was added by the user (not from built-in DB) */
  isCustom?: boolean
}

/** Which meal of the day the food was logged for */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

/** A single logged food entry */
export interface FoodEntry {
  id: string
  name: string
  category: FoodCategory
  /** ISO date string (YYYY-MM-DD) when this food was logged */
  date: string
  /** Whether this is a custom food not in the built-in DB */
  isCustom?: boolean
  /** Which meal of the day this was eaten at */
  mealType?: MealType
}

/** A saved meal — a reusable shortcut to log multiple foods at once */
export interface Meal {
  id: string
  name: string
  /** The food items in this meal */
  items: FoodItem[]
}

/** User preferences */
export interface UserSettings {
  /** 0 = Sunday, 1 = Monday (default) */
  weekStartDay: 0 | 1
}

/** Summary for a given week */
export interface WeekSummary {
  /** ISO date of the week start (YYYY-MM-DD) */
  weekStart: string
  /** ISO date of the week end (YYYY-MM-DD) */
  weekEnd: string
  /** Total plant points for the week */
  totalPoints: number
  /** Number of unique plant foods (excluding fermented) */
  uniquePlantCount: number
  /** Whether the 30-plant goal was met */
  goalMet: boolean
  /** Entries for this week */
  entries: FoodEntry[]
}

/** Top-level app data stored in localStorage */
export interface AppData {
  entries: FoodEntry[]
  /** Custom foods the user has added (persisted for reuse) */
  customFoods: FoodItem[]
  /** Saved meals for quick logging */
  meals: Meal[]
  settings: UserSettings
  version: number
}
