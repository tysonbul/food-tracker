import { useState } from 'react'
import { FoodCategory, FoodItem, getPointValue } from '../../types'
import { CATEGORY_META, CATEGORY_ORDER } from '../../data/foodDatabase'
import { ChevronLeft } from 'lucide-react'

function formatPoints(category: FoodCategory): string {
  const pts = getPointValue(category)
  if (pts === 0) return '0 pts'
  if (pts === 0.25) return '¼ pt'
  return `${pts} pt`
}

interface AddCustomFoodProps {
  onAdd: (food: FoodItem) => void
  onBack: () => void
}

export default function AddCustomFood({ onAdd, onBack }: AddCustomFoodProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<FoodCategory>('vegetable')

  const handleSubmit = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd({ name: trimmed, category, isCustom: true })
    setName('')
  }

  return (
    <div className="px-4 py-2 space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-app-text-muted hover:text-app-text transition-colors"
      >
        <ChevronLeft size={16} />
        Back to search
      </button>

      <div>
        <label className="block text-xs text-app-text-muted mb-1.5">Food name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Dragon Fruit Smoothie"
          className="w-full px-3 py-2.5 bg-app-surface border border-app-border rounded-xl text-sm text-app-text placeholder-app-text-muted focus:outline-none focus:border-app-accent"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-xs text-app-text-muted mb-1.5">Category</label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat]
            const active = category === cat
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                  active
                    ? 'bg-app-accent/15 border border-app-accent/30 text-app-text'
                    : 'bg-app-surface border border-app-border text-app-text-muted hover:text-app-text'
                }`}
              >
                <span>{meta.emoji} {meta.label}</span>
                <span className={`text-[10px] ml-1 ${active ? 'text-white/60' : 'text-app-muted'}`}>
                  {formatPoints(cat)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
        className="w-full py-3 rounded-xl bg-app-accent text-white font-semibold hover:bg-app-accent-hover transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Add "{name.trim() || '...'}"
      </button>
    </div>
  )
}
