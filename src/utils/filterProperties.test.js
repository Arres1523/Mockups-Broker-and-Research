import { describe, expect, it } from 'vitest'
import { sampleProperties } from '../test/fixtures'
import { filterAndSortProperties } from './filterProperties'

describe('filterAndSortProperties', () => {
  it('combines search, filters, and sorting in one pass', () => {
    const results = filterAndSortProperties(sampleProperties, {
      search: 'river',
      market: 'Dallas, TX',
      broker: 'All Brokers',
      occupancyMin: 85,
      occupancyMax: 95,
      dscrMin: 1.5,
      dscrMax: 2,
      yearBuiltMin: 2010,
      yearBuiltMax: 2020,
      sortBy: 'in_place_annual_upside',
      sortDirection: 'desc',
    })

    expect(results).toHaveLength(1)
    expect(results[0].property_name).toBe('River Walk Commons')
  })

  it('sorts by metric descending by default for ranking views', () => {
    const results = filterAndSortProperties(sampleProperties, {
      search: '',
      market: 'All Markets',
      broker: 'All Brokers',
      occupancyMin: 0,
      occupancyMax: 100,
      dscrMin: 0,
      dscrMax: 10,
      yearBuiltMin: 1900,
      yearBuiltMax: 2100,
      sortBy: 'noi_actual',
      sortDirection: 'desc',
    })

    expect(results.map((property) => property.property_name)).toEqual([
      'River Walk Commons',
      'Sunset Ridge',
      'Harbor Point',
    ])
  })

  it('excludes missing DSCR values when a DSCR filter is active', () => {
    const results = filterAndSortProperties(
      [
        ...sampleProperties,
        {
          ...sampleProperties[0],
          id: 'prop-4',
          property_name: 'No DSCR Asset',
          dscr_current: null,
        },
      ],
      {
        search: '',
        market: 'All Markets',
        broker: 'All Brokers',
        occupancyMin: '',
        occupancyMax: '',
        dscrMin: 1.2,
        dscrMax: 2,
        yearBuiltMin: '',
        yearBuiltMax: '',
        sortBy: 'dscr_current',
        sortDirection: 'desc',
      },
    )

    expect(results.map((property) => property.property_name)).not.toContain('No DSCR Asset')
  })
})
