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
  <div
    class="bg-bg-light text-text-on-light dark:bg-bg-dark dark:text-text-on-dark border-border-light dark:border-border-dark rounded-card w-full max-w-md border p-6"
  >
    <h2 class="mb-6 text-center text-xl font-semibold">Formulario de inicio de sesión</h2>

    <form @submit.prevent="login" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1.5">
        <label for="email" class="text-text-on-light dark:text-text-on-dark font-medium"
          >Email</label
        >
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="bg-bg-light text-text-on-light dark:bg-bg-dark dark:text-text-on-dark border-border-light dark:border-border-dark rounded-btn w-full border px-3 py-2"
          placeholder="tu@email.com"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="password" class="text-text-on-light dark:text-text-on-dark font-medium"
          >Contraseña</label
        >
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="bg-bg-light text-text-on-light dark:bg-bg-dark dark:text-text-on-dark border-border-light dark:border-border-dark rounded-btn w-full border px-3 py-2"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        class="border-border-light dark:border-border-dark rounded-btn bg-primary dark:bg-primary mt-2 border px-4 py-2 font-medium text-white dark:text-white"
      >
        Entrar
      </button>
    </form>

    <p
      v-if="errorMessage"
      class="rounded-btn mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/60 dark:text-red-300"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
