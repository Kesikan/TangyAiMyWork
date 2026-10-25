<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'

defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
}>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <BaseModal :open="open" :title="title" @close="!loading && emit('cancel')">
    <p class="text-ink-muted">{{ message }}</p>
    <template #footer>
      <BaseButton variant="secondary" :disabled="loading" @click="emit('cancel')"
        >Cancel</BaseButton
      >
      <BaseButton variant="danger" :loading="loading" @click="emit('confirm')">
        {{ confirmLabel ?? 'Delete' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
