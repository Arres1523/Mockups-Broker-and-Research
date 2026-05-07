import {
  activeDeals,
  activityItems,
  dashboardKpis,
  dashboardRows,
  pipelineStages,
  sourcingPulse,
  upcomingItems,
} from '../../data/xcreosVisualMocks'
import { KpiCard } from './primitives/KpiCard'
import { ProgressBar } from './primitives/ProgressBar'
import { StackedBar } from './primitives/StackedBar'
import { WidgetCard } from './primitives/WidgetCard'

function KpiStrip() {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {dashboardKpis.map((card) => (
        <KpiCard key={card.label} label={card.label} value={card.value} helper={card.helper} />
      ))}
    </section>
  )
}

function PipelineFunnel() {
  return (
    <WidgetCard title="Pipeline funnel" action="Mock underwriting stages">
      <StackedBar segments={pipelineStages.map((stage) => ({ ...stage, title: stage.label }))} />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {pipelineStages.map((stage) => (
          <div key={stage.key} className="rounded-md border border-ink-100 bg-ink-25 p-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ backgroundColor: stage.color }} />
              <span className="text-[12px] font-medium text-ink-700">{stage.label}</span>
            </div>
            <div className="num mt-3 text-xl font-semibold text-ink-900">{stage.count}</div>
            <div className="text-[11px] text-ink-500">{stage.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-md border border-copper/20 bg-copper/5 p-4">
        <p className="text-[12px] font-semibold text-ink-900">Stage mix</p>
        <p className="mt-1 text-sm leading-6 text-ink-500">
          Visual distribution uses the XCreos cool-to-warm stage palette with copper reserved for underwriting.
        </p>
      </div>
    </WidgetCard>
  )
}

function ActiveUnderwriting() {
  return (
    <WidgetCard title="Active underwriting" action="4 deals">
      <div className="grid gap-4">
        {activeDeals.map((deal) => (
          <article key={deal.name} className="rounded-md border border-ink-100 bg-ink-25 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-[13px] font-semibold text-ink-900">{deal.name}</h3>
                <p className="mt-0.5 text-[12px] text-ink-500">{deal.market}</p>
              </div>
              <span className="rounded-[3px] border border-copper/25 bg-copper/10 px-1.5 py-px text-[10px] font-semibold uppercase tracking-[0.04em] text-copper">
                {deal.status}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-ink-500">
              <span>{deal.sponsor}</span>
              <span>{Math.round(deal.progress * 100)}%</span>
            </div>
            <ProgressBar ratio={deal.progress} ariaLabel={`${deal.name} progress`} className="mt-2" />
          </article>
        ))}
      </div>
    </WidgetCard>
  )
}

function ActivityFeed() {
  return (
    <WidgetCard title="Activity feed">
      <div className="grid gap-1">
        {activityItems.map((item) => (
          <div key={`${item.title}-${item.time}`} className="grid grid-cols-[auto_1fr] gap-3 border-b border-ink-100 py-3 last:border-b-0">
            <span className="mt-1 size-2 rounded-full bg-copper" />
            <div>
              <p className="text-[13px] font-medium text-ink-900">{item.title}</p>
              <p className="mt-0.5 text-[12px] text-ink-500">{item.detail}</p>
              <p className="mt-1 text-[11px] text-ink-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  )
}

function UpcomingList() {
  return (
    <WidgetCard title="Upcoming list">
      <div className="grid gap-3">
        {upcomingItems.map((item) => (
          <div key={item.title} className="flex gap-3 rounded-md border border-ink-100 bg-ink-25 p-3">
            <div className="grid size-10 place-items-center rounded-md bg-ink-900 text-[12px] font-semibold text-ink-0">{item.date}</div>
            <div>
              <p className="text-[13px] font-semibold text-ink-900">{item.title}</p>
              <p className="mt-1 text-[12px] text-ink-500">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  )
}

function SourcingPulse() {
  return (
    <WidgetCard title="Sourcing pulse" action="Hit rate">
      <div className="grid gap-4">
        {sourcingPulse.map((market) => (
          <div key={market.market}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-[13px] font-medium text-ink-900">{market.market}</p>
                <p className="text-[11px] text-ink-500">{market.deals} broker submissions</p>
              </div>
              <span className="num text-[13px] font-semibold text-ink-900">{Math.round(market.hitRate * 100)}%</span>
            </div>
            <ProgressBar ratio={market.hitRate} ariaLabel={`${market.market} hit rate`} />
          </div>
        ))}
      </div>
    </WidgetCard>
  )
}

function DealTable() {
  return (
    <WidgetCard title="Comparable underwriting view" action={`${dashboardRows.length} mock rows`} bodyClassName="overflow-x-auto">
      <table className="min-w-[780px] w-full border-separate border-spacing-y-2 text-left">
        <thead className="text-[11px] uppercase tracking-[0.08em] text-ink-500">
          <tr>
            <th className="px-3 py-2 font-medium">Property</th>
            <th className="px-3 py-2 font-medium">Stage</th>
            <th className="px-3 py-2 font-medium">Market</th>
            <th className="px-3 py-2 font-medium">Units</th>
            <th className="px-3 py-2 font-medium">NOI</th>
            <th className="px-3 py-2 font-medium">DSCR</th>
            <th className="px-3 py-2 font-medium">Score</th>
          </tr>
        </thead>
        <tbody>
          {dashboardRows.map((row) => (
            <tr key={row.property} className="bg-ink-25 text-[13px] text-ink-700">
              <td className="rounded-l-md border border-r-0 border-ink-100 px-3 py-3 font-semibold text-ink-900">{row.property}</td>
              <td className="border border-x-0 border-ink-100 px-3 py-3">{row.stage}</td>
              <td className="border border-x-0 border-ink-100 px-3 py-3">{row.market}</td>
              <td className="num border border-x-0 border-ink-100 px-3 py-3">{row.units}</td>
              <td className="num border border-x-0 border-ink-100 px-3 py-3">{row.noi}</td>
              <td className="num border border-x-0 border-ink-100 px-3 py-3">{row.dscr}</td>
              <td className="num rounded-r-md border border-l-0 border-ink-100 px-3 py-3 font-semibold text-copper">{row.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </WidgetCard>
  )
}

export function PortfolioDashboardView() {
  return (
    <div className="relative flex flex-col gap-4">
      <section className="rounded-md border border-ink-100 bg-card p-5 shadow-sm">
        <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-ink-500">Visual-only workspace</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink-900">Portfolio Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-500">
          Recreated XCreos dashboard composition with mock KPIs, widgets, stage bars and table rows. No auth, database, tRPC or Clerk integration is used.
        </p>
      </section>

      <KpiStrip />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PipelineFunnel />
        </div>
        <ActiveUnderwriting />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ActivityFeed />
        <UpcomingList />
        <SourcingPulse />
      </div>

      <DealTable />
    </div>
  )
}
