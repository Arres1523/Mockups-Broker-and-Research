import { describe, expect, it } from 'vitest'
import { sampleProperties } from '../test/fixtures'
import {
  calculateInvestmentScore,
  getOpportunityLabel,
} from './calculateInvestmentScore'

describe('calculateInvestmentScore', () => {
  it('returns bounded scores and rewards stronger fundamentals', () => {
    const weak = calculateInvestmentScore(sampleProperties[1], sampleProperties)
    const strong = calculateInvestmentScore(sampleProperties[2], sampleProperties)

    expect(weak).toBeGreaterThanOrEqual(0)
    expect(strong).toBeLessThanOrEqual(100)
    expect(strong).toBeGreaterThan(weak)
  })

  it('maps score thresholds to opportunity labels', () => {
    expect(getOpportunityLabel(92)).toBe('Strong Opportunity')
    expect(getOpportunityLabel(72)).toBe('Medium Opportunity')
    expect(getOpportunityLabel(40)).toBe('Risky Opportunity')
  })

  it('ignores missing metrics instead of treating them as zero performance', () => {
    const result = calculateInvestmentScore(
      {
        property_name: 'Source-backed asset',
        physical_occupancy_pct: 95,
        noi_actual: 1000000,
        expense_ratio_actual: 40,
        dscr_current: null,
        in_place_annual_upside: 150000,
      },
      [
        {
          property_name: 'Source-backed asset',
          physical_occupancy_pct: 95,
          noi_actual: 1000000,
          expense_ratio_actual: 40,
          dscr_current: null,
          in_place_annual_upside: 150000,
        },
      ],
    )

    expect(result).toBe(98)
  })
})
