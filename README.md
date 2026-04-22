# Repair-Shop-Frontend

![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-State_Management-F7B93E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss&logoColor=white)

Frontend web para el taller de reparaciones. De momento cubre inicio de sesión, protección de rutas con token y un panel básico con listado de reparaciones.

## Qué incluye

- Vue 3 con Vite.
- TypeScript en toda la aplicación.
- Vue Router para navegación entre login y dashboard.
- Pinia como base para el estado global.
- Tailwind CSS para estilos.
- Inicio de sesión contra la API del backend.
- Guard de rutas simple usando el token guardado en `localStorage`.
- Consumo de la API para listar reparaciones en el panel.

## Requisitos

- Node.js 20.19 o superior.
- npm.
- El backend del proyecto arrancado en `http://localhost:8080`.

## Configuración local

La aplicación consume la API desde `http://localhost:8080/api`.

Si cambias la URL del backend, actualiza el valor de `BASE_URL` en `src/services/api.ts`.

## Arranque rápido

1. Instala dependencias:

```bash
npm install
```

2. Arranca el entorno de desarrollo:

```bash
npm run dev
```

3. Abre la aplicación en la URL que te indique Vite.

## Scripts útiles

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: valida tipos y genera la build de producción.
- `npm run preview`: previsualiza la build generada.
- `npm run format`: formatea los archivos de `src/`.

## Notas

- El acceso al panel depende de un token guardado en `localStorage`.
- Si no hay sesión iniciada, la ruta `/dashboard` redirige a `/login`.
- La idea del proyecto es ir ampliando el frontend por módulos conforme crezca la API.
