import { ref } from 'vue'
import { api, ForbiddenError } from '@/services/api'
import { formatStatus, formatCost } from '@/utils/main'
import type { Repair } from '@/types'
import { usePagination } from '@/composables/usePagination'
import { useModal } from './useModal'
import { useToast } from './useToast'

export function useRepairs() {
  const { currentPage, totalPages, nextPage, previousPage } = usePagination(fetchRepairs)
  const { isModalOpen, editingId, openModal, closeModal, openEditModal: openBaseModal } = useModal()
  const { success, error } = useToast()

  const repairs = ref<Repair[]>([])
  const isSaving = ref(false)
  const form = ref({
    description: '',
    mechanicId: null as number | null,
    vehicleId: null as number | null,
    status: null as string | null,
    cost: null as number | null,
  })
  const mechanicsList = ref<any[]>([])
  const vehiclesList = ref<any[]>([])
  const statusOptions = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en progreso', label: 'En Progreso' },
    { value: 'terminado', label: 'Terminado' },
  ]

  async function fetchRepairs() {
    try {
      const response = await api(`/repairs?page=${currentPage.value}`)
      repairs.value = response.content || response
      totalPages.value = response.totalPages || 1
    } catch (err) {
      error('Error al cargar las reparaciones')
      console.error(err)
    }
  }

  async function fetchMechanics() {
    try {
      const response = await api('/users?size=1000')
      mechanicsList.value = response.content || response
    } catch (err) {
      error('Error al cargar los mecánicos')
      console.error(err)
    }
  }

  async function fetchVehicles() {
    try {
      const response = await api('/vehicles?size=1000')
      vehiclesList.value = response.content || response
    } catch (err) {
      error('Error al cargar los vehículos')
      console.error(err)
    }
  }

  async function submitRepair() {
    isSaving.value = true
    const wasEditing = !!editingId.value
    try {
      if (editingId.value) {
        const updatePayload = {
          status: form.value.status,
          cost: form.value.cost,
        }
        await api('/repairs/' + editingId.value, 'PUT', updatePayload)
      } else {
        const createPayload = {
          description: form.value.description,
          mechanicId: form.value.mechanicId,
          vehicleId: form.value.vehicleId,
        }
        await api('/repairs', 'POST', createPayload)
      }
      success(wasEditing ? 'Reparación modificada correctamente' : 'Reparación creada correctamente')
      closeModal()
      form.value = { description: '', mechanicId: null, vehicleId: null, status: null, cost: null }
      await fetchRepairs()
    } catch (err) {
      error(wasEditing ? 'Error al modificar la reparación' : 'Error al crear la reparación')
      console.error('Error enviando formulario:', err)
    } finally {
      isSaving.value = false
    }
  }

  async function deleteRepair(id: number) {
    try {
      if (confirm('¿Estás seguro que quieres borrar esta reparación?')) {
        await api(`/repairs/${id}`, 'DELETE')
        await fetchRepairs()
        success('Reparación eliminada correctamente')
      }
    } catch (err) {
      if (err instanceof ForbiddenError) {
        error('No tienes permisos para realizar esta acción')
      } else {
        error('Error al eliminar la reparación')
      }
      console.error(err)
    }
  }

  function resetForm() {
    form.value = { description: '', mechanicId: null, vehicleId: null, status: null, cost: null }
  }

  function openEditModal(repair: Repair) {
    openBaseModal(repair.id)
    form.value.description = repair.description
    const mechanic = mechanicsList.value.find((m) => m.username === repair.mechanicName)
    form.value.mechanicId = mechanic ? mechanic.id : null
    const vehicle = vehiclesList.value.find((v) => v.licensePlate === repair.vehicleLicensePlate)
    form.value.vehicleId = vehicle ? vehicle.id : null
    form.value.status = repair.status
    form.value.cost = repair.cost || 0
  }

  return {
    repairs,
    isModalOpen,
    editingId,
    form,
    mechanicsList,
    vehiclesList,
    statusOptions,
    currentPage,
    totalPages,
    fetchRepairs,
    fetchMechanics,
    fetchVehicles,
    submitRepair,
    deleteRepair,
    resetForm,
    openEditModal,
    formatStatus,
    formatCost,
    previousPage,
    nextPage,
    openModal,
    closeModal,
    isSaving,
  }
}
