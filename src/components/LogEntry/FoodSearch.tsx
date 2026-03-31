import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { FoodItem, FoodCategory, Meal, getPointValue } from '../../types'
import { ALL_FOODS, CATEGORY_META, CATEGORY_ORDER } from '../../data/foodDatabase'

interface FoodSearchProps {
  /** Foods already logged this week (by lowercase name) */
  loggedThisWeek: Set<string>
  /** Custom foods from user history */
  customFoods: FoodItem[]
  /** Recently logged foods (for "Recent" section) */
  recentFoods: FoodItem[]
  /** Saved meals */
  meals: Meal[]
  /** Currently selected foods in this session */
  selected: Set<string>
  onToggle: (food: FoodItem) => void
  /** Navigate to meals tab to create a new meal */
  onCreateMeal?: () => void
}

export default function FoodSearch({
  loggedThisWeek,
  customFoods,
  recentFoods,
  meals,
  selected,
  onToggle,
  onCreateMeal,
}: FoodSearchProps) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<FoodCategory | 'recent' | 'meals' | null>(null)
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null)

  // Build prioritized food list: custom first, then recent, then built-in
  const allFoods = useMemo(() => {
    const customItems = customFoods.map((f) => ({ ...f, isCustom: true as const, _priority: 0 }))
    const recentItems = recentFoods.map((f) => ({ ...f, _priority: 1 as const }))
    const builtIn = ALL_FOODS.map((f) => ({ ...f, _priority: 2 as const }))

    // Merge, deduplicating by lowercase name (custom wins over recent wins over built-in)
    const seen = new Set<string>()
    const merged: (FoodItem & { _priority: number })[] = []
    for (const list of [customItems, recentItems, builtIn]) {
      for (const food of list) {
        const key = food.name.toLowerCase().trim()
        if (!seen.has(key)) {
          seen.add(key)
          merged.push(food)
        }
      }
    }
    return merged
  }, [customFoods, recentFoods])

  // Filter meals based on search
  const filteredMeals = useMemo(() => {
    if (activeCategory !== 'meals') return []
    const q = query.toLowerCase()
    return meals.filter((m) =>
      q
        ? m.name.toLowerCase().includes(q) ||
          m.items.some((i) => i.name.toLowerCase().includes(q))
        : true,
    )
  }, [meals, query, activeCategory])

  // Filter foods based on search and category
  const filteredFoods = useMemo(() => {
    if (activeCategory === 'meals') return []

    if (activeCategory === 'recent') {
      const q = query.toLowerCase()
      return recentFoods.filter((f) =>
        q ? f.name.toLowerCase().includes(q) : true,
      )
    }

    let foods = allFoods
    if (activeCategory) {
      foods = foods.filter((f) => f.category === activeCategory)
    }
    if (query) {
      const q = query.toLowerCase()
      foods = foods.filter((f) => f.name.toLowerCase().includes(q))
    }
    return foods
  }, [allFoods, recentFoods, query, activeCategory])

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="relative px-4 pb-3">
        <Search size={16} className="absolute left-7 top-1/2 -translate-y-1/2 text-app-text-muted -mt-1.5" />
        <input
          type="text"
          placeholder="Search foods..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 bg-app-surface border border-app-border rounded-xl text-sm text-app-text placeholder-app-text-muted focus:outline-none focus:border-app-accent"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-7 top-1/2 -translate-y-1/2 text-app-text-muted hover:text-app-text-secondary -mt-1.5"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
        {recentFoods.length > 0 && (
          <button
            onClick={() => setActiveCategory(activeCategory === 'recent' ? null : 'recent')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'recent'
                ? 'bg-app-accent text-white'
                : 'bg-app-surface border border-app-border text-app-text-muted hover:text-app-text'
            }`}
          >
            ⏱ Recent
          </button>
        )}
        {meals.length > 0 && (
          <button
            onClick={() => {
              setActiveCategory(activeCategory === 'meals' ? null : 'meals')
              setExpandedMeal(null)
            }}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'meals'
                ? 'bg-app-accent text-white'
                : 'bg-app-surface border border-app-border text-app-text-muted hover:text-app-text'
            }`}
          >
            🍽 Meals
          </button>
        )}
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
              <span className={`ml-0.5 ${active ? 'text-white/60' : 'text-app-muted'}`}>
                {getPointValue(cat) === 0.25 ? '¼' : getPointValue(cat) === 0 ? '0' : getPointValue(cat)}
              </span>
            </button>
          )
        })}
      </div>

      {/* Food list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Meals view */}
        {activeCategory === 'meals' && (
          <>
            {filteredMeals.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-app-text-secondary">
                  {query ? 'No matching meals found' : 'No saved meals yet'}
                </p>
                {!query && onCreateMeal && (
                  <button
                    onClick={onCreateMeal}
                    className="mt-3 px-4 py-2 rounded-xl bg-app-surface border border-app-border text-sm text-app-accent hover:border-app-accent/40 transition-all"
                  >
                    + Create Your First Meal
                  </button>
                )}
              </div>
            )}
            <div className="space-y-2">
              {filteredMeals.map((meal) => {
                const isExpanded = expandedMeal === meal.id
                const newItems = meal.items.filter(
                  (i) => !loggedThisWeek.has(i.name.toLowerCase().trim()),
                )
                const allSelected = newItems.every((i) =>
                  selected.has(i.name.toLowerCase().trim()),
                )
                return (
                  <div
                    key={meal.id}
                    className="bg-app-surface border border-app-border rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedMeal(isExpanded ? null : meal.id)}
                      className="w-full flex items-center justify-between px-3 py-3 text-left"
                    >
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-app-text">{meal.name}</span>
                        <span className="text-xs text-app-text-muted ml-2">
                          {meal.items.length} item{meal.items.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {newItems.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (allSelected) {
                              newItems.forEach((i) => onToggle(i))
                            } else {
                              newItems
                                .filter((i) => !selected.has(i.name.toLowerCase().trim()))
                                .forEach((i) => onToggle(i))
                            }
                          }}
                          className={`shrink-0 ml-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            allSelected
                              ? 'bg-app-accent/15 text-app-accent border border-app-accent/30'
                              : 'bg-app-accent text-white'
                          }`}
                        >
                          {allSelected ? 'Added' : `Add ${newItems.length} new`}
                        </button>
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-3 pb-3 space-y-1 border-t border-app-border/50 pt-2">
                        {meal.items.map((food) => {
                          const key = food.name.toLowerCase().trim()
                          const alreadyLogged = loggedThisWeek.has(key)
                          const isSelected = selected.has(key)
                          return (
                            <button
                              key={`${meal.id}-${food.name}`}
                              onClick={() => onToggle(food)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                                isSelected
                                  ? 'bg-app-accent/15 border border-app-accent/30'
                                  : 'hover:bg-app-hover'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                                    isSelected
                                      ? 'bg-app-accent border-app-accent'
                                      : 'border-app-border'
                                  }`}
                                >
                                  {isSelected && (
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                      <path
                                        d="M2.5 6L5 8.5L9.5 3.5"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span className={`truncate ${isSelected ? 'text-app-text' : 'text-app-text-secondary'}`}>
                                  {food.name}
                                </span>
                                {alreadyLogged && (
                                  <span className="text-[10px] text-app-muted bg-app-tag-bg/70 rounded px-1 shrink-0">
                                    logged
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-app-muted shrink-0 ml-2">
                                {CATEGORY_META[food.category].emoji}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {onCreateMeal && (
              <button
                onClick={onCreateMeal}
                className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-app-border text-sm text-app-text-muted hover:text-app-accent hover:border-app-accent/40 transition-all"
              >
                + Create New Meal
              </button>
            )}
          </>
        )}

        {/* Regular food list */}
        {activeCategory !== 'meals' && filteredFoods.length === 0 && (
          <p className="text-sm text-app-text-secondary text-center py-8">
            {query ? 'No matching foods found' : 'Select a category to browse'}
          </p>
        )}
        {activeCategory !== 'meals' && <div className="space-y-1">
          {filteredFoods.map((food) => {
            const key = food.name.toLowerCase().trim()
            const alreadyLogged = loggedThisWeek.has(key)
            const isSelected = selected.has(key)

            return (
              <button
                key={`${food.category}-${food.name}`}
                onClick={() => onToggle(food)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isSelected
                    ? 'bg-app-accent/15 border border-app-accent/30'
                    : 'hover:bg-app-hover'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Checkbox indicator */}
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-app-accent border-app-accent'
                        : 'border-app-border'
                    }`}
                  >
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6L5 8.5L9.5 3.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className={`truncate ${isSelected ? 'text-app-text' : 'text-app-text-secondary'}`}>
                    {food.name}
                  </span>
                  {food.isCustom && (
                    <span className="text-[10px] text-app-muted bg-app-tag-bg rounded px-1 shrink-0">
                      custom
                    </span>
                  )}
                  {alreadyLogged && (
                    <span className="text-[10px] text-app-muted bg-app-tag-bg/70 rounded px-1 shrink-0">
                      logged
                    </span>
                  )}
                </div>
                <span className="text-xs text-app-muted shrink-0 ml-2">
                  {CATEGORY_META[food.category].emoji}
                </span>
              </button>
            )
          })}
        </div>}
      </div>
    </div>
  )
}
