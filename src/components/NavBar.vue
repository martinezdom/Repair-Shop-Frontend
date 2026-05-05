<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import MenuItem from './MenuItem.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
type ThemeMode = 'light' | 'dark' | 'system'

const menuItems = ref([
  { to: '/dashboard', label: 'Panel de control' },
  { to: '/customers', label: 'Clientes' },
  { to: '/vehicles', label: 'Vehículos' },
])
const themeMode = ref<ThemeMode>('system')

const themeLabel = computed(() => {
  if (themeMode.value === 'light') {
    return 'Tema: Claro'
  } else if (themeMode.value === 'dark') {
    return 'Tema: Oscuro'
  } else {
    return 'Tema: Sistema'
  }
})

function applyTheme(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = mode === 'dark' || (mode === 'system' && prefersDark)

  document.documentElement.classList.toggle('dark', isDark)

  if (mode === 'system') {
    localStorage.removeItem('theme')
  } else {
    localStorage.setItem('theme', mode)
  }

  themeMode.value = mode
}

function cycleTheme() {
  if (themeMode.value === 'system') {
    applyTheme('light')
    return
  }

  if (themeMode.value === 'light') {
    applyTheme('dark')
    return
  }

  applyTheme('system')
}

function handleSystemThemeChange() {
  if (themeMode.value === 'system') {
    applyTheme('system')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'light' || savedTheme === 'dark') {
    applyTheme(savedTheme)
  } else {
    applyTheme('system')
  }

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', handleSystemThemeChange)
})

onUnmounted(() => {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .removeEventListener('change', handleSystemThemeChange)
})

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <nav class="container mx-auto flex items-center justify-between p-4">
    <ul class="text-text-on-light dark:text-text-on-dark flex gap-6 font-medium">
      <MenuItem v-for="item in menuItems" :key="item.to" :to="item.to" :label="item.label" />
    </ul>

    <div class="flex items-center gap-2">
      <button
        @click="cycleTheme"
        class="bg-primary dark:bg-primary cursor-pointer rounded px-4 py-2 font-bold text-white dark:text-white"
      >
        {{ themeLabel }}
      </button>

      <button
        @click="logout"
        class="bg-error cursor-pointer rounded px-4 py-2 font-bold text-white dark:bg-red-600"
      >
        Cerrar sesión
      </button>
    </div>
  </nav>
</template>
