import type { ReactNode } from 'react'
import { Card } from './Card'
import { cn } from '../../lib/utils'

export function StatCard({
  label,
  value,
  delta,
  trend = 'up',
  icon,
}: {
  label: string
  value: ReactNode
  delta?: string
  trend?: 'up' | 'down'
  icon?: ReactNode
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
          {delta && (
            <p
              className={cn(
                'mt-1 text-xs font-medium',
                trend === 'up' ? 'text-emerald-600' : 'text-red-600',
              )}
            >
              {trend === 'up' ? '▲' : '▼'} {delta}
            </p>
          )}
        </div>
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-ink-muted">
            {icon}
          </span>
        )}
      </div>
    </Card>
  )
}
