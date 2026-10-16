# Plantilla Web App (React + Vite + TypeScript + Tailwind)

Plantilla base **neutra y profesional** para reutilizar en cualquier proyecto.
No necesitas describir la apariencia: ya viene resuelta. Solo cambias los
tokens de diseño y la navegación.

## Que incluye

- **Layout responsivo y adaptable**: sidebar colapsable/ocultable con botón toggle tanto en barra superior como en cabecera del menú lateral, persistencia en `localStorage`, drawer en móvil, barra de navegación inferior (`MobileNav`) y área de contenido maximizada a ancho completo con márgenes reducidos.
- **Tema claro/oscuro** persistente (`ThemeContext`).
- **Autenticacion simulada** con ruta protegida (`AuthContext` + `RequireAuth`).
- **Dashboard** con tarjetas de metricas, mini grafico y tabla de recientes.
- **Listado de elementos avanzado**:
  - barra de busqueda y filtros (categoria / estado),
  - ordenamiento por columna y **paginacion**,
  - **seleccion masiva (Bulk Actions)** con Checkbox por fila o página completa,
  - **acciones en lote**: cambio de estado grupal, eliminación múltiple con confirmación y exportación de seleccionados,
  - **exportacion a CSV** (`exportToCsv`) con BOM UTF-8 para compatibilidad total con Excel,
  - alta/edicion en modal y menú de acciones por fila (editar, duplicar, eliminar).
- **Componentes UI reutilizables**: Button, Input, Textarea, Select, Switch,
  Checkbox, Badge, Card, Table, Pagination, Modal, PageHeader, EmptyState,
  StatCard, Skeleton (Card/Table), Tabs, Dropdown (menús flotantes) e iconos SVG propios.
- **Sistema de notificaciones Toast**: `useToast()` (`toast.success`, `error`, `warning`, `info`) con animaciones fluidas y soporte claro/oscuro.
- **Topbar funcional**: Menú desplegable de usuario (perfil, ajustes, logout) y panel de notificaciones con conteo no leído.
- **Ajustes modularizados en pestañas**: Perfil, apariencia (tema), seguridad (2FA) y preferencias de notificación.

## Arrancar

```bash
npm install
npm run dev        # desarrollo
npm run build      # produccion (dist/)
npm run preview    # probar el build
npm run lint       # oxlint
```

Demo de login: cualquier correo/contrasena (viene precargado).

## Personalizar en 3 pasos

1. **Colores y tipografia** -> `src/index.css` (bloque `@theme` y variables del
   tema oscuro). Todo el sistema usa estos tokens.
2. **Navegacion** -> `src/components/layout/navItems.tsx` (agrega/quita items;
   se refleja en sidebar y barra inferior).
3. **Logica de datos** -> reemplaza `src/lib/mockData.ts` y las llamadas en
   `src/context/AuthContext.tsx` por tu API real.

## Estructura

```
src/
├── components/
│   ├── layout/   AppLayout, Sidebar, Topbar, MobileNav, navItems
│   └── ui/       Button, Input, Textarea, Select, Switch, Checkbox, Badge,
│                 Card, Table, Pagination, Modal, PageHeader, EmptyState,
│                 StatCard, Skeleton, Tabs, Dropdown, icons
├── context/      ThemeContext, AuthContext, ToastContext
├── lib/          utils (cn), usePagination, mockData
├── pages/        Login, Dashboard, Items, Settings
├── App.tsx       Rutas y proteccion de acceso
└── main.tsx      Providers (Theme, Auth, Toast) + Router
```

## Convenciones

- Utilidad `cn()` para clases condicionales (`src/lib/utils.ts`).
- Colores semanticos: `bg-surface`, `text-ink`, `border-border`,
  `text-ink-muted` y el acento `brand-*`. Evita colores hardcodeados.
- Para portar a **Angular/Vue** puedes reutilizar `index.css` (tokens) y el
  estilo de los componentes; la logica de `usePagination` y los estados de
  filtro es sencilla de transportar.
