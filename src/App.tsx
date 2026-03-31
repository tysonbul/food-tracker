import { useState } from 'react'
import { FoodProvider } from './context/FoodContext'
import Layout, { View } from './components/Layout'
import ThisWeekView from './components/ThisWeek/ThisWeekView'
import HistoryView from './components/History/HistoryView'
import MealsView from './components/Meals/MealsView'
import SettingsView from './components/Settings/SettingsView'
import LogEntryModal from './components/LogEntry/LogEntryModal'
import PWAUpdatePrompt from './components/PWAUpdatePrompt'

function AppContent() {
  const [view, setView] = useState<View>('thisweek')
  const [showLogModal, setShowLogModal] = useState(false)

  return (
    <>
      <Layout view={view} onNavigate={setView} onLogFood={() => setShowLogModal(true)}>
        {view === 'thisweek' && <ThisWeekView />}
        {view === 'history' && <HistoryView />}
        {view === 'meals' && <MealsView />}
        {view === 'settings' && <SettingsView />}
      </Layout>

      {showLogModal && (
        <LogEntryModal
          onClose={() => setShowLogModal(false)}
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
