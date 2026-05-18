<script setup lang="ts">
import { onMounted } from 'vue'
import { useVehicles } from '@/composables/useVehicles'
import { useAuth } from '@/composables/useAuth'
import SpinnerIcon from '@/components/SpinnerIcon.vue'
import DataTable from '@/components/DataTable.vue'
import PaginationControls from '@/components/PaginationControls.vue'

const { isAdmin } = useAuth()

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
  fetchVehicles()
  fetchCustomers()
})
</script>

<template>
  <div class="view-wrapper">
    <div v-if="!isModalOpen" class="flex flex-col gap-2">
      <PaginationControls
        :currentPage="currentPage"
        :totalPages="totalPages"
        @previous="previousPage()"
        @next="nextPage()"
      />
      <DataTable>
        <template #thead>
          <th class="table-cell">Id</th>
          <th class="table-cell">Marca</th>
          <th class="table-cell">Modelo</th>
          <th class="table-cell">Matrícula</th>
          <th class="table-cell">Año</th>
          <th class="table-cell">Propietario</th>
          <th class="table-cell">Acciones</th>
        </template>

        <template #tbody>
          <tr v-for="vehicle in vehicles" :key="String(vehicle.id)" class="table-row">
            <td class="table-cell">{{ vehicle.id }}</td>
            <td class="table-cell">{{ vehicle.brand }}</td>
            <td class="table-cell">{{ vehicle.model }}</td>
            <td class="table-cell">{{ vehicle.licensePlate }}</td>
            <td class="table-cell">{{ vehicle.year }}</td>
            <td class="table-cell">{{ getCustomerFullName(Number(vehicle.customerId)) }}</td>
            <td class="table-cell">
              <div class="flex items-center justify-center gap-2">
                <button @click="openEditModal(vehicle)" class="transition-transform hover:scale-110">
                  <img
                    src="../assets/icons/pencil.svg"
                    alt="Editar"
                    class="h-5 w-5 cursor-pointer dark:invert"
                  />
                </button>
                <button v-if="isAdmin" @click="deleteVehicle(vehicle.id)" class="transition-transform hover:scale-110">
                  <img
                    src="../assets/icons/trash.svg"
                    alt="Eliminar"
                    class="h-5 w-5 cursor-pointer dark:invert"
                  />
                </button>
              </div>
            </td>
          </tr>
        </template>
      </DataTable>
    </div>

    <button v-if="!isModalOpen" @click="((editingId = null), openModal())" class="btn-primary">
      Añadir vehículo
    </button>
  </div>

  <div v-if="isModalOpen" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="text-xl font-bold">{{ editingId ? 'Editar vehículo' : 'Crear vehículo' }}</h3>
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
        <div class="form-field">
          <label for="brand" class="font-medium">Marca</label>
          <input id="brand" v-model="form.brand" required class="form-input" />
        </div>

        <div class="form-field">
          <label for="model" class="font-medium">Modelo</label>
          <input id="model" v-model="form.model" required class="form-input" />
        </div>

        <div class="form-field">
          <label for="licensePlate" class="font-medium">Matrícula</label>
          <input
            id="licensePlate"
            v-model="form.licensePlate"
            required
            :disabled="editingId !== null"
            class="form-input"
          />
        </div>

        <div class="form-field">
          <label for="year" class="font-medium">Año</label>
          <input id="year" type="number" v-model="form.year" required class="form-input" />
        </div>

        <div class="form-field">
          <label for="customerId" class="font-medium">Propietario</label>
          <select
            id="customerId"
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

        <button type="submit" :disabled="isSaving" class="btn-submit">
          <SpinnerIcon v-if="isSaving" />
          <span v-else>Guardar vehículo</span>
        </button>
      </form>
    </div>
  </div>
</template>
