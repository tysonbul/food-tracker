interface ProgressRingProps {
  current: number
  goal: number
  size?: number
  strokeWidth?: number
}

function getProgressColor(current: number, goal: number): string {
  const ratio = current / goal
  if (ratio >= 1) return '#FFD700' // gold — goal met!
  if (ratio >= 0.67) return '#00d395' // green
  if (ratio >= 0.33) return '#F5A623' // yellow/orange
  return '#FF6B6B' // red
}

export default function ProgressRing({
  current,
  goal,
  size = 180,
  strokeWidth = 12,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(current / goal, 1)
  const offset = circumference - progress * circumference
  const color = getProgressColor(current, goal)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e2235"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">{current % 1 === 0 ? current : current.toFixed(1)}</span>
        <span className="text-sm text-gray-500">/ {goal} plants</span>
      </div>
    </div>
  )
}
