function numericOrFallback(value, fallback) {
  if (value === '' || value === null || value === undefined) {
    return fallback
  }

  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : fallback
}

function hasActiveRange(minValue, maxValue) {
  return minValue !== '' || maxValue !== ''
}

function matchesNumericRange(value, minValue, maxValue, defaultMin, defaultMax) {
  if (!hasActiveRange(minValue, maxValue)) {
    return true
  }

  if (!Number.isFinite(value)) {
    return false
  }

  const min = numericOrFallback(minValue, defaultMin)
  const max = numericOrFallback(maxValue, defaultMax)
  return value >= min && value <= max
}

export function filterAndSortProperties(properties, filters) {
  const {
    search,
    market,
    broker,
    occupancyMin,
    occupancyMax,
    dscrMin,
    dscrMax,
    yearBuiltMin,
    yearBuiltMax,
    sortBy,
    sortDirection,
  } = filters

  const normalizedSearch = search.trim().toLowerCase()

  const filtered = properties.filter((property) => {
    const matchesSearch =
      !normalizedSearch ||
      property.property_name?.toLowerCase().includes(normalizedSearch)
    const matchesMarket = market === 'All Markets' || property.market === market
    const matchesBroker = broker === 'All Brokers' || property.broker_name === broker
    const matchesOccupancy = matchesNumericRange(
      property.physical_occupancy_pct,
      occupancyMin,
      occupancyMax,
      0,
      100,
    )
    const matchesDscr = matchesNumericRange(
      property.dscr_current,
      dscrMin,
      dscrMax,
      0,
      Number.POSITIVE_INFINITY,
    )
    const matchesYearBuilt = matchesNumericRange(
      property.year_built,
      yearBuiltMin,
      yearBuiltMax,
      0,
      Number.POSITIVE_INFINITY,
    )

    return (
      matchesSearch &&
      matchesMarket &&
      matchesBroker &&
      matchesOccupancy &&
      matchesDscr &&
      matchesYearBuilt
    )
  })

  const direction = sortDirection === 'asc' ? 1 : -1

  return filtered.sort((left, right) => {
    const leftValue = left[sortBy]
    const rightValue = right[sortBy]

    if (typeof leftValue === 'string' || typeof rightValue === 'string') {
      return String(leftValue).localeCompare(String(rightValue)) * direction
    }

    const leftMissing = !Number.isFinite(leftValue)
    const rightMissing = !Number.isFinite(rightValue)

    if (leftMissing && rightMissing) {
      return String(left.property_name).localeCompare(String(right.property_name))
    }

    if (leftMissing) {
      return 1
    }

    if (rightMissing) {
      return -1
    }

    return (leftValue - rightValue) * direction
  })
}
