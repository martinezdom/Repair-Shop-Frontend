<script setup lang="ts">
import { onMounted } from 'vue'
import { useRepairs } from '@/composables/useRepairs'

const {
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
  closeModal,
  openModal,
  openEditModal,
  deleteRepair,
  submitRepair,
  formatStatus,
} = useRepairs()

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
            <td class="px-4 py-4">{{ formatStatus(repair.status) }}</td>
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
