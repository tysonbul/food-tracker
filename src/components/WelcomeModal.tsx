import { Leaf, Scale, Flame, Ban, FlaskConical, Smartphone, X } from 'lucide-react'
import { CATEGORY_META, CATEGORY_ORDER } from '../data/foodDatabase'
import { getPointValue } from '../types'

const WELCOME_KEY = 'food-tracker-welcome-seen'

export function hasSeenWelcome(): boolean {
  return localStorage.getItem(WELCOME_KEY) === 'true'
}

export function markWelcomeSeen(): void {
  localStorage.setItem(WELCOME_KEY, 'true')
}

interface WelcomeModalProps {
  onClose: () => void
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const handleClose = () => {
    markWelcomeSeen()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-lg md:rounded-2xl bg-app-bg overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-app-bg/95 backdrop-blur-sm border-b border-app-border px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-app-text">Welcome to Plant Tracker</h1>
            <p className="text-xs text-app-text-muted mt-0.5">Track your plant food diversity</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 -mr-2 text-app-text-muted hover:text-app-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5 pb-28">
          {/* Intro */}
          <div className="bg-app-accent/10 border border-app-accent/20 rounded-2xl p-5 space-y-2">
            <p className="text-sm font-medium text-app-accent">Your gut loves variety</p>
            <p className="text-sm text-app-text-secondary leading-relaxed">
              Research shows that eating a wide variety of plant foods each week leads
              to a significantly more diverse gut microbiome — linked to better digestion,
              stronger immunity, and improved mental health.
            </p>
            <p className="text-sm text-app-text-secondary leading-relaxed">
              This app helps you track how many unique plants you eat each week and hit your
              weekly goal. You can adjust the target in Settings to match your pace.
            </p>
          </div>

          {/* Scoring */}
          <div className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <Scale size={16} className="text-blue-400" />
              </div>
              <h2 className="text-sm font-semibold text-app-text">Point System</h2>
            </div>
            <p className="text-sm text-app-text-secondary leading-relaxed">
              Each unique plant food you eat in a week counts towards your score. Eating the
              same food twice in a week still counts as 1 point — it's about variety.
            </p>
            <div className="space-y-1.5 mt-2">
              {CATEGORY_ORDER.map((cat) => {
                const meta = CATEGORY_META[cat]
                const pts = getPointValue(cat)
                const ptsLabel =
                  pts === 0 ? 'Bonus (0 pts)' : pts === 0.25 ? '¼ point each' : '1 point each'
                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-app-hover/50"
                  >
                    <span className="text-sm text-app-text-secondary">
                      {meta.emoji} {meta.label}
                    </span>
                    <span className={`text-xs font-medium ${pts === 0 ? 'text-app-text-muted' : pts === 0.25 ? 'text-yellow-600' : 'text-app-accent'}`}>
                      {ptsLabel}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* What counts */}
          <div className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
                <Flame size={16} className="text-green-600" />
              </div>
              <h2 className="text-sm font-semibold text-app-text">What Counts</h2>
            </div>
            <div className="text-sm text-app-text-secondary leading-relaxed space-y-2">
              <p>
                All whole plant foods — fruits, vegetables, whole grains, legumes,
                nuts, seeds, herbs, and spices. Different varieties count separately
                (e.g. red and green bell peppers = 2 plants).
              </p>
              <p>
                Coffee, tea, and dark chocolate (70%+) also count.
                Frozen and canned plant foods count too.
              </p>
            </div>
          </div>

          {/* What doesn't count */}
          <div className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
                <Ban size={16} className="text-red-600" />
              </div>
              <h2 className="text-sm font-semibold text-app-text">What Doesn't Count</h2>
            </div>
            <p className="text-sm text-app-text-secondary leading-relaxed">
              Meat, fish, dairy, and ultra-processed plant foods (chips, white bread,
              fruit juice) don't count. This isn't about going vegan — just adding more
              plant variety alongside whatever else you eat.
            </p>
          </div>

          {/* Fermented */}
          <div className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                <FlaskConical size={16} className="text-purple-600" />
              </div>
              <h2 className="text-sm font-semibold text-app-text">Fermented Foods</h2>
            </div>
            <p className="text-sm text-app-text-secondary leading-relaxed">
              Fermented foods like kimchi, sauerkraut, and kombucha are tracked as a bonus —
              they don't count toward your plant score, but they add beneficial live bacteria
              directly to your gut.
            </p>
          </div>

          {/* Quick tips */}
          <div className="bg-app-surface border border-app-accent/20 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-app-accent/15 flex items-center justify-center">
                <Leaf size={16} className="text-app-accent" />
              </div>
              <h2 className="text-sm font-semibold text-app-accent">Quick Start Tips</h2>
            </div>
            <div className="text-sm text-app-text-secondary leading-relaxed space-y-2">
              <p>
                Tap the <strong className="text-app-text">+ Log Food</strong> button to start
                logging what you eat. Search from 300+ built-in foods or add your own.
              </p>
              <p>
                Save common combos as <strong className="text-app-text">Meals</strong> to
                log them in one tap next time.
              </p>
              <p>
                Check the <strong className="text-app-text">This Week</strong> tab anytime to
                see your score and what you've eaten each day.
              </p>
            </div>
          </div>

          {/* Your data */}
          <div className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <Smartphone size={16} className="text-amber-600" />
              </div>
              <h2 className="text-sm font-semibold text-app-text">Your Data</h2>
            </div>
            <div className="text-sm text-app-text-secondary leading-relaxed space-y-2">
              <p>
                All your data is stored locally on this device — nothing is sent to a server.
                If you clear your browser data or switch devices, your history will be lost.
              </p>
              <p>
                Use the <strong className="text-app-text">Export JSON</strong> option in Settings
                to back up your data. Save the file to your cloud storage (iCloud, Google Drive, etc.)
                so you can restore it anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky bottom CTA */}
        <div className="sticky bottom-0 bg-app-bg/95 backdrop-blur-sm border-t border-app-border p-4">
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-xl bg-app-accent hover:bg-app-accent-hover text-app-accent-text font-semibold text-sm transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}
