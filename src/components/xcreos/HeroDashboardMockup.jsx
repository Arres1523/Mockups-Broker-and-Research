const kpis = [
  { label: 'NOI', value: '$412K', sub: '+8.2% vs prev', positive: true },
  { label: 'Occupancy', value: '94%', sub: '+2% vs mkt', positive: true },
  { label: 'Est. Value', value: '$8.25M', sub: 'at 5.00% cap' },
  { label: 'Max Loan', value: '$5.9M', sub: 'DSCR 1.25x' },
]

const incomeRows = [
  { label: 'Gross Potential Rent', value: '$612,000' },
  { label: 'Vacancy Loss', value: '($36,720)', negative: true },
  { label: 'Other Income', value: '$28,120' },
  { label: 'Effective Gross Income', value: '$603,400', strong: true },
  { label: 'Operating Expenses', value: '($191,000)', negative: true },
  { label: 'Net Operating Income', value: '$412,400', highlight: true },
]

const scenarios = [
  { rate: '4.50%', value: '$9.16M' },
  { rate: '5.00%', value: '$8.25M', active: true },
  { rate: '5.50%', value: '$7.50M' },
]

export function HeroDashboardMockup() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-3xl opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,217,0,0.9) 0%, transparent 65%)' }}
      />
      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#111] shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/6 bg-[#0a0a0a] px-4 py-3">
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="flex-1 truncate text-center font-mono text-xs tracking-[0.02em] text-white/25">
            Oakwood Apartments - <span>Financial Analysis</span>
          </span>
          <div aria-hidden className="w-10 shrink-0" />
        </div>

        <div className="flex h-[436px]">
          <aside className="hidden w-[180px] shrink-0 flex-col border-r border-white/5 bg-[#080808] p-3.5 sm:flex">
            <div className="mb-3 px-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/25">Properties</div>
            <div className="mb-1.5 rounded-lg border border-brand-gold/20 bg-brand-gold/8 px-3 py-2.5">
              <div className="text-xs font-semibold leading-tight text-white">Oakwood Apts</div>
              <div className="mt-0.5 text-[10px] text-white/40">48 units - Prospect</div>
            </div>
            {['Maple Grove', 'River Park', 'Sunset Ridge'].map((name) => (
              <div key={name} className="mb-1.5 rounded-lg px-3 py-2.5">
                <div className="text-xs font-medium leading-tight text-white/45">{name}</div>
                <div className="mt-0.5 text-[10px] text-white/25">Owned portfolio</div>
              </div>
            ))}
            <div className="mt-auto rounded-lg border border-brand-gold/12 py-1.5 text-center text-[11px] text-brand-gold/60">
              + New Property
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#111] p-4">
            <div className="mb-4 flex shrink-0 items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold leading-[1.3] text-white">Oakwood Apartments</h3>
                <p className="mt-0.5 truncate text-[11px] text-white/35">1847 Oak Street, Austin TX - 48 units - Class B</p>
              </div>
              <span className="shrink-0 rounded-full border border-brand-gold/20 bg-brand-gold/10 px-2 py-0.5 text-[10px] text-brand-gold">
                Prospect
              </span>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="rounded-lg border border-white/6 bg-white/[0.04] p-2">
                  <div className="mb-[3px] text-[9px] uppercase tracking-[0.05em] text-white/30">{kpi.label}</div>
                  <div className="text-[14px] font-bold text-white">{kpi.value}</div>
                  <div className={kpi.positive ? 'mt-0.5 text-[10px] text-brand-green' : 'mt-0.5 text-[10px] text-white/30'}>
                    {kpi.sub}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-3 rounded-lg border border-white/5 bg-white/[0.025] p-3">
              <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/30">Income & Expense Analysis</div>
              {incomeRows.map((row) => (
                <div key={row.label} className="flex justify-between border-t border-white/7 py-1 first:border-t-0">
                  <span className={row.highlight ? 'text-[11px] font-semibold text-brand-gold' : row.strong ? 'text-[11px] font-semibold text-white/90' : 'text-[11px] text-white/45'}>
                    {row.label}
                  </span>
                  <span className={row.highlight ? 'text-[11px] font-semibold text-brand-gold' : row.negative ? 'text-[11px] text-red-400' : row.strong ? 'text-[11px] font-semibold text-white/90' : 'text-[11px] text-white/45'}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/30">Valuation Scenarios</div>
              <div className="grid grid-cols-3 gap-2">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.rate}
                    className={scenario.active ? 'rounded-lg border border-brand-gold/25 bg-brand-gold/8 py-2 text-center' : 'rounded-lg border border-white/5 bg-white/[0.03] py-2 text-center'}
                  >
                    <div className={scenario.active ? 'text-[10px] text-brand-gold/75' : 'text-[10px] text-white/35'}>Cap {scenario.rate}</div>
                    <div className={scenario.active ? 'mt-0.5 text-[13px] font-bold text-brand-gold' : 'mt-0.5 text-[13px] font-bold text-white/60'}>
                      {scenario.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
