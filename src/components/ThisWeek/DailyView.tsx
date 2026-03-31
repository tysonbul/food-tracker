import { useState, useMemo } from 'react'
import { ChevronDown, Trash2 } from 'lucide-react'
import { FoodEntry, MealType, Meal } from '../../types'
import { CATEGORY_META } from '../../data/foodDatabase'
import { getWeekEnd } from '../../utils/week'

interface DailyViewProps {
  weekStart: string
  entries: FoodEntry[]
  meals: Meal[]
  onDeleteEntry: (id: string) => void
}

const MEAL_TYPE_ORDER: (MealType | 'none')[] = ['breakfast', 'lunch', 'dinner', 'snack', 'none']

const MEAL_TYPE_META: Record<MealType | 'none', { emoji: string; label: string }> = {
  breakfast: { emoji: '🌅', label: 'Breakfast' },
  lunch: { emoji: '☀️', label: 'Lunch' },
  dinner: { emoji: '🌙', label: 'Dinner' },
  snack: { emoji: '🍿', label: 'Snack' },
  none: { emoji: '🍽', label: 'Other' },
}

function formatDayLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const dateOnly = new Date(dateStr + 'T00:00:00')
  if (dateOnly.getTime() === today.getTime()) return 'Today'
  if (dateOnly.getTime() === yesterday.getTime()) return 'Yesterday'

  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

/** Check if a set of entries matches a saved meal (all meal items present) */
function findMatchingMeals(
  entries: FoodEntry[],
  meals: Meal[],
): Map<string, string> {
  // Map from entry id -> meal name, for entries that belong to a recognized meal
  const entryToMeal = new Map<string, string>()

  for (const meal of meals) {
    const mealItemNames = new Set(meal.items.map((i) => i.name.toLowerCase().trim()))
    // Find entries that match this meal's items within the same mealType
    const mealTypeGroups = new Map<string, FoodEntry[]>()
    for (const entry of entries) {
      const mt = entry.mealType || 'none'
      if (mealItemNames.has(entry.name.toLowerCase().trim())) {
        if (!mealTypeGroups.has(mt)) mealTypeGroups.set(mt, [])
        mealTypeGroups.get(mt)!.push(entry)
      }
    }

    // For each meal type group, check if all meal items are present
    for (const [, groupEntries] of mealTypeGroups) {
      const foundNames = new Set(groupEntries.map((e) => e.name.toLowerCase().trim()))
      if (mealItemNames.size > 0 && [...mealItemNames].every((n) => foundNames.has(n))) {
        for (const entry of groupEntries) {
          if (mealItemNames.has(entry.name.toLowerCase().trim())) {
            entryToMeal.set(entry.id, meal.name)
          }
        }
      }
    }
  }

  return entryToMeal
}

interface DayData {
  date: string
  sections: { mealType: MealType | 'none'; entries: FoodEntry[] }[]
}

