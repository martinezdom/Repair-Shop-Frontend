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
  formatCost,
  nextPage,
  previousPage,
  currentPage,
  totalPages,
} = useRepairs()

onMounted(() => {
  fetchRepairs()
  fetchMechanics()
  fetchVehicles()
})
</script>

<template>
  <div
    class="text-text-on-light dark:text-text-on-dark flex flex-col justify-center gap-3 px-4 py-8"
  >
    <div v-if="!isModalOpen" class="flex flex-col gap-2">
      <div class="flex justify-end gap-6">
        <button
          :disabled="currentPage === 0"
          @click="previousPage()"
          class="bg-primary rounded-btn cursor-pointer px-5 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-600"
        >
          Anterior
        </button>
        <button
          :disabled="currentPage === totalPages - 1"
          @click="nextPage()"
          class="bg-primary rounded-btn cursor-pointer px-5 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-600"
        >
          Siguiente
        </button>
      </div>
      <div
        class="border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark rounded-card w-full max-w-6xl overflow-hidden border"
      >
        <h2 v-if="errorMessage" class="px-6 pt-6 text-center text-red-700 dark:text-red-300">
          {{ errorMessage }}
        </h2>

        <table class="w-full text-center">
          <thead
            class="bg-bg-light text-muted-light dark:bg-bg-dark dark:text-text-on-dark text-sm"
          >
            <tr>
              <th class="px-4 py-4">Id</th>
              <th class="px-4 py-4">Matrícula</th>
              <th class="px-4 py-4">Estado</th>
              <th class="px-4 py-4">Mecánico responsable</th>
              <th class="px-4 py-4">Coste</th>
              <th class="px-4 py-4">Descripción</th>
              <th class="px-4 py-4">Acciones</th>
            </tr>
          </thead>

          <tbody class="divide-border-light dark:divide-border-dark divide-y">
            <tr v-for="repair in repairs" :key="String(repair.id)" class="">
              <td class="px-4 py-4">{{ repair.id }}</td>
              <td class="px-4 py-4">{{ repair.vehicleLicensePlate }}</td>
              <td class="px-4 py-4">{{ formatStatus(repair.status) }}</td>
              <td class="px-4 py-4">{{ repair.mechanicName }}</td>
              <td class="px-4 py-4">{{ formatCost(repair.cost) }}</td>
              <td class="px-4 py-4">{{ repair.description }}</td>
              <td class="flex items-center justify-center gap-3 px-4 py-4">
                <button @click="openEditModal(repair)" class="">
                  <img
                    src="../assets/icons/pencil.svg"
                    alt="Editar"
                    class="h-5 w-5 cursor-pointer dark:invert"
                  />
                </button>
                <button @click="deleteRepair(repair.id)" class="">
                  <img
                    src="../assets/icons/trash.svg"
                    alt="Eliminar"
                    class="h-5 w-5 cursor-pointer dark:invert"
                  />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <button
      v-if="!isModalOpen"
      @click="((editingId = null), openModal())"
      class="bg-primary cursor-pointer rounded-btn dark:bg-primary-dark px-6 py-3 font-semibold text-white"
    >
      Nueva reparación
    </button>
  </div>
  <div
    v-if="isModalOpen"
    class="bg-overlay-dark/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
  >
    <div
      class="border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark rounded-card w-full max-w-lg border p-6"
    >
      <div class="mb-6 flex items-center justify-between">
        <h3 class="text-xl font-bold">
          {{ editingId ? 'Editar reparación' : 'Crear Reparación' }}
        </h3>
        <button @click="closeModal()" class="">
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
            class="border-border-light dark:border-border-dark rounded border bg-transparent p-2 disabled:cursor-not-allowed disabled:opacity-50"
          ></textarea>
        </div>

        <div class="flex flex-col gap-1">
          <label for="mechanic" class="font-medium">Mecánico</label>
          <select
            id="mechanic"
            v-model="form.mechanicId"
            required
            :disabled="editingId !== null"
            class="border-border-light bg-bg-light text-text-on-light dark:border-border-dark dark:bg-bg-dark dark:text-text-on-dark accent-primary rounded border p-2 disabled:cursor-not-allowed disabled:opacity-50"
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
            class="border-border-light bg-bg-light text-text-on-light dark:border-border-dark dark:bg-bg-dark dark:text-text-on-dark accent-primary rounded border p-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled selected>Seleccione un vehículo</option>
            <option v-for="v in vehiclesList" :key="v.id" :value="v.id">
              {{ v.licensePlate }}
            </option>
          </select>
        </div>

        <div v-if="editingId" class="flex flex-col gap-1">
          <label for="status" class="font-medium">Estado</label>
          <select
            id="status"
            v-model="form.status"
            required
            class="border-border-light bg-bg-light text-text-on-light dark:border-border-dark dark:bg-bg-dark dark:text-text-on-dark accent-primary rounded border p-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
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
            class="bg-bg-light text-text-on-light dark:bg-bg-dark dark:text-text-on-dark border-border-light dark:border-border-dark rounded-btn w-full border px-3 py-2"
          />
        </div>

        <button type="submit" class="bg-primary mt-4 rounded py-2 font-bold text-white">
          Guardar Reparación
        </button>
      </form>
    </div>
  </div>
</template>
