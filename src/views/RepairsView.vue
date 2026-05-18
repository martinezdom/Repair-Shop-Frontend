<script setup lang="ts">
import { onMounted } from 'vue'
import { useRepairs } from '@/composables/useRepairs'
import SpinnerIcon from '@/components/SpinnerIcon.vue'
import DataTable from '@/components/DataTable.vue'
import PaginationControls from '@/components/PaginationControls.vue'

const {
  repairs,
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
          <th class="table-cell">Matrícula</th>
          <th class="table-cell">Estado</th>
          <th class="table-cell">Mecánico responsable</th>
          <th class="table-cell">Coste</th>
          <th class="table-cell">Descripción</th>
          <th class="table-cell">Acciones</th>
        </template>

        <template #tbody>
          <tr v-for="repair in repairs" :key="String(repair.id)">
            <td class="table-cell">{{ repair.id }}</td>
            <td class="table-cell">{{ repair.vehicleLicensePlate }}</td>
            <td class="table-cell">{{ formatStatus(repair.status) }}</td>
            <td class="table-cell">{{ repair.mechanicName }}</td>
            <td class="table-cell">{{ formatCost(repair.cost) }}</td>
            <td class="table-cell">{{ repair.description }}</td>
            <td class="table-cell flex items-center justify-center gap-3">
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

    <button v-if="!isModalOpen" @click="((editingId = null), openModal())" class="btn-primary">
      Nueva reparación
    </button>
  </div>

  <div v-if="isModalOpen" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="text-xl font-bold">{{ editingId ? 'Editar reparación' : 'Crear reparación' }}</h3>
        <button @click="closeModal(); resetForm()" class="cursor-pointer">
          <img src="../assets/icons/close-x.svg" alt="Cerrar" class="h-6 w-6 dark:invert" />
        </button>
      </div>

      <form @submit.prevent="submitRepair" class="flex flex-col gap-4">
        <div class="form-field">
          <label for="description" class="font-medium">Descripción</label>
          <textarea id="description" v-model="form.description" required :disabled="editingId !== null" class="form-input"></textarea>
        </div>

        <div class="form-field">
          <label for="mechanic" class="font-medium">Mecánico</label>
          <select id="mechanic" v-model="form.mechanicId" required :disabled="editingId !== null" class="form-select">
            <option value="" disabled selected>Seleccione un mecánico</option>
            <option v-for="m in mechanicsList" :key="m.id" :value="m.id">{{ m.username }}</option>
          </select>
        </div>

        <div class="form-field">
          <label for="vehicle" class="font-medium">Vehículo</label>
          <select id="vehicle" v-model="form.vehicleId" required :disabled="editingId !== null" class="form-select">
            <option value="" disabled selected>Seleccione un vehículo</option>
            <option v-for="v in vehiclesList" :key="v.id" :value="v.id">{{ v.licensePlate }}</option>
          </select>
        </div>

        <div v-if="editingId" class="form-field">
          <label for="status" class="font-medium">Estado</label>
          <select id="status" v-model="form.status" required class="form-select">
            <option value="" disabled selected>Seleccione el estado</option>
            <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
        </div>

        <div v-if="editingId" class="form-field">
          <label for="cost" class="font-medium">Coste</label>
          <input id="cost" v-model="form.cost" type="number" required class="form-input" />
        </div>

        <button type="submit" :disabled="isSaving" class="btn-submit">
          <SpinnerIcon v-if="isSaving" />
          <span v-else>Guardar reparación</span>
        </button>
      </form>
    </div>
  </div>
</template>
