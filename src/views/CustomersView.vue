<script setup lang="ts">
import { onMounted } from 'vue'
import { useCustomers } from '@/composables/useCustomers'

const {
  customers,
  form,
  errorMessage,
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
  resetForm
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
      <div class="flex justify-end gap-4">
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
              <th class="px-4 py-4">Nonbre</th>
              <th class="px-4 py-4">Apellidos</th>
              <th class="px-4 py-4">Email</th>
              <th class="px-4 py-4">Teléfono</th>
            </tr>
          </thead>

          <tbody class="divide-border-light dark:divide-border-dark divide-y">
            <tr v-for="customer in customers" :key="String(customer.id)" class="">
              <td class="px-4 py-4">{{ customer.id }}</td>
              <td class="px-4 py-4">{{ customer.firstName }}</td>
              <td class="px-4 py-4">{{ customer.lastName }}</td>
              <td class="px-4 py-4">{{ customer.email }}</td>
              <td class="px-4 py-4">{{ customer.phone }}</td>
              <td class="flex items-center justify-center gap-3 px-4 py-4">
                <button @click="openEditModal(customer)" class="">
                  <img
                    src="../assets/icons/pencil.svg"
                    alt="Editar"
                    class="h-5 w-5 cursor-pointer dark:invert"
                  />
                </button>
                <button @click="deleteCustomer(customer.id)" class="">
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
            class="bg-bg-light text-text-on-light dark:bg-bg-dark dark:text-text-on-dark border-border-light dark:border-border-dark rounded-btn w-full border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="lastName" class="font-medium">Apellidos</label>
          <input
            id="lastName"
            v-model="form.lastName"
            required
            :disabled="editingId !== null"
            class="bg-bg-light text-text-on-light dark:bg-bg-dark dark:text-text-on-dark border-border-light dark:border-border-dark rounded-btn w-full border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="email" class="font-medium">Email</label>
          <input
            id="email"
            v-model="form.email"
            required
            class="bg-bg-light text-text-on-light dark:bg-bg-dark dark:text-text-on-dark border-border-light dark:border-border-dark rounded-btn w-full border px-3 py-2"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="phone" class="font-medium">Teléfono</label>
          <input
            id="phone"
            v-model="form.phone"
            required
            class="bg-bg-light text-text-on-light dark:bg-bg-dark dark:text-text-on-dark border-border-light dark:border-border-dark rounded-btn w-full border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          class="bg-primary mt-4 cursor-pointer rounded py-2 font-bold text-white"
        >
          Guardar cliente
        </button>
      </form>
    </div>
  </div>
</template>
