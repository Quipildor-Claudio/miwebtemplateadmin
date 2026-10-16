import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/utils'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: ReactNode
  helperText?: ReactNode
  error?: string
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      error,
      checked = false,
      indeterminate = false,
      onChange,
      disabled,
      className,
      id: explicitId,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const id = explicitId || generatedId

    return (
      <div className={cn('flex items-start gap-3', className)}>
        <div className="flex h-5 items-center">
          <div className="relative flex items-center justify-center">
            <input
              id={id}
              ref={ref}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={(e) => onChange?.(e.target.checked)}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                'flex h-4.5 w-4.5 items-center justify-center rounded border transition-colors',
                'border-border bg-surface text-on-brand shadow-xs',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/30 peer-focus-visible:ring-offset-1',
                (checked || indeterminate) && 'border-brand-600 bg-brand-600',
                error && 'border-red-500 focus-visible:ring-red-500/30',
                disabled && 'opacity-60 cursor-not-allowed',
                !disabled && 'cursor-pointer hover:border-ink-muted/60',
              )}
            >
              {indeterminate ? (
                <span className="h-0.5 w-2 rounded-xs bg-on-brand" />
              ) : checked ? (
                <svg
                  className="h-3 w-3 stroke-current stroke-2 fill-none"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : null}
            </div>
          </div>
        </div>

        {(label || helperText || error) && (
          <div className="flex flex-col text-left">
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  'text-sm font-medium text-ink select-none',
                  disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
                )}
              >
                {label}
              </label>
            )}
            {helperText && !error && (
              <p className="text-xs text-ink-muted leading-relaxed">{helperText}</p>
            )}
            {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
          </div>
        )}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'
