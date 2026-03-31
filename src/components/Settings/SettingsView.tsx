import { useState, useRef } from 'react'
import { Download, Upload, Trash2, BookOpen, ChevronRight } from 'lucide-react'
import { useFood } from '../../context/FoodContext'
import { exportData, importData } from '../../utils/storage'
import HowItWorksView from './HowItWorksView'

export default function SettingsView() {
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const { data, replaceData, updateSettings } = useFood()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showResetConfirm, setShowResetConfirm] = useState(false)

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
    // Reset file input
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
          <p className="text-xs text-app-text-muted">Learn about the 30-plant goal, scoring, and tips</p>
        </div>
        <ChevronRight size={16} className="text-app-text-muted shrink-0" />
      </button>

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
