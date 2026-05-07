import { cn } from '../../../lib/cn'

export function KpiCard({ label, value, helper, className }) {
  return (
    <article className={cn('flex flex-col gap-1 rounded-md border border-ink-100 bg-card px-5 py-4', className)}>
      <div className="text-[11px] font-medium uppercase tracking-[0.04em] text-ink-500">{label}</div>
      <div className="num text-[24px] font-semibold leading-tight tracking-[-0.01em] text-ink-900">{value}</div>
      {helper ? <div className="text-[11px] text-ink-500">{helper}</div> : null}
    </article>
  )
}
