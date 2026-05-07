export const UNKNOWN_VALUE = 'Unknown'

const NUMERIC_FIELDS = {
  price: 'Price',
  rent: 'Rent',
  rentYield: 'Rent_Yield',
  fhfaGrowth: 'FHFA_Growth',
  volatility: 'Volatility',
  appreciation1Y: 'Appreciation_1Y',
  appreciation3Y: 'Appreciation_3Y',
  hudRent: 'HUD_Rent',
  rentGap: 'Rent_Gap',
  yieldScore: 'Yield_N',
  appreciationScore: 'Appreciation_N',
  rentGapScore: 'RentGap_N',
  volatilityScore: 'Volatility_N',
  score: 'Score',
  stability: 'Stability',
  balancedScore: 'Balanced_Score',
}

export const researchSortOptions = [
  { label: 'Score', value: 'score' },
  { label: 'Balanced Score', value: 'balancedScore' },
  { label: 'Rent Yield', value: 'rentYield' },
  { label: '1Y Appreciation', value: 'appreciation1Y' },
  { label: 'Rent Gap', value: 'rentGap' },
  { label: 'Stability', value: 'stability' },
  { label: 'Price', value: 'price' },
  { label: 'Rent', value: 'rent' },
]

export function parseDecimalComma(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  const trimmed = String(value ?? '').trim()

  if (!trimmed) {
    return null
  }

  const normalized = trimmed.includes(',')
    ? trimmed.replace(/\./g, '').replace(',', '.')
    : trimmed
  const parsed = Number(normalized)

  return Number.isFinite(parsed) ? parsed : null
}

export function formatZip(value) {
  const digits = String(value ?? '').trim().replace(/\D/g, '')
  return digits ? digits.padStart(5, '0').slice(-5) : ''
}

function cleanText(value) {
  const text = String(value ?? '').trim()
  return text || UNKNOWN_VALUE
}

export function normalizeZillowMetadata(rows) {
  return rows.reduce((metadata, row) => {
    const zip = formatZip(row.RegionName)

    if (!zip) {
      return metadata
    }

    metadata[zip] = {
      city: cleanText(row.City),
      state: cleanText(row.State || row.StateName),
      metro: cleanText(row.Metro),
      county: cleanText(row.CountyName),
    }

    return metadata
  }, {})
}

export function normalizeResearchRow(row, metadataByZip = {}) {
  const zip = formatZip(row.ZIP)
  const metadata = metadataByZip[zip] || {}
  const normalized = {
    zip,
    city: cleanText(metadata.city),
    state: cleanText(metadata.state),
    metro: cleanText(metadata.metro),
    county: cleanText(metadata.county),
  }

  Object.entries(NUMERIC_FIELDS).forEach(([target, source]) => {
    normalized[target] = parseDecimalComma(row[source])
  })

  return normalized
}

export function normalizeResearchRows(rows, metadataByZip = {}) {
  return rows
    .map((row) => normalizeResearchRow(row, metadataByZip))
    .filter((row) => row.zip)
    .sort((left, right) => (right.score ?? -Infinity) - (left.score ?? -Infinity))
}

export function summarizeResearchRows(rows) {
  const median = (values) => {
    const sorted = values.filter(Number.isFinite).sort((left, right) => left - right)

    if (!sorted.length) {
      return null
    }

    const middle = Math.floor(sorted.length / 2)
    return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle]
  }

  const average = (values) => {
    const cleanValues = values.filter(Number.isFinite)
    return cleanValues.length
      ? cleanValues.reduce((sum, value) => sum + value, 0) / cleanValues.length
      : null
  }

  return {
    zipCount: rows.length,
    stateCount: new Set(rows.map((row) => row.state).filter((state) => state !== UNKNOWN_VALUE)).size,
    metroCount: new Set(rows.map((row) => row.metro).filter((metro) => metro !== UNKNOWN_VALUE)).size,
    medianPrice: median(rows.map((row) => row.price)),
    medianRent: median(rows.map((row) => row.rent)),
    medianYield: median(rows.map((row) => row.rentYield)),
    averageScore: average(rows.map((row) => row.score)),
    medianAppreciation: median(rows.map((row) => row.appreciation1Y)),
    averageStability: average(rows.map((row) => row.stability)),
  }
}

export function getResearchOptions(rows, field, allLabel) {
  return [
    allLabel,
    ...Array.from(
      new Set(rows.map((row) => row[field]).filter((value) => value && value !== UNKNOWN_VALUE)),
    ).sort((left, right) => left.localeCompare(right)),
  ]
}

export function filterAndSortResearchRows(rows, filters) {
  const search = String(filters.search || '').trim().toLowerCase()
  const scoreMin = parseDecimalComma(filters.scoreMin)
  const scoreMax = parseDecimalComma(filters.scoreMax)
  const yieldMin = parseDecimalComma(filters.yieldMin)
  const yieldMax = parseDecimalComma(filters.yieldMax)
  const sortBy = filters.sortBy || 'score'

  return rows
    .filter((row) => {
      const matchesSearch =
        !search ||
        row.zip.includes(search) ||
        row.city.toLowerCase().includes(search) ||
        row.metro.toLowerCase().includes(search) ||
        row.county.toLowerCase().includes(search)
      const matchesState = !filters.state || filters.state === 'All States' || row.state === filters.state
      const matchesMetro = !filters.metro || filters.metro === 'All Metros' || row.metro === filters.metro
      const matchesScoreMin = scoreMin == null || (row.score ?? -Infinity) >= scoreMin
      const matchesScoreMax = scoreMax == null || (row.score ?? Infinity) <= scoreMax
      const matchesYieldMin = yieldMin == null || (row.rentYield ?? -Infinity) * 100 >= yieldMin
      const matchesYieldMax = yieldMax == null || (row.rentYield ?? Infinity) * 100 <= yieldMax

      return (
        matchesSearch &&
        matchesState &&
        matchesMetro &&
        matchesScoreMin &&
        matchesScoreMax &&
        matchesYieldMin &&
        matchesYieldMax
      )
    })
    .sort((left, right) => {
      const leftValue = left[sortBy] ?? -Infinity
      const rightValue = right[sortBy] ?? -Infinity
      return rightValue - leftValue || left.zip.localeCompare(right.zip)
    })
}

export function groupResearchRows(rows, field, valueField = 'score') {
  const groups = rows.reduce((accumulator, row) => {
    const key = row[field] || UNKNOWN_VALUE

    if (key === UNKNOWN_VALUE) {
      return accumulator
    }

    if (!accumulator[key]) {
      accumulator[key] = {
        name: key,
        count: 0,
        totalScore: 0,
        totalValue: 0,
        valueCount: 0,
      }
    }

    accumulator[key].count += 1

    if (Number.isFinite(row.score)) {
      accumulator[key].totalScore += row.score
    }

    if (Number.isFinite(row[valueField])) {
      accumulator[key].totalValue += row[valueField]
      accumulator[key].valueCount += 1
    }

    return accumulator
  }, {})

  return Object.values(groups)
    .map((group) => ({
      name: group.name,
      count: group.count,
      averageScore: group.totalScore / group.count,
      value: group.valueCount ? group.totalValue / group.valueCount : null,
    }))
    .sort((left, right) => right.averageScore - left.averageScore || right.count - left.count)
}
