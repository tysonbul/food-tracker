import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { FoodProvider, useFood } from '../src/context/FoodContext'

beforeEach(() => {
  localStorage.clear()
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FoodProvider>{children}</FoodProvider>
)

describe('FoodContext', () => {
  it('starts with empty entries', () => {
    const { result } = renderHook(() => useFood(), { wrapper })
    expect(result.current.data.entries).toEqual([])
  })

  it('adds an entry', () => {
    const { result } = renderHook(() => useFood(), { wrapper })
    act(() => {
      result.current.addEntry({
        name: 'Apple',
        category: 'fruit',
        date: '2026-03-30',
      })
    })
    expect(result.current.data.entries).toHaveLength(1)
    expect(result.current.data.entries[0].name).toBe('Apple')
    expect(result.current.data.entries[0].id).toBeDefined()
  })

  it('adds multiple entries at once', () => {
    const { result } = renderHook(() => useFood(), { wrapper })
    act(() => {
      result.current.addEntries([
        { name: 'Apple', category: 'fruit', date: '2026-03-30' },
        { name: 'Banana', category: 'fruit', date: '2026-03-30' },
        { name: 'Broccoli', category: 'vegetable', date: '2026-03-30' },
      ])
    })
    expect(result.current.data.entries).toHaveLength(3)
  })

  it('deletes an entry', () => {
    const { result } = renderHook(() => useFood(), { wrapper })
    act(() => {
      result.current.addEntry({
        name: 'Banana',
        category: 'fruit',
        date: '2026-03-30',
      })
    })
    const id = result.current.data.entries[0].id
    act(() => {
      result.current.deleteEntry(id)
    })
    expect(result.current.data.entries).toHaveLength(0)
  })

  it('adds a custom food', () => {
    const { result } = renderHook(() => useFood(), { wrapper })
    act(() => {
      result.current.addCustomFood({
        name: 'Dragon Fruit Smoothie',
        category: 'fruit',
        isCustom: true,
      })
    })
    expect(result.current.data.customFoods).toHaveLength(1)
    expect(result.current.data.customFoods[0].name).toBe('Dragon Fruit Smoothie')
  })

  it('does not add duplicate custom foods', () => {
    const { result } = renderHook(() => useFood(), { wrapper })
    act(() => {
      result.current.addCustomFood({ name: 'Kale Chips', category: 'vegetable', isCustom: true })
    })
    act(() => {
      result.current.addCustomFood({ name: 'kale chips', category: 'vegetable', isCustom: true })
    })
    expect(result.current.data.customFoods).toHaveLength(1)
  })

  it('updates settings', () => {
    const { result } = renderHook(() => useFood(), { wrapper })
    expect(result.current.data.settings.weekStartDay).toBe(1)
    act(() => {
      result.current.updateSettings({ weekStartDay: 0 })
    })
    expect(result.current.data.settings.weekStartDay).toBe(0)
  })

  it('adds a meal', () => {
    const { result } = renderHook(() => useFood(), { wrapper })
    act(() => {
      result.current.addMeal({
        name: 'Morning Smoothie',
        items: [
          { name: 'Banana', category: 'fruit' },
          { name: 'Spinach', category: 'vegetable' },
          { name: 'Chia Seed', category: 'seed' },
        ],
      })
    })
    expect(result.current.data.meals).toHaveLength(1)
    expect(result.current.data.meals[0].name).toBe('Morning Smoothie')
    expect(result.current.data.meals[0].items).toHaveLength(3)
  })

  it('updates a meal', () => {
    const { result } = renderHook(() => useFood(), { wrapper })
    act(() => {
      result.current.addMeal({
        name: 'Salad',
        items: [{ name: 'Kale', category: 'vegetable' }],
      })
    })
    const id = result.current.data.meals[0].id
    act(() => {
      result.current.updateMeal(id, {
        name: 'Super Salad',
        items: [
          { name: 'Kale', category: 'vegetable' },
          { name: 'Tomato', category: 'fruit' },
        ],
      })
    })
    expect(result.current.data.meals[0].name).toBe('Super Salad')
    expect(result.current.data.meals[0].items).toHaveLength(2)
  })

  it('deletes a meal', () => {
    const { result } = renderHook(() => useFood(), { wrapper })
    act(() => {
      result.current.addMeal({
        name: 'Test Meal',
        items: [{ name: 'Apple', category: 'fruit' }],
      })
    })
    const id = result.current.data.meals[0].id
    act(() => {
      result.current.deleteMeal(id)
    })
    expect(result.current.data.meals).toHaveLength(0)
  })

  it('replaces all data', () => {
    const { result } = renderHook(() => useFood(), { wrapper })
    act(() => {
      result.current.replaceData({
        entries: [
          { id: 'x', name: 'Kale', category: 'vegetable', date: '2026-03-30' },
          { id: 'y', name: 'Mango', category: 'fruit', date: '2026-03-30' },
        ],
        customFoods: [],
        meals: [],
        settings: { weekStartDay: 1 },
        version: 1,
      })
    })
    expect(result.current.data.entries).toHaveLength(2)
  })
})
