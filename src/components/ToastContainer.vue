<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="fixed right-6 bottom-6 z-100 flex flex-col gap-3">
    <TransitionGroup
      enter-from-class="opacity-0 translate-y-4"
      enter-active-class="transition-all duration-300 ease-out"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0 translate-y-4"
    >
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
        <span class="mt-0.5 text-base leading-none">
          {{ toast.type === 'success' ? '✓' : '✕' }}
        </span>
        <span>{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>
