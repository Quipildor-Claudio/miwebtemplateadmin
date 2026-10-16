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
import {
  IconDotsVertical,
  IconDownload,
  IconInbox,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
} from '../components/ui/icons'
import { useToast } from '../context/ToastContext'
import { SkeletonTable } from '../components/ui/Skeleton'
import { Checkbox } from '../components/ui/Checkbox'
import { exportToCsv } from '../lib/exportCsv'
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '../components/ui/Dropdown'

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
  const [loading, setLoading] = useState(false)
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({
    key: 'id',
    dir: 'asc',
  })

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Item | null>(null)
  const [toDelete, setToDelete] = useState<Item | null>(null)

  function simulateReload() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.info('Inventario sincronizado correctamente.')
    }, 600)
  }

  function duplicate(item: Item) {
    const id = Math.max(0, ...items.map((i) => i.id)) + 1
    const copy: Item = {
      ...item,
      id,
      nombre: `${item.nombre} (Copia)`,
      fecha: new Date().toISOString().slice(0, 10),
    }
    setItems((list) => [copy, ...list])
    toast.success(`Se creó una copia de "${item.nombre}".`, {
      title: 'Elemento duplicado',
    })
  }

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

  const isSelected = (id: number) => selectedIds.has(id)

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const isAllPageSelected =
    pager.slice.length > 0 && pager.slice.every((it) => selectedIds.has(it.id))

  const isSomePageSelected =
    pager.slice.some((it) => selectedIds.has(it.id)) && !isAllPageSelected

  function toggleSelectAllOnPage() {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (isAllPageSelected) {
        pager.slice.forEach((it) => next.delete(it.id))
      } else {
        pager.slice.forEach((it) => next.add(it.id))
      }
      return next
    })
  }

  function handleExport(selectedOnly = false) {
    const dataToExport = selectedOnly
      ? items.filter((it) => selectedIds.has(it.id))
      : filtrados

    if (dataToExport.length === 0) {
      toast.warning('No hay datos para exportar.')
      return
    }

    exportToCsv(
      selectedOnly ? 'elementos_seleccionados' : 'inventario_elementos',
      dataToExport,
      [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'categoria', label: 'Categoría' },
        { key: 'estado', label: 'Estado' },
        { key: 'responsable', label: 'Responsable' },
        { key: 'fecha', label: 'Fecha' },
      ],
    )

    toast.success(`Se exportaron ${dataToExport.length} elementos a formato CSV con éxito.`, {
      title: 'Exportación lista',
    })
  }

  function bulkChangeStatus(nuevoEstado: ItemStatus) {
    const count = selectedIds.size
    setItems((prev) =>
      prev.map((it) => (selectedIds.has(it.id) ? { ...it, estado: nuevoEstado } : it)),
    )
    toast.success(`Se actualizaron ${count} elementos al estado "${nuevoEstado}".`)
    setSelectedIds(new Set())
  }

  function confirmBulkDelete() {
    const count = selectedIds.size
    setItems((prev) => prev.filter((it) => !selectedIds.has(it.id)))
    toast.info(`Se eliminaron ${count} elementos del sistema.`, {
      title: 'Eliminación masiva',
    })
    setSelectedIds(new Set())
    setBulkDeleteOpen(false)
  }

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
        description="Gestiona el inventario de elementos del sistema con filtros, selección masiva y exportación."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              leftIcon={<IconDownload size={15} />}
              onClick={() => handleExport(false)}
            >
              Exportar CSV
            </Button>
            <Button variant="secondary" onClick={simulateReload} disabled={loading}>
              {loading ? 'Cargando…' : 'Simular Carga'}
            </Button>
            <Button leftIcon={<IconPlus size={16} />} onClick={openCreate}>
              Nuevo elemento
            </Button>
          </div>
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

        {/* Barra de acciones masivas cuando hay filas seleccionadas */}
        {selectedIds.size > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-500/20 bg-brand-500/10 px-4 py-2.5 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-ink">
                {selectedIds.size}{' '}
                {selectedIds.size === 1 ? 'elemento seleccionado' : 'elementos seleccionados'}
              </span>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-xs text-ink-muted hover:text-ink underline cursor-pointer"
              >
                Deseleccionar todos
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<IconDownload size={14} />}
                onClick={() => handleExport(true)}
              >
                Exportar ({selectedIds.size})
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => bulkChangeStatus('activo')}
              >
                Marcar activos
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => bulkChangeStatus('inactivo')}
              >
                Marcar inactivos
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => setBulkDeleteOpen(true)}
              >
                Eliminar ({selectedIds.size})
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="p-4">
            <SkeletonTable rows={7} columns={5} />
          </div>
        ) : pager.total === 0 ? (
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
                  <Th className="w-10">
                    <Checkbox
                      aria-label="Seleccionar todos los elementos visibles"
                      checked={isAllPageSelected}
                      indeterminate={isSomePageSelected}
                      onChange={toggleSelectAllOnPage}
                    />
                  </Th>
                  {COLUMNS.map((col) => (
                    <Th key={col.key} className={col.className}>
                      <button
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex items-center hover:text-ink cursor-pointer"
                      >
                        {col.label}
                        <SortIcon dir={sort.key === col.key ? sort.dir : null} />
                      </button>
                    </Th>
                  ))}
                  <Th className="w-20 text-right">Acciones</Th>
                </tr>
              </THead>
              <TBody>
                {pager.slice.map((it) => (
                  <Tr
                    key={it.id}
                    className={isSelected(it.id) ? 'bg-brand-500/5 font-medium' : undefined}
                  >
                    <Td className="w-10">
                      <Checkbox
                        aria-label={`Seleccionar ${it.nombre}`}
                        checked={isSelected(it.id)}
                        onChange={() => toggleSelect(it.id)}
                      />
                    </Td>
                    <Td className="text-ink-muted">#{it.id}</Td>
                    <Td className="font-medium">{it.nombre}</Td>
                    <Td>{it.categoria}</Td>
                    <Td>
                      <Badge tone={TONE[it.estado]}>{it.estado}</Badge>
                    </Td>
                    <Td className="text-ink-muted">{it.fecha}</Td>
                    <Td className="text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(it)}
                          aria-label="Editar"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors cursor-pointer"
                        >
                          <IconPencil size={15} />
                        </button>

                        <Dropdown>
                          <DropdownTrigger
                            aria-label="Más opciones"
                            className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors cursor-pointer"
                          >
                            <IconDotsVertical size={15} />
                          </DropdownTrigger>
                          <DropdownMenu width="w-36" align="right">
                            <DropdownItem
                              icon={<IconPencil size={14} />}
                              onClick={() => openEdit(it)}
                            >
                              Editar
                            </DropdownItem>
                            <DropdownItem
                              icon={<IconPlus size={14} />}
                              onClick={() => duplicate(it)}
                            >
                              Duplicar
                            </DropdownItem>
                            <DropdownDivider />
                            <DropdownItem
                              destructive
                              icon={<IconTrash size={14} />}
                              onClick={() => setToDelete(it)}
                            >
                              Eliminar
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
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
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        title="Eliminar elementos seleccionados"
        footer={
          <>
            <Button variant="secondary" onClick={() => setBulkDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmBulkDelete}>
              Eliminar ({selectedIds.size})
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          ¿Seguro que deseas eliminar los{' '}
          <span className="font-semibold text-ink">{selectedIds.size}</span> elementos seleccionados?
          Esta acción no se puede deshacer.
        </p>
      </Modal>

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
