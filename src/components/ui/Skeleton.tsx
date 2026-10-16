import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse rounded-md bg-border/70 dark:bg-border/50',
        className,
      )}
      {...props}
    />
  )
}

/** Pre-construido para simular la carga de una tarjeta completa */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-card border border-border bg-surface p-5 space-y-4',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-40" />
    </div>
  )
}

/** Pre-construido para simular una tabla con cabecera y filas */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={cn('w-full overflow-hidden rounded-card border border-border bg-surface', className)}>
      <div className="flex items-center gap-4 border-b border-border bg-surface-muted px-4 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-4 py-3.5">
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton
                key={c}
                className={cn('h-4 flex-1', c === 0 && 'w-16 flex-none')}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
