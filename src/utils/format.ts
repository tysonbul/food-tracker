import { FoodEntry } from '../types'

/** Format a points value for display (e.g. 12, 12.5, "¼") */
export function formatPoints(value: number): string {
  if (value === 0.25) return '¼'
  if (value % 1 === 0) return String(value)
  return value.toFixed(1)
}

/** Format a points value with unit (e.g. "12 pts", "¼ pt") */
export function formatPointsWithUnit(value: number): string {
  const formatted = formatPoints(value)
  return `${formatted} pt${value !== 1 ? 's' : ''}`
}

/** Deduplicate entries by lowercase name, keeping the first occurrence */
export function deduplicateEntries(entries: FoodEntry[]): FoodEntry[] {
  const seen = new Map<string, FoodEntry>()
  for (const entry of entries) {
    const key = entry.name.toLowerCase().trim()
    if (!seen.has(key)) {
      seen.set(key, entry)
    }
  }
  return Array.from(seen.values())
}
