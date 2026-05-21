# Repair-Shop-Frontend SPA

![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss&logoColor=white)

Aplicación web Single Page Application (SPA) para la gestión del taller de reparaciones. Consume la API REST del backend para administrar de forma interactiva el negocio.

## Qué incluye

- **Vue 3 con Vite**: Arquitectura moderna basada en Composition API y `<script setup>`.
- **TypeScript**: Tipado fuerte en toda la aplicación.
- **Vue Router**: Navegación SPA con guardias de rutas (Route Guards) para proteger el acceso según autenticación y roles.
- **Tailwind CSS 4**: Diseño adaptativo, minimalista y con soporte para **ambos modos (claro y oscuro)**. Clases globales centralizadas.
- **Arquitectura de Composables**: Lógica de negocio encapsulada y reutilizable.
- **Sistema Global de Notificaciones (Toasts)**: Feedback visual reactivo en toda la app sin acoplar los componentes.
- **Componentes UI Reutilizables**: Tablas dinámicas (`DataTable`), controles de paginación (`PaginationControls`) y modales.
- **Dashboard de Control**: Estadísticas y accesos directos según el rol.

## Requisitos

- Node.js 20.19 o superior.
- npm.
- El backend del proyecto arrancado en `http://localhost:8080`.

## Configuración local

La aplicación consume la API desde `http://localhost:8080/api`.

Si cambias la URL y puerto de tu backend, actualiza el valor de `BASE_URL` en el archivo `src/services/api.ts`.

## Arranque rápido

1. Instala las dependencias:

```bash
npm install
```

2. Arranca el entorno de desarrollo:

```bash
npm run dev
```

3. Abre la aplicación en la URL que indique Vite (generalmente `http://localhost:5173`).


## Estructura del Proyecto

- `src/assets/`: Archivos estáticos, iconos SVG y CSS global (`main.css`).
- `src/components/`: Componentes UI reutilizables e independientes de las vistas.
- `src/composables/`: Lógica extraída usando Vue Composition API.
- `src/router/`: Configuración de rutas de la SPA y guards de navegación.
- `src/services/`: Capa de integración con el backend (`api.ts`).
- `src/types/`: Definiciones de tipos y entidades TypeScript compartidas.
- `src/utils/`: Funciones auxiliares genéricas (`formatCost`, `formatStatus`).
- `src/views/`: Páginas principales (vistas enrutables).

## Notas adicionales

- **Gestión de Estado**: El proyecto aprovecha la reactividad nativa de Vue 3 (`ref`, `computed`) estructurada en composables Singleton.
- **Autenticación**: El acceso al panel depende de un token JWT guardado de forma persistente en `localStorage`. Si la sesión caduca o el token devuelto es inválido, el interceptor de peticiones de la app redirige automáticamente a la pantalla de login.
- **Control de Roles**: La UI se adapta dinámicamente según tu rol en el taller. Por ejemplo, los botones de eliminación o el acceso completo al Dashboard quedan ocultos y protegidos a nivel de UI y a nivel de rutas si entras con un rol básico de mecánico.
