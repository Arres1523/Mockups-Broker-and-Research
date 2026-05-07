import {
  formatCompactCurrency,
  formatCurrency,
  formatDscr,
  formatNumber,
  formatPercent,
} from '../utils/formatters'

function badgeClassName(label) {
  if (label === 'Strong Opportunity') {
    return 'bg-emerald-500/15 text-emerald-300'
  }

  if (label === 'Medium Opportunity') {
    return 'bg-amber-500/15 text-amber-300'
  }

  return 'bg-rose-500/15 text-rose-300'
}

export function PropertyTable({ properties }) {
  return (
    <section className="rounded-[1.75rem] border border-xcreos-border bg-xcreos-surface p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">Property table</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Comparable underwriting view</h3>
        </div>
        <p className="text-sm text-xcreos-muted">{properties.length} rows</p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-[1200px] table-fixed border-separate border-spacing-y-2 text-left">
          <thead className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">
            <tr>
              <th className="pb-3 font-semibold">Property</th>
              <th className="pb-3 font-semibold">Market</th>
              <th className="pb-3 font-semibold">Broker</th>
              <th className="pb-3 font-semibold">Units</th>
              <th className="pb-3 font-semibold">Year</th>
              <th className="pb-3 font-semibold">Occupancy</th>
              <th className="pb-3 font-semibold">NOI</th>
              <th className="pb-3 font-semibold">Expense Ratio</th>
              <th className="pb-3 font-semibold">DSCR</th>
              <th className="pb-3 font-semibold">Annual Upside</th>
              <th className="pb-3 font-semibold">Score</th>
              <th className="pb-3 font-semibold">View</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="rounded-2xl bg-black/30 text-sm text-white">
                <td className="rounded-l-2xl px-4 py-4 font-medium">{property.property_name}</td>
                <td className="px-4 py-4 text-xcreos-muted">{property.market}</td>
                <td className="px-4 py-4 text-xcreos-muted">{property.broker_name}</td>
                <td className="px-4 py-4">{formatNumber(property.units)}</td>
                <td className="px-4 py-4">{property.year_built ?? '—'}</td>
                <td className="px-4 py-4">{formatPercent(property.physical_occupancy_pct)}</td>
                <td className="px-4 py-4">{formatCurrency(property.noi_actual)}</td>
                <td className="px-4 py-4">{formatPercent(property.expense_ratio_actual)}</td>
                <td className="px-4 py-4">{formatDscr(property.dscr_current)}</td>
                <td className="px-4 py-4">{formatCompactCurrency(property.in_place_annual_upside)}</td>
                <td className="px-4 py-4 font-semibold text-xcreos-primary">
                  {property.investment_score}
                </td>
                <td className="rounded-r-2xl px-4 py-4">
                  <span className={`rounded-full px-3 py-2 text-xs font-semibold ${badgeClassName(property.opportunity_label)}`}>
                    {property.opportunity_label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
