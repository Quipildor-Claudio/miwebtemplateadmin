import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from './Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-2xl font-bold text-red-500 ring-1 ring-border">
            !
          </div>
          <h2 className="text-lg font-semibold text-ink">Ha ocurrido un error inesperado</h2>
          <p className="mt-2 max-w-md text-sm text-ink-muted">
            La vista actual no se pudo cargar correctamente. Puedes intentar recargar la aplicación o volver al inicio.
          </p>
          {this.state.error && (
            <pre className="mt-4 max-w-lg overflow-x-auto rounded-lg border border-border bg-surface-muted p-3 text-left text-xs text-ink-muted">
              {this.state.error.message}
            </pre>
          )}
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Recargar página
            </Button>
            <Button onClick={this.handleReset}>
              Volver al inicio
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
