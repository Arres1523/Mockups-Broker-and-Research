import { useState } from 'react'
import { cn } from '../../lib/cn'
import { AppSidebar } from './AppSidebar'
import { AppTopBar } from './AppTopBar'
import { PortfolioDashboardView } from './PortfolioDashboardView'

export function AppShell({ activeHash }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <AppSidebar activeHash={activeHash} className="hidden lg:flex" />

        {sidebarOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close side menu"
              className="absolute inset-0 bg-ink-900/35"
              onClick={() => setSidebarOpen(false)}
            />
            <AppSidebar
              activeHash={activeHash}
              className="relative h-full shadow-xl"
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>
        ) : null}

        <div className={cn('flex min-w-0 flex-1 flex-col')}>
          <AppTopBar
            activeHash={activeHash}
            isSidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((current) => !current)}
          />
          <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8">
            <PortfolioDashboardView />
          </main>
        </div>
      </div>
    </div>
  )
}
