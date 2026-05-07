import { Building2, Check, Zap } from 'lucide-react'
import { HeroDashboardMockup } from './HeroDashboardMockup'

const trustItems = [
  { label: 'Instant underwriting read', icon: Zap, className: 'text-brand-gold' },
  { label: 'Mock financial data only', icon: Check, className: 'text-brand-green' },
  { label: 'Portfolio-ready layout', icon: Building2, className: 'text-white/35' },
]

export function HomePageView() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-brand-black">
      <section id="hero" className="relative overflow-hidden bg-brand-dark bg-grid-pattern px-6 pb-20 pt-20 lg:pb-24 lg:pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 25% 55%, rgba(255,217,0,0.07) 0%, transparent 65%)' }}
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-14">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/20 bg-brand-gold/10 px-3 py-1">
              <Zap className="h-3.5 w-3.5 text-brand-gold" />
              <span className="text-xs font-semibold tracking-wide text-brand-gold">Visual system replica</span>
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white xl:text-6xl">
              Underwrite multifamily deals <span className="text-brand-gold">with XCreos clarity.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/55">
              A visual-only implementation of the XCreos shell, dashboard cards, financial tables, KPI widgets and responsive composition.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#workspace"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-6 py-3 font-bold text-brand-black transition-colors hover:bg-[#f3cd00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
              >
                Open mock workspace
              </a>
              <a
                href="#visual-system"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/55 transition-colors hover:text-white"
              >
                View visual system
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/7 pt-8">
              {trustItems.map(({ label, icon: Icon, className }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className={`h-3.5 w-3.5 ${className}`} />
                  <span className="text-sm text-white/40">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-0 overflow-hidden py-4">
            <div className="mx-auto w-full max-w-[560px] lg:ml-auto lg:mr-0">
              <HeroDashboardMockup />
            </div>
          </div>
        </div>
      </section>

      <section id="visual-system" className="bg-ink-25 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {['Ink scale', 'Copper accent', 'Financial widgets'].map((title) => (
            <article key={title} className="rounded-md border border-ink-100 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-ink-500">Design token</p>
              <h2 className="mt-2 text-xl font-semibold text-ink-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-500">
                Recreated as reusable React components with mock values and no backend dependencies.
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
