import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Badge, type BadgeTone } from '../components/ui/Badge'
import { TableWrap, THead, Th, TBody, Tr, Td } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { ITEMS, type ItemStatus } from '../lib/mockData'
import { IconItems, IconPlus, IconSettings, IconDashboard } from '../components/ui/icons'

const TONE: Record<ItemStatus, BadgeTone> = {
  activo: 'success',
  pendiente: 'warning',
  inactivo: 'neutral',
}

const SERIE = [42, 58, 51, 63, 72, 66, 80]

export function DashboardPage() {
  const max = Math.max(...SERIE)
  const recientes = ITEMS.slice(0, 5)

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Resumen general del sistema."
        actions={
          <Button size="sm" leftIcon={<IconPlus size={16} />}>
            Nuevo registro
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total elementos" value={ITEMS.length} delta="4.5%" icon={<IconItems size={18} />} />
        <StatCard label="Activos" value={ITEMS.filter((i) => i.estado === 'activo').length} delta="2.1%" icon={<IconDashboard size={18} />} />
        <StatCard label="Pendientes" value={ITEMS.filter((i) => i.estado === 'pendiente').length} delta="1.2%" trend="down" icon={<IconSettings size={18} />} />
        <StatCard label="Categorias" value={5} icon={<IconItems size={18} />} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Actividad" description="Ultimos 7 dias" />
          <CardBody>
            <div className="flex h-48 items-end gap-3">
              {SERIE.map((v, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-md bg-brand-500/70 transition-colors duration-200 hover:bg-brand-600"
                      style={{ height: `${(v / max) * 100}%` }}
                      title={String(v)}
                    />
                  </div>
                  <span className="text-[10px] text-ink-muted">D{i + 1}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recientes" description="Ultimos movimientos" />
          <ul className="divide-y divide-border">
            {recientes.map((it) => (
              <li key={it.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{it.nombre}</p>
                  <p className="truncate text-xs text-ink-muted">{it.responsable}</p>
                </div>
                <Badge tone={TONE[it.estado]}>{it.estado}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Ultimos elementos" />
        <TableWrap>
          <THead>
            <tr>
              <Th>ID</Th>
              <Th>Nombre</Th>
              <Th>Categoria</Th>
              <Th>Estado</Th>
              <Th>Fecha</Th>
            </tr>
          </THead>
          <TBody>
            {recientes.map((it) => (
              <Tr key={it.id}>
                <Td className="text-ink-muted">#{it.id}</Td>
                <Td className="font-medium">{it.nombre}</Td>
                <Td>{it.categoria}</Td>
                <Td>
                  <Badge tone={TONE[it.estado]}>{it.estado}</Badge>
                </Td>
                <Td className="text-ink-muted">{it.fecha}</Td>
              </Tr>
            ))}
          </TBody>
        </TableWrap>
      </Card>
    </>
  )
}
