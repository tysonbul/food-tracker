import { useState, useMemo } from 'react'
import { useFood } from '../../context/FoodContext'
import {
  getAllWeeks,
  getEntriesForWeek,
  calculateWeekSummary,
  getAverageWeeklyPoints,
} from '../../utils/week'
import WeekCard from './WeekCard'
import WeekDetail from './WeekDetail'

export default function HistoryView() {
  const { data, streak, totalUniquePlants, currentWeekStart, deleteEntry } = useFood()
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null)

  const weeks = useMemo(
    () => getAllWeeks(data.entries, data.settings.weekStartDay),
    [data.entries, data.settings.weekStartDay],
  )

  const weekSummaries = useMemo(
    () =>
      weeks.map((ws) => {
        const entries = getEntriesForWeek(data.entries, ws, data.settings.weekStartDay)
        return calculateWeekSummary(ws, entries)
      }),
    [weeks, data.entries, data.settings.weekStartDay],
  )

  const avgPoints = useMemo(
    () => getAverageWeeklyPoints(data.entries, data.settings.weekStartDay),
    [data.entries, data.settings.weekStartDay],
  )

  const selectedSummary = useMemo(
    () => weekSummaries.find((s) => s.weekStart === selectedWeek) ?? null,
    [weekSummaries, selectedWeek],
  )

  // Show detail view
  if (selectedSummary) {
    return (
      <WeekDetail
        summary={selectedSummary}
        isCurrent={selectedSummary.weekStart === currentWeekStart}
        onBack={() => setSelectedWeek(null)}
        onDeleteEntry={deleteEntry}
      />
    )
  }

  const weeksAtGoal = weekSummaries.filter((s) => s.goalMet).length

  return (
    <div className="p-5 max-w-lg mx-auto space-y-5 pb-6">
      <h1 className="text-lg font-semibold text-white">History</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-app-surface border border-app-border rounded-2xl p-4">
          <p className="text-2xl font-bold text-white">{streak.current}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
            week streak
          </p>
        </div>
        <div className="bg-app-surface border border-app-border rounded-2xl p-4">
          <p className="text-2xl font-bold text-white">{streak.longest}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
            best streak
          </p>
        </div>
        <div className="bg-app-surface border border-app-border rounded-2xl p-4">
          <p className="text-2xl font-bold text-white">
            {avgPoints % 1 === 0 ? avgPoints : avgPoints.toFixed(1)}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
            avg / week
          </p>
        </div>
        <div className="bg-app-surface border border-app-border rounded-2xl p-4">
          <p className="text-2xl font-bold text-white">{totalUniquePlants}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
            unique ever
          </p>
        </div>
      </div>

      {/* Weeks at goal note */}
      {weeksAtGoal > 0 && (
        <p className="text-xs text-gray-500 text-center">
          Hit 30+ in {weeksAtGoal} of {weeks.length} week{weeks.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Week list */}
      <div className="space-y-2.5">
        {weekSummaries.map((summary) => (
          <WeekCard
            key={summary.weekStart}
            summary={summary}
            isCurrent={summary.weekStart === currentWeekStart}
            onSelect={() => setSelectedWeek(summary.weekStart)}
          />
        ))}
      </div>

      {weeks.length === 0 && (
        <div className="bg-app-surface border border-app-border rounded-2xl p-6 text-center">
          <p className="text-gray-500 text-sm">No history yet. Start logging foods!</p>
        </div>
      )}
    </div>
  )
}
