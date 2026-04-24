<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'

const route = useRoute()
</script>

<template>
  <div id="wrapper" class="min-h-screen">
    <header class="bg-slate-500 dark:bg-slate-700 shadow-md">
      <NavBar v-if="route.meta.requiresAuth" />
    </header>

    <main class="container mx-auto p-4">
      <RouterView />
    </main>
  </div>
</template>
