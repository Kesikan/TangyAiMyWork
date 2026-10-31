<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Toast from '@/components/base/Toast.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="sticky top-0 z-40 border-b border-line/70 bg-surface/80 backdrop-blur-md">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <RouterLink to="/" class="flex items-center gap-2.5">
          <span
            class="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft"
            aria-hidden="true"
          >
            <svg
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path
                d="M6 3v7a3 3 0 003 3v8M9 3v7M12 3v7M17 21V3c-2 2-3 5-3 8h3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="font-display text-xl font-bold tracking-tight text-brand-900">
            Tangy Restaurant
          </span>
        </RouterLink>
        <nav aria-label="Main navigation" class="flex items-center gap-1 sm:gap-2">
          <RouterLink
            to="/contact"
            class="rounded-full px-3 py-2 text-sm font-semibold text-ink-muted transition-colors hover:bg-brand-100 hover:text-brand-900 sm:px-4"
          >
            Contact
          </RouterLink>
          <RouterLink
            to="/manage"
            class="rounded-full px-3 py-2 text-sm font-semibold text-ink-muted transition-colors hover:bg-brand-100 hover:text-brand-900 sm:px-4"
          >
            Menu Studio
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
      <RouterView />
    </main>

    <footer class="mt-8 bg-brand-900 text-brand-100">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-center text-sm sm:flex-row sm:text-left"
      >
        <p class="font-display text-lg font-semibold text-white">Tangy Restaurant</p>
        <p>&copy; {{ new Date().getFullYear() }} Tangy Restaurant. All rights reserved.</p>
      </div>
    </footer>
    <Toast />
  </div>
</template>
