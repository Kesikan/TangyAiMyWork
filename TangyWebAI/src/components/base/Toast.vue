<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4"
    aria-live="polite"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :role="toast.type === 'error' ? 'alert' : 'status'"
      class="pointer-events-auto flex w-full max-w-md items-start justify-between gap-3 rounded-lg border p-3 text-sm shadow-lg"
      :class="
        toast.type === 'error'
          ? 'border-danger/30 bg-danger-soft text-danger'
          : 'border-success/30 bg-success-soft text-success'
      "
    >
      <span>{{ toast.text }}</span>
      <button type="button" class="font-semibold underline" @click="remove(toast.id)">
        Dismiss
      </button>
    </div>
  </div>
</template>
