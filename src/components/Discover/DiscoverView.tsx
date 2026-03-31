import { useState, useMemo, useCallback, useEffect } from 'react'
import { ChevronLeft, Shuffle, Compass, Check } from 'lucide-react'
import { useFood } from '../../context/FoodContext'
import { ALL_FOODS, CATEGORY_META, CATEGORY_ORDER } from '../../data/foodDatabase'
import { FoodCategory, FoodItem } from '../../types'
import CategoryChips from '../common/CategoryChips'
import EmptyState from '../common/EmptyState'

interface DiscoverViewProps {
  onBack: () => void
  onLogFood: (food: FoodItem) => void
}

export default function DiscoverView({ onBack, onLogFood }: DiscoverViewProps) {
  const { data } = useFood()
  const [categoryFilter, setCategoryFilter] = useState<FoodCategory | null>(null)
  const [shuffleSeed, setShuffleSeed] = useState(0)
  const [justLogged, setJustLogged] = useState<string | null>(null)

  const handleLog = useCallback(
    (food: FoodItem) => {
      onLogFood(food)
      setJustLogged(food.name)
    },
    [onLogFood],
  )

  // Clear toast after 2 seconds
  useEffect(() => {
    if (!justLogged) return
    const t = setTimeout(() => setJustLogged(null), 2000)
    return () => clearTimeout(t)
  }, [justLogged])

  // All food names the user has ever logged (lowercased for matching)
  const loggedNames = useMemo(() => {
    const names = new Set<string>()
    for (const entry of data.entries) {
      names.add(entry.name.toLowerCase())
    }
    // Also include custom foods — the user knows about those
    for (const food of data.customFoods) {
      names.add(food.name.toLowerCase())
    }
    return names
  }, [data.entries, data.customFoods])

  // Foods never logged, grouped by category
  const untriedFoods = useMemo(() => {
    return ALL_FOODS.filter((f) => !loggedNames.has(f.name.toLowerCase()))
  }, [loggedNames])

  const filtered = useMemo(() => {
    if (!categoryFilter) return untriedFoods
    return untriedFoods.filter((f) => f.category === categoryFilter)
  }, [untriedFoods, categoryFilter])

  // Counts per category for the chips
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<FoodCategory, number>> = {}
    for (const f of untriedFoods) {
      counts[f.category] = (counts[f.category] || 0) + 1
    }
    return counts
  }, [untriedFoods])

  // Shuffle the list deterministically based on seed
  const shuffled = useMemo(() => {
    const arr = [...filtered]
    // Simple seeded shuffle (Fisher-Yates with seed)
    let seed = shuffleSeed + 1
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [filtered, shuffleSeed])

  const totalUntried = untriedFoods.length
  const totalInDb = ALL_FOODS.length

  return (
    <div className="max-w-lg mx-auto pb-6">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 text-app-text-muted hover:text-app-text transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-app-text">Food Hit List</h1>
            <p className="text-xs text-app-text-muted mt-0.5">
              {totalUntried} of {totalInDb} foods to discover
            </p>
          </div>
          <button
            onClick={() => setShuffleSeed((s) => s + 1)}
            className="p-2 -mr-2 text-app-text-muted hover:text-app-accent transition-colors"
            title="Shuffle order"
          >
            <Shuffle size={18} />
          </button>
        </div>
      </div>

      {/* Category filter */}
      <CategoryChips active={categoryFilter} onChange={setCategoryFilter} />

      {/* Progress bar */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between text-[10px] text-app-text-muted mb-1.5">
          <span>{totalInDb - totalUntried} tried</span>
          <span>{totalUntried} to go</span>
        </div>
        <div className="h-1.5 bg-app-hover rounded-full overflow-hidden">
          <div
            className="h-full bg-app-accent rounded-full transition-all duration-500"
            style={{ width: `${((totalInDb - totalUntried) / totalInDb) * 100}%` }}
          />
        </div>
      </div>

      {/* Food list */}
      <div className="px-5 space-y-2">
        {shuffled.length === 0 ? (
          <EmptyState
            message={
              categoryFilter
                ? `You've tried every ${CATEGORY_META[categoryFilter].label.toLowerCase()} in the database!`
                : "You've tried everything! Add custom foods to keep exploring."
            }
            icon={<Compass size={24} className="text-app-accent mx-auto" />}
          />
        ) : (
          <>
            {/* Group by category when no filter active */}
            {categoryFilter ? (
              <FoodGrid foods={shuffled} onLog={handleLog} />
            ) : (
              CATEGORY_ORDER
                .filter((cat) => (categoryCounts[cat] || 0) > 0)
                .map((cat) => {
                  const catFoods = shuffled.filter((f) => f.category === cat)
                  if (catFoods.length === 0) return null
                  const meta = CATEGORY_META[cat]
                  return (
                    <div key={cat} className="space-y-2">
                      <button
                        onClick={() => setCategoryFilter(cat)}
                        className="flex items-center gap-2 text-xs font-semibold text-app-text-secondary pt-2 hover:text-app-accent transition-colors"
                      >
                        <span>{meta.emoji} {meta.label}</span>
                        <span className="text-app-text-muted font-normal">
                          {catFoods.length} to try
                        </span>
                      </button>
                      <FoodGrid foods={catFoods.slice(0, 8)} onLog={handleLog} />
                      {catFoods.length > 8 && (
                        <button
                          onClick={() => setCategoryFilter(cat)}
                          className="text-xs text-app-accent font-medium hover:underline"
                        >
                          View all {catFoods.length} →
                        </button>
                      )}
                    </div>
                  )
                })
            )}
          </>
        )}
      </div>

      {/* Toast */}
      {justLogged && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-app-accent text-white text-xs font-medium shadow-lg">
            <Check size={14} />
            Logged {justLogged}
          </div>
        </div>
      )}
    </div>
  )
}

function FoodGrid({ foods, onLog }: { foods: FoodItem[]; onLog: (food: FoodItem) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {foods.map((food) => {
        const meta = CATEGORY_META[food.category]
        return (
          <button
            key={food.name}
            onClick={() => onLog(food)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-app-surface border border-app-border text-xs text-app-text-secondary hover:border-app-accent hover:text-app-accent transition-all active:scale-95"
          >
            <span>{meta.emoji}</span>
            <span>{food.name}</span>
          </button>
        )
      })}
    </div>
  )
}
