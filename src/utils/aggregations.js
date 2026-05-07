function average(values) {
  if (!values.length) {
    return null
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function sumBy(properties, key) {
  return properties.reduce((sum, property) => sum + (property[key] ?? 0), 0)
}

export function summarizePortfolio(properties) {
  const totalProperties = properties.length

  return {
    totalProperties,
    totalUnits: sumBy(properties, 'units'),
    averageOccupancy: average(
      properties
        .map((property) => property.physical_occupancy_pct)
        .filter((value) => Number.isFinite(value)),
    ),
    totalNoi: sumBy(properties, 'noi_actual'),
    averageExpenseRatio: average(
      properties
        .map((property) => property.expense_ratio_actual)
        .filter((value) => Number.isFinite(value)),
    ),
    averageDscr: average(
      properties
        .map((property) => property.dscr_current)
        .filter((value) => Number.isFinite(value)),
    ),
    totalAnnualUpside: sumBy(properties, 'in_place_annual_upside'),
  }
}

function groupCounts(properties, key, label) {
  const counts = properties.reduce((accumulator, property) => {
    const value = property[key] || 'Unknown'
    accumulator[value] = (accumulator[value] || 0) + 1
    return accumulator
  }, {})

  return Object.entries(counts)
    .map(([name, count]) => ({ [label]: name, count }))
    .sort((left, right) => right.count - left.count || String(left[label]).localeCompare(String(right[label])))
}

export function buildMarketDistribution(properties) {
  return groupCounts(properties, 'market', 'market')
}

export function buildBrokerDistribution(properties) {
  return groupCounts(properties, 'broker_name', 'broker')
}

export function buildPropertyComparisonSeries(properties, key, limit = 8) {
  return [...properties]
    .filter((property) => Number.isFinite(property[key]))
    .sort((left, right) => right[key] - left[key])
    .slice(0, limit)
    .map((property) => ({
      propertyName: property.property_name,
      value: property[key],
    }))
}

export function getUniqueOptions(properties, key, allLabel) {
  const values = new Set()

  for (const property of properties) {
    if (property[key]) {
      values.add(property[key])
    }
  }

  return [allLabel, ...Array.from(values).sort((left, right) => left.localeCompare(right))]
}
