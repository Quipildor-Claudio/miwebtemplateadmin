import { useId, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: ReactNode
  description?: ReactNode
  disabled?: boolean
  id?: string
  name?: string
  className?: string
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id: explicitId,
  name,
  className,
}: SwitchProps) {
  const generatedId = useId()
  const id = explicitId || generatedId

  function toggle() {
    if (!disabled) {
      onChange(!checked)
    }
  }

  return (
    <div className={cn('flex items-start justify-between gap-3', className)}>
      {(label || description) && (
        <label
          htmlFor={id}
          className={cn(
            'flex flex-col select-none cursor-pointer text-left',
            disabled && 'opacity-60 cursor-not-allowed',
          )}
        >
          {label && <span className="text-sm font-medium text-ink">{label}</span>}
          {description && (
            <span className="text-xs text-ink-muted leading-relaxed">{description}</span>
          )}
        </label>
      )}

      <button
        type="button"
        role="switch"
        id={id}
        name={name}
        aria-checked={checked}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:ring-offset-2',
          checked ? 'bg-brand-600' : 'bg-surface-muted border-border',
          disabled && 'opacity-60 cursor-not-allowed',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out dark:bg-ink',
            checked ? 'translate-x-5 !bg-on-brand' : 'translate-x-0',
          )}
        />
      </button>
    </div>
  )
}
