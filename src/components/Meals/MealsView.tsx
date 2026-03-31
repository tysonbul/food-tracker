import { useState } from 'react'
import { Plus, UtensilsCrossed } from 'lucide-react'
import { useFood } from '../../context/FoodContext'
import { Meal } from '../../types'
import MealCard from './MealCard'
import MealEditor from './MealEditor'

export default function MealsView() {
  const { data, deleteMeal } = useFood()
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    deleteMeal(id)
    setConfirmDelete(null)
  }

  if (showCreate) {
    return <MealEditor onClose={() => setShowCreate(false)} />
  }

  if (editingMeal) {
    return <MealEditor meal={editingMeal} onClose={() => setEditingMeal(null)} />
  }

  return (
    <div className="p-5 max-w-lg mx-auto space-y-5 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-app-text">Meals</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-app-accent text-white text-xs font-semibold hover:bg-app-accent-hover transition-all"
        >
          <Plus size={14} />
          New Meal
        </button>
      </div>

      {data.meals.length === 0 ? (
        <div className="bg-app-surface border border-app-border rounded-2xl p-8 text-center">
          <UtensilsCrossed size={32} className="mx-auto text-app-muted mb-3" />
          <p className="text-sm text-app-text-muted mb-1">No meals saved yet</p>
          <p className="text-xs text-app-muted">
            Create a meal to quickly log common food combos — like your morning
            smoothie or go-to salad.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.meals.map((meal) => (
            <div key={meal.id}>
              <MealCard
                meal={meal}
                onEdit={() => setEditingMeal(meal)}
                onDelete={() => setConfirmDelete(meal.id)}
              />
              {confirmDelete === meal.id && (
                <div className="mt-2 flex gap-2 px-1">
                  <button
                    onClick={() => handleDelete(meal.id)}
                    className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-all"
                  >
                    Delete "{meal.name}"
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 py-2 rounded-xl bg-app-hover text-app-text-muted text-xs font-medium hover:text-app-text transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
