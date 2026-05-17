<script setup lang="ts">
import { onMounted } from 'vue'
import { useVehicles } from '@/composables/useVehicles'
import SpinnerIcon from '@/components/SpinnerIcon.vue'
import DataTable from '@/components/DataTable.vue'
import PaginationControls from '@/components/PaginationControls.vue'

const {
  vehicles,
  fetchVehicles,
  form,
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
  getCustomerFullName,
  resetForm,
  isSaving,
} = useVehicles()

onMounted(() => {
  ;(fetchVehicles(), fetchCustomers())
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
      <DataTable>
        <template #thead>
          <th class="px-4 py-4">Id</th>
          <th class="px-4 py-4">Marca</th>
          <th class="px-4 py-4">Modelo</th>
          <th class="px-4 py-4">Matrícula</th>
          <th class="px-4 py-4">Año</th>
          <th class="px-4 py-4">Propietario</th>
          <th class="px-4 py-4">Acciones</th>
        </template>

        <template #tbody>
          <tr v-for="vehicle in vehicles" :key="String(vehicle.id)">
            <td class="px-4 py-4">{{ vehicle.id }}</td>
            <td class="px-4 py-4">{{ vehicle.brand }}</td>
            <td class="px-4 py-4">{{ vehicle.model }}</td>
            <td class="px-4 py-4">{{ vehicle.licensePlate }}</td>
            <td class="px-4 py-4">{{ vehicle.year }}</td>
            <td class="px-4 py-4">{{ getCustomerFullName(Number(vehicle.customerId)) }}</td>
            <td class="flex items-center justify-center gap-3 px-4 py-4">
              <button @click="openEditModal(vehicle)">
                <img src="../assets/icons/pencil.svg" alt="Editar" class="h-5 w-5 cursor-pointer dark:invert" />
              </button>
              <button @click="deleteVehicle(vehicle.id)">
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
      Añadir vehículo
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
          {{ editingId ? 'Editar vehículo' : 'Crear Vehículo' }}
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

      <form @submit.prevent="submitVehicle" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="brand" class="font-medium">Marca</label>
          <input
            id="brand"
            v-model="form.brand"
            required
            class="form-input"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="model" class="font-medium">Modelo</label>
          <input
            id="model"
            v-model="form.model"
            required
            class="form-input"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="licensePlate" class="font-medium">Matrícula</label>
          <input
            id="licensePlate"
            v-model="form.licensePlate"
            required
            :disabled="editingId !== null"
            class="form-input"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="year" class="font-medium">Año</label>
          <input
            type="number"
            id="year"
            v-model="form.year"
            required
            class="form-input"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="mechanic" class="font-medium">Propietario</label>
          <select
            id="mechanic"
            v-model="form.customerId"
            required
            :disabled="editingId !== null"
            class="form-select"
          >
            <option value="" disabled selected>Seleccione un propietario</option>
            <option v-for="c in customersList" :key="c.id" :value="c.id">
              {{ c.firstName }} {{ c.lastName }}
            </option>
          </select>
        </div>

        <button
          type="submit"
          :disabled="isSaving"
          class="bg-primary mt-4 flex items-center justify-center gap-2 cursor-pointer rounded py-2 font-bold text-white disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <SpinnerIcon v-if="isSaving" />
          <span v-else>Guardar vehículo</span>
        </button>
      </form>
    </div>
  </div>
</template>
