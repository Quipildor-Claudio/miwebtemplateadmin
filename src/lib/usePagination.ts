import { useMemo, useState } from 'react'

/**
 * Pagina en memoria un arreglo. Reinicia a la pagina 1 cuando cambia la lista
 * resultante (p. ej. al filtrar o buscar) usando el patron de estado derivado
 * recomendado por React (sin useEffect).
 */
export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1)
  const [ref, setRef] = useState(items)

  if (ref !== items) {
    setRef(items)
    setPage(1)
  }

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(page, totalPages)

  const slice = useMemo(() => {
    const start = (current - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, current, pageSize])

  return {
    page: current,
    pageSize,
    total,
    totalPages,
    slice,
    setPage: (p: number) => setPage(Math.min(Math.max(1, p), totalPages)),
  }
}
