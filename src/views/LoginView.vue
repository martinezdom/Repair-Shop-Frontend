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
    class="w-full max-w-md rounded-2xl border border-slate-800/20 bg-slate-300 p-6 text-slate-800 dark:border-slate-300/20 dark:bg-slate-800 dark:text-slate-300"
  >
    <h2 class="mb-6 text-center text-xl font-semibold">Formulario de inicio de sesión</h2>

    <form @submit.prevent="login" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1.5">
        <label for="email" class="font-medium text-slate-800 dark:text-slate-300">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="w-full rounded-lg border border-slate-800 bg-slate-300 px-3 py-2 text-slate-800 transition dark:border-slate-300 dark:bg-slate-800 dark:text-slate-300"
          placeholder="tu@email.com"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="password" class="font-medium text-slate-800 dark:text-slate-300"
          >Contraseña</label
        >
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="w-full rounded-lg border border-slate-800 bg-slate-300 px-3 py-2 text-slate-800 transition dark:border-slate-300 dark:bg-slate-800 dark:text-slate-300"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        class="mt-2 cursor-pointer rounded-lg border border-slate-800 bg-slate-800 px-4 py-2 font-medium text-slate-300 transition hover:bg-slate-300 hover:text-slate-800 dark:border-slate-300 dark:bg-slate-300 dark:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-300"
      >
        Entrar
      </button>
    </form>

    <p
      v-if="errorMessage"
      class="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/60 dark:text-red-300"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
