import { cn } from '../../../lib/cn'

export function WidgetCard({ title, action, children, className, bodyClassName, ...rest }) {
  return (
    <section
      className={cn(
        'flex h-full flex-col rounded-md border border-ink-100 bg-card text-card-foreground shadow-sm',
        className,
      )}
      {...rest}
    >
      <div className="flex items-center justify-between gap-3 border-b border-ink-100 px-5 py-3">
        <h2 className="text-[13px] font-semibold leading-none text-ink-900">{title}</h2>
        {action ? <div className="text-[11px] text-ink-500">{action}</div> : null}
      </div>
      <div className={cn('flex-1 px-5 py-4', bodyClassName)}>{children}</div>
    </section>
  )
}
