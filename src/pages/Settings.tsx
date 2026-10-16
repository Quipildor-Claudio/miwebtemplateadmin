import { useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Textarea } from '../components/ui/Textarea'
import { Switch } from '../components/ui/Switch'
import { Checkbox } from '../components/ui/Checkbox'
import { Button } from '../components/ui/Button'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export function SettingsPage() {
  const { theme, toggle } = useTheme()
  const { user } = useAuth()
  const toast = useToast()

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
        description="Configuracion general del perfil, preferencias y apariencia."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Perfil" description="Información pública del usuario" />
          <CardBody className="space-y-4">
            <Input label="Nombre" defaultValue={user?.name} />
            <Input label="Correo" type="email" defaultValue={user?.email} />
            <Select label="Idioma" defaultValue="es">
              <option value="es">Español</option>
              <option value="en">English</option>
            </Select>
            <Textarea
              label="Biografía / Notas"
              placeholder="Escribe una breve descripción o notas sobre tu puesto..."
              defaultValue="Administrador de plataforma con permisos globales."
              rows={3}
            />
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Apariencia y Sistema" description="Preferencia visual de la interfaz" />
            <CardBody className="space-y-4">
              <Switch
                label="Tema oscuro"
                description="Cambia el contraste entre el modo claro y modo oscuro real."
                checked={theme === 'dark'}
                onChange={toggle}
              />
              <div className="border-t border-border pt-4">
                <Switch
                  label="Autenticación de dos pasos (2FA)"
                  description="Añade un nivel extra de seguridad al iniciar sesión."
                  checked={twoFactor}
                  onChange={(val) => {
                    setTwoFactor(val)
                    if (val) {
                      toast.info('2FA configurado temporalmente en modo demostración.')
                    }
                  }}
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Notificaciones" description="Controla cómo recibes avisos y reportes" />
            <CardBody className="space-y-3">
              <Checkbox
                label="Alertas críticas por correo"
                helperText="Recibir alertas cuando se detecte actividad inusual."
                checked={emailAlerts}
                onChange={setEmailAlerts}
              />
              <Checkbox
                label="Resumen semanal del sistema"
                helperText="Envío automático cada lunes con métricas consolidadas."
                checked={weeklyDigest}
                onChange={setWeeklyDigest}
              />

              <div className="pt-3">
                <Button onClick={handleSave}>Guardar cambios</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  )
}
