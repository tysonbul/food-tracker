import { useState, useRef } from 'react'
import { Download, Upload, Trash2, BookOpen, ChevronRight, Info } from 'lucide-react'
import { useFood } from '../../context/FoodContext'
import { DEFAULT_GOAL } from '../../types'
import { exportData, importData } from '../../utils/storage'
import HowItWorksView from './HowItWorksView'

interface GoalTier {
  value: number
  emoji: string
  name: string
  description: string
}

const GOAL_TIERS: GoalTier[] = [
  { value: 20, emoji: '🌱', name: 'Seedling', description: 'A great place to start growing' },
  { value: 30, emoji: '🌿', name: 'Blooming', description: 'The research-backed sweet spot' },
  { value: 40, emoji: '🌳', name: 'Thriving', description: 'Go beyond and keep exploring' },
]

export default function SettingsView() {
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const { data, replaceData, updateSettings } = useFood()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showResearchInfo, setShowResearchInfo] = useState(false)

  const goal = data.settings.weeklyGoal ?? DEFAULT_GOAL
  const isCustomGoal = !GOAL_TIERS.some((t) => t.value === goal)
  const [showCustomInput, setShowCustomInput] = useState(isCustomGoal)
  const [customValue, setCustomValue] = useState(String(goal))

  const handleGoalSelect = (value: number) => {
    setShowCustomInput(false)
    updateSettings({ weeklyGoal: value })
  }

  const handleCustomGoal = () => {
    setShowCustomInput(true)
  }

  const handleCustomSubmit = () => {
    const num = Math.max(5, Math.min(100, Math.round(Number(customValue))))
    if (!isNaN(num)) {
      updateSettings({ weeklyGoal: num })
      setCustomValue(String(num))
    }
  }

  const handleExport = () => {
    const json = exportData(data)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `food-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = importData(reader.result as string)
      if (result) {
        replaceData(result)
        setImportStatus('success')
        setTimeout(() => setImportStatus('idle'), 3000)
      } else {
        setImportStatus('error')
        setTimeout(() => setImportStatus('idle'), 3000)
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleReset = () => {
    replaceData({
      entries: [],
      customFoods: [],
      meals: [],
      settings: data.settings,
      version: 1,
    })
    setShowResetConfirm(false)
  }

  if (showHowItWorks) {
    return <HowItWorksView onBack={() => setShowHowItWorks(false)} />
  }

  return (
    <div className="p-5 max-w-lg mx-auto space-y-5 pb-6">
      <h1 className="text-lg font-semibold text-app-text">Settings</h1>

      {/* How It Works */}
      <button
        onClick={() => setShowHowItWorks(true)}
        className="w-full bg-app-surface border border-app-border rounded-2xl p-4 flex items-center gap-3 hover:border-app-accent/30 transition-all text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-app-accent/15 flex items-center justify-center shrink-0">
          <BookOpen size={16} className="text-app-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-app-text">How It Works</p>
          <p className="text-xs text-app-text-muted">Learn about scoring, categories, and tips</p>
        </div>
        <ChevronRight size={16} className="text-app-text-muted shrink-0" />
      </button>

      {/* Weekly Goal */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-app-text">Weekly goal</h3>
          <button
            onClick={() => setShowResearchInfo(!showResearchInfo)}
            className="p-1 text-app-text-muted hover:text-app-accent transition-colors"
            title="About this goal"
          >
            <Info size={16} />
          </button>
        </div>

        {/* Research info panel */}
        {showResearchInfo && (
          <div className="bg-app-hover/60 border border-app-border rounded-xl p-3 space-y-2 text-xs text-app-text-secondary leading-relaxed">
            <p>
              The{' '}
              <a
                href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5954204/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-app-accent underline"
              >
                American Gut Project
              </a>
              {' '}(15,000+ participants) found that people eating 30+ different plants per week
              had significantly more diverse gut microbiomes than those eating fewer than 10.
            </p>
            <p>
              The relationship is a gradient — more variety means more benefit. There's no cliff
              where benefits suddenly start, so{' '}
              <a
                href="https://theconversation.com/the-30-plants-a-week-challenge-youll-still-see-gut-health-benefits-even-if-you-dont-meet-this-goal-248491"
                target="_blank"
                rel="noopener noreferrer"
                className="text-app-accent underline"
              >
                even modest increases help
              </a>.
              Pick whatever goal keeps you motivated.
            </p>
          </div>
        )}

        {/* Tier buttons */}
        <div className="space-y-2">
          {GOAL_TIERS.map((tier) => {
            const active = goal === tier.value && !showCustomInput
            return (
              <button
                key={tier.value}
                onClick={() => handleGoalSelect(tier.value)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all ${
                  active
                    ? 'bg-app-accent/10 border border-app-accent/30'
                    : 'bg-app-hover/50 border border-transparent hover:border-app-border'
                }`}
              >
                <span className="text-xl">{tier.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${active ? 'text-app-accent' : 'text-app-text'}`}>
                      {tier.name}
                    </span>
                    <span className={`text-xs ${active ? 'text-app-accent/70' : 'text-app-text-muted'}`}>
                      {tier.value}/week
                    </span>
                  </div>
                  <p className="text-xs text-app-text-muted mt-0.5">{tier.description}</p>
                </div>
                {active && (
                  <div className="w-5 h-5 rounded-full bg-app-accent flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}

          {/* Custom option */}
          <button
            onClick={handleCustomGoal}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all ${
              showCustomInput
                ? 'bg-app-accent/10 border border-app-accent/30'
                : 'bg-app-hover/50 border border-transparent hover:border-app-border'
            }`}
          >
            <span className="text-xl">✏️</span>
            <div className="flex-1 min-w-0">
              <span className={`text-sm font-medium ${showCustomInput ? 'text-app-accent' : 'text-app-text'}`}>
                Custom
              </span>
              <p className="text-xs text-app-text-muted mt-0.5">Set your own number</p>
            </div>
            {showCustomInput && (
              <div className="w-5 h-5 rounded-full bg-app-accent flex items-center justify-center shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </button>

          {/* Custom input */}
          {showCustomInput && (
            <div className="flex gap-2 px-1">
              <input
                type="number"
                min={5}
                max={100}
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onBlur={handleCustomSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                className="flex-1 px-3 py-2.5 bg-app-bg border border-app-border rounded-xl text-sm text-app-text focus:outline-none focus:border-app-accent text-center"
                placeholder="e.g. 25"
              />
              <span className="flex items-center text-xs text-app-text-muted">plants/week</span>
            </div>
          )}
        </div>
      </div>

      {/* Week start day */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-medium text-app-text">Week starts on</h3>
        <div className="flex gap-2">
          {([1, 0] as const).map((day) => {
            const active = data.settings.weekStartDay === day
            return (
              <button
                key={day}
                onClick={() => updateSettings({ weekStartDay: day })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-app-accent text-white'
                    : 'bg-app-hover text-app-text-muted hover:text-app-text'
                }`}
              >
                {day === 1 ? 'Monday' : 'Sunday'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Data management */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-medium text-app-text">Data</h3>

        <div className="space-y-2">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-app-hover text-sm text-app-text-secondary hover:text-app-text transition-all"
          >
            <Download size={16} />
            Export backup (JSON)
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-app-hover text-sm text-app-text-secondary hover:text-app-text transition-all"
          >
            <Upload size={16} />
            Import backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          {importStatus === 'success' && (
            <p className="text-xs text-green-400 px-1">Data imported successfully!</p>
          )}
          {importStatus === 'error' && (
            <p className="text-xs text-red-400 px-1">Invalid backup file. Please try again.</p>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-app-surface border border-red-900/30 rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-medium text-red-400">Danger Zone</h3>

        {showResetConfirm ? (
          <div className="space-y-2">
            <p className="text-xs text-app-text-muted">
              This will permanently delete all your logged foods and custom entries.
              Your settings will be kept.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all"
              >
                Yes, delete all data
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-app-hover text-app-text-muted text-sm font-medium hover:text-app-text transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-900/20 text-sm text-red-400 hover:text-red-300 transition-all"
          >
            <Trash2 size={16} />
            Reset all data
          </button>
        )}
      </div>

      {/* Stats footer */}
      <div className="text-center text-xs text-app-text-muted space-y-0.5">
        <p>{data.entries.length} total entries logged</p>
        <p>{data.customFoods.length} custom foods saved</p>
      </div>
    </div>
  )
}
