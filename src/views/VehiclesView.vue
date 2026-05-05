<script setup lang="ts">
import { onMounted } from 'vue'
import { useVehicles } from '@/composables/useVehicles'

const {
    vehicles,
    fetchVehicles,
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
    deleteVehicle,
    submitVehicle,
    customersList,
    fetchCustomers,
} = useVehicles()

onMounted(() => {
    fetchVehicles(),
    fetchCustomers()
})
</script>

<template>
    <div class="text-text-on-light dark:text-text-on-dark flex flex-col justify-center gap-3 px-4 py-8">
        <div v-if="!isModalOpen" class="flex flex-col gap-2">
            <div class="flex justify-end gap-6">
                <button :disabled="currentPage === 0" @click="previousPage()"
                    class="bg-primary rounded-btn cursor-pointer px-5 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-600">
                    Anterior
                </button>
                <button :disabled="currentPage === totalPages - 1" @click="nextPage()"
                    class="bg-primary rounded-btn cursor-pointer px-5 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-600">
                    Siguiente
                </button>
            </div>
            <div
                class="border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark rounded-card w-full max-w-6xl overflow-hidden border">
                <h2 v-if="errorMessage" class="px-6 pt-6 text-center text-red-700 dark:text-red-300">
                    {{ errorMessage }}
                </h2>

                <table class="w-full text-center">
                    <thead class="bg-bg-light text-muted-light dark:bg-bg-dark dark:text-text-on-dark text-sm">
                        <tr>
                            <th class="px-4 py-4">Id</th>
                            <th class="px-4 py-4">Marca</th>
                            <th class="px-4 py-4">Modelo</th>
                            <th class="px-4 py-4">Matrícula</th>
                            <th class="px-4 py-4">Año</th>
                            <th class="px-4 py-4">Propietario</th>
                            <th class="px-4 py-4">Acciones</th>
                        </tr>
                    </thead>

                    <tbody class="divide-border-light dark:divide-border-dark divide-y">
                        <tr v-for="vehicle in vehicles" :key="String(vehicle.id)" class="">
                            <td class="px-4 py-4">{{ vehicle.id }}</td>
                            <td class="px-4 py-4">{{ vehicle.brand }}</td>
                            <td class="px-4 py-4">{{ vehicle.model }}</td>
                            <td class="px-4 py-4">{{ vehicle.licensePlate }}</td>
                            <td class="px-4 py-4">{{ vehicle.year }}</td>
                            <td class="px-4 py-4">{{ vehicle.customerId }}</td>
                            <td class="flex items-center justify-center gap-3 px-4 py-4">
                                <button @click="openEditModal(vehicle)" class="">
                                    <img src="../assets/icons/pencil.svg" alt="Editar"
                                        class="h-5 w-5 cursor-pointer dark:invert" />
                                </button>
                                <button @click="deleteVehicle(vehicle.id)" class="">
                                    <img src="../assets/icons/trash.svg" alt="Eliminar"
                                        class="h-5 w-5 cursor-pointer dark:invert" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <button v-if="!isModalOpen" @click="((editingId = null), openModal())"
            class="bg-primary cursor-pointer rounded-btn dark:bg-primary-dark px-6 py-3 font-semibold text-white">
            Añadir vehículo
        </button>
    </div>
    <div v-if="isModalOpen"
        class="bg-overlay-dark/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div
            class="border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark rounded-card w-full max-w-lg border p-6">
            <div class="mb-6 flex items-center justify-between">
                <h3 class="text-xl font-bold">
                    {{ editingId ? 'Editar vehículo' : 'Crear Vehículo' }}
                </h3>
                <button @click="closeModal()" class="">
                    <img src="../assets/icons/close-x.svg" alt="Cerrar" class="h-6 w-6 dark:invert" />
                </button>
            </div>

            <form @submit.prevent="submitVehicle" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label for="brand" class="font-medium">Marca</label>
                    <input id="brand" v-model="form.brand" required
                        class="bg-bg-light text-text-on-light dark:bg-bg-dark dark:text-text-on-dark border-border-light dark:border-border-dark rounded-btn w-full border px-3 py-2"></input>
                </div>

                <div class="flex flex-col gap-1">
                    <label for="model" class="font-medium">Modelo</label>
                    <input id="model" v-model="form.model" required
                        class="bg-bg-light text-text-on-light dark:bg-bg-dark dark:text-text-on-dark border-border-light dark:border-border-dark rounded-btn w-full border px-3 py-2"></input>
                </div>

                <div class="flex flex-col gap-1">
                    <label for="licensePlate" class="font-medium">Matrícula</label>
                    <input id="licensePlate" v-model="form.licensePlate" required :disabled="editingId !== null"
                        class="bg-bg-light text-text-on-light dark:bg-bg-dark dark:text-text-on-dark border-border-light dark:border-border-dark rounded-btn w-full border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"></input>
                </div>

                <div class="flex flex-col gap-1">
                    <label for="year" class="font-medium">Año</label>
                    <input type="number" id="year" v-model="form.year" required
                        class="bg-bg-light text-text-on-light dark:bg-bg-dark dark:text-text-on-dark border-border-light dark:border-border-dark rounded-btn w-full border px-3 py-2"></input>
                </div>

                <div class="flex flex-col gap-1">
                    <label for="mechanic" class="font-medium">Propietario</label>
                    <select id="mechanic" v-model="form.customerId" required :disabled="editingId !== null"
                        class="border-border-light bg-bg-light text-text-on-light dark:border-border-dark dark:bg-bg-dark dark:text-text-on-dark accent-primary rounded border p-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="" disabled selected>Seleccione un propietario</option>
                        <option v-for="c in customersList" :key="c.id" :value="c.id">
                            {{ c.firstName }} {{ c.lastName }}
                        </option>
                    </select>
                </div>

                <button type="submit" class="bg-primary mt-4 rounded py-2 font-bold text-white">
                    Guardar Reparación
                </button>
            </form>
        </div>
    </div>
</template>