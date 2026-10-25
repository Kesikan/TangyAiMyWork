<script setup lang="ts">
import BaseButton from './BaseButton.vue'

withDefaults(defineProps<{ message: string; retryable?: boolean }>(), { retryable: true })
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div
    role="alert"
    class="flex flex-col items-start gap-3 rounded-card border border-danger/30 bg-danger-soft p-4 text-danger"
  >
    <p class="font-medium">{{ message }}</p>
    <BaseButton v-if="retryable" variant="secondary" @click="emit('retry')">Retry</BaseButton>
  </div>
</template>
