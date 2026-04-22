<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="wrapper">
    <nav>
      <RouterLink to="/login">Inicio de sesión</RouterLink>
      <RouterLink to="/dashboard">Panel de control</RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