export default function DailyView({ weekStart, entries, meals, onDeleteEntry }: DailyViewProps) {
  const weekEnd = getWeekEnd(weekStart)

  // Build list of all days in the week (up to today)
  const days = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const result: DayData[] = []
    const d = new Date(weekEnd + 'T00:00:00')
    const startDate = new Date(weekStart + 'T00:00:00')

    while (d >= startDate) {
      const dateStr = d.toISOString().slice(0, 10)
      if (dateStr <= today) {
        const dayEntries = entries.filter((e) => e.date === dateStr)
        const sections = MEAL_TYPE_ORDER
          .map((mt) => ({
            mealType: mt,
            entries: dayEntries.filter((e) => (e.mealType || 'none') === mt),
          }))
          .filter((s) => s.entries.length > 0)

        result.push({ date: dateStr, sections })
      }
      d.setDate(d.getDate() - 1)
    }
    return result
  }, [weekStart, weekEnd, entries])

  // Find which entries belong to recognized meals
  const entryToMeal = useMemo(() => findMatchingMeals(entries, meals), [entries, meals])

  // Expand today by default
  const today = new Date().toISOString().slice(0, 10)
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set([today]))

  const toggleDay = (date: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev)
      if (next.has(date)) next.delete(date)
      else next.add(date)
      return next
    })
  }

  if (days.every((d) => d.sections.length === 0)) {
    return (
      <div className="bg-app-surface border border-app-border rounded-2xl p-6 text-center">
        <p className="text-app-text-secondary text-sm">No foods logged this week yet.</p>
        <p className="text-app-muted text-xs mt-1">Tap the + button to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {days.map(({ date, sections }) => {
        const isExpanded = expandedDays.has(date)
        const entryCount = sections.reduce((s, sec) => s + sec.entries.length, 0)

        return (
          <div
            key={date}
            className="bg-app-surface border border-app-border rounded-2xl overflow-hidden"
          >
            {/* Day header */}
            <button
              onClick={() => toggleDay(date)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-app-text">{formatDayLabel(date)}</span>
                {entryCount > 0 && (
                  <span className="text-[10px] text-app-text-muted bg-app-tag-bg/70 rounded-full px-2 py-0.5">
                    {entryCount} item{entryCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <ChevronDown
                size={16}
                className={`text-app-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Expanded day content */}
            {isExpanded && sections.length > 0 && (
              <div className="border-t border-app-border">
                {sections.map(({ mealType, entries: sectionEntries }) => {
                  const meta = MEAL_TYPE_META[mealType]
                  // Group entries by meal name where applicable
                  const mealGroups = groupByMeal(sectionEntries, entryToMeal)

                  return (
                    <div key={mealType}>
                      {/* Meal type header */}
                      <div className="px-4 py-2 bg-app-hover/50">
                        <span className="text-xs font-medium text-app-text-muted">
                          {meta.emoji} {meta.label}
                        </span>
                      </div>
                      {/* Entries, optionally grouped by meal */}
                      <div className="divide-y divide-app-border/50">
                        {mealGroups.map((group) => (
                          <div key={group.key}>
                            {group.mealName && (
                              <div className="px-4 pt-2 pb-1">
                                <span className="text-[10px] font-medium text-app-accent/70 uppercase tracking-wider">
                                  {group.mealName}
                                </span>
                              </div>
                            )}
                            {group.entries.map((entry) => (
                              <div
                                key={entry.id}
                                className="flex items-center justify-between px-4 py-2 group"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-xs text-app-muted shrink-0">
                                    {CATEGORY_META[entry.category].emoji}
                                  </span>
                                  <span className="text-sm text-app-text-secondary truncate">
                                    {entry.name}
                                  </span>
                                  {entry.isCustom && (
                                    <span className="text-[10px] text-app-muted bg-app-tag-bg rounded px-1 shrink-0">
                                      custom
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => onDeleteEntry(entry.id)}
                                  className="opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1 text-app-muted hover:text-red-400 transition-all shrink-0"
                                  aria-label={`Remove ${entry.name}`}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Empty day */}
            {isExpanded && sections.length === 0 && (
              <div className="border-t border-app-border px-4 py-4">
                <p className="text-xs text-app-muted text-center">Nothing logged</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Group entries within a meal type section by their recognized meal name */
function groupByMeal(
  entries: FoodEntry[],
  entryToMeal: Map<string, string>,
): { key: string; mealName: string | null; entries: FoodEntry[] }[] {
  const groups: { key: string; mealName: string | null; entries: FoodEntry[] }[] = []
  const mealBuckets = new Map<string, FoodEntry[]>()
  const ungrouped: FoodEntry[] = []

  for (const entry of entries) {
    const mealName = entryToMeal.get(entry.id)
    if (mealName) {
      if (!mealBuckets.has(mealName)) mealBuckets.set(mealName, [])
      mealBuckets.get(mealName)!.push(entry)
    } else {
      ungrouped.push(entry)
    }
  }

  // Named meal groups first
  for (const [mealName, mealEntries] of mealBuckets) {
    groups.push({ key: `meal-${mealName}`, mealName, entries: mealEntries })
  }

  // Ungrouped entries
  if (ungrouped.length > 0) {
    groups.push({ key: 'ungrouped', mealName: null, entries: ungrouped })
  }

  return groups
}
