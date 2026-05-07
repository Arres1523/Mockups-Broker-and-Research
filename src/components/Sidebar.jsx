import { BarChart3, Building2, ChartNoAxesColumn, LayoutDashboard } from 'lucide-react'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Portfolio', icon: Building2 },
  { label: 'Charts', icon: ChartNoAxesColumn },
  { label: 'Rankings', icon: BarChart3 },
]

export function Sidebar() {
  return (
    <aside className="border-xcreos-border bg-xcreos-surface/80 lg:sticky lg:top-0 lg:h-screen lg:border-r">
      <div className="flex h-full flex-col gap-8 px-5 py-6">
        <div className="flex items-center justify-between lg:block">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-xcreos-muted">
              Xcreos
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Capital Intelligence</h1>
          </div>
          <div className="rounded-full border border-xcreos-border px-3 py-1 text-[11px] font-medium text-xcreos-primary">
            v1 MVP
          </div>
        </div>

        <nav className="grid gap-2 sm:grid-cols-4 lg:grid-cols-1">
          {navItems.map(({ label, icon: Icon }, index) => (
            <div
              key={label}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${
                index === 0
                  ? 'border-xcreos-primary/40 bg-xcreos-primary/10 text-white'
                  : 'border-xcreos-border bg-white/[0.02] text-xcreos-muted'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </div>
          ))}
        </nav>

        <div className="rounded-3xl border border-xcreos-border bg-black/50 p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">
            Focus Mode
          </p>
          <p className="mt-3 text-sm leading-6 text-white">
            High-contrast underwriting layout with portfolio KPIs, rankings, and market splits.
          </p>
        </div>
      </div>
    </aside>
  )
}
