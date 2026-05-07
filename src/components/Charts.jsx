import { useState } from 'react'
import { geoAlbersUsa, geoPath } from 'd3-geo'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { feature, mesh } from 'topojson-client'
import usAtlas from 'us-atlas/states-10m.json'
import {
  buildBrokerDistribution,
  buildPropertyComparisonSeries,
} from '../utils/aggregations'
import { buildMarketMapPoints } from '../utils/marketMap'
import { formatCompactCurrency, formatDscr, formatPercent } from '../utils/formatters'

const marketColors = ['#D57B2D', '#3B82F6', '#22C55E', '#A78BFA', '#F59E0B']
const mapWidth = 960
const mapHeight = 560
const stateGeoJson = feature(usAtlas, usAtlas.objects.states)
const stateBorders = mesh(usAtlas, usAtlas.objects.states, (left, right) => left !== right)
const projection = geoAlbersUsa().fitSize([mapWidth, mapHeight], stateGeoJson)
const usaPath = geoPath(projection)

function ChartShell({ title, subtitle, children, heightClassName = 'h-80' }) {
  return (
    <article className="overflow-hidden rounded-md border border-xcreos-border bg-xcreos-surface p-5 shadow-none">
      <p className="text-[11px] uppercase tracking-[0.12em] text-xcreos-muted">{subtitle}</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <div className={`mt-5 ${heightClassName}`}>{children}</div>
    </article>
  )
}

function chartTheme() {
  return {
    stroke: '#2a2a2a',
    axis: '#8a8f98',
    tooltipStyle: {
      backgroundColor: '#111111',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      color: '#FFFFFF',
    },
  }
}

function EmptyChartState({ message }) {
  return (
    <div className="flex h-full items-center justify-center rounded-md border border-dashed border-xcreos-border bg-[#090909] px-6 text-center">
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
        <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#D57B2D" />
      </BarChart>
    </ResponsiveContainer>
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
  const projectedPoints = points
    .map((point) => {
      const coordinates = projection([point.longitude, point.latitude])

      if (!coordinates) {
        return null
      }

      return {
        ...point,
        x: coordinates[0],
        y: coordinates[1],
      }
    })
    .filter(Boolean)

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="relative h-full overflow-hidden rounded-md border border-xcreos-border bg-[#0a0a0a]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div className="absolute left-5 top-5 z-20 rounded-md border border-xcreos-border bg-[#111111] px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-xcreos-muted">
          Markets covered
        </div>
        <svg
          aria-label="United States market coverage map"
          className="absolute inset-x-4 bottom-4 top-12 z-10 h-[calc(100%-4rem)] w-[calc(100%-2rem)]"
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          role="img"
        >
          <defs>
            <linearGradient id="usa-state-fill" x1="140" y1="70" x2="810" y2="500" gradientUnits="userSpaceOnUse">
              <stop stopColor="#171717" />
              <stop offset="0.35" stopColor="#111111" />
              <stop offset="1" stopColor="#080808" />
            </linearGradient>
            <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g>
            {stateGeoJson.features.map((state) => (
              <path
                key={state.id}
                d={usaPath(state)}
                fill="url(#usa-state-fill)"
                stroke="#2B2B2B"
                strokeWidth="0.8"
              />
            ))}
            <path d={usaPath(stateBorders)} fill="none" stroke="#343434" strokeWidth="0.9" />
          </g>
          <g filter="url(#map-glow)">
            {projectedPoints.map((point, index) => {
            const isActive = highlightedMarket.market === point.market
            const size = 14 + (point.count / maxCount) * 10

            return (
              <g
                key={point.market}
                onMouseEnter={() => setActiveMarketId(point.market)}
                onFocus={() => setActiveMarketId(point.market)}
                onClick={() => setActiveMarketId(point.market)}
                tabIndex={0}
                role="button"
                aria-label={`${point.market}: ${point.count} properties`}
                className="cursor-pointer outline-none"
              >
                <circle cx={point.x} cy={point.y} r={size * 1.05} fill="rgba(213,123,45,0.16)" opacity={isActive ? 1 : 0.55} />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? size * 0.62 : size * 0.5}
                  fill={marketColors[index % marketColors.length]}
                  stroke="#111111"
                  strokeWidth="1.2"
                />
                <text
                  x={point.x}
                  y={point.y + 3.6}
                  textAnchor="middle"
                  className="pointer-events-none fill-white text-[10px] font-bold"
                >
                  {point.count}
                </text>
                {isActive ? (
                  <text
                    x={point.x}
                    y={point.y - size - 8}
                    textAnchor="middle"
                    className="pointer-events-none fill-white text-[11px] font-semibold"
                  >
                    {point.state}
                  </text>
                ) : null}
              </g>
            )
          })}
          </g>
        </svg>
      </div>

      <div className="grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-3">
        <div className="rounded-md border border-xcreos-border bg-xcreos-surface p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-xcreos-muted">Selected market</p>
          <h4 className="mt-2 text-xl font-semibold text-white">{highlightedMarket.market}</h4>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-md border border-xcreos-border bg-[#090909] p-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-xcreos-muted">Properties</p>
              <p className="mt-2 text-2xl font-semibold text-white">{highlightedMarket.count}</p>
            </div>
            <div className="rounded-md border border-xcreos-border bg-[#090909] p-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-xcreos-muted">Share</p>
              <p className="mt-2 text-2xl font-semibold text-xcreos-primary">{share}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-xcreos-border bg-xcreos-surface p-4">
            <p className="text-[11px] uppercase tracking-[0.12em] text-xcreos-muted">Markets covered</p>
            <p className="mt-2 text-2xl font-semibold text-white">{points.length}</p>
          </div>
          <div className="rounded-md border border-xcreos-border bg-xcreos-surface p-4">
            <p className="text-[11px] uppercase tracking-[0.12em] text-xcreos-muted">Mapped assets</p>
            <p className="mt-2 text-2xl font-semibold text-white">{totalMapped}</p>
          </div>
        </div>

        <div className="flex min-h-0 flex-col rounded-md border border-xcreos-border bg-xcreos-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">Top clusters</p>
            <p className="truncate text-xs text-xcreos-muted">{topMarket.market}</p>
          </div>
          <div className="xcreos-scrollbar mt-4 grid min-h-0 gap-2 overflow-y-auto pr-1">
            {points.map((point, index) => {
              const pointShare = (point.count / maxCount) * 100

              return (
                <button
                  key={point.market}
                  type="button"
                  className={`grid gap-2 rounded-2xl border px-3 py-2.5 text-left transition ${
                    highlightedMarket.market === point.market
                      ? 'border-xcreos-primary bg-[#17110c]'
                      : 'border-xcreos-border bg-[#090909] hover:border-[#333333]'
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

      <div className="2xl:col-span-2">
        <ChartShell title="Properties by Market" subtitle="Geographic split" heightClassName="h-[34rem]">
          <MarketCoverageMap properties={properties} />
        </ChartShell>
      </div>

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
                <Bar dataKey="count" fill="#D57B2D" radius={[4, 4, 0, 0]} />
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
