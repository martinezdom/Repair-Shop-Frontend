<script setup lang="ts">
import { onMounted } from 'vue'
import { useCustomers } from '@/composables/useCustomers'
import SpinnerIcon from '@/components/SpinnerIcon.vue'
import DataTable from '@/components/DataTable.vue'
import PaginationControls from '@/components/PaginationControls.vue'

const {
  customers,
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
  submitCustomer,
  fetchCustomers,
  deleteCustomer,
  resetForm,
  isSaving,
} = useCustomers()

onMounted(() => {
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
          <th class="table-cell">Nombre</th>
          <th class="table-cell">Apellidos</th>
          <th class="table-cell">Email</th>
          <th class="table-cell">Teléfono</th>
          <th class="table-cell">Acciones</th>
        </template>

        <template #tbody>
          <tr v-for="customer in customers" :key="String(customer.id)">
            <td class="table-cell">{{ customer.id }}</td>
            <td class="table-cell">{{ customer.firstName }}</td>
            <td class="table-cell">{{ customer.lastName }}</td>
            <td class="table-cell">{{ customer.email }}</td>
            <td class="table-cell">{{ customer.phone }}</td>
            <td class="table-cell flex items-center justify-center gap-3">
              <button @click="openEditModal(customer)">
                <img src="../assets/icons/pencil.svg" alt="Editar" class="h-5 w-5 cursor-pointer dark:invert" />
              </button>
              <button @click="deleteCustomer(customer.id)">
                <img src="../assets/icons/trash.svg" alt="Eliminar" class="h-5 w-5 cursor-pointer dark:invert" />
              </button>
            </td>
          </tr>
        </template>
      </DataTable>
    </div>

    <button v-if="!isModalOpen" @click="((editingId = null), openModal())" class="btn-primary">
      Añadir cliente
    </button>
  </div>

  <div v-if="isModalOpen" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="text-xl font-bold">{{ editingId ? 'Editar cliente' : 'Crear cliente' }}</h3>
        <button @click="closeModal(); resetForm()" class="cursor-pointer">
          <img src="../assets/icons/close-x.svg" alt="Cerrar" class="h-6 w-6 dark:invert" />
        </button>
      </div>

      <form @submit.prevent="submitCustomer" class="flex flex-col gap-4">
        <div class="form-field">
          <label for="firstName" class="font-medium">Nombre</label>
          <input id="firstName" v-model="form.firstName" required :disabled="editingId !== null" class="form-input" />
        </div>

        <div class="form-field">
          <label for="lastName" class="font-medium">Apellidos</label>
          <input id="lastName" v-model="form.lastName" required :disabled="editingId !== null" class="form-input" />
        </div>

        <div class="form-field">
          <label for="email" class="font-medium">Email</label>
          <input id="email" v-model="form.email" required class="form-input" />
        </div>

        <div class="form-field">
          <label for="phone" class="font-medium">Teléfono</label>
          <input id="phone" v-model="form.phone" required class="form-input" />
        </div>

        <button type="submit" :disabled="isSaving" class="btn-submit">
          <SpinnerIcon v-if="isSaving" />
          <span v-else>Guardar cliente</span>
        </button>
      </form>
    </div>
  </div>
</template>
