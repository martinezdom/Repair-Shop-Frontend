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
  isSaving
} = useCustomers()

onMounted(() => {
  fetchCustomers()
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
          <th class="px-4 py-4">Nombre</th>
          <th class="px-4 py-4">Apellidos</th>
          <th class="px-4 py-4">Email</th>
          <th class="px-4 py-4">Teléfono</th>
          <th class="px-4 py-4">Acciones</th>
        </template>

        <template #tbody>
          <tr v-for="customer in customers" :key="String(customer.id)">
            <td class="px-4 py-4">{{ customer.id }}</td>
            <td class="px-4 py-4">{{ customer.firstName }}</td>
            <td class="px-4 py-4">{{ customer.lastName }}</td>
            <td class="px-4 py-4">{{ customer.email }}</td>
            <td class="px-4 py-4">{{ customer.phone }}</td>
            <td class="flex items-center justify-center gap-3 px-4 py-4">
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
    <button
      v-if="!isModalOpen"
      @click="((editingId = null), openModal())"
      class="bg-primary rounded-btn dark:bg-primary-dark cursor-pointer px-6 py-3 font-semibold text-white"
    >
      Añadir cliente
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
          {{ editingId ? 'Editar cliente' : 'Crear cliente' }}
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

      <form @submit.prevent="submitCustomer" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="firstName" class="font-medium">Nombre</label>
          <input
            id="firstName"
            v-model="form.firstName"
            required
            :disabled="editingId !== null"
            class="form-input"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="lastName" class="font-medium">Apellidos</label>
          <input
            id="lastName"
            v-model="form.lastName"
            required
            :disabled="editingId !== null"
            class="form-input"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="email" class="font-medium">Email</label>
          <input
            id="email"
            v-model="form.email"
            required
            class="form-input"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="phone" class="font-medium">Teléfono</label>
          <input
            id="phone"
            v-model="form.phone"
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
          <span v-else>Guardar cliente</span>
        </button>
      </form>
    </div>
  </div>
</template>
