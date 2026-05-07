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
    <section className="rounded-[2rem] border border-xcreos-border bg-[radial-gradient(circle_at_top_left,_rgba(255,107,0,0.22),_transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
            Xcreos
          </p>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-2 text-[11px] font-medium text-white/70">
          {propertyCount} live multifamily records
        </div>
      </div>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-xcreos-primary">
            Multifamily Investment Intelligence Dashboard
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Analyze property opportunities with broker executive summary signals.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-xcreos-muted sm:text-base">
            Analyze property opportunities, financial strength, operational performance,
            and growth upside from broker executive summaries.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[360px]">
          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">Properties</p>
            <p className="mt-2 text-2xl font-semibold text-white">{propertyCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">Markets</p>
            <p className="mt-2 text-2xl font-semibold text-white">{marketCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">Brokers</p>
            <p className="mt-2 text-2xl font-semibold text-white">{brokerCount}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 inline-flex rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-medium text-white">
        {sourceLabel}
      </div>
    </section>
  )
}
