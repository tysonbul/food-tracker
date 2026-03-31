import { LayoutDashboard, CalendarDays, UtensilsCrossed, Settings, Plus, type LucideIcon } from 'lucide-react'

export type View = 'thisweek' | 'history' | 'meals' | 'settings'

interface LayoutProps {
  view: View
  onNavigate: (view: View) => void
  onLogFood: () => void
  children: React.ReactNode
}

const NAV_ITEMS: { view: View; label: string; Icon: LucideIcon }[] = [
  { view: 'thisweek', label: 'This Week', Icon: LayoutDashboard },
  { view: 'history', label: 'History', Icon: CalendarDays },
  { view: 'meals', label: 'Meals', Icon: UtensilsCrossed },
  { view: 'settings', label: 'Settings', Icon: Settings },
]

export default function Layout({ view, onNavigate, onLogFood, children }: LayoutProps) {
  return (
    <div className="flex min-h-screen md:h-screen w-full overflow-x-hidden">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-[#1e2235] bg-[#0d1018]">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-[#1e2235]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-app-accent flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5" stroke="#0a0d14" strokeWidth="2" />
                <circle cx="7" cy="7" r="2" fill="#0a0d14" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">Food Tracker</span>
          </div>
        </div>

        {/* Log Food CTA */}
        <div className="px-3 pt-4">
          <button
            onClick={onLogFood}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-app-accent text-[#0a0d14] text-sm font-semibold hover:bg-app-accent-hover transition-all"
          >
            <Plus size={14} />
            Log Food
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ view: v, label, Icon }) => {
            const active = view === v
            return (
              <button
                key={v}
                onClick={() => onNavigate(v)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-app-accent-dim text-app-accent'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1e2e]'
                }`}
              >
                <Icon size={16} className={active ? 'text-app-accent' : ''} />
                {label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-x-hidden md:overflow-auto bg-[#0a0d14] pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden border-t border-[#1e2235] bg-[#0d1018]">
        {/* This Week */}
        <button
          onClick={() => onNavigate('thisweek')}
          className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-all ${
            view === 'thisweek' ? 'text-app-accent' : 'text-gray-500'
          }`}
        >
          <LayoutDashboard size={18} />
          Week
        </button>

        {/* History */}
        <button
          onClick={() => onNavigate('history')}
          className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-all ${
            view === 'history' ? 'text-app-accent' : 'text-gray-500'
          }`}
        >
          <CalendarDays size={18} />
          History
        </button>

        {/* Log Food CTA — center */}
        <button
          onClick={onLogFood}
          className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold text-app-accent"
        >
          <div className="w-8 h-8 rounded-xl bg-app-accent flex items-center justify-center -mt-1">
            <Plus size={16} className="text-[#0a0d14]" />
          </div>
          Log
        </button>

        {/* Meals */}
        <button
          onClick={() => onNavigate('meals')}
          className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-all ${
            view === 'meals' ? 'text-app-accent' : 'text-gray-500'
          }`}
        >
          <UtensilsCrossed size={18} />
          Meals
        </button>

        {/* Settings */}
        <button
          onClick={() => onNavigate('settings')}
          className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-all ${
            view === 'settings' ? 'text-app-accent' : 'text-gray-500'
          }`}
        >
          <Settings size={18} />
          Settings
        </button>
      </nav>
    </div>
  )
}
