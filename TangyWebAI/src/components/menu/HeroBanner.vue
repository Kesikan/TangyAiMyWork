<script setup lang="ts">
const props = defineProps<{ targetId: string }>()

const HERO_IMAGE = 'https://testkesis.blob.core.windows.net/tangyaidemo/Margherita_Pizza.png'

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
    class="relative isolate overflow-hidden rounded-[2rem] bg-brand-900 text-white shadow-lift"
  >
    <img
      :src="HERO_IMAGE"
      alt=""
      class="absolute inset-0 -z-20 size-full object-cover opacity-70"
    />
    <div
      class="absolute inset-0 -z-10 bg-linear-to-r from-brand-900 via-brand-900/80 to-brand-900/10"
    ></div>

    <div
      class="flex min-h-[26rem] flex-col justify-center gap-6 px-6 py-16 sm:px-12 lg:min-h-[32rem]"
    >
      <p
        class="w-fit rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-100 backdrop-blur"
      >
        Authentic Italian kitchen
      </p>
      <h1
        id="hero-heading"
        class="max-w-2xl animate-fade-up font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
      >
        Fresh pasta, wood-fired pizza &amp; sweet endings
      </h1>
      <p class="max-w-xl text-lg text-brand-100">
        Simple ingredients, classic recipes and plenty of love in every plate. Explore the menu and
        find your next favourite.
      </p>
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 py-2 font-semibold text-brand-900 shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-100"
          @click="scrollToMenu"
        >
          View our menu
          <svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            aria-hidden="true"
          >
            <path d="M12 5v14m0 0l-6-6m6 6l6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <span class="text-sm text-brand-100">Appetizers &middot; Entrees &middot; Desserts</span>
      </div>
    </div>
  </section>
</template>
