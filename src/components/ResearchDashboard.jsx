import { useDeferredValue, useMemo, useState } from 'react'
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
import researchDataset from '../data/marketResearch.generated.json'
import {
  filterAndSortResearchRows,
  getResearchOptions,
  groupResearchRows,
  researchSortOptions,
  summarizeResearchRows,
} from '../utils/marketResearchData'
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  formatPercent,
} from '../utils/formatters'

const stateFipsToAbbr = {
  '01': 'AL',
  '02': 'AK',
  '04': 'AZ',
  '05': 'AR',
  '06': 'CA',
  '08': 'CO',
  '09': 'CT',
  10: 'DE',
  11: 'DC',
  12: 'FL',
  13: 'GA',
  15: 'HI',
  16: 'ID',
  17: 'IL',
  18: 'IN',
  19: 'IA',
  20: 'KS',
  21: 'KY',
  22: 'LA',
  23: 'ME',
  24: 'MD',
  25: 'MA',
  26: 'MI',
  27: 'MN',
  28: 'MS',
  29: 'MO',
  30: 'MT',
  31: 'NE',
  32: 'NV',
  33: 'NH',
  34: 'NJ',
  35: 'NM',
  36: 'NY',
  37: 'NC',
  38: 'ND',
  39: 'OH',
  40: 'OK',
  41: 'OR',
  42: 'PA',
  44: 'RI',
  45: 'SC',
  46: 'SD',
  47: 'TN',
  48: 'TX',
  49: 'UT',
  50: 'VT',
  51: 'VA',
  53: 'WA',
  54: 'WV',
  55: 'WI',
  56: 'WY',
}

const mapWidth = 960
const mapHeight = 560
const stateGeoJson = feature(usAtlas, usAtlas.objects.states)
const stateBorders = mesh(usAtlas, usAtlas.objects.states, (left, right) => left !== right)
const projection = geoAlbersUsa().fitSize([mapWidth, mapHeight], stateGeoJson)
const usaPath = geoPath(projection)
const portfolioViews = [
  { label: 'Top 5', value: 5 },
  { label: 'Top 10', value: 10 },
  { label: 'All', value: 'all' },
]
const defaultFilters = {
  search: '',
  state: 'All States',
  metro: 'All Metros',
  scoreMin: '',
  scoreMax: '',
  yieldMin: '',
  yieldMax: '',
  sortBy: 'score',
}

