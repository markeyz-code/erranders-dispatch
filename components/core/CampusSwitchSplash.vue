<template>
  <div
    class="splash-root fixed inset-0 z-[2000000] flex items-center justify-center overflow-hidden bg-white"
    :class="{ 'is-leaving': isLeaving }"
    :style="splashVars"
    role="status"
    aria-live="polite"
    :aria-label="`Switching to ${targetName}`"
  >
    <!-- Soft brand wash -->
    <div class="splash-wash pointer-events-none absolute inset-0" aria-hidden="true"></div>

    <div class="splash-stage relative flex w-full max-w-md flex-col items-center px-6 text-center">
      <!-- Mark: brand arc turning over soft halo -->
      <div class="relative flex h-40 w-40 items-center justify-center">
        <span class="splash-halo absolute -inset-6 rounded-full bg-[#FF5C1A]/10 blur-2xl" aria-hidden="true"></span>
        <span class="absolute inset-0 rounded-full border-2 border-[#FFE3D6]" aria-hidden="true"></span>
        <span
          class="splash-arc absolute inset-0 rounded-full border-2 border-transparent border-r-[#FF5C1A]/60 border-t-[#FF5C1A]"
          aria-hidden="true"
        ></span>
        <span class="absolute inset-[13px] rounded-full border border-[#F3EDE6]" aria-hidden="true"></span>
        <img
          src="@/assets/img/erranders-icon-2048.png"
          alt="Erranders"
          class="splash-mark relative h-16 w-16 rounded-2xl shadow-[0_18px_44px_-18px_rgba(255,92,26,0.65)] object-contain"
        />
      </div>

      <!-- Copy -->
      <div class="mt-10 w-full">
        <p class="text-[10px] font-bold uppercase tracking-[0.45em] text-[#9C968E]">Errand Ninja Dispatch</p>

        <div class="mt-5 flex justify-center">
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1EA] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF5C1A]"
          >
            <MapPin class="h-3 w-3" aria-hidden="true" />
            {{ badgeLabel }}
          </span>
        </div>

        <h1 class="mt-4 text-[22px] font-bold leading-tight tracking-tight text-[#171310] sm:text-[26px]">
          {{ fullName }}
        </h1>
        <p v-if="tagline" class="mt-1.5 text-[12px] font-bold text-[#9C968E]">{{ tagline }}</p>

        <p class="mt-2 text-[13px] text-[#6B655E]">Switching to {{ targetName }}</p>

        <!-- Progress rail -->
        <div class="mx-auto mt-8 h-1 w-56 overflow-hidden rounded-full bg-[#EFEAE3]">
          <span class="splash-rail block h-full w-full origin-left rounded-full bg-[#FF5C1A]"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { MapPin } from 'lucide-vue-next'
import type { Institution } from '@/api_factory/modules/institutions'

const props = defineProps<{
  institution?: Institution | null
}>()

const emit = defineEmits<{ (e: 'finished'): void }>()

const ENTER_MS = 360
const RAIL_MS = 1150
const HOLD_MS = 160
const EXIT_MS = 360

const isLeaving = ref(false)
const timers: number[] = []

const splashVars = computed(() => ({
  '--enter-ms': `${ENTER_MS}ms`,
  '--rail-ms': `${RAIL_MS}ms`,
  '--exit-ms': `${EXIT_MS}ms`,
}))

const shortName = computed(() => props.institution?.shortName?.trim() || '')
const fullName = computed(() => props.institution?.name?.trim() || shortName.value || 'Your campus')
const targetName = computed(() => fullName.value)
const badgeLabel = computed(() => shortName.value || fullName.value)
const tagline = computed(() => props.institution?.branding?.tagline?.trim() || '')

onMounted(() => {
  const reduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const exitAt = reduced ? 200 : RAIL_MS + HOLD_MS
  const doneAt = exitAt + (reduced ? 160 : EXIT_MS)

  timers.push(window.setTimeout(() => { isLeaving.value = true }, exitAt))
  timers.push(window.setTimeout(() => emit('finished'), doneAt))
})

onBeforeUnmount(() => {
  timers.forEach((timer) => window.clearTimeout(timer))
})
</script>

<style scoped>
.splash-root {
  animation: splash-fade-in var(--enter-ms, 360ms) ease-out both;
}

.splash-root.is-leaving {
  animation: splash-fade-out var(--exit-ms, 360ms) ease-in both;
  pointer-events: none;
}

.splash-stage {
  animation: splash-rise 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.splash-wash {
  background:
    radial-gradient(60% 50% at 50% 30%, rgba(255, 92, 26, 0.09), transparent 70%),
    radial-gradient(80% 60% at 50% 110%, rgba(255, 92, 26, 0.06), transparent 70%);
}

.splash-arc {
  animation: splash-spin 2600ms linear infinite;
}

.splash-halo {
  animation: splash-halo 2400ms ease-in-out infinite;
}

.splash-mark {
  animation: splash-breathe 2400ms ease-in-out infinite;
}

.splash-rail {
  animation: splash-rail var(--rail-ms, 1150ms) cubic-bezier(0.45, 0, 0.15, 1) both;
}

@keyframes splash-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes splash-fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes splash-rise {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes splash-spin {
  to { transform: rotate(360deg); }
}

@keyframes splash-halo {
  0%, 100% { opacity: 0.55; transform: scale(0.94); }
  50% { opacity: 0.95; transform: scale(1.05); }
}

@keyframes splash-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

@keyframes splash-rail {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@media (prefers-reduced-motion: reduce) {
  .splash-arc,
  .splash-halo,
  .splash-mark {
    animation: none;
  }
}
</style>
