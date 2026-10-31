<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'

const name = ref('')
const email = ref('')
const message = ref('')
const status = ref('')
const contactEmail = computed(() => import.meta.env.VITE_CONTACT_EMAIL?.trim() ?? '')

function sendMessage() {
  if (!contactEmail.value) {
    status.value = 'Contact email is not configured yet. Please try again later.'
    return
  }

  const subject = encodeURIComponent(`Website message from ${name.value.trim()}`)
  const body = encodeURIComponent(
    `${message.value.trim()}\n\nFrom: ${name.value.trim()}\nReply to: ${email.value.trim()}`,
  )
  window.location.href = `mailto:${contactEmail.value}?subject=${subject}&body=${body}`
  status.value = 'Your email app should open with your message ready to send.'
}
</script>

<template>
  <section class="mx-auto flex max-w-5xl flex-col gap-8" aria-labelledby="contact-heading">
    <header class="max-w-2xl">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
        We'd love to hear from you
      </p>
      <h1
        id="contact-heading"
        class="mt-2 font-display text-4xl font-bold text-brand-900 sm:text-5xl"
      >
        Contact us
      </h1>
      <p class="mt-3 text-lg leading-relaxed text-ink-muted">
        Have a question about our menu or your visit? Send us a message and we'll get back to you.
      </p>
    </header>

    <div class="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <aside
        class="flex flex-col justify-between gap-6 rounded-card bg-brand-900 p-6 text-white shadow-soft sm:p-8"
      >
        <div>
          <span
            class="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 text-brand-100"
            aria-hidden="true"
          >
            <svg
              class="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
            >
              <path
                d="M3 7l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <h2 class="font-display text-2xl font-semibold">Get in touch</h2>
          <p class="mt-2 leading-relaxed text-brand-100">
            Send your note directly from your email app. Your message won't be stored on this
            website.
          </p>
        </div>
        <div class="rounded-xl border border-white/15 bg-white/5 p-4">
          <p class="text-xs font-semibold uppercase tracking-widest text-brand-200">Email</p>
          <a
            v-if="contactEmail"
            :href="`mailto:${contactEmail}`"
            class="mt-1 inline-block break-all font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
          >
            {{ contactEmail }}
          </a>
          <p v-else class="mt-1 text-sm text-brand-100">Email contact is not configured yet.</p>
        </div>
      </aside>

      <form
        class="flex flex-col gap-5 rounded-card border border-line bg-white p-6 shadow-soft sm:p-8"
        @submit.prevent="sendMessage"
      >
        <div class="grid gap-5 sm:grid-cols-2">
          <div class="flex flex-col gap-1.5">
            <label for="contact-name" class="text-sm font-semibold text-brand-900">Your name</label>
            <input
              id="contact-name"
              v-model="name"
              name="name"
              autocomplete="name"
              required
              maxlength="100"
              class="min-h-11 rounded-xl border border-line bg-white px-4 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="contact-email" class="text-sm font-semibold text-brand-900"
              >Email address</label
            >
            <input
              id="contact-email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              maxlength="254"
              class="min-h-11 rounded-xl border border-line bg-white px-4 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="contact-message" class="text-sm font-semibold text-brand-900">Message</label>
          <textarea
            id="contact-message"
            v-model="message"
            name="message"
            required
            rows="6"
            maxlength="3000"
            class="rounded-xl border border-line bg-white px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
          ></textarea>
          <p class="text-right text-xs text-ink-muted">{{ message.length }}/3000</p>
        </div>
        <p
          v-if="!contactEmail"
          class="rounded-xl bg-brand-50 p-3 text-sm text-ink-muted"
          role="note"
        >
          Set <code>VITE_CONTACT_EMAIL</code> in your local environment to enable message delivery.
        </p>
        <p v-if="status" class="text-sm text-ink-muted" role="status" aria-live="polite">
          {{ status }}
        </p>
        <div>
          <BaseButton type="submit">Prepare email</BaseButton>
        </div>
      </form>
    </div>
  </section>
</template>
