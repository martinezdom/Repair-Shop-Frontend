import { ref } from 'vue'
import { api } from '@/services/api'
import { formatStatus } from '@/utils/main'
import type { Repair } from '@/types'

export function useRepairs() {
  const repairs = ref<Repair[]>([])
  const errorMessage = ref('')
  const isModalOpen = ref(false)
  const editingId = ref<number | null>(null)

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
      const response = await api('/repairs')
      repairs.value = response.content || response
    } catch (error) {
      errorMessage.value = 'Error al cargar las reparaciones'
      console.error(error)
    }
  }

  async function fetchMechanics() {
    try {
      const response = await api('/users?size=1000')
      mechanicsList.value = response.content || response
    } catch (error) {
      errorMessage.value = 'Error al cargar los mecánicos'
      console.error(error)
    }
  }

  async function fetchVehicles() {
    try {
      const response = await api('/vehicles?size=1000')
      vehiclesList.value = response.content || response
    } catch (error) {
      errorMessage.value = 'Error al cargar los vehículos'
      console.error(error)
    }
  }

  async function submitRepair() {
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
      closeModal()
      form.value = {
        description: '',
        mechanicId: null,
        vehicleId: null,
        status: null,
        cost: null,
      }
      await fetchRepairs()
    } catch (error) {
      if (editingId.value) {
        errorMessage.value = 'Error al modificar la reparación. Revisa los datos.'
      } else {
        errorMessage.value = 'Error al crear la reparación. Revisa los datos.'
      }
      console.error('Error enviando formulario:', error)
    }
  }

  async function deleteRepair(id: bigint) {
    try {
      if (confirm('¿Estás seguro que quieres borrar está reparación?')) {
        await api(`/repairs/${id}`, 'DELETE')
        await fetchRepairs()
      }
    } catch (error) {
      errorMessage.value = 'Error al eliminar la reparación'
      console.error(error)
    }
  }

  function openModal() {
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
  }

  function openEditModal(repair: Repair) {
    editingId.value = Number(repair.id)
    form.value.description = repair.description
    const mechanic = mechanicsList.value.find((m) => m.username === repair.mechanicName)
    form.value.mechanicId = mechanic ? mechanic.id : null
    const vehicle = vehiclesList.value.find((v) => v.licensePlate === repair.vehicleLicensePlate)
    form.value.vehicleId = vehicle ? vehicle.id : null
    form.value.status = repair.status
    form.value.cost = repair.cost || 0
    isModalOpen.value = true
  }

  return {
    repairs,
    errorMessage,
    isModalOpen,
    editingId,
    form,
    mechanicsList,
    vehiclesList,
    statusOptions,
    fetchRepairs,
    fetchMechanics,
    fetchVehicles,
    submitRepair,
    deleteRepair,
    openModal,
    closeModal,
    openEditModal,
    formatStatus,
  }
}
