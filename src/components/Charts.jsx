import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  buildBrokerDistribution,
  buildPropertyComparisonSeries,
} from '../utils/aggregations'
import { buildMarketMapPoints } from '../utils/marketMap'
import { formatCompactCurrency, formatDscr, formatPercent } from '../utils/formatters'

const marketColors = ['#FF7A0D', '#FF9640', '#FFB56F', '#FFD3AC', '#D57B2D']

function ChartShell({ title, subtitle, children, heightClassName = 'h-80' }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-[#171717] bg-[linear-gradient(180deg,rgba(11,11,11,0.98),rgba(7,7,7,0.98))] p-5 shadow-[0_8px_28px_rgba(0,0,0,0.24)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">{subtitle}</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <div className={`mt-5 ${heightClassName}`}>{children}</div>
    </article>
  )
}

function chartTheme() {
    return {
    stroke: '#242424',
    axis: '#8b847d',
    tooltipStyle: {
      backgroundColor: '#0D0D0D',
      border: '1px solid #22180F',
      borderRadius: '16px',
      color: '#FFFFFF',
    },
  }
}

function EmptyChartState({ message }) {
  return (
    <div className="flex h-full items-center justify-center rounded-[1.5rem] border border-dashed border-white/8 bg-black/20 px-6 text-center">
      <p className="max-w-sm text-sm text-xcreos-muted">{message}</p>
    </div>
  )
}

