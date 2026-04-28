<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'

type Repair = {
  id: bigint
  vehicleLicensePlate: string
  status: string
  mechanicName: string
  description: string
  cost: number
}

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

onMounted(() => {
  fetchRepairs()
  fetchMechanics()
  fetchVehicles()
})
</script>

<template>
  <div class="flex flex-col justify-center gap-3 px-4 py-8 text-slate-800 dark:text-slate-300">
    <div
      v-if="!isModalOpen"
      class="w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/30"
    >
      <h2 v-if="errorMessage" class="px-6 pt-6 text-center text-red-700 dark:text-red-300">
        {{ errorMessage }}
      </h2>

      <table class="w-full text-center">
        <thead class="bg-slate-100 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th class="px-4 py-4">Id</th>
            <th class="px-4 py-4">Matrícula</th>
            <th class="px-4 py-4">Estado</th>
            <th class="px-4 py-4">Mecánico responsable</th>
            <th class="px-4 py-4">Descripción</th>
            <th class="px-4 py-4">Acciones</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          <tr
            v-for="repair in repairs"
            :key="String(repair.id)"
            class="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70"
          >
            <td class="px-4 py-4">{{ repair.id }}</td>
            <td class="px-4 py-4">{{ repair.vehicleLicensePlate }}</td>
            <td class="px-4 py-4">{{ repair.status }}</td>
            <td class="px-4 py-4">{{ repair.mechanicName }}</td>
            <td class="px-4 py-4">{{ repair.description }}</td>
            <td class="flex items-center justify-center gap-3 px-4 py-4">
              <button @click="openEditModal(repair)" class="cursor-pointer hover:opacity-70">
                <img src="../assets/icons/pencil.svg" alt="Editar" class="h-5 w-5 dark:invert" />
              </button>
              <button @click="deleteRepair(repair.id)" class="cursor-pointer hover:opacity-70">
                <img src="../assets/icons/trash.svg" alt="Eliminar" class="h-5 w-5 dark:invert" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button
      v-if="!isModalOpen"
      @click="((editingId = null), openModal())"
      class="cursor-pointer rounded-full bg-slate-100 px-4 py-2 text-slate-600 hover:bg-slate-200"
    >
      Nueva reparación
    </button>
  </div>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-800/60 backdrop-blur-sm"
  >
    <div
      class="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
    >
      <div class="mb-6 flex items-center justify-between">
        <h3 class="text-xl font-bold">
          {{ editingId ? 'Editar reparación' : 'Crear Reparación' }}
        </h3>
        <button @click="closeModal()" class="cursor-pointer hover:opacity-70">
          <img src="../assets/icons/close-x.svg" alt="Cerrar" class="h-6 w-6 dark:invert" />
        </button>
      </div>

      <form @submit.prevent="submitRepair" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="description" class="font-medium">Descripción</label>
          <textarea
            id="description"
            v-model="form.description"
            required
            :disabled="editingId !== null"
            class="rounded border border-slate-300 bg-transparent p-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600"
          ></textarea>
        </div>

        <div class="flex flex-col gap-1">
          <label for="mechanic" class="font-medium">Mecánico</label>
          <select
            id="mechanic"
            v-model="form.mechanicId"
            required
            :disabled="editingId !== null"
            class="rounded border border-slate-300 bg-transparent p-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600"
          >
            <option value="" disabled selected>Seleccione un mecánico</option>
            <option v-for="m in mechanicsList" :key="m.id" :value="m.id">
              {{ m.username }}
            </option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label for="vehicle" class="font-medium">Vehículo</label>
          <select
            id="vehicle"
            v-model="form.vehicleId"
            required
            :disabled="editingId !== null"
            class="rounded border border-slate-300 bg-transparent p-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600"
          >
            <option value="" disabled selected>Seleccione un vehículo</option>
            <option v-for="v in vehiclesList" :key="v.id" :value="v.id">
              {{ v.licensePlate }}
            </option>
          </select>
        </div>

        <div v-if="editingId" class="flex flex-col gap-1">
          <label for="status" class="font-medium">Estado</label>
          <select id="status" v-model="form.status" required class="...">
            <option value="" disabled selected>Seleccione el estado</option>
            <option v-for="s in statusOptions" :key="s.value" :value="s.value">
              {{ s.label }}
            </option>
          </select>
        </div>

        <div v-if="editingId" class="flex flex-col gap-1">
          <label for="cost" class="font-medium">Coste</label>
          <input
            id="cost"
            v-model="form.cost"
            type="number"
            required
            class="w-full rounded-lg border border-slate-800 bg-slate-300 px-3 py-2 text-slate-800 transition dark:border-slate-300 dark:bg-slate-800 dark:text-slate-300"
          />
        </div>

        <button
          type="submit"
          class="mt-4 rounded bg-blue-600 py-2 font-bold text-white hover:bg-blue-700"
        >
          Guardar Reparación
        </button>
      </form>
    </div>
  </div>
</template>
