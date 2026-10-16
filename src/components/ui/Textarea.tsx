import type { ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: ReactNode
  error?: string
}

export function Textarea({
  label,
  hint,
  error,
  className,
  id,
  rows = 3,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={cn(
          'w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink transition',
          'placeholder:text-ink-muted/70',
          'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          error ? 'border-red-500' : 'border-border',
          className,
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  )
}
