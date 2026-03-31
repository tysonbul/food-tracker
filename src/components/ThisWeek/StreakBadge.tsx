import { Flame } from 'lucide-react'

interface StreakBadgeProps {
  current: number
  longest: number
}

export default function StreakBadge({ current, longest }: StreakBadgeProps) {
  if (current === 0 && longest === 0) return null

  return (
    <div className="flex items-center gap-3">
      {current > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
          <Flame size={14} className="text-orange-400" />
          <span className="text-xs font-medium text-orange-300">
            {current} week{current !== 1 ? 's' : ''} streak
          </span>
        </div>
      )}
      {longest > current && (
        <span className="text-xs text-gray-500">
          Best: {longest}w
        </span>
      )}
    </div>
  )
}
