import { WeekSummary } from '../../types'
import { formatWeekRange } from '../../utils/week'
import { formatPoints } from '../../utils/format'
import { ChevronRight, Check } from 'lucide-react'

interface WeekCardProps {
  summary: WeekSummary
  goal: number
  isCurrent: boolean
  onSelect: () => void
}

function getBarColor(ratio: number): string {
  if (ratio >= 1) return 'bg-yellow-500'
  if (ratio >= 0.67) return 'bg-green-500'
  if (ratio >= 0.33) return 'bg-orange-500'
  return 'bg-red-500'
}

export default function WeekCard({ summary, goal, isCurrent, onSelect }: WeekCardProps) {
  const progress = Math.min(summary.totalPoints / goal, 1)

  return (
    <button
      onClick={onSelect}
      className="w-full text-left rounded-2xl border p-4 transition-all bg-app-surface border-app-border hover:border-app-accent/30"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <span className="text-sm font-medium text-app-text">
            {formatWeekRange(summary.weekStart, summary.weekEnd)}
          </span>
          {isCurrent && (
            <span className="ml-2 text-[10px] text-white bg-app-accent rounded px-1.5 py-0.5">
              current
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {summary.goalMet && <Check size={14} className="text-yellow-500" />}
          <ChevronRight size={14} className="text-app-text-muted" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-app-border overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(progress)}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-app-text-muted">
          {formatPoints(summary.totalPoints)} / {goal} plants
        </span>
        <span className="text-xs text-app-text-muted">
          {summary.uniquePlantCount} unique
        </span>
      </div>
    </button>
  )
}
