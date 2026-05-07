import { describe, expect, it } from 'vitest'
import {
  normalizeResearchRow,
  normalizeZillowMetadata,
  parseDecimalComma,
} from './marketResearchData'

describe('marketResearchData', () => {
  it('parses decimal comma values as numbers', () => {
    expect(parseDecimalComma('4908492,116509')).toBeCloseTo(4908492.116509)
    expect(parseDecimalComma('0,262810')).toBeCloseTo(0.26281)
  })

  it('keeps ZIP values as five-character strings', () => {
    const row = normalizeResearchRow({ ZIP: '123', Score: '78,1' })

    expect(row.zip).toBe('00123')
  })

  it('joins Zillow metadata to matching ZIP rows', () => {
    const metadata = normalizeZillowMetadata([
      {
        RegionName: '11976',
        City: 'Water Mill',
        State: 'NY',
        Metro: 'New York-Newark-Jersey City, NY-NJ-PA',
        CountyName: 'Suffolk County',
      },
    ])
    const row = normalizeResearchRow({ ZIP: '11976', Score: '78,1' }, metadata)

    expect(row.city).toBe('Water Mill')
    expect(row.state).toBe('NY')
    expect(row.metro).toBe('New York-Newark-Jersey City, NY-NJ-PA')
    expect(row.county).toBe('Suffolk County')
  })

  it('falls back to Unknown when metadata is missing', () => {
    const row = normalizeResearchRow({ ZIP: '90210', Score: '70,0' })

    expect(row.city).toBe('Unknown')
    expect(row.state).toBe('Unknown')
    expect(row.metro).toBe('Unknown')
    expect(row.county).toBe('Unknown')
  })
})
