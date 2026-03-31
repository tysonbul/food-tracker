import { FoodEntry, getPointValue, FoodCategory } from '../../types'
import { CATEGORY_META, CATEGORY_ORDER } from '../../data/foodDatabase'
import { Trash2 } from 'lucide-react'

interface CategoryBreakdownProps {
  entries: FoodEntry[]
  onDeleteEntry: (id: string) => void
}

interface GroupedCategory {
  category: FoodCategory
  items: { entry: FoodEntry; points: number }[]
  totalPoints: number
}

export default function CategoryBreakdown({ entries, onDeleteEntry }: CategoryBreakdownProps) {
  // Deduplicate entries by name (case-insensitive) — only unique foods for scoring
  const seen = new Map<string, FoodEntry>()
  for (const entry of entries) {
    const key = entry.name.toLowerCase().trim()
    if (!seen.has(key)) {
      seen.set(key, entry)
    }
  }
  const uniqueEntries = Array.from(seen.values())

  // Group by category
  const groups: GroupedCategory[] = CATEGORY_ORDER
    .map((cat) => {
      const items = uniqueEntries
        .filter((e) => e.category === cat)
        .map((e) => ({ entry: e, points: getPointValue(e.category) }))
      return {
        category: cat,
        items,
        totalPoints: items.reduce((sum, i) => sum + i.points, 0),
      }
    })
    .filter((g) => g.items.length > 0)

  if (groups.length === 0) {
    return (
      <div className="bg-app-surface border border-app-border rounded-2xl p-6 text-center">
        <p className="text-gray-500 text-sm">No foods logged this week yet.</p>
        <p className="text-gray-600 text-xs mt-1">Tap the + button to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const meta = CATEGORY_META[group.category]
        return (
          <div
            key={group.category}
            className="bg-app-surface border border-app-border rounded-2xl overflow-hidden"
          >
            {/* Category header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-app-border">
              <div className="flex items-center gap-2">
                <span>{meta.emoji}</span>
                <span className="text-sm font-medium text-gray-200">{meta.label}</span>
              </div>
              <span className="text-xs text-gray-500">
                {group.totalPoints % 1 === 0
                  ? group.totalPoints
                  : group.totalPoints.toFixed(2)}{' '}
                pt{group.totalPoints !== 1 ? 's' : ''}
              </span>
            </div>
            {/* Items */}
            <div className="divide-y divide-app-border">
              {group.items.map(({ entry, points }) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between px-4 py-2.5 group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-gray-300 truncate">{entry.name}</span>
                    {entry.isCustom && (
                      <span className="text-[10px] text-gray-600 bg-gray-800 rounded px-1 shrink-0">custom</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-500">
                      {points === 0.25 ? '¼' : points} pt
                    </span>
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1 text-gray-600 hover:text-red-400 transition-all"
                      aria-label={`Remove ${entry.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
