import { cn } from '../../lib/utils'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

function pagesToShow(current: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const pages: (number | '...')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(totalPages - 1, current + 1)
  if (start > 2) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages - 1) pages.push('...')
  pages.push(totalPages)
  return pages
}

export function Pagination({ page, pageSize, total, onPageChange, className }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const navBase =
    'inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40'
  const navIdle = 'border-border bg-surface text-ink hover:bg-surface-muted'
  const navBtn = cn(navBase, navIdle)

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-3 sm:flex-row',
        className,
      )}
    >
      <p className="text-xs text-ink-muted">
        Mostrando <span className="font-medium text-ink">{from}</span>–
        <span className="font-medium text-ink">{to}</span> de{' '}
        <span className="font-medium text-ink">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          className={navBtn}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Pagina anterior"
        >
          ‹
        </button>

        {pagesToShow(page, totalPages).map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} className="px-1 text-ink-muted">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={cn(
                navBase,
                p === page ? 'border-brand-600 bg-brand-600 font-medium text-on-brand' : navIdle,
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          className={navBtn}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Pagina siguiente"
        >
          ›
        </button>
      </div>
    </div>
  )
}
