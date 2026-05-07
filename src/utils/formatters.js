const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const numberFormatter = new Intl.NumberFormat('en-US')

export function formatCurrency(value) {
  return Number.isFinite(value) ? currencyFormatter.format(value) : '—'
}

export function formatCompactCurrency(value) {
  return Number.isFinite(value) ? compactCurrencyFormatter.format(value) : '—'
}

export function formatNumber(value) {
  return Number.isFinite(value) ? numberFormatter.format(value) : '—'
}

export function formatPercent(value, digits = 1) {
  return Number.isFinite(value) ? `${value.toFixed(digits)}%` : '—'
}

export function formatDscr(value) {
  return Number.isFinite(value) ? value.toFixed(2) : '—'
}
