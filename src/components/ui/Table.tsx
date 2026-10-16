import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  )
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-surface-muted text-left text-xs uppercase tracking-wide text-ink-muted">
      {children}
    </thead>
  )
}

export function Th({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn('whitespace-nowrap px-4 py-3 font-medium', className)}
      {...props}
    >
      {children}
    </th>
  )
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-border">{children}</tbody>
}

export function Tr({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <tr className={cn('transition-colors hover:bg-surface-muted/60', className)}>{children}</tr>
  )
}

export function Td({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('whitespace-nowrap px-4 py-3 text-ink', className)} {...props}>
      {children}
    </td>
  )
}

/** Indicador de orden reutilizable en encabezados. */
export function SortIcon({ dir }: { dir: 'asc' | 'desc' | null }) {
  return (
    <span className="ml-1.5 inline-flex flex-col gap-0.5 align-middle" aria-hidden>
      <svg
        width="8"
        height="5"
        viewBox="0 0 8 5"
        fill="currentColor"
        className={cn('transition-colors', dir === 'asc' ? 'text-ink' : 'text-ink-muted/30')}
      >
        <path d="M4 0L8 5H0L4 0Z" />
      </svg>
      <svg
        width="8"
        height="5"
        viewBox="0 0 8 5"
        fill="currentColor"
        className={cn('transition-colors', dir === 'desc' ? 'text-ink' : 'text-ink-muted/30')}
      >
        <path d="M4 5L0 0H8L4 5Z" />
      </svg>
    </span>
  )
}
