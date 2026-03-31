import { Meal, getPointValue } from '../../types'
import { CATEGORY_META } from '../../data/foodDatabase'
import { Pencil, Trash2 } from 'lucide-react'

interface MealCardProps {
  meal: Meal
  onEdit: () => void
  onDelete: () => void
}

export default function MealCard({
  meal,
  onEdit,
  onDelete,
}: MealCardProps) {
  const totalPoints = meal.items.reduce((s, i) => s + getPointValue(i.category), 0)

  return (
    <div className="bg-app-surface border border-app-border rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-white truncate">{meal.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {meal.items.length} item{meal.items.length !== 1 ? 's' : ''} · {totalPoints % 1 === 0 ? totalPoints : totalPoints.toFixed(2)} pts
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-500 hover:text-white transition-colors"
            title="Edit meal"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
            title="Delete meal"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Item preview chips */}
      <div className="px-4 pb-3 flex flex-wrap gap-1">
        {meal.items.map((item) => (
          <span
            key={item.name}
            className="text-[10px] text-gray-500 bg-gray-800/50 rounded px-1.5 py-0.5"
          >
            {CATEGORY_META[item.category].emoji} {item.name}
          </span>
        ))}
      </div>
    </div>
  )
}
