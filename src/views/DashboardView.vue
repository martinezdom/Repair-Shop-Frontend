<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'

type Repair = {
  id: number
  vehicleLicensePlate: string
  status: string
  mechanicName: string
  description: string
}

const repairs = ref<Repair[]>([])
const errorMessage = ref('')
async function fetchRepairs() {
  try {
    const response = await api('/repairs')
    repairs.value = response.content || response
  } catch (error) {
    errorMessage.value = 'Error al cargar las reparaciones'
    console.error(error)
  }
}

onMounted(() => {
  fetchRepairs()
})
</script>

<template>
  <div class="flex justify-center text-slate-800 dark:text-slate-300">
    <h2 v-if="errorMessage" class="text-red-700 dark:text-red-300">{{ errorMessage }}</h2>
    <table class="border-slate-800 dark:border-slate-300">
      <thead class="border-slate-800 dark:border-slate-300">
        <tr class="p-6">
          <th>Id</th>
          <th>Matrícula</th>
          <th>Estado</th>
          <th>Mecánico responsable</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody class="border-slate-800 dark:border-slate-300">
        <tr v-for="repair in repairs" :key="repair.id">
          <td>{{ repair.id }}</td>
          <td>{{ repair.vehicleLicensePlate }}</td>
          <td>{{ repair.status }}</td>
          <td>{{ repair.mechanicName }}</td>
          <td>{{ repair.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
