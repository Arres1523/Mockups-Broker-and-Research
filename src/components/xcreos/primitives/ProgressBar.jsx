import { cn } from '../../../lib/cn'

export function ProgressBar({ ratio, className, ariaLabel }) {
  const clamped = Math.max(0, Math.min(1, ratio))

  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-muted', className)}
    >
      <div className="h-full bg-copper transition-all" style={{ width: `${clamped * 100}%` }} />
    </div>
  )
}
