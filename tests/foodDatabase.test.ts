import { describe, it, expect } from 'vitest'
import { ALL_FOODS, FOOD_GROUPS, CATEGORY_META, CATEGORY_ORDER } from '../src/data/foodDatabase'

describe('foodDatabase', () => {
  it('has a substantial number of foods', () => {
    expect(ALL_FOODS.length).toBeGreaterThan(250)
  })

  it('has all categories represented', () => {
    const categories = new Set(ALL_FOODS.map((f) => f.category))
    for (const cat of CATEGORY_ORDER) {
      expect(categories.has(cat)).toBe(true)
    }
  })

  it('has metadata for all categories', () => {
    for (const cat of CATEGORY_ORDER) {
      expect(CATEGORY_META[cat]).toBeDefined()
      expect(CATEGORY_META[cat].label).toBeTruthy()
      expect(CATEGORY_META[cat].emoji).toBeTruthy()
    }
  })

  it('has no duplicate food names within the same category', () => {
    for (const group of FOOD_GROUPS) {
      const names = group.items.map((n) => n.toLowerCase())
      const unique = new Set(names)
      expect(unique.size).toBe(names.length)
    }
  })

  it('includes key foods from each group', () => {
    const names = ALL_FOODS.map((f) => f.name.toLowerCase())
    // Spot check essential items
    expect(names).toContain('apple')
    expect(names).toContain('broccoli')
    expect(names).toContain('quinoa')
    expect(names).toContain('chickpea')
    expect(names).toContain('almond')
    expect(names).toContain('chia seed')
    expect(names).toContain('basil')
    expect(names).toContain('coffee')
    expect(names).toContain('kimchi')
  })
})
