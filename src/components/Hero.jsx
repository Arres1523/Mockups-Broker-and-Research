export function Hero({ source, reason, propertyCount, marketCount, brokerCount }) {
  const sourceLabel =
    source === 'supabase'
      ? 'Live Supabase feed'
      : reason === 'empty-database'
        ? 'Demo fallback · empty database'
        : reason === 'query-error'
          ? 'Demo fallback · Supabase error'
          : 'Demo portfolio active'

  return (
    <section className="rounded-md border border-xcreos-border bg-xcreos-surface p-6 shadow-none sm:p-7">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-xcreos-border pb-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-xcreos-muted">
            Xcreos
          </p>
        </div>
        <div className="rounded-md border border-xcreos-border bg-[#0b0b0b] px-3 py-2 text-[11px] font-medium text-xcreos-muted">
          {propertyCount} live multifamily records
        </div>
      </div>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-xcreos-muted">
            Multifamily Investment Intelligence Dashboard
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Analyze property opportunities with broker executive summary signals.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-xcreos-muted sm:text-base">
            Analyze property opportunities, financial strength, operational performance,
            and growth upside from broker executive summaries.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[360px]">
          <div className="rounded-md border border-xcreos-border bg-[#0b0b0b] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-xcreos-muted">Properties</p>
            <p className="mt-2 text-2xl font-semibold text-white">{propertyCount}</p>
          </div>
          <div className="rounded-md border border-xcreos-border bg-[#0b0b0b] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-xcreos-muted">Markets</p>
            <p className="mt-2 text-2xl font-semibold text-white">{marketCount}</p>
          </div>
          <div className="rounded-md border border-xcreos-border bg-[#0b0b0b] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-xcreos-muted">Brokers</p>
            <p className="mt-2 text-2xl font-semibold text-white">{brokerCount}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 inline-flex rounded-md border border-xcreos-border bg-[#0b0b0b] px-4 py-2 text-xs font-medium text-xcreos-muted">
        {sourceLabel}
      </div>
    </section>
  )
}
