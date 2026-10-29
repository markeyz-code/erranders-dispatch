<template>
  <div class="fixed inset-0 z-[200] flex flex-col items-center justify-between bg-slate-950 px-6 py-12 text-center">
    <div class="mt-16 flex flex-col items-center">
      <div class="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#FF5C1A]/20">
        <span class="absolute inset-0 animate-ping rounded-full bg-[#FF5C1A]/30" />
        <Bike class="relative h-10 w-10 text-[#FF5C1A]" />
      </div>

      <p class="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
        Incoming errand
      </p>
      <h1 class="mt-2 text-2xl font-black text-white">{{ title }}</h1>
      <p v-if="fee" class="mt-2 text-lg font-black text-[#FF5C1A]">₦{{ fee.toLocaleString() }}</p>
      <p v-if="dropoff" class="mt-1 max-w-xs text-sm font-medium text-white/60">{{ dropoff }}</p>
    </div>

    <div class="mb-6 w-full max-w-sm">
      <p v-if="blocked" class="mb-4 rounded-xl bg-amber-500/15 px-4 py-3 text-xs font-semibold text-amber-200">
        {{ blocked }}
      </p>

      <div class="flex items-center justify-center gap-10">
        <button type="button" class="flex flex-col items-center gap-2" @click="decline">
          <span class="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 active:scale-95">
            <PhoneOff class="h-7 w-7 text-white" />
          </span>
          <span class="text-xs font-bold text-white/70">Decline</span>
        </button>

        <button type="button" class="flex flex-col items-center gap-2" @click="accept">
          <span class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 active:scale-95">
            <Phone class="h-7 w-7 text-white" />
          </span>
          <span class="text-xs font-bold text-white/70">Accept</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Bike, Phone, PhoneOff } from 'lucide-vue-next';

/**
 * The ringing screen.
 *
 * Browsers forbid a service worker from looping audio, so a closed app can only vibrate and
 * show a card. Tapping that card lands here — a real page, with a real gesture behind it —
 * where the ringtone is allowed to play on a loop until the rider answers or declines.
 *
 * One tap to answer, which is the point.
 */
definePageMeta({ layout: false });

const route = useRoute();
const router = useRouter();

const orderId = String(route.params.id || '');
const title = String(route.query.title || 'New errand available');
const dropoff = String(route.query.dropoff || '');
const fee = Number(route.query.fee || 0) || 0;

const blocked = ref('');
let tone: HTMLAudioElement | null = null;
let vibration: ReturnType<typeof setInterval> | null = null;
let stopAt: ReturnType<typeof setTimeout> | null = null;

const stopRinging = () => {
  if (tone) {
    tone.pause();
    tone.currentTime = 0;
  }
  if (vibration) clearInterval(vibration);
  if (stopAt) clearTimeout(stopAt);
  vibration = null;
  stopAt = null;
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(0); } catch {}
  }
};

const buzz = () => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate([600, 250, 600, 250, 600]); } catch {}
  }
};

onMounted(() => {
  tone = new Audio('/sounds/order-alert.mp3');
  tone.loop = true;
  tone.volume = 1;

  // The tap that opened this page is the gesture the browser needs, so playback is
  // normally allowed here — but it can still be refused, and a silent ring is worse than
  // saying so.
  tone.play().catch(() => {
    blocked.value = 'Tap the screen to enable the ringtone.';
  });

  buzz();
  vibration = setInterval(buzz, 2400);

  // An errand nobody answers should stop ringing rather than ring forever.
  stopAt = setTimeout(() => {
    stopRinging();
    router.replace('/deliveries');
  }, 45000);
});

onBeforeUnmount(stopRinging);

const accept = () => {
  stopRinging();
  router.push(`/deliveries/${orderId}`);
};

const decline = () => {
  stopRinging();
  router.replace('/deliveries');
};
</script>
