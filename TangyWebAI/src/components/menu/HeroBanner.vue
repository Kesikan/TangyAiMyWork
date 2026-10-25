<script setup lang="ts">
const props = defineProps<{ targetId: string }>()

function scrollToMenu() {
  const target = document.getElementById(props.targetId)
  if (!target) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  target.focus({ preventScroll: true })
}
</script>

<template>
  <section
    aria-labelledby="hero-heading"
    class="flex min-h-[22rem] flex-col items-center justify-center gap-5 rounded-card bg-linear-to-br from-brand-900 to-brand-600 px-6 py-16 text-center text-white sm:min-h-[26rem]"
  >
    <p class="text-sm font-semibold uppercase tracking-widest text-brand-200">
      Authentic Italian kitchen
    </p>
    <h1 id="hero-heading" class="font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
      Welcome to Tangy Restaurant
    </h1>
    <p class="max-w-xl text-lg text-brand-100">
      Fresh pasta, wood-fired pizza and classic desserts, made with simple ingredients and plenty of
      love.
    </p>
    <button
      type="button"
      class="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-6 py-2 font-semibold text-brand-900 transition-colors hover:bg-brand-100"
      @click="scrollToMenu"
    >
      View our menu
    </button>
  </section>
</template>
