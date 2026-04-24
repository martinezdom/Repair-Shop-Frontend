<script setup lang="ts">
import { ref } from 'vue'
import MenuItem from './MenuItem.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const menuItems = ref([
  { to: '/dashboard', label: 'Panel de control' },
  { to: '/customers', label: 'Clientes' },
  { to: '/vehicles', label: 'Vehículos' },
])

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <nav class="container mx-auto flex justify-between items-center p-4">
    <ul class="flex gap-6 font-medium">
      <MenuItem v-for="item in menuItems" :key="item.to" :to="item.to" :label="item.label" />
    </ul>

    <button
      @click="logout"
      class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-bold cursor-pointer transition-colors"
    >
      Cerrar sesión
    </button>
  </nav>
</template>
