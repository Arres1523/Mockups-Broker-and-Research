import { mockExecutiveSummaries } from '../data/mockExecutiveSummaries'
import { hasSupabaseEnv, supabase } from './supabaseClient'

const NUMERIC_FIELDS = [
  'units',
  'year_built',
  'physical_occupancy_pct',
  'noi_actual',
  'expense_ratio_actual',
  'dscr_current',
  'in_place_annual_upside',
]

const VERIFIED_CORRECTIONS = {
  'The Verandahs at Hunt Club': {
    units: 210,
  },
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const normalized = String(value).replace(/[$,%\s,]/g, '')
  const numeric = Number(normalized)
  return Number.isFinite(numeric) ? numeric : null
}

function normalizePercent(value) {
  if (!Number.isFinite(value)) {
    return value
  }

  return value <= 1 ? value * 100 : value
}

function normalizeRecord(property) {
  const normalized = { ...property }

  for (const field of NUMERIC_FIELDS) {
    normalized[field] = toNumber(property[field])
  }

  normalized.physical_occupancy_pct = normalizePercent(normalized.physical_occupancy_pct)
  normalized.expense_ratio_actual = normalizePercent(normalized.expense_ratio_actual)
  normalized.property_name =
    normalized.property_name || normalized.source_folder_name || 'Unnamed Property'

  return {
    ...normalized,
    ...(VERIFIED_CORRECTIONS[normalized.property_name] ?? {}),
  }
}

function buildFallback(properties, reason, error = null) {
  return {
    properties: properties.map(normalizeRecord),
    source: 'mock',
    reason,
    error,
  }
}

function defaultQuery() {
  return supabase
    .from('executive_summaries')
    .select('*')
    .order('noi_actual', { ascending: false, nullsFirst: false })
}

export async function loadExecutiveSummaries({
  hasSupabaseEnv: hasEnv = hasSupabaseEnv,
  query = defaultQuery,
  mockData = mockExecutiveSummaries,
} = {}) {
  if (!hasEnv) {
    return buildFallback(mockData, 'missing-env')
  }

  try {
    const { data, error } = await query()

    if (error) {
      return buildFallback(mockData, 'query-error', error)
    }

    if (!Array.isArray(data) || data.length === 0) {
      return buildFallback(mockData, 'empty-database')
    }

    return {
      properties: data.map(normalizeRecord),
      source: 'supabase',
      reason: 'live',
      error: null,
    }
  } catch (error) {
    return buildFallback(mockData, 'query-error', error)
  }
}
