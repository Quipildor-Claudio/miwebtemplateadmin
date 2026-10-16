import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/utils'

interface DropdownContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  close: () => void
}

const DropdownContext = createContext<DropdownContextValue | null>(null)

function useDropdownContext() {
  const ctx = useContext(DropdownContext)
  if (!ctx) throw new Error('Dropdown compound components must be used within <Dropdown>')
  return ctx
}

export interface DropdownProps {
  children: ReactNode
  className?: string
}

export function Dropdown({ children, className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close()
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <DropdownContext.Provider value={{ open, setOpen, close }}>
      <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export interface DropdownTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function DropdownTrigger({ children, className, onClick, ...props }: DropdownTriggerProps) {
  const { open, setOpen } = useDropdownContext()

  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={(e) => {
        setOpen(!open)
        onClick?.(e)
      }}
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      {children}
    </button>
  )
}

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'right'
  width?: string
}

export function DropdownMenu({
  children,
  align = 'right',
  width = 'w-56',
  className,
  ...props
}: DropdownMenuProps) {
  const { open } = useDropdownContext()

  if (!open) return null

  return (
    <div
      role="menu"
      aria-orientation="vertical"
      className={cn(
        'absolute z-40 mt-1.5 animate-scale-in rounded-card border border-border bg-surface p-1 shadow-lg backdrop-blur-sm',
        align === 'right' ? 'right-0' : 'left-0',
        width,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
  destructive?: boolean
}

export function DropdownItem({
  children,
  icon,
  destructive = false,
  disabled = false,
  className,
  onClick,
  ...props
}: DropdownItemProps) {
  const { close } = useDropdownContext()

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={(e) => {
        if (!disabled) {
          onClick?.(e)
          close()
        }
      }}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors text-left',
        destructive
          ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
          : 'text-ink hover:bg-surface-muted',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0 text-ink-muted">{icon}</span>}
      <span className="truncate flex-1">{children}</span>
    </button>
  )
}

export function DropdownHeader({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string
  subtitle?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('px-2.5 py-2 text-left border-b border-border mb-1', className)}>
      {title && <p className="text-xs font-semibold text-ink truncate">{title}</p>}
      {subtitle && <p className="text-[11px] text-ink-muted truncate">{subtitle}</p>}
      {children}
    </div>
  )
}

export function DropdownDivider({ className }: { className?: string }) {
  return <div className={cn('my-1 border-t border-border', className)} role="separator" />
}
