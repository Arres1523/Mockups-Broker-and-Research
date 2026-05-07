import { cn } from '../../../lib/cn'

export function StackedBar({ segments, className }) {
  if (!segments.length) {
    return <div className={cn('h-2 w-full rounded-full bg-muted/50', className)} aria-hidden="true" />
  }

  return (
    <div className={cn('flex h-2 w-full overflow-hidden rounded-full', className)}>
      {segments.map((segment, index) => (
        <div
          key={segment.key}
          title={segment.title}
          className={cn('h-full', index > 0 && 'border-l border-background')}
          style={{
            width: `${Math.max(0, segment.widthRatio) * 100}%`,
            backgroundColor: segment.color,
          }}
        />
      ))}
    </div>
  )
}
