<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

withDefaults(defineProps<{ open: boolean; title: string; size?: 'md' | 'lg' }>(), { size: 'md' })
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Dialog :open="open" class="relative z-50" @close="emit('close')">
    <div class="fixed inset-0 bg-brand-900/60 backdrop-blur-sm" aria-hidden="true" />
    <div class="fixed inset-0 overflow-y-auto p-4">
      <div class="flex min-h-full items-center justify-center">
        <DialogPanel
          class="w-full animate-fade-up overflow-hidden rounded-[1.75rem] bg-surface shadow-lift"
          :class="size === 'lg' ? 'max-w-2xl' : 'max-w-lg'"
        >
          <header class="flex items-start justify-between gap-4 border-b border-line p-5">
            <DialogTitle class="font-display text-2xl font-bold text-brand-900">
              {{ title }}
            </DialogTitle>
            <button
              type="button"
              class="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-900 transition hover:bg-brand-100"
              aria-label="Close dialog"
              @click="emit('close')"
            >
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
              </svg>
            </button>
          </header>
          <div class="p-5"><slot /></div>
          <footer v-if="$slots.footer" class="flex justify-end gap-2 border-t border-line p-5">
            <slot name="footer" />
          </footer>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>
