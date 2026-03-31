import { WeekSummary } from '../../types'
import { useFood } from '../../context/FoodContext'
import { formatWeekRange } from '../../utils/week'
import { ChevronLeft } from 'lucide-react'
import ProgressRing from '../ProgressRing'
import CategoryBreakdown from '../ThisWeek/CategoryBreakdown'

interface WeekDetailProps {
  summary: WeekSummary
  onBack: () => void
  onDeleteEntry: (id: string) => void
  isCurrent: boolean
}

export default function WeekDetail({ summary, onBack, onDeleteEntry, isCurrent }: WeekDetailProps) {
  const { data } = useFood()
  const goal = data.settings.weeklyGoal

  return (
    <div className="p-5 max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1 text-app-text-muted hover:text-app-text transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-sm font-semibold text-app-text">
            {formatWeekRange(summary.weekStart, summary.weekEnd)}
          </h2>
          {isCurrent && <span className="text-xs text-app-accent">Current week</span>}
        </div>
      </div>

      {/* Ring */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-6 flex justify-center">
        <ProgressRing current={summary.totalPoints} goal={goal} size={140} />
      </div>

      {/* Breakdown */}
      <CategoryBreakdown entries={summary.entries} onDeleteEntry={onDeleteEntry} />
    </div>
  )
}
