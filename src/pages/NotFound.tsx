import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center animate-fade-in">
      <span className="text-6xl font-extrabold tracking-tight text-ink-muted/30">404</span>
      <h1 className="mt-4 text-xl font-bold text-ink">Página no encontrada</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">
        La ruta a la que intentas acceder no existe o fue movida.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button>Volver al Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
