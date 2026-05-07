import { Menu, Moon, Plus, Search, UserRound } from 'lucide-react'
import { cn } from '../../lib/cn'

const labels = {
  '#workspace': ['Dashboard'],
  '#pipeline': ['Pipeline'],
  '#deals': ['Deals'],
  '#brokers': ['Brokers'],
  '#partners': ['Partners'],
  '#markets': ['Markets', 'Overview'],
  '#research-browser': ['Markets', 'Research Browser'],
  '#documents': ['Tools', 'Document Browser'],
}

export function AppTopBar({ activeHash, isSidebarOpen, onToggleSidebar }) {
  const crumbs = labels[activeHash] || ['Dashboard']

  return (
    <header
      data-testid="app-top-bar"
      className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-ink-100 bg-ink-0 px-4"
    >
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label={isSidebarOpen ? 'Hide side menu' : 'Show side menu'}
        aria-expanded={isSidebarOpen}
        className={cn(
          'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-ink-100 bg-ink-0 text-ink-500 transition-colors hover:text-ink-900',
          !isSidebarOpen && 'text-ink-900',
        )}
      >
        <Menu className="size-4" />
      </button>

      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-[13px] text-ink-500 md:flex">
        {crumbs.map((crumb, index) => (
          <span key={crumb} className="flex items-center gap-1.5">
            {index > 0 ? <span className="text-ink-300">/</span> : null}
            <span className={index === crumbs.length - 1 ? 'truncate font-semibold text-ink-900' : 'truncate text-ink-500'}>{crumb}</span>
          </span>
        ))}
      </nav>

      <div className="flex flex-1" />

      <button
        type="button"
        className="hidden h-8 items-center gap-2 rounded-md border border-ink-100 bg-ink-25 px-2.5 text-[12px] text-ink-500 md:flex"
        aria-label="Open command palette"
        disabled
      >
        <Search className="size-3.5" />
        <span>jump to deal, field...</span>
        <span className="ml-2 rounded border border-ink-150 bg-ink-0 px-1.5 py-px font-mono text-[10px] text-ink-500">K</span>
      </button>

      <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-md bg-copper px-2.5 text-[13px] font-medium text-ink-0 transition-colors hover:bg-copper-700">
        <Plus className="size-3.5" strokeWidth={2} />
        <span className="hidden sm:inline">New deal</span>
      </button>

      <div className="hidden min-w-0 items-center gap-2 rounded-md border border-ink-100 bg-ink-25 px-2 py-1 sm:flex">
        <span className="max-w-32 truncate text-[12px] font-medium text-ink-700">Mock Analyst</span>
        <span className="rounded-[3px] border border-copper/30 bg-copper/10 px-1.5 py-px text-[10px] font-semibold uppercase tracking-[0.04em] text-copper">
          Visual
        </span>
      </div>

      <button type="button" className="grid h-8 w-8 place-items-center rounded-md border border-ink-100 bg-ink-0 text-ink-500">
        <Moon className="size-3.5" />
      </button>
      <div className="grid h-8 w-8 place-items-center rounded-full border border-ink-100 bg-ink-25 text-ink-600">
        <UserRound className="size-4" />
      </div>
    </header>
  )
}
