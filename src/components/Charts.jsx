import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  buildBrokerDistribution,
  buildMarketDistribution,
  buildPropertyComparisonSeries,
} from '../utils/aggregations'
import { formatCompactCurrency, formatDscr, formatPercent } from '../utils/formatters'

const colors = ['#FF6B00', '#FF924A', '#FFB47D', '#F5D0B2', '#C76A24', '#8C4517']

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

export function Charts({ properties }) {
  const noiSeries = buildPropertyComparisonSeries(properties, 'noi_actual')
  const occupancySeries = buildPropertyComparisonSeries(properties, 'physical_occupancy_pct')
  const dscrSeries = buildPropertyComparisonSeries(properties, 'dscr_current')
  const upsideSeries = buildPropertyComparisonSeries(properties, 'in_place_annual_upside')
  const expenseSeries = buildPropertyComparisonSeries(properties, 'expense_ratio_actual')
  const marketSeries = buildMarketDistribution(properties)
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
        {marketSeries.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip contentStyle={theme.tooltipStyle} formatter={(value) => `${value} properties`} />
              <Pie
                data={marketSeries}
                dataKey="count"
                nameKey="market"
                innerRadius={72}
                outerRadius={110}
                paddingAngle={3}
              >
                {marketSeries.map((entry, index) => (
                  <Cell key={entry.market} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartState message="No market distribution is available for the current filters." />
        )}
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
