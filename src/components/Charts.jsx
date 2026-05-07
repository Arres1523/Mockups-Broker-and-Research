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

const marketColors = ['#FF6B00', '#FF8A3D', '#FFB169', '#FFD1A6', '#C76A24']

function ChartShell({ title, subtitle, children }) {
  return (
    <article className="rounded-[1.75rem] border border-xcreos-border bg-xcreos-surface p-5">
      <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">{subtitle}</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <div className="mt-5 h-80">{children}</div>
    </article>
  )
}

function chartTheme() {
  return {
    stroke: '#3A3A3A',
    axis: '#888888',
    tooltipStyle: {
      backgroundColor: '#0D0D0D',
      border: '1px solid #2A2A2A',
      borderRadius: '16px',
      color: '#FFFFFF',
    },
  }
}

function EmptyChartState({ message }) {
  return (
    <div className="flex h-full items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-black/20 px-6 text-center">
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
        <Bar dataKey="value" radius={[0, 12, 12, 0]} fill="#FF6B00" />
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
          <stop stopColor="#141414" />
          <stop offset="1" stopColor="#0A0A0A" />
        </linearGradient>
      </defs>
      <path
        d="M123 185L148 160L214 162L272 125L349 121L385 141L444 136L505 157L578 155L625 171L676 171L735 198L791 214L861 210L898 235L887 281L840 302L826 338L831 394L806 430L773 440L751 471L692 476L645 462L607 474L566 454L508 468L458 447L415 452L362 436L300 437L253 410L212 402L170 370L155 333L126 313L111 274L118 224L123 185Z"
        fill="url(#market-surface)"
        stroke="#2A2A2A"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path
        d="M155 495L194 468L238 480L243 520L190 542L155 495Z"
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
    <div className="grid h-full gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(250px,0.95fr)]">
      <div className="relative overflow-hidden rounded-[1.6rem] border border-white/8 bg-[radial-gradient(circle_at_top,_rgba(255,107,0,0.16),_transparent_42%),linear-gradient(180deg,_rgba(18,18,18,0.95),_rgba(6,6,6,0.98))]">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div className="absolute left-5 top-5 z-20 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-xcreos-muted">
          Markets covered
        </div>
        <MarketShape />

        <div className="absolute inset-0 z-20">
          {points.map((point, index) => {
            const isActive = highlightedMarket.market === point.market
            const size = 16 + (point.count / maxCount) * 16

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
                    width: `${size * 1.9}px`,
                    height: `${size * 1.9}px`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(255, 107, 0, 0.28)',
                  }}
                />
                <span
                  className={`relative flex items-center justify-center rounded-full border border-white/18 font-semibold text-black shadow-[0_0_18px_rgba(255,107,0,0.28)] transition ${
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
                {index < 4 ? (
                  <span
                    className={`pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] transition ${
                      isActive ? 'bg-white text-black' : 'bg-black/60 text-white/70'
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

      <div className="grid gap-3">
        <div className="rounded-[1.45rem] border border-white/8 bg-black/25 p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">Selected market</p>
          <h4 className="mt-2 text-xl font-semibold text-white">{highlightedMarket.market}</h4>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">Properties</p>
              <p className="mt-2 text-2xl font-semibold text-white">{highlightedMarket.count}</p>
            </div>
            <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">Share</p>
              <p className="mt-2 text-2xl font-semibold text-xcreos-primary">{share}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[1.35rem] border border-white/8 bg-black/25 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">Markets covered</p>
            <p className="mt-2 text-2xl font-semibold text-white">{points.length}</p>
          </div>
          <div className="rounded-[1.35rem] border border-white/8 bg-black/25 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">Mapped assets</p>
            <p className="mt-2 text-2xl font-semibold text-white">{totalMapped}</p>
          </div>
        </div>

        <div className="rounded-[1.45rem] border border-white/8 bg-black/25 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">Top clusters</p>
            <p className="text-xs text-xcreos-muted">{topMarket.market}</p>
          </div>
          <div className="mt-4 grid gap-3">
            {points.slice(0, 5).map((point, index) => {
              const pointShare = (point.count / maxCount) * 100

              return (
                <button
                  key={point.market}
                  type="button"
                  className={`grid gap-2 rounded-2xl border px-3 py-3 text-left transition ${
                    highlightedMarket.market === point.market
                      ? 'border-xcreos-primary/35 bg-xcreos-primary/10'
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
                    <span className="text-lg font-semibold text-white">{point.count}</span>
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

      <ChartShell title="DSCR by Property" subtitle="Debt coverage">
        <ComparisonBarChart
          data={dscrSeries}
          formatter={formatDscr}
          emptyMessage="No DSCR values were extracted from the current source files."
        />
      </ChartShell>

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

      <ChartShell title="Properties by Market" subtitle="Geographic split">
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
                <Bar dataKey="count" fill="#FF6B00" radius={[12, 12, 0, 0]} />
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