function ComparisonBarChart({ data, formatter, emptyMessage }) {
  const theme = chartTheme()

  if (!data.length) {
    return <EmptyChartState message={emptyMessage} />
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
        <CartesianGrid horizontal stroke={theme.stroke} vertical={false} />
        <XAxis type="number" stroke={theme.axis} tickFormatter={formatter} />
        <YAxis
          dataKey="propertyName"
          type="category"
          stroke={theme.axis}
          width={120}
          tickLine={false}
        />
        <Tooltip
          contentStyle={theme.tooltipStyle}
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          formatter={(value) => formatter(value)}
        />
        <Bar dataKey="value" radius={[0, 12, 12, 0]} fill="#FF7A0D" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function MarketShape() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1000 620"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="market-surface" x1="120" y1="120" x2="860" y2="520" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A140F" />
          <stop offset="0.4" stopColor="#121212" />
          <stop offset="1" stopColor="#090909" />
        </linearGradient>
      </defs>
      <path
        d="M82 387L76 352L84 319L107 287L141 287L172 266L216 267L248 243L288 244L313 216L380 205L432 177L490 177L545 156L604 143L684 146L740 160L785 156L834 171L877 206L888 246L879 274L844 288L827 320L824 354L796 374L771 413L721 426L701 459L645 461L617 454L581 467L542 454L513 462L469 450L420 460L381 449L337 457L291 444L258 448L215 436L186 439L159 422L125 419L98 405L82 387Z"
        fill="url(#market-surface)"
        stroke="#2A2A2A"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path
        d="M139 454L171 438L201 450L200 482L168 494L144 486L139 454Z"
        fill="url(#market-surface)"
        stroke="#2A2A2A"
        strokeWidth="6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MarketCoverageMap({ properties }) {
  const points = buildMarketMapPoints(properties)
  const [activeMarketId, setActiveMarketId] = useState(null)

  if (!points.length) {
    return <EmptyChartState message="No market distribution is available for the current filters." />
  }

  const topMarket = points[0]
  const maxCount = topMarket.count
  const totalMapped = points.reduce((sum, point) => sum + point.count, 0)
  const highlightedMarket = points.find((point) => point.market === activeMarketId) ?? topMarket
  const share = Math.round((highlightedMarket.count / totalMapped) * 100)

  return (
    <div className="grid h-full min-h-0 gap-3 xl:grid-cols-[minmax(0,1.3fr)_220px]">
      <div className="relative h-full overflow-hidden rounded-[1.6rem] border border-[#22170f] bg-[radial-gradient(circle_at_top_left,_rgba(255,122,13,0.18),_transparent_38%),linear-gradient(180deg,_rgba(18,14,11,0.96),_rgba(7,7,7,0.98))]">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div className="absolute left-5 top-5 z-20 rounded-full border border-[#322115] bg-[rgba(33,18,8,0.52)] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#b4977d]">
          Markets covered
        </div>
        <div className="absolute inset-x-4 bottom-4 top-11">
          <MarketShape />
        </div>

        <div className="absolute inset-x-4 bottom-4 top-11 z-20">
          {points.map((point, index) => {
            const isActive = highlightedMarket.market === point.market
            const size = 14 + (point.count / maxCount) * 10

            return (
              <button
                key={point.market}
                type="button"
                aria-label={`${point.market}: ${point.count} properties`}
                className="group absolute -translate-x-1/2 -translate-y-1/2 text-left"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                onMouseEnter={() => setActiveMarketId(point.market)}
                onFocus={() => setActiveMarketId(point.market)}
                onClick={() => setActiveMarketId(point.market)}
              >
                <span
                  className={`absolute left-1/2 top-1/2 rounded-full blur-md transition ${
                    isActive ? 'opacity-80' : 'opacity-45 group-hover:opacity-70'
                  }`}
                  style={{
                    width: `${size * 1.7}px`,
                    height: `${size * 1.7}px`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(255, 122, 13, 0.3)',
                  }}
                />
                <span
                  className={`relative flex items-center justify-center rounded-full border border-[#f5d3ae]/30 font-semibold text-[#1d1208] shadow-[0_0_18px_rgba(255,122,13,0.28)] transition ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: marketColors[index % marketColors.length],
                  }}
                >
                  <span className="text-[10px]">{point.count}</span>
                </span>
                {isActive ? (
                  <span
                    className={`pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] transition ${
                      isActive ? 'bg-[#f6dcc0] text-[#201207]' : 'bg-black/60 text-white/70'
                    }`}
                  >
                    {point.state}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid min-h-0 auto-rows-min gap-3">
        <div className="rounded-[1.45rem] border border-[#1d1d1d] bg-[linear-gradient(180deg,rgba(14,14,14,0.96),rgba(8,8,8,0.98))] p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">Selected market</p>
          <h4 className="mt-2 text-xl font-semibold text-white">{highlightedMarket.market}</h4>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">Properties</p>
              <p className="mt-2 text-2xl font-semibold text-white">{highlightedMarket.count}</p>
            </div>
            <div className="rounded-2xl border border-[#2a1a10] bg-[rgba(33,18,8,0.28)] p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">Share</p>
              <p className="mt-2 text-2xl font-semibold text-xcreos-primary">{share}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[1.35rem] border border-[#1d1d1d] bg-[linear-gradient(180deg,rgba(14,14,14,0.96),rgba(8,8,8,0.98))] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">Markets covered</p>
            <p className="mt-2 text-2xl font-semibold text-white">{points.length}</p>
          </div>
          <div className="rounded-[1.35rem] border border-[#1d1d1d] bg-[linear-gradient(180deg,rgba(14,14,14,0.96),rgba(8,8,8,0.98))] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">Mapped assets</p>
            <p className="mt-2 text-2xl font-semibold text-white">{totalMapped}</p>
          </div>
        </div>

        <div className="min-h-0 rounded-[1.45rem] border border-[#1d1d1d] bg-[linear-gradient(180deg,rgba(14,14,14,0.96),rgba(8,8,8,0.98))] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">Top clusters</p>
            <p className="truncate text-xs text-xcreos-muted">{topMarket.market}</p>
          </div>
          <div className="mt-4 grid gap-2">
            {points.slice(0, 3).map((point, index) => {
              const pointShare = (point.count / maxCount) * 100

              return (
                <button
                  key={point.market}
                  type="button"
                  className={`grid gap-2 rounded-2xl border px-3 py-2.5 text-left transition ${
                    highlightedMarket.market === point.market
                      ? 'border-xcreos-primary/35 bg-[rgba(255,122,13,0.08)]'
                      : 'border-white/6 bg-white/[0.02] hover:border-white/12'
                  }`}
                  onMouseEnter={() => setActiveMarketId(point.market)}
                  onFocus={() => setActiveMarketId(point.market)}
                  onClick={() => setActiveMarketId(point.market)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{point.market}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-xcreos-muted">{point.state}</p>
                    </div>
                    <span className="text-base font-semibold text-white">{point.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/6">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pointShare}%`,
                        backgroundColor: marketColors[index % marketColors.length],
                      }}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Charts({ properties }) {
  const noiSeries = buildPropertyComparisonSeries(properties, 'noi_actual')
  const occupancySeries = buildPropertyComparisonSeries(properties, 'physical_occupancy_pct')
  const dscrSeries = buildPropertyComparisonSeries(properties, 'dscr_current')
  const upsideSeries = buildPropertyComparisonSeries(properties, 'in_place_annual_upside')
  const expenseSeries = buildPropertyComparisonSeries(properties, 'expense_ratio_actual')
  const brokerSeries = buildBrokerDistribution(properties)
  const hasDscrValues = properties.some((property) => Number.isFinite(property.dscr_current))
  const theme = chartTheme()
  const defaultEmptyMessage = 'No source-backed values are available for this metric.'

  return (
    <section className="grid gap-4 2xl:grid-cols-2">
      <ChartShell title="NOI by Property" subtitle="Financial strength">
        <ComparisonBarChart
          data={noiSeries}
          formatter={formatCompactCurrency}
          emptyMessage={defaultEmptyMessage}
        />
      </ChartShell>

      <ChartShell title="Occupancy by Property" subtitle="Operational performance">
        <ComparisonBarChart
          data={occupancySeries}
          formatter={formatPercent}
          emptyMessage={defaultEmptyMessage}
        />
      </ChartShell>

      {hasDscrValues ? (
        <ChartShell title="DSCR by Property" subtitle="Debt coverage">
          <ComparisonBarChart
            data={dscrSeries}
            formatter={formatDscr}
            emptyMessage="No DSCR values were extracted from the current source files."
          />
        </ChartShell>
      ) : null}

      <ChartShell title="Annual Upside by Property" subtitle="Growth potential">
        <ComparisonBarChart
          data={upsideSeries}
          formatter={formatCompactCurrency}
          emptyMessage={defaultEmptyMessage}
        />
      </ChartShell>

      <ChartShell title="Expense Ratio Comparison" subtitle="Cost discipline">
        <ComparisonBarChart
          data={expenseSeries}
          formatter={formatPercent}
          emptyMessage={defaultEmptyMessage}
        />
      </ChartShell>

      <ChartShell title="Properties by Market" subtitle="Geographic split" heightClassName="h-[28rem]">
        <MarketCoverageMap properties={properties} />
      </ChartShell>

      <div className="2xl:col-span-2">
        <ChartShell title="Broker Contribution by Property Count" subtitle="Channel mix">
          {brokerSeries.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brokerSeries} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                <CartesianGrid vertical={false} stroke={theme.stroke} />
                <XAxis dataKey="broker" stroke={theme.axis} tickLine={false} axisLine={false} />
                <YAxis stroke={theme.axis} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={theme.tooltipStyle}
                  formatter={(value) => `${value} properties`}
                />
                <Bar dataKey="count" fill="#FF7A0D" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState message="No broker distribution is available for the current filters." />
          )}
        </ChartShell>
      </div>
    </section>
  )
}
