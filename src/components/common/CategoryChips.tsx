import { FoodCategory, getPointValue } from '../../types'
import { CATEGORY_META, CATEGORY_ORDER } from '../../data/foodDatabase'

interface CategoryChipsProps {
  active: FoodCategory | null
  onChange: (category: FoodCategory | null) => void
  /** Show point values next to labels */
  showPoints?: boolean
  /** Extra chips to render before the categories */
  prefix?: React.ReactNode
}

export default function CategoryChips({
  active,
  onChange,
  showPoints = false,
  prefix,
}: CategoryChipsProps) {
  return (
    <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
      {prefix}
      {CATEGORY_ORDER.map((cat) => {
        const meta = CATEGORY_META[cat]
        const isActive = active === cat
        return (
          <button
            key={cat}
            onClick={() => onChange(isActive ? null : cat)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive
                ? 'bg-app-accent text-white'
                : 'bg-app-surface border border-app-border text-app-text-muted hover:text-app-text'
            }`}
          >
            {meta.emoji} {meta.label}
            {showPoints && (
              <span className={`ml-0.5 ${isActive ? 'text-white/60' : 'text-app-muted'}`}>
                {getPointValue(cat) === 0.25 ? '¼' : getPointValue(cat) === 0 ? '0' : getPointValue(cat)}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
