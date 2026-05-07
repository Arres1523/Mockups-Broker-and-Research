import { describe, expect, it } from 'vitest'
import { buildMarketMapPoints } from './marketMap'

describe('buildMarketMapPoints', () => {
  it('aggregates known markets into positioned map points ordered by count', () => {
    const points = buildMarketMapPoints([
      { market: 'HOUSTON, TX' },
      { market: 'HOUSTON, TX' },
      { market: 'PHOENIX, AZ' },
      { market: 'Unknown Market' },
    ])

    expect(points).toHaveLength(2)
    expect(points[0]).toMatchObject({
      market: 'HOUSTON, TX',
      count: 2,
      state: 'TX',
    })
    expect(points[0].x).toBeGreaterThan(0)
    expect(points[0].y).toBeGreaterThan(0)
    expect(points[1]).toMatchObject({
      market: 'PHOENIX, AZ',
      count: 1,
      state: 'AZ',
    })
  })

  it('returns an empty array when no known markets are available', () => {
    expect(buildMarketMapPoints([{ market: null }, { market: 'Unknown Market' }])).toEqual([])
  })
})
