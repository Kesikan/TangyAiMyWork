<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  label: string
  error?: string
  disabled?: boolean
  required?: boolean
  hideLabel?: boolean
}>()

const model = defineModel<string>({ default: '' })
const id = useId()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="id" class="text-sm font-medium" :class="{ 'sr-only': hideLabel }">
      {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
    </label>
    <select
      :id="id"
      v-model="model"
      :disabled="disabled"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      class="min-h-10 rounded-lg border border-line bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
      :class="{ 'border-danger': error }"
    >
      <slot />
    </select>
    <p v-if="error" :id="`${id}-error`" class="text-sm text-danger">{{ error }}</p>
  </div>
</template>
