<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'

const route = useRoute()
</script>

<template>
  <div id="wrapper" class="min-h-screen">
    <header class="bg-slate-300 shadow-md dark:bg-slate-800">
      <NavBar v-if="route.meta.requiresAuth" />
    </header>

    <main class="container mx-auto flex min-h-screen items-center justify-center p-4">
      <RouterView />
    </main>
  </div>
</template>
