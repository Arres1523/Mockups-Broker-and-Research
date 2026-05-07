import {
  Activity,
  Building,
  Building2,
  Calculator,
  FileText,
  FolderOpen,
  Globe2,
  Handshake,
  LayoutDashboard,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react'
import { cn } from '../../lib/cn'

const workspaceItems = [
  { href: '#workspace', label: 'Dashboard', icon: LayoutDashboard },
  { href: '#pipeline', label: 'Pipeline', icon: TrendingUp },
  { href: '#deals', label: 'Deals', icon: FileText },
  { href: '#brokers', label: 'Brokers', icon: Users },
  { href: '#partners', label: 'Partners', icon: Handshake },
  { href: '#oasis-refinance', label: 'Oasis Refinance', icon: Building2 },
  { href: '#oasis-operations', label: 'Oasis Operations', icon: Building },
]

const marketItems = [
  { href: '#markets', label: 'Overview' },
  { href: '#research-browser', label: 'Research Browser' },
  { href: '#zip-county', label: 'ZIP to County' },
]

const toolItems = [
  { href: '#documents', label: 'Document Browser', icon: FolderOpen },
  { href: '#t12-parser', label: 'T-12 Parser', icon: Calculator },
  { href: '#rent-roll-parser', label: 'Rent Roll Parser', icon: Wrench },
]

function GroupLabel({ children }) {
  return <div className="px-2 pb-1 pt-3 text-[11px] font-medium text-ink-500">{children}</div>
}

function NavRow({ href, label, icon: Icon, active, indent, onNavigate }) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
        active ? 'bg-ink-100 font-semibold text-ink-900' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
        indent && 'pl-7',
      )}
    >
      {Icon ? <Icon aria-hidden className="size-[15px] shrink-0" strokeWidth={1.75} /> : null}
      <span className="truncate">{label}</span>
    </a>
  )
}

export function AppSidebar({ activeHash = '#workspace', className, onNavigate }) {
  return (
    <aside
      aria-label="Workspace navigation"
      className={cn('flex h-full w-[240px] min-w-[240px] shrink-0 flex-col overflow-x-hidden border-r border-ink-100 bg-ink-25', className)}
    >
      <div className="border-b border-ink-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-md bg-ink-900 text-[13px] font-semibold text-ink-0">X</div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-ink-900">XCreos</div>
            <div className="truncate text-[11px] text-ink-500">Capital Workspace</div>
          </div>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        <GroupLabel>Workspace</GroupLabel>
        {workspaceItems.map((item) => (
          <NavRow key={item.href} {...item} active={activeHash === item.href} onNavigate={onNavigate} />
        ))}

        <div className="mt-3 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-ink-500">
          <Globe2 aria-hidden className="size-[15px] shrink-0" strokeWidth={1.75} />
          <span className="truncate">Markets</span>
        </div>
        {marketItems.map((item) => (
          <NavRow key={item.href} {...item} active={activeHash === item.href} indent onNavigate={onNavigate} />
        ))}

        <div className="mt-3 flex items-center justify-between gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-ink-900">
          <span className="flex items-center gap-2.5">
            <Wrench aria-hidden className="size-[15px] shrink-0" strokeWidth={1.75} />
            Tools
          </span>
          <span className="rounded-[3px] border border-ink-100 bg-ink-50 px-1.5 py-px font-mono text-[9.5px] uppercase tracking-[0.04em] text-ink-500">
            mock
          </span>
        </div>
        {toolItems.map((item) => (
          <NavRow key={item.href} {...item} active={activeHash === item.href} indent onNavigate={onNavigate} />
        ))}

        <GroupLabel>Admin</GroupLabel>
        <NavRow href="#health" label="System Health" icon={Activity} active={activeHash === '#health'} onNavigate={onNavigate} />
      </nav>
    </aside>
  )
}
