export type ItemStatus = 'activo' | 'inactivo' | 'pendiente'

export interface Item {
  id: number
  nombre: string
  categoria: string
  estado: ItemStatus
  responsable: string
  fecha: string
}

const CATEGORIAS = ['Hardware', 'Software', 'Redes', 'Soporte', 'Licencias']
const ESTADOS: ItemStatus[] = ['activo', 'inactivo', 'pendiente']
const PERSONAS = [
  'Ana Torres',
  'Luis Gomez',
  'Marta Ruiz',
  'Pedro Diaz',
  'Sofia Vega',
  'Carlos Mena',
]

function seeded(n: number) {
  return (n * 9301 + 49297) % 233280
}

export const ITEMS: Item[] = Array.from({ length: 87 }, (_, i) => {
  const r = seeded(i + 1)
  return {
    id: i + 1,
    nombre: `Elemento ${String(i + 1).padStart(3, '0')}`,
    categoria: CATEGORIAS[r % CATEGORIAS.length],
    estado: ESTADOS[(r >> 3) % ESTADOS.length],
    responsable: PERSONAS[(r >> 5) % PERSONAS.length],
    fecha: `2026-${String((r % 12) + 1).padStart(2, '0')}-${String((r % 27) + 1).padStart(2, '0')}`,
  }
})

export const CATEGORIA_OPTIONS = CATEGORIAS
export const ESTADO_OPTIONS = ESTADOS
