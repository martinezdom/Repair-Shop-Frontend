import { ref } from 'vue'
import { api } from '@/services/api'
import type { Vehicle } from '@/types'

export function useVehicles() {
  const editingId = ref<number | null>(null)
  const form = ref({
    brand: '',
    model: '',
    licensePlate: '',
    year: null as number | null,
    customerId: null as number | null,
  })

  const vehicles = ref<Vehicle[]>([])
  const errorMessage = ref('')
  const currentPage = ref(0)
  const totalPages = ref(1)
  const isModalOpen = ref(false)
  const customersList = ref<any[]>([])

  async function fetchVehicles() {
    try {
      const response = await api(`/vehicles?page=${currentPage.value}`)
      vehicles.value = response.content || response
      totalPages.value = response.totalPages || 1
    } catch (error) {
      errorMessage.value = 'Error al cargar los vehículos'
      console.error(error)
    }
  }

  async function deleteVehicle(id: number) {
    try {
      if (confirm('¿Estás seguro que quieres borrar este vehículo?')) {
        await api(`/vehicles/${id}`, 'DELETE')
        await fetchVehicles()
      }
    } catch (error) {
      errorMessage.value = 'Error al eliminar el vehículo'
      console.error(error)
    }
  }

  async function submitVehicle() {
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
      closeModal()
      form.value = {
        brand: '',
        model: '',
        customerId: null,
        year: null,
        licensePlate: '',
      }
      await fetchVehicles()
    } catch (error) {
      if (editingId.value) {
        errorMessage.value = 'Error al modificar el vehículo. Revisa los datos.'
      } else {
        errorMessage.value = 'Error al crear el vehículo. Revisa los datos.'
      }
      console.error('Error enviando formulario:', error)
    }
  }
  async function fetchCustomers() {
    try {
      const response = await api('/customers?size=1000')
      customersList.value = response.content || response
    } catch (error) {
      errorMessage.value = 'Error al cargar los clientes'
      console.error(error)
    }
  }

  function getGetCustomerFullName(customerId: number | null): string {
    const customer = customersList.value.find((c) => String(c.id) === String(customerId))
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Desconocido'
  }

  function nextPage() {
    currentPage.value++
    fetchVehicles()
  }

  function previousPage() {
    currentPage.value--
    fetchVehicles()
  }

  function openModal() {
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
  }

  function openEditModal(vehicle: Vehicle) {
    editingId.value = vehicle.id
    form.value.brand = vehicle.brand
    form.value.model = vehicle.model
    form.value.licensePlate = vehicle.licensePlate
    form.value.year = vehicle.year
    form.value.customerId = vehicle.customerId
    isModalOpen.value = true
  }

  return {
    vehicles,
    fetchVehicles,
    form,
    errorMessage,
    nextPage,
    previousPage,
    openModal,
    closeModal,
    openEditModal,
    currentPage,
    totalPages,
    editingId,
    isModalOpen,
    deleteVehicle,
    submitVehicle,
    customersList,
    fetchCustomers,
    getGetCustomerFullName,
  }
}
