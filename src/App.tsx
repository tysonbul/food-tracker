import { useState } from 'react'
import { FoodProvider, useFood } from './context/FoodContext'
import Layout, { View } from './components/Layout'
import ThisWeekView from './components/ThisWeek/ThisWeekView'
import HistoryView from './components/History/HistoryView'
import MealsView from './components/Meals/MealsView'
import SettingsView from './components/Settings/SettingsView'
import DiscoverView from './components/Discover/DiscoverView'
import LogEntryModal from './components/LogEntry/LogEntryModal'
import PWAUpdatePrompt from './components/PWAUpdatePrompt'
import WelcomeModal, { hasSeenWelcome } from './components/WelcomeModal'
import { getToday } from './utils/week'

function AppContent() {
  const [view, setView] = useState<View>('thisweek')
  const [showLogModal, setShowLogModal] = useState(false)
  const [showWelcome, setShowWelcome] = useState(() => !hasSeenWelcome())
  const [showDiscover, setShowDiscover] = useState(false)
  const { addEntry } = useFood()

  return (
    <>
      <Layout view={view} onNavigate={(v) => { setView(v); setShowDiscover(false) }} onLogFood={() => setShowLogModal(true)}>
        {showDiscover ? (
          <DiscoverView
            onBack={() => setShowDiscover(false)}
            onLogFood={(food) => {
              addEntry({
                name: food.name,
                category: food.category,
                date: getToday(),
                isCustom: food.isCustom,
              })
              // Stay on discover so they can keep browsing
            }}
          />
        ) : (
          <>
            {view === 'thisweek' && <ThisWeekView onOpenDiscover={() => setShowDiscover(true)} />}
            {view === 'history' && <HistoryView />}
            {view === 'meals' && <MealsView />}
            {view === 'settings' && <SettingsView />}
          </>
        )}
      </Layout>

      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}

      {showLogModal && (
        <LogEntryModal
          onClose={() => setShowLogModal(false)}
          onSave={() => {
            setShowLogModal(false)
            setView('thisweek')
          }}
          onCreateMeal={() => {
            setShowLogModal(false)
            setView('meals')
          }}
        />
      )}
    </>
  )
}

export default function App() {
  return (
    <FoodProvider>
      <AppContent />
      <PWAUpdatePrompt />
    </FoodProvider>
  )
}
