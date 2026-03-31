import { useMemo } from 'react'
import { Compass, ChevronRight } from 'lucide-react'
import { useFood } from '../../context/FoodContext'
import { ALL_FOODS, CATEGORY_META } from '../../data/foodDatabase'

interface DiscoverCardProps {
  onExplore: () => void
}

export default function DiscoverCard({ onExplore }: DiscoverCardProps) {
  const { data } = useFood()

  const { suggestions, totalUntried } = useMemo(() => {
    const loggedNames = new Set<string>()
    for (const entry of data.entries) {
      loggedNames.add(entry.name.toLowerCase())
    }
    for (const food of data.customFoods) {
      loggedNames.add(food.name.toLowerCase())
    }

    const untried = ALL_FOODS.filter((f) => !loggedNames.has(f.name.toLowerCase()))

    // Pick 3 random suggestions, seeded by today's date so they stay stable within a day
    const today = new Date()
    let seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }

    const picks = []
    const pool = [...untried]
    for (let i = 0; i < Math.min(3, pool.length); i++) {
      const idx = Math.floor(random() * pool.length)
      picks.push(pool[idx])
      pool.splice(idx, 1)
    }

    return { suggestions: picks, totalUntried: untried.length }
  }, [data.entries, data.customFoods])

  if (totalUntried === 0) return null

  return (
    <button
      onClick={onExplore}
      className="w-full bg-app-surface border border-app-border rounded-2xl p-4 text-left hover:border-app-accent/40 transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
          <Compass size={16} className="text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-app-text">Try something new</p>
            <ChevronRight
              size={14}
              className="text-app-text-muted group-hover:text-app-accent transition-colors shrink-0"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {suggestions.map((food) => {
              const meta = CATEGORY_META[food.category]
              return (
                <span
                  key={food.name}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-app-hover text-[11px] text-app-text-secondary"
                >
                  {meta.emoji} {food.name}
                </span>
              )
            })}
          </div>
          <p className="text-[10px] text-app-text-muted mt-2">
            {totalUntried} foods to discover →
          </p>
        </div>
      </div>
    </button>
  )
}
