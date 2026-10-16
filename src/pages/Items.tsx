import { useMemo, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Badge, type BadgeTone } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { TableWrap, THead, Th, TBody, Tr, Td, SortIcon } from '../components/ui/Table'
import { Pagination } from '../components/ui/Pagination'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { usePagination } from '../lib/usePagination'
import {
  CATEGORIA_OPTIONS,
  ESTADO_OPTIONS,
  ITEMS,
  type Item,
  type ItemStatus,
} from '../lib/mockData'
import { IconInbox, IconPencil, IconPlus, IconSearch, IconTrash } from '../components/ui/icons'
import { useToast } from '../context/ToastContext'

const TONE: Record<ItemStatus, BadgeTone> = {
  activo: 'success',
  pendiente: 'warning',
  inactivo: 'neutral',
}

type SortKey = 'id' | 'nombre' | 'categoria' | 'estado' | 'fecha'

const HOY = new Date().toISOString().slice(0, 10)
const ITEM_VACIO: Omit<Item, 'id'> = {
  nombre: '',
  categoria: CATEGORIA_OPTIONS[0],
  estado: 'activo',
  responsable: '',
  fecha: HOY,
}

function aFormulario(item: Item | null): Omit<Item, 'id'> {
  return item
    ? {
        nombre: item.nombre,
        categoria: item.categoria,
        estado: item.estado,
        responsable: item.responsable,
        fecha: item.fecha,
      }
    : ITEM_VACIO
}

const COLUMNS: { key: SortKey; label: string; className?: string }[] = [
  { key: 'id', label: 'ID', className: 'w-20' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'categoria', label: 'Categoria' },
  { key: 'estado', label: 'Estado', className: 'w-32' },
  { key: 'fecha', label: 'Fecha', className: 'w-36' },
]

