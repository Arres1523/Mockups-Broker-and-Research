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
    <section className="rounded-[2rem] border border-[#1b1b1b] bg-[radial-gradient(circle_at_top_left,_rgba(255,122,13,0.22),_transparent_34%),radial-gradient(circle_at_22%_60%,_rgba(116,60,19,0.14),_transparent_28%),linear-gradient(180deg,rgba(16,16,16,0.98),rgba(8,8,8,0.98))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.34)] sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
            Xcreos
          </p>
        </div>
        <div className="rounded-full border border-white/8 bg-black/25 px-3 py-2 text-[11px] font-medium text-white/70">
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
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8e857d] sm:text-base">
            Analyze property opportunities, financial strength, operational performance,
            and growth upside from broker executive summaries.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[360px]">
          <div className="rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(14,14,14,0.94),rgba(9,9,9,0.98))] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">Properties</p>
            <p className="mt-2 text-2xl font-semibold text-white">{propertyCount}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(14,14,14,0.94),rgba(9,9,9,0.98))] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">Markets</p>
            <p className="mt-2 text-2xl font-semibold text-white">{marketCount}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(14,14,14,0.94),rgba(9,9,9,0.98))] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">Brokers</p>
            <p className="mt-2 text-2xl font-semibold text-white">{brokerCount}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 inline-flex rounded-full border border-[#2a1b0f] bg-[rgba(26,14,6,0.55)] px-4 py-2 text-xs font-medium text-white">
        {sourceLabel}
      </div>
    </section>
  )
}
