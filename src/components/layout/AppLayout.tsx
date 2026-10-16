import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'

export function AppLayout() {
  return (
    <div className="flex h-full">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {/* pb-24 deja espacio para la barra inferior en movil */}
          <div className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:pb-6">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
