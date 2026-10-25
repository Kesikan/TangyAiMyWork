<script setup lang="ts">
import Spinner from './Spinner.vue'

withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger'
    type?: 'button' | 'submit'
    loading?: boolean
    disabled?: boolean
  }>(),
  { variant: 'primary', type: 'button', loading: false, disabled: false },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading"
    class="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
    :class="{
      'bg-brand-600 text-white hover:bg-brand-700': variant === 'primary',
      'border border-line bg-white text-ink hover:bg-brand-50': variant === 'secondary',
      'bg-danger text-white hover:opacity-90': variant === 'danger',
    }"
  >
    <Spinner v-if="loading" size="sm" label="Working" class="[&_svg]:text-current" />
    <slot />
  </button>
</template>