function xcreosTheme() {
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

function metricPercent(value, digits = 1) {
  return Number.isFinite(value) ? formatPercent(value * 100, digits) : '-'
}

function scoreLabel(score) {
  if (score >= 65) {
    return 'Prime Market'
  }

  if (score >= 45) {
    return 'Watchlist'
  }

  return 'Speculative'
}

function scoreBadge(score) {
  if (score >= 65) {
    return 'border-emerald-500/20 bg-emerald-500/15 text-emerald-300'
  }

  if (score >= 45) {
    return 'border-amber-500/20 bg-amber-500/15 text-amber-300'
  }

  return 'border-rose-500/20 bg-rose-500/15 text-rose-300'
}

function ChartShell({ title, subtitle, children, heightClassName = 'h-80' }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-[#171717] bg-[linear-gradient(180deg,rgba(11,11,11,0.98),rgba(7,7,7,0.98))] p-5 shadow-[0_8px_28px_rgba(0,0,0,0.24)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">{subtitle}</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <div className={`mt-5 ${heightClassName}`}>{children}</div>
    </article>
  )
}

function ResearchHero({ summary }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#171717] bg-[radial-gradient(circle_at_top_left,rgba(255,122,13,0.22),transparent_34%),linear-gradient(135deg,rgba(16,16,16,0.98),rgba(5,5,5,0.98))] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.32)] sm:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#c49b78]">Market research</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
            Market Research Intelligence
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-xcreos-muted">
            ZIP-level score model built from pricing, rents, HUD gaps, appreciation, yield, and Zillow market metadata.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#24180f] bg-black/35 px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-xcreos-muted">ZIPs</p>
            <p className="mt-2 text-2xl font-semibold text-white">{formatNumber(summary.zipCount)}</p>
          </div>
          <div className="rounded-2xl border border-[#24180f] bg-black/35 px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-xcreos-muted">States</p>
            <p className="mt-2 text-2xl font-semibold text-white">{formatNumber(summary.stateCount)}</p>
          </div>
          <div className="rounded-2xl border border-[#24180f] bg-black/35 px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-xcreos-muted">Metros</p>
            <p className="mt-2 text-2xl font-semibold text-white">{formatNumber(summary.metroCount)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function SummaryCards({ summary }) {
  const cards = [
    { label: 'ZIPs', value: formatNumber(summary.zipCount) },
    { label: 'Median Price', value: formatCompactCurrency(summary.medianPrice) },
    { label: 'Median Rent', value: formatCurrency(summary.medianRent) },
    { label: 'Median Yield', value: metricPercent(summary.medianYield) },
    { label: 'Average Score', value: Number.isFinite(summary.averageScore) ? summary.averageScore.toFixed(1) : '-' },
    { label: 'Median 1Y Appreciation', value: metricPercent(summary.medianAppreciation) },
    { label: 'Average Stability', value: metricPercent(summary.averageStability) },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-[1.75rem] border border-[#171717] bg-[linear-gradient(180deg,rgba(12,12,12,0.98),rgba(7,7,7,0.98))] px-5 py-5 shadow-[0_8px_28px_rgba(0,0,0,0.24)]"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">{card.label}</p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{card.value}</p>
        </article>
      ))}
    </section>
  )
}

function ResearchFilters({ filters, states, metros, onChange, onReset }) {
  const inputClass =
    'w-full rounded-2xl border border-[#1d1d1d] bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-xcreos-muted focus:border-xcreos-primary/50'
  const labelClass = 'text-[10px] uppercase tracking-[0.2em] text-xcreos-muted'

  return (
    <section className="rounded-[1.75rem] border border-[#171717] bg-[linear-gradient(180deg,rgba(11,11,11,0.98),rgba(7,7,7,0.98))] p-5 shadow-[0_8px_28px_rgba(0,0,0,0.24)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">Research filters</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Refine the ZIP universe</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-[#2a2118] px-4 py-2 text-sm font-semibold text-xcreos-muted transition hover:border-xcreos-primary/40 hover:text-white"
        >
          Reset filters
        </button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="grid gap-2">
          <span className={labelClass}>ZIP / city / metro</span>
          <input
            className={inputClass}
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
            placeholder="Search ZIP, city, metro"
          />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>State</span>
          <select
            className={inputClass}
            value={filters.state}
            onChange={(event) => onChange('state', event.target.value)}
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Metro</span>
          <select
            className={inputClass}
            value={filters.metro}
            onChange={(event) => onChange('metro', event.target.value)}
          >
            {metros.map((metro) => (
              <option key={metro} value={metro}>
                {metro}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Sort metric</span>
          <select
            className={inputClass}
            value={filters.sortBy}
            onChange={(event) => onChange('sortBy', event.target.value)}
          >
            {researchSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="grid gap-2">
          <span className={labelClass}>Score min</span>
          <input className={inputClass} value={filters.scoreMin} onChange={(event) => onChange('scoreMin', event.target.value)} placeholder="0" />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Score max</span>
          <input className={inputClass} value={filters.scoreMax} onChange={(event) => onChange('scoreMax', event.target.value)} placeholder="100" />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Yield min %</span>
          <input className={inputClass} value={filters.yieldMin} onChange={(event) => onChange('yieldMin', event.target.value)} placeholder="4" />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Yield max %</span>
          <input className={inputClass} value={filters.yieldMax} onChange={(event) => onChange('yieldMax', event.target.value)} placeholder="12" />
        </label>
      </div>
    </section>
  )
}

function ComparisonBarChart({ data, dataKey, formatter, nameKey = 'label' }) {
  const theme = xcreosTheme()

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid horizontal stroke={theme.stroke} vertical={false} />
        <XAxis type="number" stroke={theme.axis} tickFormatter={formatter} />
        <YAxis dataKey={nameKey} type="category" stroke={theme.axis} width={115} tickLine={false} />
        <Tooltip
          contentStyle={theme.tooltipStyle}
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          formatter={(value) => formatter(value)}
        />
        <Bar dataKey={dataKey} radius={[0, 12, 12, 0]} fill="#FF7A0D" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function StateMarketMap({ stateSeries, selectedState, onStateSelect }) {
  const [hoveredState, setHoveredState] = useState(null)
  const byState = new Map(stateSeries.map((state) => [state.name, state]))
  const activeState = hoveredState || selectedState
  const selected = byState.get(activeState) || stateSeries[0]
  const maxScore = Math.max(...stateSeries.map((state) => state.averageScore), 1)
  const minScore = Math.min(...stateSeries.map((state) => state.averageScore), maxScore)

  function fillForState(stateAbbr) {
    const state = byState.get(stateAbbr)

    if (!state) {
      return '#101010'
    }

    const ratio = (state.averageScore - minScore) / Math.max(maxScore - minScore, 1)
    const alpha = 0.18 + ratio * 0.72
    return `rgba(255,122,13,${alpha})`
  }

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="relative h-full overflow-hidden rounded-[1.6rem] border border-[#22170f] bg-[radial-gradient(circle_at_top_left,_rgba(255,122,13,0.18),_transparent_38%),linear-gradient(180deg,_rgba(18,14,11,0.96),_rgba(7,7,7,0.98))]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute left-5 top-5 z-20 rounded-full border border-[#322115] bg-[rgba(33,18,8,0.56)] px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[#b4977d]">
          Average score by state
        </div>
        <svg
          aria-label="United States research score choropleth"
          className="absolute inset-x-4 bottom-4 top-14 z-10 h-[calc(100%-4.5rem)] w-[calc(100%-2rem)]"
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          role="img"
        >
          <defs>
            <filter id="research-state-glow" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g>
            {stateGeoJson.features.map((state) => {
              const abbr = stateFipsToAbbr[String(state.id).padStart(2, '0')]
              const hasData = byState.has(abbr)
              const isActive = selected?.name === abbr

              return (
                <path
                  key={state.id}
                  d={usaPath(state)}
                  fill={fillForState(abbr)}
                  stroke={isActive ? '#FFB56F' : '#303030'}
                  strokeWidth={isActive ? 1.8 : 0.9}
                  filter={isActive ? 'url(#research-state-glow)' : undefined}
                  className={hasData ? 'cursor-pointer transition' : ''}
                  onMouseEnter={() => hasData && setHoveredState(abbr)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => hasData && onStateSelect(abbr)}
                  role={hasData ? 'button' : undefined}
                  tabIndex={hasData ? 0 : undefined}
                  aria-label={hasData ? `${abbr} average score ${byState.get(abbr).averageScore.toFixed(1)}` : undefined}
                />
              )
            })}
            <path d={usaPath(stateBorders)} fill="none" stroke="#393939" strokeWidth="0.8" />
          </g>
        </svg>
      </div>

      <div className="grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-3">
        <div className="rounded-[1.45rem] border border-[#1d1d1d] bg-[linear-gradient(180deg,rgba(14,14,14,0.96),rgba(8,8,8,0.98))] p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">Selected state</p>
          <h4 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{selected?.name || '-'}</h4>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">ZIPs</p>
              <p className="mt-2 text-2xl font-semibold text-white">{selected?.count ?? '-'}</p>
            </div>
            <div className="rounded-2xl border border-[#2a1a10] bg-[rgba(33,18,8,0.28)] p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">Avg score</p>
              <p className="mt-2 text-2xl font-semibold text-xcreos-primary">
                {selected ? selected.averageScore.toFixed(1) : '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[1.35rem] border border-[#1d1d1d] bg-[linear-gradient(180deg,rgba(14,14,14,0.96),rgba(8,8,8,0.98))] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">States covered</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stateSeries.length}</p>
          </div>
          <div className="rounded-[1.35rem] border border-[#1d1d1d] bg-[linear-gradient(180deg,rgba(14,14,14,0.96),rgba(8,8,8,0.98))] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">Mapped ZIPs</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {formatNumber(stateSeries.reduce((sum, state) => sum + state.count, 0))}
            </p>
          </div>
        </div>

        <div className="flex min-h-0 flex-col rounded-[1.45rem] border border-[#1d1d1d] bg-[linear-gradient(180deg,rgba(14,14,14,0.96),rgba(8,8,8,0.98))] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">Top states</p>
            <p className="text-xs text-xcreos-muted">score desc</p>
          </div>
          <div className="xcreos-scrollbar mt-4 grid min-h-0 gap-2 overflow-y-auto pr-1">
            {stateSeries.map((state) => {
              const width = (state.averageScore / maxScore) * 100
              const isActive = selected?.name === state.name

              return (
                <button
                  key={state.name}
                  type="button"
                  className={`grid gap-2 rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? 'border-xcreos-primary/35 bg-[rgba(255,122,13,0.08)]'
                      : 'border-white/6 bg-white/[0.02] hover:border-white/12'
                  }`}
                  onMouseEnter={() => setHoveredState(state.name)}
                  onFocus={() => setHoveredState(state.name)}
                  onClick={() => onStateSelect(state.name)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-white">{state.name}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-xcreos-muted">{state.count} ZIPs</p>
                    </div>
                    <span className="text-lg font-semibold text-white">{state.averageScore.toFixed(1)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/6">
                    <div className="h-full rounded-full bg-xcreos-primary" style={{ width: `${width}%` }} />
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

function ResearchCharts({ rows, stateSeries, metroSeries, onStateSelect, selectedState }) {
  const topZipSeries = rows.slice(0, 10).map((row) => ({
    label: row.zip,
    value: row.score,
  }))
  const yieldSeries = rows.slice(0, 8).map((row) => ({
    label: row.zip,
    value: row.rentYield * 100,
  }))
  const appreciationSeries = rows.slice(0, 8).map((row) => ({
    label: row.zip,
    value: row.appreciation1Y * 100,
  }))
  const rentGapSeries = rows
    .filter((row) => Number.isFinite(row.rentGap))
    .slice(0, 8)
    .map((row) => ({
      label: row.zip,
      value: row.rentGap,
    }))
  const topMetroSeries = metroSeries.slice(0, 8).map((metro) => ({
    label: metro.name,
    value: metro.averageScore,
  }))

  return (
    <section className="grid gap-4 2xl:grid-cols-2">
      <ChartShell title="Top ZIPs by Score" subtitle="Market ranking">
        <ComparisonBarChart data={topZipSeries} dataKey="value" formatter={(value) => Number(value).toFixed(1)} />
      </ChartShell>
      <ChartShell title="Rent Yield Comparison" subtitle="Income signal">
        <ComparisonBarChart data={yieldSeries} dataKey="value" formatter={(value) => `${Number(value).toFixed(1)}%`} />
      </ChartShell>
      <ChartShell title="1Y Appreciation Comparison" subtitle="Growth signal">
        <ComparisonBarChart data={appreciationSeries} dataKey="value" formatter={(value) => `${Number(value).toFixed(1)}%`} />
      </ChartShell>
      <ChartShell title="Rent Gap Comparison" subtitle="HUD spread">
        <ComparisonBarChart data={rentGapSeries} dataKey="value" formatter={formatCurrency} />
      </ChartShell>
      <div className="2xl:col-span-2">
        <ChartShell title="Properties by Market" subtitle="Geographic split" heightClassName="h-[38rem]">
          <StateMarketMap
            stateSeries={stateSeries}
            selectedState={selectedState === 'All States' ? null : selectedState}
            onStateSelect={onStateSelect}
          />
        </ChartShell>
      </div>
      <div className="2xl:col-span-2">
        <ChartShell title="Top Metros by Average Score" subtitle="Market depth">
          <ComparisonBarChart data={topMetroSeries} dataKey="value" formatter={(value) => Number(value).toFixed(1)} />
        </ChartShell>
      </div>
    </section>
  )
}

function ResearchTable({ rows, totalRows, currentView, onViewChange }) {
  return (
    <section className="rounded-[1.75rem] border border-[#171717] bg-[linear-gradient(180deg,rgba(11,11,11,0.98),rgba(7,7,7,0.98))] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.22)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">ZIP table</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">ZIP-level underwriting view</h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-full border border-[#2a2118] bg-[rgba(12,12,12,0.94)] p-1">
            {portfolioViews.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => onViewChange(option.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  currentView === option.value
                    ? 'bg-xcreos-primary text-[#170d05]'
                    : 'text-xcreos-muted hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-[#2a2118] bg-[rgba(24,14,7,0.34)] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-xcreos-primary" />
            <p className="text-sm text-xcreos-muted">
              {rows.length} of {totalRows} rows
            </p>
          </div>
        </div>
      </div>
      <div className="xcreos-scrollbar mt-6 overflow-x-auto pb-2">
        <table className="min-w-[1320px] table-fixed border-separate border-spacing-y-3 text-left">
          <thead className="text-[11px] uppercase tracking-[0.18em] text-xcreos-muted">
            <tr>
              <th className="w-[12%] pb-3 pl-4 font-semibold">ZIP</th>
              <th className="w-[18%] pb-3 font-semibold">Market</th>
              <th className="w-[20%] pb-3 font-semibold">Metro</th>
              <th className="w-[11%] pb-3 font-semibold">Price</th>
              <th className="w-[9%] pb-3 font-semibold">Rent</th>
              <th className="w-[9%] pb-3 font-semibold">Yield</th>
              <th className="w-[9%] pb-3 font-semibold">1Y App.</th>
              <th className="w-[9%] pb-3 font-semibold">HUD Gap</th>
              <th className="w-[8%] pb-3 font-semibold">Score</th>
              <th className="w-[9%] pb-3 font-semibold">Stability</th>
              <th className="w-[14%] pb-3 pr-4 font-semibold">View</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.zip}
                data-testid="research-table-row"
                className="rounded-[1.45rem] bg-[linear-gradient(180deg,rgba(9,9,9,0.96),rgba(5,5,5,0.98))] text-sm text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(0,0,0,0.28)]"
              >
                <td className="rounded-l-[1.45rem] border border-r-0 border-[#141414] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex min-w-9 justify-center rounded-full border border-[#26211d] bg-white/[0.03] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-xcreos-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base font-semibold text-white">{row.zip}</span>
                  </div>
                </td>
                <td className="border border-l-0 border-r-0 border-[#141414] px-4 py-4">
                  <p className="font-semibold text-white">{row.city}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-xcreos-muted">{row.state}</p>
                </td>
                <td className="border border-l-0 border-r-0 border-[#141414] px-4 py-4 text-xcreos-muted">
                  {row.metro}
                </td>
                <td className="border border-l-0 border-r-0 border-[#141414] px-4 py-4 font-medium">{formatCompactCurrency(row.price)}</td>
                <td className="border border-l-0 border-r-0 border-[#141414] px-4 py-4 font-medium">{formatCurrency(row.rent)}</td>
                <td className="border border-l-0 border-r-0 border-[#141414] px-4 py-4 font-medium">{metricPercent(row.rentYield)}</td>
                <td className="border border-l-0 border-r-0 border-[#141414] px-4 py-4 font-medium">{metricPercent(row.appreciation1Y)}</td>
                <td className="border border-l-0 border-r-0 border-[#141414] px-4 py-4 font-medium">{formatCurrency(row.rentGap)}</td>
                <td className="border border-l-0 border-r-0 border-[#141414] px-4 py-4 text-lg font-semibold text-xcreos-primary">{row.score.toFixed(1)}</td>
                <td className="border border-l-0 border-r-0 border-[#141414] px-4 py-4 font-medium">{metricPercent(row.stability)}</td>
                <td className="rounded-r-[1.45rem] border border-l-0 border-[#141414] px-4 py-4">
                  <span className={`inline-flex rounded-full border px-3 py-2 text-xs font-semibold ${scoreBadge(row.score)}`}>
                    {scoreLabel(row.score)}
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

function ResearchCards({ rows }) {
  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-3 rounded-[1.75rem] border border-[#171717] bg-[linear-gradient(180deg,rgba(11,11,11,0.98),rgba(7,7,7,0.98))] px-5 py-4 shadow-[0_8px_28px_rgba(0,0,0,0.24)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-xcreos-muted">Opportunity cards</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Ranked ZIP snapshots</h2>
        </div>
        <p className="text-sm text-xcreos-muted">{rows.length} cards shown</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {rows.map((row) => (
          <article
            key={row.zip}
            className="rounded-[1.75rem] border border-[#171717] bg-[linear-gradient(180deg,rgba(11,11,11,0.98),rgba(7,7,7,0.98))] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-xcreos-muted">{row.zip}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{row.city}, {row.state}</h3>
                <p className="mt-1 max-w-xl truncate text-sm text-xcreos-muted">{row.metro}</p>
              </div>
              <span className={`rounded-full border px-3 py-2 text-xs font-semibold ${scoreBadge(row.score)}`}>
                {scoreLabel(row.score)}
              </span>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-xcreos-muted">
                <span>Research Score</span>
                <span className="text-xcreos-primary">{row.score.toFixed(1)}/100</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/6">
                <div className="h-full rounded-full bg-xcreos-primary" style={{ width: `${Math.min(row.score, 100)}%` }} />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-xcreos-muted">Price</p>
                <p className="mt-2 font-semibold text-white">{formatCompactCurrency(row.price)}</p>
              </div>
              <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-xcreos-muted">Rent</p>
                <p className="mt-2 font-semibold text-white">{formatCurrency(row.rent)}</p>
              </div>
              <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-xcreos-muted">Yield</p>
                <p className="mt-2 font-semibold text-white">{metricPercent(row.rentYield)}</p>
              </div>
              <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-xcreos-muted">HUD Gap</p>
                <p className="mt-2 font-semibold text-white">{formatCurrency(row.rentGap)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ResearchDashboard({ dataRows = researchDataset.rows }) {
  const [filters, setFilters] = useState(defaultFilters)
  const [portfolioView, setPortfolioView] = useState(10)
  const deferredSearch = useDeferredValue(filters.search)
  const rows = dataRows
  const states = useMemo(() => getResearchOptions(rows, 'state', 'All States'), [rows])
  const metros = useMemo(() => getResearchOptions(rows, 'metro', 'All Metros'), [rows])
  const visibleRows = useMemo(
    () => filterAndSortResearchRows(rows, { ...filters, search: deferredSearch }),
    [deferredSearch, filters, rows],
  )
  const summary = useMemo(() => summarizeResearchRows(visibleRows), [visibleRows])
  const stateSeries = useMemo(() => groupResearchRows(visibleRows, 'state'), [visibleRows])
  const metroSeries = useMemo(() => groupResearchRows(visibleRows, 'metro'), [visibleRows])
  const displayedRows = portfolioView === 'all' ? visibleRows : visibleRows.slice(0, portfolioView)

  function handleFilterChange(field, value) {
    setFilters((current) => ({
      ...current,
      [field]: value,
      ...(field === 'state' ? { metro: 'All Metros' } : {}),
    }))
  }

  return (
    <div className="min-h-screen bg-xcreos-background text-white">
      <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5">
          <ResearchHero summary={summary} />
          <SummaryCards summary={summary} />
          <ResearchFilters
            filters={filters}
            states={states}
            metros={metros}
            onChange={handleFilterChange}
            onReset={() => setFilters(defaultFilters)}
          />
          {visibleRows.length ? (
            <>
              <ResearchCharts
                rows={visibleRows}
                stateSeries={stateSeries}
                metroSeries={metroSeries}
                selectedState={filters.state}
                onStateSelect={(state) => handleFilterChange('state', state)}
              />
              <ResearchTable
                rows={displayedRows}
                totalRows={visibleRows.length}
                currentView={portfolioView}
                onViewChange={setPortfolioView}
              />
              <ResearchCards rows={displayedRows} />
            </>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-[#1a1a1a] bg-[linear-gradient(180deg,rgba(11,11,11,0.98),rgba(7,7,7,0.98))] px-6 py-12 text-center">
              <p className="text-[11px] uppercase tracking-[0.24em] text-xcreos-muted">No results</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">No ZIPs match the current filters.</h3>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
