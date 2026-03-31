import { describe, it, expect } from 'vitest'
import {
  getWeekStart,
  getWeekEnd,
  formatWeekRange,
  calculateWeekSummary,
  getEntriesForWeek,
  getTotalUniquePlants,
} from '../src/utils/week'
import { FoodEntry } from '../src/types'

describe('getWeekStart', () => {
  it('returns Monday for a Wednesday (weekStartDay=1)', () => {
    // 2026-04-01 is a Wednesday
    expect(getWeekStart('2026-04-01', 1)).toBe('2026-03-30')
  })

  it('returns Monday for a Monday (weekStartDay=1)', () => {
    expect(getWeekStart('2026-03-30', 1)).toBe('2026-03-30')
  })

  it('returns Sunday for a Wednesday (weekStartDay=0)', () => {
    // 2026-04-01 is Wednesday, previous Sunday is 2026-03-29
    expect(getWeekStart('2026-04-01', 0)).toBe('2026-03-29')
  })

  it('returns Sunday for a Sunday (weekStartDay=0)', () => {
    expect(getWeekStart('2026-03-29', 0)).toBe('2026-03-29')
  })
})

describe('getWeekEnd', () => {
  it('returns 6 days after week start', () => {
    expect(getWeekEnd('2026-03-30')).toBe('2026-04-05')
  })
})

describe('formatWeekRange', () => {
  it('formats same-month range', () => {
    expect(formatWeekRange('2026-03-02', '2026-03-08')).toBe('Mar 2 – 8')
  })

  it('formats cross-month range', () => {
    expect(formatWeekRange('2026-03-30', '2026-04-05')).toBe('Mar 30 – Apr 5')
  })
})

describe('calculateWeekSummary', () => {
  it('counts unique plants at 1 point each', () => {
    const entries: FoodEntry[] = [
      { id: '1', name: 'Apple', category: 'fruit', date: '2026-03-30' },
      { id: '2', name: 'Banana', category: 'fruit', date: '2026-03-31' },
      { id: '3', name: 'Broccoli', category: 'vegetable', date: '2026-03-31' },
    ]
    const summary = calculateWeekSummary('2026-03-30', entries)
    expect(summary.totalPoints).toBe(3)
    expect(summary.uniquePlantCount).toBe(3)
    expect(summary.goalMet).toBe(false)
  })

  it('deduplicates by name (case-insensitive)', () => {
    const entries: FoodEntry[] = [
      { id: '1', name: 'Apple', category: 'fruit', date: '2026-03-30' },
      { id: '2', name: 'apple', category: 'fruit', date: '2026-03-31' },
      { id: '3', name: 'APPLE', category: 'fruit', date: '2026-04-01' },
    ]
    const summary = calculateWeekSummary('2026-03-30', entries)
    expect(summary.totalPoints).toBe(1)
    expect(summary.uniquePlantCount).toBe(1)
  })

  it('scores herbs/spices at 0.25 points', () => {
    const entries: FoodEntry[] = [
      { id: '1', name: 'Basil', category: 'herb_spice', date: '2026-03-30' },
      { id: '2', name: 'Cumin', category: 'herb_spice', date: '2026-03-30' },
      { id: '3', name: 'Thyme', category: 'herb_spice', date: '2026-03-30' },
      { id: '4', name: 'Oregano', category: 'herb_spice', date: '2026-03-30' },
    ]
    const summary = calculateWeekSummary('2026-03-30', entries)
    expect(summary.totalPoints).toBe(1)
  })

  it('scores fermented foods at 0 points', () => {
    const entries: FoodEntry[] = [
      { id: '1', name: 'Kimchi', category: 'fermented', date: '2026-03-30' },
      { id: '2', name: 'Apple', category: 'fruit', date: '2026-03-30' },
    ]
    const summary = calculateWeekSummary('2026-03-30', entries)
    expect(summary.totalPoints).toBe(1)
    expect(summary.uniquePlantCount).toBe(1)
  })

  it('detects goal met at 30 points', () => {
    const entries: FoodEntry[] = Array.from({ length: 30 }, (_, i) => ({
      id: `${i}`,
      name: `Plant ${i}`,
      category: 'fruit' as const,
      date: '2026-03-30',
    }))
    const summary = calculateWeekSummary('2026-03-30', entries)
    expect(summary.totalPoints).toBe(30)
    expect(summary.goalMet).toBe(true)
  })
})

describe('getEntriesForWeek', () => {
  it('filters entries to the correct week', () => {
    const entries: FoodEntry[] = [
      { id: '1', name: 'Apple', category: 'fruit', date: '2026-03-30' }, // Mon
      { id: '2', name: 'Banana', category: 'fruit', date: '2026-04-05' }, // Sun (same week)
      { id: '3', name: 'Cherry', category: 'fruit', date: '2026-04-06' }, // Mon (next week)
    ]
    const weekEntries = getEntriesForWeek(entries, '2026-03-30', 1)
    expect(weekEntries).toHaveLength(2)
    expect(weekEntries.map((e) => e.name)).toContain('Apple')
    expect(weekEntries.map((e) => e.name)).toContain('Banana')
  })
})

describe('getTotalUniquePlants', () => {
  it('counts unique plant names across all entries', () => {
    const entries: FoodEntry[] = [
      { id: '1', name: 'Apple', category: 'fruit', date: '2026-03-01' },
      { id: '2', name: 'apple', category: 'fruit', date: '2026-03-15' },
      { id: '3', name: 'Banana', category: 'fruit', date: '2026-03-20' },
      { id: '4', name: 'Kimchi', category: 'fermented', date: '2026-03-20' },
    ]
    expect(getTotalUniquePlants(entries)).toBe(2) // Apple + Banana, not Kimchi
  })
})
