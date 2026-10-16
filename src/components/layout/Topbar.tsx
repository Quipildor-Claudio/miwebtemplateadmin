import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import {
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '../ui/Dropdown'
import {
  IconBell,
  IconCheck,
  IconLogout,
  IconMoon,
  IconSearch,
  IconSettings,
  IconSun,
  IconUser,
} from '../ui/icons'

const MOCK_NOTIFS = [
  { id: 1, title: 'Nuevo elemento registrado', time: 'Hace 5 min', unread: true },
  { id: 2, title: 'Copia de seguridad completada', time: 'Hace 1 hora', unread: true },
  { id: 3, title: 'Actualización del sistema aplicada', time: 'Ayer', unread: false },
]

export function Topbar() {
  const { theme, toggle } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notifs, setNotifs] = useState(MOCK_NOTIFS)

  const unreadCount = notifs.filter((n) => n.unread).length

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'

  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border px-4 sm:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-on-brand">
          A
        </span>
      </div>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
          <IconSearch size={16} />
        </span>
        <input
          type="search"
          aria-label="Buscar en la aplicación"
          placeholder="Buscar…"
          className="h-9 w-full rounded-lg border border-border bg-surface-muted pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted/70 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={toggle}
          aria-label="Cambiar tema"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
        >
          {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
        </button>

        {/* Notificaciones */}
        <Dropdown>
          <DropdownTrigger
            aria-label="Notificaciones"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <IconBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-600" />
            )}
          </DropdownTrigger>
          <DropdownMenu width="w-80" align="right">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-xs font-semibold text-ink">Notificaciones</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink transition-colors"
                >
                  <IconCheck size={12} />
                  Marcar leídas
                </button>
              )}
            </div>
            <div className="max-h-64 divide-y divide-border overflow-y-auto p-1">
              {notifs.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-2.5 rounded-md p-2.5 hover:bg-surface-muted transition-colors"
                >
                  {n.unread && <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-ink">{n.title}</p>
                    <p className="text-[10px] text-ink-muted mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DropdownMenu>
        </Dropdown>

        {/* Menú de Usuario */}
        <Dropdown>
          <DropdownTrigger
            aria-label="Menú de usuario"
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-surface-muted transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted border border-border text-xs font-semibold text-ink">
              {initials}
            </div>
          </DropdownTrigger>
          <DropdownMenu width="w-56" align="right">
            <DropdownHeader
              title={user?.name ?? 'Usuario'}
              subtitle={user?.email ?? 'admin@demo.com'}
            />
            <DropdownItem icon={<IconUser size={15} />} onClick={() => navigate('/settings')}>
              Mi perfil
            </DropdownItem>
            <DropdownItem
              icon={<IconSettings size={15} />}
              onClick={() => navigate('/settings')}
            >
              Ajustes generales
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
              destructive
              icon={<IconLogout size={15} />}
              onClick={logout}
            >
              Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  )
}
