import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCheck,
  IconClose,
  IconInfo,
} from '../components/ui/icons'
import { cn } from '../lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
  title?: string
  duration?: number
}

export interface ToastItem {
  id: string
  type: ToastType
  message: string
  title?: string
  duration: number
}

interface ToastContextValue {
  toasts: ToastItem[]
  toast: {
    success: (message: string, options?: ToastOptions) => string
    error: (message: string, options?: ToastOptions) => string
    warning: (message: string, options?: ToastOptions) => string
    info: (message: string, options?: ToastOptions) => string
    custom: (type: ToastType, message: string, options?: ToastOptions) => string
    dismiss: (id: string) => void
    clear: () => void
  }
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS = {
  success: {
    icon: IconCheck,
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  error: {
    icon: IconAlertCircle,
    badgeClass: 'bg-red-500/15 text-red-600 dark:text-red-400',
  },
  warning: {
    icon: IconAlertTriangle,
    badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
  info: {
    icon: IconInfo,
    badgeClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
  },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clear = useCallback(() => {
    setToasts([])
  }, [])

  const addToast = useCallback(
    (type: ToastType, message: string, options?: ToastOptions) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const duration = options?.duration ?? 4000
      const newItem: ToastItem = {
        id,
        type,
        message,
        title: options?.title,
        duration,
      }

      setToasts((prev) => [...prev, newItem])

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id)
        }, duration)
      }

      return id
    },
    [dismiss],
  )

  const toast = useMemo(
    () => ({
      success: (msg: string, opts?: ToastOptions) => addToast('success', msg, opts),
      error: (msg: string, opts?: ToastOptions) => addToast('error', msg, opts),
      warning: (msg: string, opts?: ToastOptions) => addToast('warning', msg, opts),
      info: (msg: string, opts?: ToastOptions) => addToast('info', msg, opts),
      custom: addToast,
      dismiss,
      clear,
    }),
    [addToast, dismiss, clear],
  )

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-4 sm:items-end"
    >
      {toasts.map((t) => {
        const { icon: Icon, badgeClass } = ICONS[t.type]
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto flex w-full max-w-sm animate-scale-in items-start gap-3 rounded-card border border-border bg-surface p-3.5 shadow-lg transition-all sm:w-88',
            )}
          >
            <div
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                badgeClass,
              )}
            >
              <Icon size={16} />
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              {t.title && <p className="text-xs font-semibold text-ink">{t.title}</p>}
              <p className="text-xs text-ink-muted leading-relaxed">{t.message}</p>
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              aria-label="Cerrar notificación"
              className="shrink-0 rounded p-1 text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors"
            >
              <IconClose size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider')
  return ctx.toast
}
