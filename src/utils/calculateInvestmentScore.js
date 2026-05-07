function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function normalizeMinMax(value, min, max, invert = false) {
  if (
    value === null ||
    value === undefined ||
    min === null ||
    min === undefined ||
    max === null ||
    max === undefined
  ) {
    return null
  }

  if (min === max) {
    return 1
  }

  const normalized = clamp((value - min) / (max - min), 0, 1)
  return invert ? 1 - normalized : normalized
}

function getMetricRange(properties, key) {
  const values = properties
    .map((property) => property[key])
    .filter((value) => Number.isFinite(value))

  return {
    min: values.length ? Math.min(...values) : null,
    max: values.length ? Math.max(...values) : null,
  }
}

export function calculateInvestmentScore(property, properties) {
  const noiRange = getMetricRange(properties, 'noi_actual')
  const expenseRatioRange = getMetricRange(properties, 'expense_ratio_actual')
  const upsideRange = getMetricRange(properties, 'in_place_annual_upside')

  const metricScores = [
    {
      score: Number.isFinite(property.physical_occupancy_pct)
        ? clamp(property.physical_occupancy_pct / 100, 0, 1)
        : null,
      weight: 25,
    },
    {
      score: normalizeMinMax(property.noi_actual, noiRange.min, noiRange.max),
      weight: 25,
    },
    {
      score: normalizeMinMax(
        property.expense_ratio_actual,
        expenseRatioRange.min,
        expenseRatioRange.max,
        true,
      ),
      weight: 15,
    },
    {
      score: Number.isFinite(property.dscr_current)
        ? clamp(property.dscr_current / 1.75, 0, 1)
        : null,
      weight: 20,
    },
    {
      score: normalizeMinMax(
        property.in_place_annual_upside,
        upsideRange.min,
        upsideRange.max,
      ),
      weight: 15,
    },
  ].filter((metric) => Number.isFinite(metric.score))

  if (!metricScores.length) {
    return 0
  }

  const totalWeight = metricScores.reduce((sum, metric) => sum + metric.weight, 0)
  const weightedScore = metricScores.reduce(
    (sum, metric) => sum + metric.score * metric.weight,
    0,
  )

  return Math.round(clamp((weightedScore / totalWeight) * 100, 0, 100))
}

export function getOpportunityLabel(score) {
  if (score >= 80) {
    return 'Strong Opportunity'
  }

  if (score >= 55) {
    return 'Medium Opportunity'
  }

  return 'Risky Opportunity'
}
