import { useState, useMemo, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { FoodItem, FoodEntry, MealType } from '../../types'
import { useFood } from '../../context/FoodContext'
import { getToday } from '../../utils/week'
import { MEAL_TYPES } from '../../data/mealTypes'
import FullScreenModal from '../common/FullScreenModal'
import FoodSearch from './FoodSearch'
import AddCustomFood from './AddCustomFood'

interface LogEntryModalProps {
  onClose: () => void
  onSave?: () => void
  onCreateMeal?: () => void
}

export default function LogEntryModal({ onClose, onSave, onCreateMeal }: LogEntryModalProps) {
  const { data, currentWeekSummary, addEntries, addCustomFood } = useFood()
  const [selected, setSelected] = useState<Map<string, FoodItem>>(new Map())
  const [showCustom, setShowCustom] = useState(false)
  const [date, setDate] = useState(getToday())
  const [mealType, setMealType] = useState<MealType | undefined>(undefined)

  // Foods already logged this week (by lowercase name)
  const loggedThisWeek = useMemo(() => {
    return new Set(
      currentWeekSummary.entries.map((e) => e.name.toLowerCase().trim()),
    )
  }, [currentWeekSummary.entries])

  // Recent foods — unique foods from last 4 weeks, not already logged this week
  const recentFoods = useMemo(() => {
    const seen = new Map<string, FoodItem>()
    const sorted = [...data.entries].sort((a, b) => b.date.localeCompare(a.date))
    for (const entry of sorted) {
      const key = entry.name.toLowerCase().trim()
      if (!loggedThisWeek.has(key) && !seen.has(key)) {
        seen.set(key, {
          name: entry.name,
          category: entry.category,
          isCustom: entry.isCustom,
        })
      }
      if (seen.size >= 50) break
    }
    return Array.from(seen.values())
  }, [data.entries, loggedThisWeek])

  const selectedSet = useMemo(
    () => new Set(Array.from(selected.keys())),
    [selected],
  )

  const handleToggle = useCallback((food: FoodItem) => {
    setSelected((prev) => {
      const next = new Map(prev)
      const key = food.name.toLowerCase().trim()
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.set(key, food)
      }
      return next
    })
  }, [])

  const handleAddCustom = useCallback(
    (food: FoodItem) => {
      addCustomFood(food)
      setSelected((prev) => {
        const next = new Map(prev)
        next.set(food.name.toLowerCase().trim(), food)
        return next
      })
      setShowCustom(false)
    },
    [addCustomFood],
  )

  const handleDone = () => {
    if (selected.size === 0) {
      onClose()
      return
    }
    const entries: Omit<FoodEntry, 'id'>[] = Array.from(selected.values()).map(
      (food) => ({
        name: food.name,
        category: food.category,
        date,
        isCustom: food.isCustom,
        mealType,
      }),
    )
    addEntries(entries)
    if (onSave) {
      onSave()
    } else {
      onClose()
    }
  }

  return (
    <FullScreenModal
      title="Log Food"
      onClose={onClose}
      headerRight={
        !showCustom ? (
          <button
            onClick={() => setShowCustom(true)}
            className="p-1 text-app-text-muted hover:text-app-accent"
            title="Add custom food"
          >
            <Plus size={20} />
          </button>
        ) : undefined
      }
      footer={
        <button
          onClick={handleDone}
          className="w-full py-3 rounded-xl bg-app-accent text-white font-semibold hover:bg-app-accent-hover transition-all text-sm"
        >
          {selected.size > 0
            ? `Add ${selected.size} food${selected.size !== 1 ? 's' : ''}`
            : 'Done'}
        </button>
      }
    >
      {/* Date picker + meal type */}
      <div className="px-4 py-2.5 border-b border-app-border space-y-2.5 overflow-hidden">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full max-w-full px-3 py-2 bg-app-surface border border-app-border rounded-xl text-sm text-app-text focus:outline-none focus:border-app-accent"
        />
        <div className="grid grid-cols-4 gap-1.5">
          {MEAL_TYPES.map((mt) => (
            <button
              key={mt.value}
              onClick={() => setMealType(mealType === mt.value ? undefined : mt.value)}
              className={`py-1.5 rounded-lg text-xs font-medium transition-all truncate px-1 ${
                mealType === mt.value
                  ? 'bg-app-accent text-white'
                  : 'bg-app-surface border border-app-border text-app-text-muted hover:text-app-text'
              }`}
            >
              {mt.emoji} {mt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden pt-3">
        {showCustom ? (
          <AddCustomFood onAdd={handleAddCustom} onBack={() => setShowCustom(false)} />
        ) : (
          <FoodSearch
            loggedThisWeek={loggedThisWeek}
            customFoods={data.customFoods}
            recentFoods={recentFoods}
            meals={data.meals}
            selected={selectedSet}
            onToggle={handleToggle}
            onCreateMeal={onCreateMeal}
          />
        )}
      </div>
    </FullScreenModal>
  )
}
