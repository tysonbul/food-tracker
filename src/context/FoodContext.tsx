import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { AppData, FoodEntry, FoodItem, Meal, UserSettings } from '../types'
import { loadData, saveData } from '../utils/storage'
import {
  getWeekStart,
  getEntriesForWeek,
  calculateWeekSummary,
  calculateStreak,
  getToday,
  getTotalUniquePlants,
} from '../utils/week'

interface FoodContextValue {
  data: AppData

  // Entry CRUD
  addEntry: (entry: Omit<FoodEntry, 'id'>) => void
  addEntries: (entries: Omit<FoodEntry, 'id'>[]) => void
  deleteEntry: (id: string) => void
  replaceData: (data: AppData) => void

  // Custom foods
  addCustomFood: (food: FoodItem) => void

  // Meals
  addMeal: (meal: Omit<Meal, 'id'>) => void
  updateMeal: (id: string, meal: Omit<Meal, 'id'>) => void
  deleteMeal: (id: string) => void

  // Settings
  updateSettings: (settings: Partial<UserSettings>) => void

  // Computed
  currentWeekStart: string
  currentWeekSummary: ReturnType<typeof calculateWeekSummary>
  streak: { current: number; longest: number }
  totalUniquePlants: number
}

const FoodContext = createContext<FoodContextValue | null>(null)

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(loadData)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    saveData(data)
  }, [data])

  const addEntry = useCallback((entry: Omit<FoodEntry, 'id'>) => {
    setData((prev) => ({
      ...prev,
      entries: [...prev.entries, { ...entry, id: crypto.randomUUID() }],
    }))
  }, [])

  const addEntries = useCallback((entries: Omit<FoodEntry, 'id'>[]) => {
    setData((prev) => ({
      ...prev,
      entries: [
        ...prev.entries,
        ...entries.map((e) => ({ ...e, id: crypto.randomUUID() })),
      ],
    }))
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      entries: prev.entries.filter((e) => e.id !== id),
    }))
  }, [])

  const replaceData = useCallback((newData: AppData) => {
    setData(newData)
  }, [])

  const addCustomFood = useCallback((food: FoodItem) => {
    setData((prev) => {
      // Don't add duplicates
      const exists = prev.customFoods.some(
        (f) => f.name.toLowerCase() === food.name.toLowerCase(),
      )
      if (exists) return prev
      return {
        ...prev,
        customFoods: [...prev.customFoods, { ...food, isCustom: true }],
      }
    })
  }, [])

  const addMeal = useCallback((meal: Omit<Meal, 'id'>) => {
    setData((prev) => ({
      ...prev,
      meals: [...prev.meals, { ...meal, id: crypto.randomUUID() }],
    }))
  }, [])

  const updateMeal = useCallback((id: string, meal: Omit<Meal, 'id'>) => {
    setData((prev) => ({
      ...prev,
      meals: prev.meals.map((m) => (m.id === id ? { ...meal, id } : m)),
    }))
  }, [])

  const deleteMeal = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      meals: prev.meals.filter((m) => m.id !== id),
    }))
  }, [])

  const updateSettings = useCallback((settings: Partial<UserSettings>) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }))
  }, [])

  const currentWeekStart = useMemo(
    () => getWeekStart(getToday(), data.settings.weekStartDay),
    [data.settings.weekStartDay],
  )

  const currentWeekEntries = useMemo(
    () => getEntriesForWeek(data.entries, currentWeekStart, data.settings.weekStartDay),
    [data.entries, currentWeekStart, data.settings.weekStartDay],
  )

  const currentWeekSummary = useMemo(
    () => calculateWeekSummary(currentWeekStart, currentWeekEntries),
    [currentWeekStart, currentWeekEntries],
  )

  const streak = useMemo(
    () => calculateStreak(data.entries, data.settings.weekStartDay),
    [data.entries, data.settings.weekStartDay],
  )

  const totalUniquePlants = useMemo(
    () => getTotalUniquePlants(data.entries),
    [data.entries],
  )

  return (
    <FoodContext.Provider
      value={{
        data,
        addEntry,
        addEntries,
        deleteEntry,
        replaceData,
        addCustomFood,
        addMeal,
        updateMeal,
        deleteMeal,
        updateSettings,
        currentWeekStart,
        currentWeekSummary,
        streak,
        totalUniquePlants,
      }}
    >
      {children}
    </FoodContext.Provider>
  )
}

export const useFood = (): FoodContextValue => {
  const ctx = useContext(FoodContext)
  if (!ctx) throw new Error('useFood must be used within FoodProvider')
  return ctx
}
