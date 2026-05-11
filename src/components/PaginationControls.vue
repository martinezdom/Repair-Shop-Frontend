<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  previous: []
  next: []
}>()
</script>

<template>
  <div class="flex justify-end gap-4">
    <button
      :disabled="currentPage === 0"
      @click="emit('previous')"
      class="bg-primary rounded-btn cursor-pointer px-5 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-600"
    >
      Anterior
    </button>
    <button
      :disabled="currentPage === totalPages - 1"
      @click="emit('next')"
      class="bg-primary rounded-btn cursor-pointer px-5 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-600"
    >
      Siguiente
    </button>
  </div>
</template>
