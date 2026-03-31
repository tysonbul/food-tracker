import { WeekSummary } from '../../types'
import { formatWeekRange } from '../../utils/week'
import { ChevronRight, Check } from 'lucide-react'

interface WeekCardProps {
  summary: WeekSummary
  isCurrent: boolean
  onSelect: () => void
}

function getProgressColor(points: number): string {
  if (points >= 30) return 'bg-yellow-500/20 border-yellow-500/30'
  if (points >= 20) return 'bg-green-500/15 border-green-500/25'
  if (points >= 10) return 'bg-orange-500/15 border-orange-500/25'
  if (points > 0) return 'bg-red-500/10 border-red-500/20'
  return 'bg-app-surface border-app-border'
}

function getBarColor(points: number): string {
  if (points >= 30) return 'bg-yellow-500'
  if (points >= 20) return 'bg-green-500'
  if (points >= 10) return 'bg-orange-500'
  return 'bg-red-500'
}

export default function WeekCard({ summary, isCurrent, onSelect }: WeekCardProps) {
  const progress = Math.min(summary.totalPoints / 30, 1)

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border p-4 transition-all hover:brightness-110 ${getProgressColor(summary.totalPoints)}`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <span className="text-sm font-medium text-white">
            {formatWeekRange(summary.weekStart, summary.weekEnd)}
          </span>
          {isCurrent && (
            <span className="ml-2 text-[10px] text-app-accent bg-app-accent/10 rounded px-1.5 py-0.5">
              current
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {summary.goalMet && <Check size={14} className="text-yellow-500" />}
          <ChevronRight size={14} className="text-gray-600" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-gray-800 overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(summary.totalPoints)}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {summary.totalPoints % 1 === 0
            ? summary.totalPoints
            : summary.totalPoints.toFixed(1)}{' '}
          / 30 plants
        </span>
        <span className="text-xs text-gray-500">
          {summary.uniquePlantCount} unique
        </span>
      </div>
    </button>
  )
}
