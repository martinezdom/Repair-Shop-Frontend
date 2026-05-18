<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import ToastContainer from './components/ToastContainer.vue'

const route = useRoute()
</script>

<template>
 <div id="wrapper" class="min-h-screen flex flex-col">
 <header class="bg-bg-light dark:bg-bg-dark shadow-md">
 <NavBar v-if="route.meta.requiresAuth" />
 </header>

 <main class="container mx-auto flex flex-1 items-center justify-center p-4">
 <RouterView />
 </main>

 <ToastContainer />
 </div>
</template>
