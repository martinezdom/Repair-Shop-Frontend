<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboard } from '@/composables/useDashboard'
import { formatCost } from '@/utils/main'

const router = useRouter()
const { stats, isLoading, fetchStats } = useDashboard()

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="view-wrapper w-full max-w-5xl">
    <h1 class="mb-4 text-2xl font-bold">Panel de control</h1>

    <div v-if="isLoading" class="flex justify-center py-16">
      <svg class="h-10 w-10 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>

    <template v-else>
      <div class="flex gap-4">
        <div class="border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark rounded-card flex-1 border p-6">
          <p class="text-muted-light dark:text-muted-dark mb-2 font-medium">Reparaciones pendientes</p>
          <p class="text-4xl font-bold">{{ stats?.pendingCars ?? 0 }}</p>
        </div>

        <div class="border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark rounded-card flex-1 border p-6">
          <p class="text-muted-light dark:text-muted-dark mb-2 font-medium">Ingresos totales</p>
          <p class="text-4xl font-bold">{{ formatCost(stats?.totalRevenue ?? 0) }}</p>
        </div>
      </div>

      <div class="border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark rounded-card border p-6">
        <h2 class="mb-4 font-semibold">Accesos rápidos</h2>
        <div class="flex gap-3">
          <button
            @click="router.push('/repairs')"
            class="border-border-light dark:border-border-dark rounded-btn flex-1 cursor-pointer border p-4 font-semibold transition-opacity hover:opacity-70"
          >
            Reparaciones
          </button>
          <button
            @click="router.push('/vehicles')"
            class="border-border-light dark:border-border-dark rounded-btn flex-1 cursor-pointer border p-4 font-semibold transition-opacity hover:opacity-70"
          >
            Vehículos
          </button>
          <button
            @click="router.push('/customers')"
            class="border-border-light dark:border-border-dark rounded-btn flex-1 cursor-pointer border p-4 font-semibold transition-opacity hover:opacity-70"
          >
            Clientes
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
