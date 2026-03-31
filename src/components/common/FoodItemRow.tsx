import { FoodItem } from '../../types'
import { CATEGORY_META } from '../../data/foodDatabase'
import Checkbox from './Checkbox'

interface FoodItemRowProps {
  food: FoodItem
  isSelected?: boolean
  onClick?: () => void
  tags?: ('custom' | 'logged')[]
}

export default function FoodItemRow({ food, isSelected = false, onClick, tags = [] }: FoodItemRowProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
        isSelected
          ? 'bg-app-accent/15 border border-app-accent/30'
          : 'hover:bg-app-hover'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Checkbox checked={isSelected} />
        <span className={`truncate ${isSelected ? 'text-app-text' : 'text-app-text-secondary'}`}>
          {food.name}
        </span>
        {tags.includes('custom') && (
          <span className="text-[10px] text-app-muted bg-app-tag-bg rounded px-1 shrink-0">
            custom
          </span>
        )}
        {tags.includes('logged') && (
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
}
