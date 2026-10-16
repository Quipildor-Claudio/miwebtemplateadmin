import { useTheme } from '../../context/ThemeContext'
import { IconBell, IconMoon, IconSearch, IconSun } from '../ui/icons'

export function Topbar() {
  const { theme, toggle } = useTheme()

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

      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={toggle}
          aria-label="Cambiar tema"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
        >
          {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
        </button>
        <button
          aria-label="Notificaciones"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
        >
          <IconBell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-600" />
        </button>
        <div className="ml-1 hidden h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-ink-muted sm:flex">
          A
        </div>
      </div>
    </header>
  )
}
