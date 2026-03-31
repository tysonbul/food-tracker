import { ChevronLeft, Leaf, Scale, Flame, Ban, FlaskConical, Smartphone } from 'lucide-react'
import { CATEGORY_META, CATEGORY_ORDER } from '../../data/foodDatabase'
import { getPointValue } from '../../types'
import { useFood } from '../../context/FoodContext'

interface HowItWorksViewProps {
  onBack: () => void
}

export default function HowItWorksView({ onBack }: HowItWorksViewProps) {
  const { data } = useFood()
  const goal = data.settings.weeklyGoal

  return (
    <div className="p-5 max-w-lg mx-auto space-y-5 pb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1 text-app-text-muted hover:text-app-text transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-app-text">How It Works</h1>
      </div>

      {/* The goal */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-app-accent/15 flex items-center justify-center">
            <Leaf size={16} className="text-app-accent" />
          </div>
          <h2 className="text-sm font-semibold text-app-text">The Plant Diversity Goal</h2>
        </div>
        <p className="text-sm text-app-text-secondary leading-relaxed">
          Research from the American Gut Project found that people who eat 30 or more
          different plant foods per week have significantly more diverse gut microbiomes
          than those who eat fewer than 10. But the relationship is a gradient — even
          modest increases in variety help.
        </p>
        <p className="text-sm text-app-text-secondary leading-relaxed">
          Your current goal is <strong className="text-app-text">{goal} plants/week</strong>.
          You can change this anytime in Settings.
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
          Each unique plant food you eat in a week counts towards your score. Only unique
          names count — eating an apple on Monday and Tuesday still counts as 1 point.
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
            All whole plant foods count — fruits, vegetables, whole grains, legumes,
            nuts, seeds, herbs, and spices. Different varieties count separately
            (e.g. red and green bell peppers = 2 plants).
          </p>
          <p>
            Plant-derived foods like coffee, tea, and dark chocolate (70%+) also count as
            1 point each.
          </p>
          <p>
            Frozen and canned plant foods count too, as long as they're not heavily processed.
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
        <div className="text-sm text-app-text-secondary leading-relaxed space-y-2">
          <p>
            Meat, fish, and dairy don't count toward your plant goal. This isn't about
            going vegan — you can eat meat and still hit your target. The count focuses
            specifically on plant diversity.
          </p>
          <p>
            Ultra-processed plant foods don't count either — potato chips, refined white
            bread, and fruit juice have lost most of their fiber and microbiome benefits.
          </p>
        </div>
      </div>

      {/* Fermented foods */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
            <FlaskConical size={16} className="text-purple-600" />
          </div>
          <h2 className="text-sm font-semibold text-app-text">Fermented Foods</h2>
        </div>
        <p className="text-sm text-app-text-secondary leading-relaxed">
          Fermented foods like kimchi, sauerkraut, miso, and kombucha don't technically
          count toward your plant score. However, they're tracked as a bonus because
          they add beneficial live bacteria directly to your gut — complementing the
          fiber diversity from plants.
        </p>
      </div>

      {/* Tips */}
      <div className="bg-app-surface border border-app-accent/20 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-app-accent">Tips for Hitting Your Goal</h2>
        <div className="text-sm text-app-text-secondary leading-relaxed space-y-2">
          <p>
            Use the <strong className="text-app-text">Meals</strong> feature to save common combos and
            log them in one tap.
          </p>
          <p>
            Herbs and spices add up: using 4 different spices in a single dish = 1 full point.
          </p>
          <p>
            Mixed salads, stir-fries, and smoothies are easy ways to hit 5-10 plants
            in a single meal.
          </p>
          <p>
            Don't forget about your morning coffee or tea — they count too!
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
            to back up your data regularly. Save the file to your cloud storage (iCloud, Google
            Drive, Dropbox, etc.) so you can restore it later with <strong className="text-app-text">Import JSON</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
