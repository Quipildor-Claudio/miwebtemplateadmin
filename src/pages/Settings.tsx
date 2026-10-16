import { useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Textarea } from '../components/ui/Textarea'
import { Switch } from '../components/ui/Switch'
import { Checkbox } from '../components/ui/Checkbox'
import { Button } from '../components/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { IconMoon, IconSettings, IconUser } from '../components/ui/icons'

export function SettingsPage() {
  const { theme, toggle } = useTheme()
  const { user } = useAuth()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState('perfil')
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)

  function handleSave() {
    toast.success('Los cambios se guardaron correctamente.', {
      title: 'Ajustes actualizados',
    })
  }

  return (
    <>
      <PageHeader
        title="Ajustes"
        description="Configuración de tu cuenta, preferencias de interfaz y seguridad."
      />

      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabsList variant="underline">
          <TabsTrigger value="perfil" icon={<IconUser size={16} />}>
            Perfil
          </TabsTrigger>
          <TabsTrigger value="apariencia" icon={<IconMoon size={16} />}>
            Apariencia
          </TabsTrigger>
          <TabsTrigger
            value="seguridad"
            icon={<IconSettings size={16} />}
            badge={twoFactor ? '2FA ON' : undefined}
          >
            Seguridad y Alertas
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Perfil */}
        <TabsContent value="perfil">
          <div className="max-w-2xl">
            <Card>
              <CardHeader
                title="Información Personal"
                description="Estos datos identifican tu cuenta en el panel."
              />
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Nombre" defaultValue={user?.name} />
                  <Input label="Rol en el sistema" defaultValue={user?.role} disabled />
                </div>
                <Input label="Correo electrónico" type="email" defaultValue={user?.email} />
                <Select label="Idioma del panel" defaultValue="es">
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </Select>
                <Textarea
                  label="Biografía / Notas de perfil"
                  placeholder="Escribe una breve descripción o notas..."
                  defaultValue="Administrador de plataforma con permisos globales."
                  rows={3}
                />
                <div className="pt-2">
                  <Button onClick={handleSave}>Guardar perfil</Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Apariencia */}
        <TabsContent value="apariencia">
          <div className="max-w-2xl">
            <Card>
              <CardHeader
                title="Tema visual del sistema"
                description="Alterna entre el modo claro de alto contraste y el modo oscuro con grises neutros."
              />
              <CardBody className="space-y-4">
                <Switch
                  label="Tema oscuro"
                  description="Ajusta el fondo a negro real y textos con tipografía legible."
                  checked={theme === 'dark'}
                  onChange={toggle}
                />
              </CardBody>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Seguridad y Notificaciones */}
        <TabsContent value="seguridad">
          <div className="max-w-2xl space-y-4">
            <Card>
              <CardHeader
                title="Autenticación y Seguridad"
                description="Protege el acceso a tus credenciales y sesiones activas."
              />
              <CardBody className="space-y-4">
                <Switch
                  label="Autenticación de dos pasos (2FA)"
                  description="Solicita un código temporal además de la contraseña al ingresar."
                  checked={twoFactor}
                  onChange={(val) => {
                    setTwoFactor(val)
                    if (val) {
                      toast.info('2FA activado en modo de demostración.')
                    } else {
                      toast.warning('2FA desactivado.')
                    }
                  }}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title="Canales de notificación"
                description="Selecciona qué tipos de eventos deseas recibir por email."
              />
              <CardBody className="space-y-3">
                <Checkbox
                  label="Alertas críticas por correo"
                  helperText="Notificar de inmediato ante intentos fallidos de acceso o cambios de rol."
                  checked={emailAlerts}
                  onChange={setEmailAlerts}
                />
                <Checkbox
                  label="Resumen semanal del inventario"
                  helperText="Recibir un reporte consolidado cada lunes por la mañana."
                  checked={weeklyDigest}
                  onChange={setWeeklyDigest}
                />
                <div className="pt-2">
                  <Button onClick={handleSave}>Actualizar seguridad</Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
