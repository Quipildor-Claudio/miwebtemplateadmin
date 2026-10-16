import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/utils'

interface TabsContextValue {
  value: string
  onChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs compound components must be used within <Tabs>')
  return ctx
}

export interface TabsProps {
  value: string
  onChange: (value: string) => void
  children: ReactNode
  className?: string
}

export function Tabs({ value, onChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className={cn('w-full space-y-4', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'underline' | 'pills'
}

export function TabsList({
  children,
  className,
  variant = 'underline',
  ...props
}: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1 overflow-x-auto',
        variant === 'underline' && 'border-b border-border',
        variant === 'pills' && 'rounded-lg bg-surface-muted p-1 border border-border inline-flex',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  icon?: ReactNode
  badge?: ReactNode
  variant?: 'underline' | 'pills'
}

export function TabsTrigger({
  value,
  children,
  icon,
  badge,
  className,
  variant = 'underline',
  ...props
}: TabsTriggerProps) {
  const { value: activeValue, onChange } = useTabsContext()
  const isActive = activeValue === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onChange(value)}
      className={cn(
        'inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/25',
        variant === 'underline' && [
          'relative px-3 py-2.5 -mb-px border-b-2',
          isActive
            ? 'border-brand-600 text-ink font-semibold'
            : 'border-transparent text-ink-muted hover:border-border hover:text-ink',
        ],
        variant === 'pills' && [
          'rounded-md px-3 py-1.5',
          isActive
            ? 'bg-surface text-ink shadow-xs font-semibold'
            : 'text-ink-muted hover:text-ink hover:bg-surface/50',
        ],
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {badge !== undefined && (
        <span
          className={cn(
            'rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none',
            isActive ? 'bg-brand-600 text-on-brand' : 'bg-surface-muted text-ink-muted',
          )}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({ value, children, className, ...props }: TabsContentProps) {
  const { value: activeValue } = useTabsContext()
  if (activeValue !== value) return null

  return (
    <div
      role="tabpanel"
      className={cn('animate-fade-in focus-visible:outline-none', className)}
      {...props}
    >
      {children}
    </div>
  )
}
