import { lazy, Suspense, useDeferredValue, useEffect, useState } from 'react'
import { Filters } from './components/Filters'
import { Hero } from './components/Hero'
import { PropertyCard } from './components/PropertyCard'
import { PropertyTable } from './components/PropertyTable'
import { SummaryCards } from './components/SummaryCards'
import { loadExecutiveSummaries } from './lib/dataService'
import {
  getUniqueOptions,
  summarizePortfolio,
} from './utils/aggregations'
import {
  calculateInvestmentScore,
  getOpportunityLabel,
} from './utils/calculateInvestmentScore'
import { filterAndSortProperties } from './utils/filterProperties'
import {
  formatCompactCurrency,
  formatDscr,
  formatNumber,
  formatPercent,
} from './utils/formatters'

const Charts = lazy(() =>
  import('./components/Charts').then((module) => ({
    default: module.Charts,
  })),
)

const ResearchDashboard = lazy(() =>
  import('./components/ResearchDashboard').then((module) => ({
    default: module.ResearchDashboard,
  })),
)

const defaultFilters = {
  search: '',
  market: 'All Markets',
  broker: 'All Brokers',
  occupancyMin: '',
  occupancyMax: '',
  dscrMin: '',
  dscrMax: '',
  yearBuiltMin: '',
  yearBuiltMax: '',
  sortBy: 'noi_actual',
  sortDirection: 'desc',
}

const portfolioViews = [
  { label: 'Top 5', value: 5 },
  { label: 'Top 10', value: 10 },
  { label: 'All', value: 'all' },
]

function buildSummaryItems(summary) {
  return [
    { label: 'Total Properties', value: formatNumber(summary.totalProperties) },
    { label: 'Total Units', value: formatNumber(summary.totalUnits) },
    { label: 'Average Occupancy', value: formatPercent(summary.averageOccupancy) },
    { label: 'Total NOI', value: formatCompactCurrency(summary.totalNoi) },
    {
      label: 'Average Expense Ratio',
      value: formatPercent(summary.averageExpenseRatio),
    },
    { label: 'Average DSCR', value: formatDscr(summary.averageDscr) },
    {
      label: 'Total Annual Upside',
      value: formatCompactCurrency(summary.totalAnnualUpside),
    },
  ]
}

function buildBanner(reason, error) {
  if (reason === 'query-error') {
    return {
      tone: 'border-amber-500/30 bg-amber-500/10 text-amber-100',
      title: 'Supabase unavailable',
      message: `Live data could not be loaded. Showing demo portfolio.${error?.message ? ` ${error.message}` : ''}`,
    }
  }

  if (reason === 'empty-database') {
    return {
      tone: 'border-sky-500/30 bg-sky-500/10 text-sky-100',
      title: 'No Supabase rows yet',
      message: 'The table is reachable but empty. Showing demo portfolio until you load data.',
    }
  }

  if (reason === 'missing-env') {
    return {
      tone: 'border-[#221a13] bg-[rgba(25,16,9,0.34)] text-white',
      title: 'Demo portfolio active',
      message: 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to switch this view to live data.',
    }
  }

  return null
}

function LoadingScreen() {
  return (
    <div className="grid gap-4">
      <div className="h-56 animate-pulse rounded-md bg-[#111111]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-md bg-[#111111]" />
        ))}
      </div>
    </div>
  )
}

function EmptyFilterState() {
  return (
    <div className="rounded-md border border-dashed border-xcreos-border bg-xcreos-surface px-6 py-12 text-center">
      <p className="text-[11px] uppercase tracking-[0.24em] text-xcreos-muted">No results</p>
      <h3 className="mt-3 text-2xl font-semibold text-white">No properties match the current filters.</h3>
      <p className="mt-3 text-sm text-xcreos-muted">
        Adjust market, broker, or numeric ranges to widen the portfolio view.
      </p>
    </div>
  )
}

function ChartsLoadingState() {
  return <div className="h-80 animate-pulse rounded-md bg-[#111111]" />
}

