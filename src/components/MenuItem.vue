<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  to: string
  label: string
}>()
</script>

<template>
  <li class="hover:scale-110 transition-transform">
    <RouterLink :to="to">{{ label }}</RouterLink>
  </li>
</template>
