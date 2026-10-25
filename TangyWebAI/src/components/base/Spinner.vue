<script setup lang="ts">
withDefaults(defineProps<{ label?: string; size?: 'sm' | 'md' | 'lg' }>(), {
  label: 'Loading',
  size: 'md',
})
</script>

<template>
  <span role="status" class="inline-flex items-center justify-center">
    <svg
      class="animate-spin text-brand-600"
      :class="{ 'size-4': size === 'sm', 'size-8': size === 'md', 'size-12': size === 'lg' }"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
    <span class="sr-only">{{ label }}</span>
  </span>
</template>
