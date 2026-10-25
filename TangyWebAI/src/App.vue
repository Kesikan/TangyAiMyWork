<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Toast from '@/components/base/Toast.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="border-b border-line bg-brand-900 text-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <RouterLink to="/" class="font-display text-2xl font-bold">Tangy Restaurant</RouterLink>
      </div>
    </header>
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <RouterView />
    </main>
    <footer class="border-t border-line py-6 text-center text-sm text-ink-muted">
      &copy; {{ new Date().getFullYear() }} Tangy Restaurant
    </footer>
    <Toast />
  </div>
</template>
