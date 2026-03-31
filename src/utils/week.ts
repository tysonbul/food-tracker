import { FoodEntry, WeekSummary, getPointValue, DEFAULT_GOAL } from '../types'
import { deduplicateEntries } from './format'

/**
 * Get the start date (YYYY-MM-DD) of the week containing `date`.
 * @param date ISO date string or Date
 * @param weekStartDay 0 = Sunday, 1 = Monday
 */
export function getWeekStart(date: string | Date, weekStartDay: 0 | 1 = 1): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date)
  const day = d.getDay()
  const diff = (day - weekStartDay + 7) % 7
  d.setDate(d.getDate() - diff)
  return d.toISOString().slice(0, 10)
}

/**
 * Get the end date (YYYY-MM-DD) of the week starting on `weekStart`.
 */
export function getWeekEnd(weekStart: string): string {
  const d = new Date(weekStart + 'T00:00:00')
  d.setDate(d.getDate() + 6)
  return d.toISOString().slice(0, 10)
}

/**
 * Format a week range for display: "Mar 24 – 30" or "Mar 28 – Apr 3"
 */
export function formatWeekRange(weekStart: string, weekEnd: string): string {
  const start = new Date(weekStart + 'T00:00:00')
  const end = new Date(weekEnd + 'T00:00:00')
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' })
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' })

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()} – ${end.getDate()}`
  }
  return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}`
}

/**
 * Calculate the week summary for a given set of entries.
 * Only counts unique plant names (case-insensitive).
 * Herbs/spices = 0.25 points each, fermented = 0 (tracked but doesn't count).
 */
export function calculateWeekSummary(
  weekStart: string,
  entries: FoodEntry[],
  goal: number = DEFAULT_GOAL,
): WeekSummary {
  const weekEnd = getWeekEnd(weekStart)

  // Deduplicate by lowercase name — only unique plants count
  const uniqueEntries = deduplicateEntries(entries)
  let totalPoints = 0
  let uniquePlantCount = 0

  for (const entry of uniqueEntries) {
    const pts = getPointValue(entry.category)
    totalPoints += pts
    if (pts > 0) uniquePlantCount++
  }

  return {
    weekStart,
    weekEnd,
    totalPoints,
    uniquePlantCount,
    goalMet: totalPoints >= goal,
    entries,
  }
}

/**
 * Get entries for a specific week.
 */
export function getEntriesForWeek(
  allEntries: FoodEntry[],
  weekStart: string,
  weekStartDay: 0 | 1 = 1,
): FoodEntry[] {
  return allEntries.filter((e) => getWeekStart(e.date, weekStartDay) === weekStart)
}

/**
 * Get today's date as YYYY-MM-DD.
 */
export function getToday(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Get all unique weeks that have entries, plus the current week, sorted newest first.
 */
export function getAllWeeks(
  allEntries: FoodEntry[],
  weekStartDay: 0 | 1 = 1,
): string[] {
  const weeks = new Set<string>()
  // Always include current week
  weeks.add(getWeekStart(getToday(), weekStartDay))
  for (const entry of allEntries) {
    weeks.add(getWeekStart(entry.date, weekStartDay))
  }
  return Array.from(weeks).sort((a, b) => b.localeCompare(a))
}

/**
 * Calculate the current streak of weeks meeting the 30-plant goal.
 * Counts backwards from the current or most recent completed week.
 */
export function calculateStreak(
  allEntries: FoodEntry[],
  weekStartDay: 0 | 1 = 1,
  goal: number = DEFAULT_GOAL,
): { current: number; longest: number } {
  const weeks = getAllWeeks(allEntries, weekStartDay)
  if (weeks.length === 0) return { current: 0, longest: 0 }

  // Build summaries for all weeks
  const summaries = weeks.map((ws) => {
    const entries = getEntriesForWeek(allEntries, ws, weekStartDay)
    return calculateWeekSummary(ws, entries, goal)
  })

  // Calculate longest streak
  let longest = 0
  let current = 0

  // Go from oldest to newest for longest
  const sortedOldest = [...summaries].reverse()
  let streak = 0
  for (const s of sortedOldest) {
    if (s.goalMet) {
      streak++
      longest = Math.max(longest, streak)
    } else {
      streak = 0
    }
  }

  // Current streak — count from most recent completed week backwards
  // Skip current week if it hasn't ended yet
  const today = getToday()
  const currentWeekStart = getWeekStart(today, weekStartDay)

  for (const s of summaries) {
    // Skip current in-progress week for streak purposes
    if (s.weekStart === currentWeekStart) continue
    if (s.goalMet) {
      current++
    } else {
      break
    }
  }

  // If current week also meets goal, include it
  const currentWeekSummary = summaries.find((s) => s.weekStart === currentWeekStart)
  if (currentWeekSummary?.goalMet) {
    current++
  }

  return { current, longest: Math.max(longest, current) }
}

/**
 * Get the total number of unique plants ever logged.
 */
export function getTotalUniquePlants(allEntries: FoodEntry[]): number {
  const seen = new Set<string>()
  for (const entry of allEntries) {
    const pts = getPointValue(entry.category)
    if (pts > 0) {
      seen.add(entry.name.toLowerCase().trim())
    }
  }
  return seen.size
}

/**
 * Get average weekly points across all weeks with entries.
 */
export function getAverageWeeklyPoints(
  allEntries: FoodEntry[],
  weekStartDay: 0 | 1 = 1,
): number {
  const weeks = getAllWeeks(allEntries, weekStartDay)
  if (weeks.length === 0) return 0

  let totalPoints = 0
  for (const ws of weeks) {
    const entries = getEntriesForWeek(allEntries, ws, weekStartDay)
    const summary = calculateWeekSummary(ws, entries)
    totalPoints += summary.totalPoints
  }

  return totalPoints / weeks.length
}
