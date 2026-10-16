import type { ReactNode, SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  children: ReactNode
}

export function Select({ label, error, className, id, children, ...props }: SelectProps) {
  const selectId = id ?? props.name
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'select-caret h-10 w-full appearance-none rounded-lg border bg-surface px-3 pr-8 text-sm text-ink',
          'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25',
          error ? 'border-red-500' : 'border-border',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
