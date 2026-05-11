<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
 to: string
 label: string
}>()
</script>

<template>
 <li>
 <RouterLink :to="to">{{ label }}</RouterLink>
 </li>
</template>
