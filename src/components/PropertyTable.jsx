import {
  formatCompactCurrency,
  formatCurrency,
  formatDscr,
  formatNumber,
  formatPercent,
} from '../utils/formatters'

function badgeClassName(label) {
  if (label === 'Strong Opportunity') {
    return 'border-emerald-500/20 bg-emerald-500/15 text-emerald-300'
  }

  if (label === 'Medium Opportunity') {
    return 'border-amber-500/20 bg-amber-500/15 text-amber-300'
  }

  return 'border-rose-500/20 bg-rose-500/15 text-rose-300'
}

function scoreClassName(score) {
  if (score >= 85) {
    return 'text-emerald-300'
  }

  if (score >= 70) {
    return 'text-xcreos-primary'
  }

  return 'text-amber-300'
}

export function PropertyTable({ properties, totalProperties, viewOptions, currentView, onViewChange }) {
  return (
    <section className="rounded-md border border-xcreos-border bg-xcreos-surface p-5 shadow-none sm:p-6">
      <div className="flex flex-col gap-4 border-b border-xcreos-border pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-xcreos-muted">Property table</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">
            Comparable underwriting view
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-md border border-xcreos-border bg-[#090909] p-1">
            {viewOptions.map((option) => {
              const isActive = currentView === option.value

              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => onViewChange(option.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-xcreos-primary text-black'
                      : 'text-xcreos-muted hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
          <div className="inline-flex items-center gap-3 rounded-md border border-xcreos-border bg-[#090909] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-xcreos-primary" />
            <p className="text-sm text-xcreos-muted">
              {properties.length} of {totalProperties} rows
            </p>
          </div>
        </div>
      </div>

      <div className="xcreos-scrollbar mt-6 overflow-x-auto pb-2">
        <table className="min-w-[1360px] table-fixed border-separate border-spacing-y-3 text-left">
          <colgroup>
            <col className="w-[24%]" />
            <col className="w-[17%]" />
            <col className="w-[11%]" />
            <col className="w-[6%]" />
            <col className="w-[7%]" />
            <col className="w-[9%]" />
            <col className="w-[11%]" />
            <col className="w-[10%]" />
            <col className="w-[7%]" />
            <col className="w-[11%]" />
            <col className="w-[7%]" />
            <col className="w-[16%]" />
          </colgroup>
          <thead className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">
            <tr>
              <th className="pb-3 pl-4 font-semibold">Property</th>
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
              <th className="pb-3 pr-4 font-semibold">View</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property, index) => (
              <tr
                key={property.id}
                className="rounded-md bg-[#0b0b0b] text-sm text-white transition hover:bg-[#101010]"
              >
                <td className="rounded-l-md border border-r-0 border-xcreos-border px-4 py-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex min-w-9 justify-center rounded-md border border-xcreos-border bg-[#111111] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-xcreos-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[1.05rem] font-semibold tracking-[-0.02em] text-white">
                        {property.property_name}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-xcreos-muted">
                        Underwriting candidate
                      </p>
                    </div>
                  </div>
                </td>
                <td className="border border-l-0 border-r-0 border-xcreos-border px-4 py-4 text-xcreos-muted">
                  {property.market || '—'}
                </td>
                <td className="border border-l-0 border-r-0 border-xcreos-border px-4 py-4 text-xcreos-muted">
                  {property.broker_name || '—'}
                </td>
                <td className="border border-l-0 border-r-0 border-xcreos-border px-4 py-4 font-medium">
                  {formatNumber(property.units)}
                </td>
                <td className="border border-l-0 border-r-0 border-xcreos-border px-4 py-4">
                  {property.year_built ?? '—'}
                </td>
                <td className="border border-l-0 border-r-0 border-xcreos-border px-4 py-4 font-medium">
                  {formatPercent(property.physical_occupancy_pct)}
                </td>
                <td className="border border-l-0 border-r-0 border-xcreos-border px-4 py-4 font-medium">
                  {formatCurrency(property.noi_actual)}
                </td>
                <td className="border border-l-0 border-r-0 border-xcreos-border px-4 py-4 font-medium">
                  {formatPercent(property.expense_ratio_actual)}
                </td>
                <td className="border border-l-0 border-r-0 border-xcreos-border px-4 py-4 font-medium">
                  {formatDscr(property.dscr_current)}
                </td>
                <td className="border border-l-0 border-r-0 border-xcreos-border px-4 py-4 font-medium">
                  {formatCompactCurrency(property.in_place_annual_upside)}
                </td>
                <td
                  className={`border border-l-0 border-r-0 border-xcreos-border px-4 py-4 text-lg font-semibold ${scoreClassName(property.investment_score)}`}
                >
                  {property.investment_score}
                </td>
                <td className="rounded-r-md border border-l-0 border-xcreos-border px-4 py-4">
                  <span
                    className={`inline-flex rounded-md border px-3 py-2 text-xs font-semibold ${badgeClassName(property.opportunity_label)}`}
                  >
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
