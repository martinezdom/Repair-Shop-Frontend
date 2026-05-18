<script setup lang="ts">
defineProps<{
  errorMessage?: string
}>()
</script>

<template>
  <div class="border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark rounded-card w-full max-w-6xl overflow-hidden border">
    <table class="w-full text-center">
      <thead class="bg-bg-light text-muted-light dark:bg-bg-dark dark:text-text-on-dark text-sm">
        <tr>
          <slot name="thead" />
        </tr>
      </thead>
      <tbody class="divide-border-light dark:divide-border-dark divide-y">
        <slot name="tbody" />
      </tbody>
    </table>
  </div>
</template>
