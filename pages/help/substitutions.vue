<template>
  <div class="min-h-screen bg-white px-5 pb-16 pt-6">
    <NuxtLink to="/deliveries" class="text-sm font-semibold text-gray-500 hover:text-gray-900">← Back</NuxtLink>

    <header class="mt-6">
      <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF5C1A]">When something is out of stock</p>
      <h1 class="mt-2 text-2xl font-black tracking-tight text-gray-900">You never wait at the counter</h1>
      <p class="mt-2 text-sm leading-relaxed text-gray-500">
        If the shop has run out, offer a replacement in the app. The student answers for you —
        and if they don't, the item is refunded and you keep moving.
      </p>
    </header>

    <ol class="mt-8 space-y-5">
      <li v-for="(step, i) in steps" :key="i" class="flex gap-4">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF5C1A]/10 text-sm font-black text-[#FF5C1A]">
          {{ i + 1 }}
        </span>
        <div class="min-w-0">
          <p class="text-sm font-bold text-gray-900">{{ step.title }}</p>
          <p class="mt-0.5 text-sm leading-relaxed text-gray-500">{{ step.body }}</p>
        </div>
      </li>
    </ol>

    <section class="mt-9 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
      <p class="text-sm font-bold text-emerald-900">The 3-minute rule</p>
      <p class="mt-1 text-sm leading-relaxed text-emerald-800">
        The student has three minutes to accept your substitute. After that the item is refunded
        to their wallet and the rest of the order carries on — no phone call, no support ticket.
      </p>
    </section>

    <section class="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
      <p class="text-sm font-bold text-amber-900">Same price or less</p>
      <p class="mt-1 text-sm leading-relaxed text-amber-800">
        A replacement can't cost more than the item it replaces. Cheaper is fine — the difference
        goes back to the student automatically.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

// Written for a rider standing in a shop with a phone in one hand, so it is a short list of
// actions rather than prose.
const steps = [
  {
    title: 'Tap the item that is out of stock',
    body: 'Open the order and mark the line unavailable. This is only possible before delivery.',
  },
  {
    title: 'Offer a replacement from the same shop',
    body: 'Pick something in stock and note what you swapped. The student sees exactly what they get.',
  },
  {
    title: 'Keep moving',
    body: 'They accept, decline, or simply do not answer — all three resolve without you calling anyone.',
  },
];
</script>