export function BrokerDashboard() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('mock')
  const [reason, setReason] = useState('missing-env')
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(defaultFilters)
  const [portfolioView, setPortfolioView] = useState(10)
  const deferredSearch = useDeferredValue(filters.search)

  useEffect(() => {
    let isActive = true

    async function fetchProperties() {
      setLoading(true)
      const result = await loadExecutiveSummaries()

      if (!isActive) {
        return
      }

      setProperties(result.properties)
      setSource(result.source)
      setReason(result.reason)
      setError(result.error)
      setLoading(false)
    }

    fetchProperties()

    return () => {
      isActive = false
    }
  }, [])

  const visibleBaseProperties = filterAndSortProperties(properties, {
    ...filters,
    search: deferredSearch,
  })

  const visibleProperties = visibleBaseProperties.map((property) => {
    const investmentScore = calculateInvestmentScore(property, visibleBaseProperties)

    return {
      ...property,
      investment_score: investmentScore,
      opportunity_label: getOpportunityLabel(investmentScore),
    }
  })

  const summary = summarizePortfolio(visibleBaseProperties)
  const summaryItems = buildSummaryItems(summary)
  const markets = getUniqueOptions(properties, 'market', 'All Markets')
  const brokers = getUniqueOptions(properties, 'broker_name', 'All Brokers')
  const banner = buildBanner(reason, error)
  const marketCount = new Set(properties.map((property) => property.market).filter(Boolean)).size
  const brokerCount = new Set(properties.map((property) => property.broker_name).filter(Boolean)).size
  const tableProperties = [...visibleProperties].sort(
    (left, right) => right.investment_score - left.investment_score,
  )
  const displayedProperties =
    portfolioView === 'all'
      ? tableProperties
      : tableProperties.slice(0, portfolioView)

  function handleFilterChange(field, value) {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-xcreos-background px-4 py-6 text-white lg:px-6">
        <div className="mx-auto max-w-[1800px]">
          <LoadingScreen />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-xcreos-background text-white">
      <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5">
          <Hero
            source={source}
            reason={reason}
            propertyCount={properties.length}
            marketCount={marketCount}
            brokerCount={brokerCount}
          />

          {banner ? (
            <div className={`rounded-md border px-5 py-4 ${banner.tone}`}>
              <p className="text-sm font-semibold">{banner.title}</p>
              <p className="mt-1 text-sm">{banner.message}</p>
            </div>
          ) : null}

          <SummaryCards items={summaryItems} />

          <Filters
            filters={filters}
            markets={markets}
            brokers={brokers}
            onChange={handleFilterChange}
            onReset={() => setFilters(defaultFilters)}
          />

          {visibleProperties.length === 0 ? (
            <EmptyFilterState />
          ) : (
            <>
              <Suspense fallback={<ChartsLoadingState />}>
                <Charts properties={visibleProperties} />
              </Suspense>
              <PropertyTable
                properties={displayedProperties}
                totalProperties={visibleProperties.length}
                viewOptions={portfolioViews}
                currentView={portfolioView}
                onViewChange={setPortfolioView}
              />
              <section className="grid gap-4">
                <div className="flex flex-col gap-3 rounded-md border border-xcreos-border bg-xcreos-surface px-5 py-4 shadow-none sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-xcreos-muted">
                      Property cards
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                      Ranked opportunity snapshots
                    </h2>
                  </div>
                  <p className="text-sm text-xcreos-muted">{displayedProperties.length} cards shown</p>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {displayedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function getRouteFromHash() {
  const hash = window.location.hash.replace('#', '').toLowerCase()

  if (hash === 'broker' || hash === 'research') {
    return hash
  }

  return 'index'
}

function useHashRoute() {
  const [route, setRoute] = useState(getRouteFromHash)

  useEffect(() => {
    function handleHashChange() {
      setRoute(getRouteFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return route
}

function LandingPage() {
  const cards = [
    {
      eyebrow: 'Broker',
      title: 'Broker Intelligence',
      description: 'Executive summary dashboard for underwriting candidates, broker channels, market coverage, and opportunity scoring.',
      href: '#broker',
      meta: 'Deal pipeline and property-level scorecards',
    },
    {
      eyebrow: 'Research',
      title: 'Market Research',
      description: 'ZIP-level market model using price, rent, yield, appreciation, HUD gap, stability, and Zillow metadata.',
      href: '#research',
      meta: 'Market map, ZIP rankings, and state/metro filters',
    },
  ]

  return (
    <div className="min-h-screen bg-xcreos-background text-white">
      <main className="mx-auto flex min-h-screen max-w-[1500px] items-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="w-full overflow-hidden rounded-md border border-xcreos-border bg-xcreos-surface p-6 shadow-none sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-xcreos-muted">Valoris capital partners</p>
              <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
                Choose your intelligence workspace
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-xcreos-muted">
                One Xcreos-style app with broker underwriting and market research views connected through version-controlled Vercel deployments.
              </p>
            </div>
            <div className="rounded-md border border-xcreos-border bg-[#090909] px-4 py-2 text-sm text-xcreos-muted">
              Select Broker or Research
            </div>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {cards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="group grid min-h-[320px] rounded-md border border-xcreos-border bg-[#0b0b0b] p-6 shadow-none transition hover:-translate-y-0.5 hover:border-xcreos-primary"
              >
                <div>
                  <p className="inline-flex rounded-md border border-xcreos-border bg-[#111111] px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-xcreos-muted">
                    {card.eyebrow}
                  </p>
                  <h2 className="mt-7 text-4xl font-semibold tracking-[-0.06em] text-white">{card.title}</h2>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-xcreos-muted">{card.description}</p>
                </div>
                <div className="mt-10 flex items-end justify-between gap-6">
                  <p className="max-w-sm text-xs uppercase tracking-[0.2em] text-xcreos-muted">{card.meta}</p>
                  <span className="rounded-md bg-xcreos-primary px-5 py-3 text-sm font-semibold text-black transition group-hover:bg-xcreos-primary-soft">
                    Open
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function RouteNavigation() {
  return (
    <nav className="fixed right-4 top-4 z-50 flex rounded-md border border-xcreos-border bg-[#0b0b0b] p-1 shadow-none">
      <a className="rounded px-4 py-2 text-sm font-semibold text-xcreos-muted transition hover:bg-[#151515] hover:text-white" href="#">
        Index
      </a>
      <a className="rounded px-4 py-2 text-sm font-semibold text-xcreos-muted transition hover:bg-[#151515] hover:text-white" href="#broker">
        Broker
      </a>
      <a className="rounded px-4 py-2 text-sm font-semibold text-xcreos-muted transition hover:bg-[#151515] hover:text-white" href="#research">
        Research
      </a>
    </nav>
  )
}

function App() {
  const route = useHashRoute()

  if (route === 'broker') {
    return (
      <>
        <RouteNavigation />
        <BrokerDashboard />
      </>
    )
  }

  if (route === 'research') {
    return (
      <>
        <RouteNavigation />
        <Suspense fallback={<div className="min-h-screen bg-xcreos-background p-6 text-white">Loading research dashboard...</div>}>
          <ResearchDashboard />
        </Suspense>
      </>
    )
  }

  return <LandingPage />
}

export default App
