import { useState } from 'react'
import { useFood } from '../../context/FoodContext'
import { formatWeekRange } from '../../utils/week'
import ProgressRing from '../ProgressRing'
import StreakBadge from './StreakBadge'
import CategoryBreakdown from './CategoryBreakdown'
import DailyView from './DailyView'
import DiscoverCard from '../Discover/DiscoverCard'

type WeekTab = 'score' | 'daily'

interface ThisWeekViewProps {
  onOpenDiscover?: () => void
}

export default function ThisWeekView({ onOpenDiscover }: ThisWeekViewProps) {
  const { data, currentWeekStart, currentWeekSummary, streak, totalUniquePlants, deleteEntry } = useFood()
  const [tab, setTab] = useState<WeekTab>('score')
  const goal = data.settings.weeklyGoal

  return (
    <div className="p-5 max-w-lg mx-auto space-y-5 pb-6">
      {/* Week label */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-app-text">This Week</h1>
        <span className="text-xs text-app-text-muted">
          {formatWeekRange(currentWeekSummary.weekStart, currentWeekSummary.weekEnd)}
        </span>
      </div>

      {/* Progress ring + streak */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-6 flex flex-col items-center gap-4">
        <ProgressRing current={currentWeekSummary.totalPoints} goal={goal} />
        <StreakBadge current={streak.current} longest={streak.longest} />

        {/* Quick stats row */}
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-lg font-semibold text-app-text">{currentWeekSummary.uniquePlantCount}</p>
            <p className="text-[10px] text-app-text-muted uppercase tracking-wider">unique this week</p>
          </div>
          <div className="w-px bg-app-border" />
          <div>
            <p className="text-lg font-semibold text-app-text">{totalUniquePlants}</p>
            <p className="text-[10px] text-app-text-muted uppercase tracking-wider">all-time unique</p>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-app-surface border border-app-border rounded-xl p-1">
        <button
          onClick={() => setTab('score')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
            tab === 'score'
              ? 'bg-app-accent text-white'
              : 'text-app-text-muted hover:text-app-text'
          }`}
        >
          Score
        </button>
        <button
          onClick={() => setTab('daily')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
            tab === 'daily'
              ? 'bg-app-accent text-white'
              : 'text-app-text-muted hover:text-app-text'
          }`}
        >
          Daily
        </button>
      </div>

      {/* Tab content */}
      {tab === 'score' && (
        <CategoryBreakdown
          entries={currentWeekSummary.entries}
          onDeleteEntry={deleteEntry}
        />
      )}
      {tab === 'daily' && (
        <DailyView
          weekStart={currentWeekStart}
          entries={currentWeekSummary.entries}
          meals={data.meals}
          onDeleteEntry={deleteEntry}
        />
      )}

      {/* Discover card */}
      {onOpenDiscover && <DiscoverCard onExplore={onOpenDiscover} />}
    </div>
  )
}
