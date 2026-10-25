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
    class="inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    :class="{
      'bg-brand-600 text-white shadow-soft hover:bg-brand-700': variant === 'primary',
      'border border-line bg-white text-ink hover:border-brand-200 hover:bg-brand-50':
        variant === 'secondary',
      'bg-danger text-white shadow-soft hover:opacity-90': variant === 'danger',
    }"
  >
    <Spinner v-if="loading" size="sm" label="Working" class="[&_svg]:text-current" />
    <slot />
  </button>
</template>
