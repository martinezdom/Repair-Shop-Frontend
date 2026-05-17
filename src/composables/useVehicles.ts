import { ref } from 'vue'
import { api } from '@/services/api'
import type { Vehicle } from '@/types'
import { usePagination } from '@/composables/usePagination'
import { useModal } from './useModal'
import { useCustomers } from './useCustomers'
import { useToast } from './useToast'

export function useVehicles() {
  const { currentPage, totalPages, nextPage, previousPage } = usePagination(fetchVehicles)
  const { isModalOpen, editingId, openModal, closeModal, openEditModal: openBaseModal } = useModal()
  const { getCustomerFullName } = useCustomers()
  const { success, error } = useToast()

  const form = ref({
    brand: '',
    model: '',
    licensePlate: '',
    year: null as number | null,
    customerId: null as number | null,
  })
  const vehicles = ref<Vehicle[]>([])
  const isSaving = ref(false)
  const customersList = ref<any[]>([])

  async function fetchVehicles() {
    try {
      const response = await api(`/vehicles?page=${currentPage.value}`)
      vehicles.value = response.content || response
      totalPages.value = response.totalPages || 1
    } catch (err) {
      error('Error al cargar los vehículos')
      console.error(err)
    }
  }

  async function fetchCustomers() {
    try {
      const response = await api('/customers?size=1000')
      customersList.value = response.content || response
    } catch (err) {
      error('Error al cargar los clientes')
      console.error(err)
    }
  }

  async function submitVehicle() {
    isSaving.value = true
    const wasEditing = !!editingId.value
    try {
      if (editingId.value) {
        const updatePayload = {
          brand: form.value.brand,
          model: form.value.model,
          year: form.value.year,
        }
        await api('/vehicles/' + editingId.value, 'PUT', updatePayload)
      } else {
        const createPayload = {
          brand: form.value.brand,
          model: form.value.model,
          licensePlate: form.value.licensePlate,
          year: form.value.year,
          customerId: form.value.customerId,
        }
        await api('/vehicles', 'POST', createPayload)
      }
      success(wasEditing ? 'Vehículo modificado correctamente' : 'Vehículo creado correctamente')
      closeModal()
      form.value = { brand: '', model: '', customerId: null, year: null, licensePlate: '' }
      await fetchVehicles()
    } catch (err) {
      error(wasEditing ? 'Error al modificar el vehículo' : 'Error al crear el vehículo')
      console.error('Error enviando formulario:', err)
    } finally {
      isSaving.value = false
    }
  }

  async function deleteVehicle(id: number) {
    try {
      if (confirm('¿Estás seguro que quieres borrar este vehículo?')) {
        await api(`/vehicles/${id}`, 'DELETE')
        await fetchVehicles()
        success('Vehículo eliminado correctamente')
      }
    } catch (err) {
      error('Error al eliminar el vehículo')
      console.error(err)
    }
  }

  function resetForm() {
    form.value = { brand: '', model: '', customerId: null, year: null, licensePlate: '' }
  }

  function openEditModal(vehicle: Vehicle) {
    openBaseModal(vehicle.id)
    form.value.brand = vehicle.brand
    form.value.model = vehicle.model
    form.value.licensePlate = vehicle.licensePlate
    form.value.year = vehicle.year
    form.value.customerId = vehicle.customerId
  }

  return {
    vehicles,
    form,
    customersList,
    currentPage,
    totalPages,
    editingId,
    isModalOpen,
    fetchVehicles,
    fetchCustomers,
    submitVehicle,
    deleteVehicle,
    resetForm,
    openEditModal,
    getCustomerFullName,
    nextPage,
    previousPage,
    openModal,
    closeModal,
    isSaving,
  }
}
