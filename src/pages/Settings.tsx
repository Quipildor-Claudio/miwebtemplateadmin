import { useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Button } from '../components/ui/Button'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

export function SettingsPage() {
  const { theme, toggle } = useTheme()
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)

  return (
    <>
      <PageHeader title="Ajustes" description="Configuracion general de la aplicacion." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Perfil" description="Datos del usuario activo" />
          <CardBody className="space-y-4">
            <Input label="Nombre" defaultValue={user?.name} />
            <Input label="Correo" defaultValue={user?.email} />
            <Select label="Idioma" defaultValue="es">
              <option value="es">Espanol</option>
              <option value="en">English</option>
            </Select>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Apariencia" description="Tema de la interfaz" />
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-ink">Tema {theme === 'dark' ? 'oscuro' : 'claro'}</p>
                <p className="text-xs text-ink-muted">Cambia entre claro y oscuro</p>
              </div>
              <Button variant="secondary" size="sm" onClick={toggle}>
                Cambiar
              </Button>
            </div>

            {saved && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-muted px-3 py-2 text-xs font-medium text-ink animate-fade-in">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Cambios guardados correctamente.
              </div>
            )}
            <Button
              onClick={() => {
                setSaved(true)
                setTimeout(() => setSaved(false), 3000)
              }}
            >
              Guardar cambios
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