export function ItemsPage() {
  const toast = useToast()
  const [items, setItems] = useState<Item[]>(ITEMS)
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [estado, setEstado] = useState('todos')
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({
    key: 'id',
    dir: 'asc',
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Item | null>(null)
  const [toDelete, setToDelete] = useState<Item | null>(null)

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    const out = items.filter((it) => {
      if (q && !`${it.nombre} ${it.responsable}`.toLowerCase().includes(q)) return false
      if (categoria !== 'todas' && it.categoria !== categoria) return false
      if (estado !== 'todos' && it.estado !== estado) return false
      return true
    })
    out.sort((a, b) => {
      const va = a[sort.key]
      const vb = b[sort.key]
      const cmp = typeof va === 'number' && typeof vb === 'number'
        ? va - vb
        : String(va).localeCompare(String(vb))
      return sort.dir === 'asc' ? cmp : -cmp
    })
    return out
  }, [items, busqueda, categoria, estado, sort])

  const pager = usePagination(filtrados, 10)

  function toggleSort(key: SortKey) {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    )
  }

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(item: Item) {
    setEditing(item)
    setModalOpen(true)
  }

  function save(data: Omit<Item, 'id'>) {
    if (editing) {
      setItems((list) => list.map((it) => (it.id === editing.id ? { ...editing, ...data } : it)))
      toast.success(`"${data.nombre}" se actualizó correctamente.`, {
        title: 'Elemento actualizado',
      })
    } else {
      const id = Math.max(0, ...items.map((i) => i.id)) + 1
      setItems((list) => [{ id, ...data }, ...list])
      toast.success(`"${data.nombre}" se añadió al inventario.`, {
        title: 'Elemento creado',
      })
    }
    setModalOpen(false)
  }

  function confirmDelete() {
    if (toDelete) {
      setItems((list) => list.filter((it) => it.id !== toDelete.id))
      toast.info(`"${toDelete.nombre}" fue eliminado del sistema.`, {
        title: 'Elemento eliminado',
      })
    }
    setToDelete(null)
  }

  const hayFiltros = busqueda !== '' || categoria !== 'todas' || estado !== 'todos'

  return (
    <>
      <PageHeader
        title="Elementos"
        description="Gestiona el inventario de elementos del sistema."
        actions={
          <Button leftIcon={<IconPlus size={16} />} onClick={openCreate}>
            Nuevo elemento
          </Button>
        }
      />

      <Card>
        {/* Barra de busqueda y filtros */}
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-end">
          <div className="lg:max-w-xs lg:flex-1">
            <Input
              name="buscar"
              type="search"
              aria-label="Buscar por nombre o responsable"
              placeholder="Buscar por nombre o responsable…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              leftIcon={<IconSearch size={16} />}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:max-w-md">
            <Select name="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="todas">Todas las categorias</option>
              {CATEGORIA_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select name="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="todos">Todos los estados</option>
              {ESTADO_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
          {hayFiltros && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setBusqueda('')
                setCategoria('todas')
                setEstado('todos')
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        {pager.total === 0 ? (
          <EmptyState
            icon={<IconInbox size={22} />}
            title="Sin resultados"
            description="No se encontraron elementos con los filtros actuales."
            action={
              hayFiltros && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setBusqueda('')
                    setCategoria('todas')
                    setEstado('todos')
                  }}
                >
                  Limpiar filtros
                </Button>
              )
            }
          />
        ) : (
          <>
            <TableWrap>
              <THead>
                <tr>
                  {COLUMNS.map((col) => (
                    <Th key={col.key} className={col.className}>
                      <button
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex items-center hover:text-ink"
                      >
                        {col.label}
                        <SortIcon dir={sort.key === col.key ? sort.dir : null} />
                      </button>
                    </Th>
                  ))}
                  <Th className="w-24 text-right">Acciones</Th>
                </tr>
              </THead>
              <TBody>
                {pager.slice.map((it) => (
                  <Tr key={it.id}>
                    <Td className="text-ink-muted">#{it.id}</Td>
                    <Td className="font-medium">{it.nombre}</Td>
                    <Td>{it.categoria}</Td>
                    <Td>
                      <Badge tone={TONE[it.estado]}>{it.estado}</Badge>
                    </Td>
                    <Td className="text-ink-muted">{it.fecha}</Td>
                    <Td className="text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => openEdit(it)}
                          aria-label="Editar"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-surface-muted hover:text-ink"
                        >
                          <IconPencil size={16} />
                        </button>
                        <button
                          onClick={() => setToDelete(it)}
                          aria-label="Eliminar"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </TableWrap>

            <div className="border-t border-border p-4">
              <Pagination
                page={pager.page}
                pageSize={pager.pageSize}
                total={pager.total}
                onPageChange={pager.setPage}
              />
            </div>
          </>
        )}
      </Card>

      <ItemModal
        open={modalOpen}
        item={editing}
        onClose={() => setModalOpen(false)}
        onSave={save}
      />

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Eliminar elemento"
        footer={
          <>
            <Button variant="secondary" onClick={() => setToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Eliminar
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          ¿Seguro que deseas eliminar <span className="font-medium text-ink">{toDelete?.nombre}</span>?
          Esta accion no se puede deshacer.
        </p>
      </Modal>
    </>
  )
}

function ItemModal({
  open,
  item,
  onClose,
  onSave,
}: {
  open: boolean
  item: Item | null
  onClose: () => void
  onSave: (data: Omit<Item, 'id'>) => void
}) {
  const [form, setForm] = useState<Omit<Item, 'id'>>(() => aFormulario(item))

  // Re-sincroniza el formulario cuando cambia el elemento a editar.
  const key = item?.id ?? 'new'
  const [lastKey, setLastKey] = useState<string | number>(key)
  if (key !== lastKey) {
    setLastKey(key)
    setForm(aFormulario(item))
  }

  const valid = form.nombre.trim() !== ''

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item ? 'Editar elemento' : 'Nuevo elemento'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={!valid} onClick={() => onSave(form)}>
            Guardar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          placeholder="Nombre del elemento"
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Categoria"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          >
            {CATEGORIA_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select
            label="Estado"
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value as ItemStatus })}
          >
            {ESTADO_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Responsable"
            value={form.responsable}
            onChange={(e) => setForm({ ...form, responsable: e.target.value })}
          />
          <Input
            label="Fecha"
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          />
        </div>
      </div>
    </Modal>
  )
}
