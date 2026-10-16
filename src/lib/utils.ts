/** Une clases condicionales evitando duplicados simples. */
export function cn(...values: unknown[]): string {
  const out: string[] = []
  for (const v of values) {
    if (!v) continue
    if (Array.isArray(v)) {
      const inner = cn(...v)
      if (inner) out.push(inner)
    } else if (typeof v === 'string') {
      out.push(v)
    }
  }
  return out.join(' ')
}
