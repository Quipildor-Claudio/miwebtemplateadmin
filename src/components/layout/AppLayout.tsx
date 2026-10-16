import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      return localStorage.getItem('layout.sidebar') !== 'false'
    } catch {
      return true
    }
  })

  function toggleSidebar() {
    setSidebarOpen((prev) => {
      const next = !prev
      try {
        localStorage.setItem('layout.sidebar', String(next))
      } catch {
        // ignorar
      }
      return next
    })
  }

  return (
    <div className="flex h-full">
      <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          {/* w-full con márgenes compactos para que las tablas ocupen el máximo ancho posible */}
          <div className="w-full px-3 py-4 pb-24 sm:px-4 lg:px-6 lg:pb-6">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
