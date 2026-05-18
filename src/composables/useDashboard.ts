import { ref } from 'vue'
import { api } from '@/services/api'
import type { DashboardStats } from '@/types'
import { useToast } from './useToast'

export function useDashboard() {
  const stats = ref<DashboardStats | null>(null)
  const isLoading = ref(true)
  const { error } = useToast()

  async function fetchStats() {
    isLoading.value = true
    try {
      stats.value = await api('/stats/dashboard')
    } catch (err) {
      error('Error al cargar las estadísticas')
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    stats,
    isLoading,
    fetchStats,
  }
}
