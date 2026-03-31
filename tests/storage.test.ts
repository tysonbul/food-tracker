import { describe, it, expect, beforeEach } from 'vitest'
import { loadData, saveData, exportData, importData } from '../src/utils/storage'
import { AppData } from '../src/types'

beforeEach(() => {
  localStorage.clear()
})

describe('storage', () => {
  it('returns default data when localStorage is empty', () => {
    const data = loadData()
    expect(data.entries).toEqual([])
    expect(data.customFoods).toEqual([])
    expect(data.settings.weekStartDay).toBe(1)
    expect(data.version).toBe(1)
  })

  it('saves and loads data round-trip', () => {
    const testData: AppData = {
      entries: [
        { id: 'test-1', name: 'Apple', category: 'fruit', date: '2026-03-30' },
      ],
      customFoods: [],
      meals: [],
      settings: { weekStartDay: 1 },
      version: 1,
    }
    saveData(testData)
    const loaded = loadData()
    expect(loaded.entries).toHaveLength(1)
    expect(loaded.entries[0].name).toBe('Apple')
  })

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('food-tracker-v1', '{invalid json')
    const data = loadData()
    expect(data.entries).toEqual([])
  })

  it('migrates data missing customFoods field', () => {
    const legacy = JSON.stringify({ entries: [], settings: { weekStartDay: 1 }, version: 1 })
    localStorage.setItem('food-tracker-v1', legacy)
    const data = loadData()
    expect(data.customFoods).toEqual([])
  })

  it('migrates data missing meals field', () => {
    const legacy = JSON.stringify({ entries: [], customFoods: [], settings: { weekStartDay: 1 }, version: 1 })
    localStorage.setItem('food-tracker-v1', legacy)
    const data = loadData()
    expect(data.meals).toEqual([])
  })

  it('exports data as formatted JSON', () => {
    const testData: AppData = {
      entries: [],
      customFoods: [],
      meals: [],
      settings: { weekStartDay: 1 },
      version: 1,
    }
    const json = exportData(testData)
    expect(JSON.parse(json)).toEqual(testData)
  })

  it('imports valid JSON data', () => {
    const testData: AppData = {
      entries: [
        { id: '1', name: 'Banana', category: 'fruit', date: '2026-03-30' },
      ],
      customFoods: [],
      meals: [],
      settings: { weekStartDay: 1 },
      version: 1,
    }
    const result = importData(JSON.stringify(testData))
    expect(result).not.toBeNull()
    expect(result!.entries).toHaveLength(1)
  })

  it('returns null for invalid import data', () => {
    expect(importData('not json')).toBeNull()
    expect(importData('{}')).toBeNull()
  })
})
