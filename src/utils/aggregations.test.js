import { describe, expect, it } from 'vitest'
import { sampleProperties } from '../test/fixtures'
import {
  buildBrokerDistribution,
  buildMarketDistribution,
  buildPropertyComparisonSeries,
  summarizePortfolio,
} from './aggregations'

describe('aggregations', () => {
  it('summarizes the visible portfolio metrics', () => {
    const summary = summarizePortfolio(sampleProperties)

    expect(summary.totalProperties).toBe(3)
    expect(summary.totalUnits).toBe(672)
    expect(summary.averageOccupancy).toBeCloseTo(91.67, 1)
    expect(summary.totalNoi).toBe(4250000)
    expect(summary.averageExpenseRatio).toBeCloseTo(42, 1)
    expect(summary.averageDscr).toBeCloseTo(1.59, 2)
    expect(summary.totalAnnualUpside).toBe(1110000)
  })

  it('builds market and broker distributions', () => {
    expect(buildMarketDistribution(sampleProperties)).toEqual([
      { market: 'Dallas, TX', count: 2 },
      { market: 'Austin, TX', count: 1 },
    ])

    expect(buildBrokerDistribution(sampleProperties)).toEqual([
      { broker: 'CBRE', count: 1 },
      { broker: 'JLL', count: 1 },
      { broker: 'Newmark', count: 1 },
    ])
  })

  it('creates sorted property comparison series', () => {
    const series = buildPropertyComparisonSeries(sampleProperties, 'noi_actual', 2)

    expect(series).toEqual([
      { propertyName: 'River Walk Commons', value: 1820000 },
      { propertyName: 'Sunset Ridge', value: 1450000 },
    ])
  })

  it('returns null averages when a metric is missing across the full set', () => {
    const summary = summarizePortfolio(
      sampleProperties.map((property) => ({
        ...property,
        dscr_current: null,
      })),
    )

    expect(summary.averageDscr).toBeNull()
  })
})
