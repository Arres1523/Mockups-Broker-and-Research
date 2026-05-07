import { formatCompactCurrency, formatDscr, formatNumber, formatPercent } from '../utils/formatters'

function badgeClassName(label) {
  if (label === 'Strong Opportunity') {
    return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  }

  if (label === 'Medium Opportunity') {
    return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
  }

  return 'bg-rose-500/15 text-rose-300 border-rose-500/30'
}

function Metric({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  )
}

export function PropertyCard({ property }) {
  return (
    <article
      data-testid="property-card"
      className="rounded-md border border-xcreos-border bg-xcreos-surface p-5 shadow-none"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-xcreos-muted">
            {property.market}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">
            {property.property_name}
          </h3>
          <p className="mt-2 text-sm text-xcreos-muted">{property.broker_name}</p>
        </div>

        <div className={`rounded-md border px-3 py-2 text-xs font-semibold ${badgeClassName(property.opportunity_label)}`}>
          {property.opportunity_label}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-white">Investment Score</span>
          <span className="font-semibold text-xcreos-primary">{property.investment_score}/100</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1f1f1f]">
          <div
            className="h-full rounded-full bg-xcreos-primary"
            style={{ width: `${property.investment_score}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Metric label="Units" value={formatNumber(property.units)} />
        <Metric label="Occupancy" value={formatPercent(property.physical_occupancy_pct)} />
        <Metric label="NOI" value={formatCompactCurrency(property.noi_actual)} />
        <Metric label="Expense Ratio" value={formatPercent(property.expense_ratio_actual)} />
        <Metric label="DSCR" value={formatDscr(property.dscr_current)} />
        <Metric label="Annual Upside" value={formatCompactCurrency(property.in_place_annual_upside)} />
      </div>
    </article>
  )
}
