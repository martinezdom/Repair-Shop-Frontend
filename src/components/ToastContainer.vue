<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="fixed right-6 bottom-6 z-100 flex flex-col gap-3">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      @click="removeToast(toast.id)"
      class="flex min-w-72 cursor-pointer items-start gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg"
      :class="{
        'bg-success': toast.type === 'success',
        'bg-error': toast.type === 'error',
      }"
    >
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>
