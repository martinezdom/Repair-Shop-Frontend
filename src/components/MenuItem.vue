<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
 to: string
 label: string
}>()
</script>

<template>
 <li>
 <RouterLink :to="to" class="inline-block transition-transform hover:scale-110">{{ label }}</RouterLink>
 </li>
</template>
