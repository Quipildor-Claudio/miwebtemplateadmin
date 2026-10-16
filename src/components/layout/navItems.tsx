import type { ComponentType, SVGProps } from 'react'
import { IconDashboard, IconItems, IconSettings } from '../ui/icons'

export interface NavItem {
  to: string
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>
}

/** Edita esta lista para adaptar la navegacion a cada proyecto. */
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: IconDashboard },
  { to: '/items', label: 'Elementos', icon: IconItems },
  { to: '/settings', label: 'Ajustes', icon: IconSettings },
]
