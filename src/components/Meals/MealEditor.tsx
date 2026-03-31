import { useState, useMemo } from 'react'
import { X, Search, Trash2 } from 'lucide-react'
import { FoodItem, FoodCategory, Meal, getPointValue } from '../../types'
import { ALL_FOODS, CATEGORY_META, CATEGORY_ORDER } from '../../data/foodDatabase'
import { useFood } from '../../context/FoodContext'

interface MealEditorProps {
  /** Existing meal to edit, or undefined for new */
  meal?: Meal
  onClose: () => void
}

export default function MealEditor({ meal, onClose }: MealEditorProps) {
  const { data, addMeal, updateMeal } = useFood()
  const [name, setName] = useState(meal?.name ?? '')
  const [items, setItems] = useState<FoodItem[]>(meal?.items ?? [])
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<FoodCategory | null>(null)

  const allFoods = useMemo(() => {
    const custom = data.customFoods.map((f) => ({ ...f, isCustom: true }))
    return [...custom, ...ALL_FOODS]
  }, [data.customFoods])

  const selectedKeys = useMemo(
    () => new Set(items.map((i) => i.name.toLowerCase().trim())),
    [items],
  )

  const filteredFoods = useMemo(() => {
    let foods = allFoods
    if (activeCategory) {
      foods = foods.filter((f) => f.category === activeCategory)
    }
    if (query) {
      const q = query.toLowerCase()
      foods = foods.filter((f) => f.name.toLowerCase().includes(q))
    }
    return foods
  }, [allFoods, query, activeCategory])

  const totalPoints = items.reduce((sum, i) => sum + getPointValue(i.category), 0)

  const handleToggle = (food: FoodItem) => {
    const key = food.name.toLowerCase().trim()
    if (selectedKeys.has(key)) {
      setItems((prev) => prev.filter((i) => i.name.toLowerCase().trim() !== key))
    } else {
      setItems((prev) => [...prev, food])
    }
  }

  const handleRemoveItem = (food: FoodItem) => {
    const key = food.name.toLowerCase().trim()
    setItems((prev) => prev.filter((i) => i.name.toLowerCase().trim() !== key))
  }

  const handleSave = () => {
    if (!name.trim() || items.length === 0) return
    if (meal) {
      updateMeal(meal.id, { name: name.trim(), items })
    } else {
      addMeal({ name: name.trim(), items })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-app-bg overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-app-border">
        <button onClick={onClose} className="p-1 text-app-text-muted hover:text-app-text">
          <X size={20} />
        </button>
        <h2 className="text-sm font-semibold text-app-text">
          {meal ? 'Edit Meal' : 'Create Meal'}
        </h2>
        <div className="w-7" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Meal name */}
        <div className="px-4 py-3 border-b border-app-border">
          <label className="block text-xs text-app-text-muted mb-1.5">Meal name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning Smoothie, Taco Tuesday"
            className="w-full px-3 py-2.5 bg-app-surface border border-app-border rounded-xl text-sm text-app-text placeholder-app-text-muted focus:outline-none focus:border-app-accent"
            autoFocus
          />
        </div>

        {/* Selected items */}
        {items.length > 0 && (
          <div className="px-4 py-3 border-b border-app-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-app-text-muted">
                {items.length} item{items.length !== 1 ? 's' : ''} · {totalPoints % 1 === 0 ? totalPoints : totalPoints.toFixed(2)} pts
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {items.map((item) => (
                <span
                  key={item.name}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-app-accent/10 border border-app-accent/20 text-xs text-app-accent"
                >
                  {CATEGORY_META[item.category].emoji} {item.name}
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="hover:text-red-400 ml-0.5"
                  >
                    <Trash2 size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Search + category filter */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-text-muted" />
            <input
              type="text"
              placeholder="Search foods to add..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-app-surface border border-app-border rounded-xl text-sm text-app-text placeholder-app-text-muted focus:outline-none focus:border-app-accent"
            />
          </div>
        </div>

        <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat]
            const active = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(active ? null : cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active
                    ? 'bg-app-accent text-white'
                    : 'bg-app-surface border border-app-border text-app-text-muted hover:text-app-text'
                }`}
              >
                {meta.emoji} {meta.label}
              </button>
            )
          })}
        </div>

        {/* Food list */}
        <div className="px-4 pb-4">
          <div className="space-y-1">
            {filteredFoods.slice(0, 100).map((food) => {
              const key = food.name.toLowerCase().trim()
              const isSelected = selectedKeys.has(key)
              return (
                <button
                  key={`${food.category}-${food.name}`}
                  onClick={() => handleToggle(food)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isSelected
                      ? 'bg-app-accent/15 border border-app-accent/30'
                      : 'hover:bg-app-hover'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? 'bg-app-accent border-app-accent' : 'border-app-border'
                      }`}
                    >
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`truncate ${isSelected ? 'text-app-text' : 'text-app-text-secondary'}`}>
                      {food.name}
                    </span>
                  </div>
                  <span className="text-xs text-app-muted shrink-0 ml-2">
                    {CATEGORY_META[food.category].emoji}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="px-4 py-3 border-t border-app-border bg-app-bg">
        <button
          onClick={handleSave}
          disabled={!name.trim() || items.length === 0}
          className="w-full py-3 rounded-xl bg-app-accent text-white font-semibold hover:bg-app-accent-hover transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {meal ? 'Save Changes' : 'Create Meal'}
        </button>
      </div>
    </div>
  )
}
