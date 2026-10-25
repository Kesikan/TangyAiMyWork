<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="flex flex-col items-center gap-4 py-16 text-center">
    <h1 class="font-display text-3xl font-bold">Page not found</h1>
    <p class="text-ink-muted">The page you are looking for does not exist.</p>
    <RouterLink
      to="/"
      class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
    >
      Back to the menu
    </RouterLink>
  </section>
</template>
