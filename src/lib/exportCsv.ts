/**
 * Exporta un arreglo de datos a formato CSV y dispara la descarga en el navegador.
 * Incluye BOM UTF-8 (\uFEFF) para compatibilidad total con Excel y caracteres especiales.
 */
export function exportToCsv<T extends object>(
  filename: string,
  data: T[],
  columns?: { key: keyof T; label: string }[],
) {
  if (data.length === 0) return

  const cols =
    columns ??
    (Object.keys(data[0] as object).map((k) => ({
      key: k as keyof T,
      label: k,
    })))

  const headerRow = cols.map((c) => `"${String(c.label).replace(/"/g, '""')}"`).join(',')

  const bodyRows = data.map((item) =>
    cols
      .map((c) => {
        const val = item[c.key]
        if (val === null || val === undefined) return '""'
        const escaped = String(val).replace(/"/g, '""')
        return `"${escaped}"`
      })
      .join(','),
  )

  const csvContent = '\uFEFF' + [headerRow, ...bodyRows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
