import { AppData } from '../types'

const STORAGE_KEY = 'food-tracker-v1'

const DEFAULT_DATA: AppData = {
  entries: [],
  customFoods: [],
  meals: [],
  settings: {
    weekStartDay: 1,
  },
  version: 1,
}

export const loadData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_DATA, customFoods: [], entries: [], meals: [] }
    const parsed = JSON.parse(raw) as AppData
    // Migrate missing fields
    if (!parsed.entries) parsed.entries = []
    if (!parsed.customFoods) parsed.customFoods = []
    if (!parsed.meals) parsed.meals = []
    if (!parsed.settings) parsed.settings = { weekStartDay: 1 }
    if (parsed.settings.weekStartDay === undefined) parsed.settings.weekStartDay = 1
    return parsed
  } catch {
    return { ...DEFAULT_DATA, customFoods: [], entries: [], meals: [] }
  }
}

export const saveData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const exportData = (data: AppData): string => {
  return JSON.stringify(data, null, 2)
}

export const importData = (json: string): AppData | null => {
  try {
    const parsed = JSON.parse(json) as AppData
    if (!parsed.entries || !Array.isArray(parsed.entries)) return null
    return parsed
  } catch {
    return null
  }
}
