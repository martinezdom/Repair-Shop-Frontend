<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import { useRouter } from 'vue-router'

type Repair = {
  id: number
  vehicleLicensePlate: string
  status: string
  mechanicName: string
  description: string
}

const router = useRouter()
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

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(() => {
  fetchRepairs()
})
</script>

<template>
  <div>
    <button @click="logout">Cerrar sesión</button>
    <h2 v-if="errorMessage">{{ errorMessage }}</h2>
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Matrícula</th>
          <th>Estado</th>
          <th>Mecánico responsable</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
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
