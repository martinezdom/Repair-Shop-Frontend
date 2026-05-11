<script setup lang="ts">
import { onMounted } from 'vue'
import { useRepairs } from '@/composables/useRepairs'
import SpinnerIcon from '@/components/SpinnerIcon.vue'
import DataTable from '@/components/DataTable.vue'
import PaginationControls from '@/components/PaginationControls.vue'

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
  resetForm,
  isSaving,
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
      <PaginationControls
        :currentPage="currentPage"
        :totalPages="totalPages"
        @previous="previousPage()"
        @next="nextPage()"
      />
      <DataTable :errorMessage="errorMessage">
        <template #thead>
          <th class="px-4 py-4">Id</th>
          <th class="px-4 py-4">Matrícula</th>
          <th class="px-4 py-4">Estado</th>
          <th class="px-4 py-4">Mecánico responsable</th>
          <th class="px-4 py-4">Coste</th>
          <th class="px-4 py-4">Descripción</th>
          <th class="px-4 py-4">Acciones</th>
        </template>

        <template #tbody>
          <tr v-for="repair in repairs" :key="String(repair.id)">
            <td class="px-4 py-4">{{ repair.id }}</td>
            <td class="px-4 py-4">{{ repair.vehicleLicensePlate }}</td>
            <td class="px-4 py-4">{{ formatStatus(repair.status) }}</td>
            <td class="px-4 py-4">{{ repair.mechanicName }}</td>
            <td class="px-4 py-4">{{ formatCost(repair.cost) }}</td>
            <td class="px-4 py-4">{{ repair.description }}</td>
            <td class="flex items-center justify-center gap-3 px-4 py-4">
              <button @click="openEditModal(repair)">
                <img src="../assets/icons/pencil.svg" alt="Editar" class="h-5 w-5 cursor-pointer dark:invert" />
              </button>
              <button @click="deleteRepair(repair.id)">
                <img src="../assets/icons/trash.svg" alt="Eliminar" class="h-5 w-5 cursor-pointer dark:invert" />
              </button>
            </td>
          </tr>
        </template>
      </DataTable>
    </div>
    <button
      v-if="!isModalOpen"
      @click="((editingId = null), openModal())"
      class="bg-primary rounded-btn dark:bg-primary-dark cursor-pointer px-6 py-3 font-semibold text-white"
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
        <button
          @click="
            closeModal();
            resetForm()
          "
          class="cursor-pointer"
        >
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
            class="form-select"
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
            class="form-select"
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
            class="form-select"
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
            class="form-input"
          />
        </div>

        <button
          type="submit"
          :disabled="isSaving"
          class="bg-primary mt-4 flex items-center justify-center gap-2 cursor-pointer rounded py-2 font-bold text-white disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <SpinnerIcon v-if="isSaving" />
          <span v-else>Guardar reparación</span>
        </button>
      </form>
    </div>
  </div>
</template>
