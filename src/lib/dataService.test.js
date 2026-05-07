import { describe, expect, it, vi } from 'vitest'
import { sampleProperties } from '../test/fixtures'
import { loadExecutiveSummaries } from './dataService'

describe('loadExecutiveSummaries', () => {
  it('returns demo data when Supabase env vars are missing', async () => {
    const result = await loadExecutiveSummaries({
      hasSupabaseEnv: false,
      mockData: sampleProperties,
    })

    expect(result.source).toBe('mock')
    expect(result.reason).toBe('missing-env')
    expect(result.properties).toEqual(sampleProperties)
  })

  it('uses live Supabase rows when the query succeeds', async () => {
    const query = vi.fn().mockResolvedValue({ data: sampleProperties, error: null })

    const result = await loadExecutiveSummaries({
      hasSupabaseEnv: true,
      query,
      mockData: [],
    })

    expect(query).toHaveBeenCalledOnce()
    expect(result.source).toBe('supabase')
    expect(result.reason).toBe('live')
    expect(result.properties).toEqual(sampleProperties)
  })

  it('keeps the app usable with demo data when Supabase errors', async () => {
    const query = vi
      .fn()
      .mockResolvedValue({ data: null, error: new Error('network failure') })

    const result = await loadExecutiveSummaries({
      hasSupabaseEnv: true,
      query,
      mockData: sampleProperties,
    })

    expect(result.source).toBe('mock')
    expect(result.reason).toBe('query-error')
    expect(result.error).toBeInstanceOf(Error)
    expect(result.properties).toEqual(sampleProperties)
  })

  it('flags an empty database while still providing demo data', async () => {
    const query = vi.fn().mockResolvedValue({ data: [], error: null })

    const result = await loadExecutiveSummaries({
      hasSupabaseEnv: true,
      query,
      mockData: sampleProperties,
    })

    expect(result.source).toBe('mock')
    expect(result.reason).toBe('empty-database')
    expect(result.properties).toEqual(sampleProperties)
  })

  it('applies verified corrections for known extraction errors', async () => {
    const query = vi.fn().mockResolvedValue({
      data: [
        {
          property_name: 'The Verandahs at Hunt Club',
          market: 'APOPKA, FL',
          broker_name: 'JLL',
          units: 1,
          year_built: 1984,
        },
      ],
      error: null,
    })

    const result = await loadExecutiveSummaries({
      hasSupabaseEnv: true,
      query,
      mockData: [],
    })

    expect(result.properties[0].units).toBe(210)
  })
})
