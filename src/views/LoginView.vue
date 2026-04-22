<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

async function login() {
  try {
    errorMessage.value = ''

    const response = await api('/auth/login', 'POST', {
      email: email.value,
      password: password.value,
    })

    const token = response.token

    if (token) {
      localStorage.setItem('token', token)
      router.push('/dashboard')
    }
  } catch (error) {
    errorMessage.value = 'Credenciales incorrectas. Inténtalo de nuevo.'
    console.error(error)
  }
}
</script>

<template>
  <div>
    <h2>Formulario de inicio de sesión</h2>

    <form @submit.prevent="login">
      <label for="email">Email</label>
      <input type="email" id="email" v-model="email" required />

      <label for="password">Contraseña</label>
      <input type="password" id="password" v-model="password" required />

      <button type="submit">Entrar</button>
    </form>

    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
  </div>
</template>
