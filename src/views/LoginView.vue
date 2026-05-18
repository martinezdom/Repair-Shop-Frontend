<script setup lang="ts">
import { useRouter } from 'vue-router'
import { api } from '@/services/api'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { ref } from 'vue'

const router = useRouter()
const { getUserRole } = useAuth()
const { error } = useToast()

const email = ref('')
const password = ref('')

async function login() {
  try {
    const response = await api('/auth/login', 'POST', {
      email: email.value,
      password: password.value,
    })
    const token = response.token
    if (token) {
      localStorage.setItem('token', token)
      getUserRole() === 'ADMIN' ? router.push('/dashboard') : router.push('/repairs')
    }
  } catch (err) {
    error('Credenciales incorrectas. Inténtalo de nuevo.')
    console.error(err)
  }
}
</script>

<template>
  <div class="bg-bg-light text-text-on-light dark:bg-bg-dark dark:text-text-on-dark border-border-light dark:border-border-dark rounded-card w-full max-w-md border p-6">
    <h2 class="mb-6 text-center text-xl font-semibold">Formulario de inicio de sesión</h2>

    <form @submit.prevent="login" class="flex flex-col gap-4">
      <div class="form-field">
        <label for="email" class="font-medium">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="form-input"
          placeholder="tu@email.com"
        />
      </div>

      <div class="form-field">
        <label for="password" class="font-medium">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="form-input"
          placeholder="••••••••"
        />
      </div>

      <button type="submit" class="btn-primary mt-2">
        Entrar
      </button>
    </form>
  </div>
</template>
