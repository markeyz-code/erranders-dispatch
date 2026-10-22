<template>
  <!-- Only rendered while a call exists, so it can never cover the app when idle. -->
  <Teleport to="body">
    <div
      v-if="state !== 'idle'"
      class="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md px-6 text-center"
    >
      <!-- Incoming: who is calling and what kind of call -->
      <template v-if="state === 'incoming'">
        <div class="mb-2 h-24 w-24 rounded-full bg-[#FF5C1A]/15 flex items-center justify-center animate-pulse">
          <PhoneIncoming class="h-10 w-10 text-[#FF5C1A]" />
        </div>
        <p class="mt-4 text-sm font-semibold uppercase tracking-wider text-white/50">
          Incoming {{ kind }} call
        </p>
        <h2 class="mt-1 text-2xl font-black text-white">{{ peerName || 'Someone on your order' }}</h2>

        <div class="mt-10 flex items-center gap-10">
          <button class="flex flex-col items-center gap-2" @click="declineCall">
            <span class="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition">
              <PhoneOff class="h-7 w-7 text-white" />
            </span>
            <span class="text-xs font-bold text-white/70">Decline</span>
          </button>
          <button class="flex flex-col items-center gap-2" @click="acceptCall">
            <span class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 transition">
              <Phone class="h-7 w-7 text-white" />
            </span>
            <span class="text-xs font-bold text-white/70">Answer</span>
          </button>
        </div>
      </template>

      <!-- Ringing / active -->
      <template v-else>
        <p class="text-sm font-semibold uppercase tracking-wider text-white/50">
          {{ state === 'ringing' ? 'Calling…' : (kind === 'video' ? 'Video call' : 'Voice call') }}
        </p>
        <h2 class="mt-1 text-2xl font-black text-white">{{ peerName || 'Your contact' }}</h2>
        <p v-if="state === 'active'" class="mt-1 font-mono text-sm text-white/60">{{ clock }}</p>

        <!-- Remote video fills the screen once media arrives -->
        <video
          v-if="kind === 'video' && remoteStream"
          ref="remoteEl"
          autoplay
          playsinline
          class="mt-8 w-full max-w-2xl rounded-2xl bg-black aspect-video object-cover"
        />
        <div v-else-if="state === 'active'" class="mt-8 flex h-28 w-28 items-center justify-center rounded-full bg-white/10">
          <Mic class="h-10 w-10 text-white/70" />
        </div>
        <div v-else class="mt-8 flex h-28 w-28 items-center justify-center rounded-full bg-white/10">
          <span class="h-3 w-3 rounded-full bg-[#FF5C1A] animate-ping" />
        </div>

        <!-- Self preview, so you can see you are on camera -->
        <video
          v-if="kind === 'video' && localStream"
          ref="localEl"
          autoplay
          muted
          playsinline
          class="mt-4 h-24 w-32 rounded-xl bg-black object-cover opacity-80"
        />

        <p v-if="error" class="mt-4 max-w-sm text-sm font-semibold text-red-300">{{ error }}</p>

        <div class="mt-10 flex items-center gap-6">
          <button class="flex flex-col items-center gap-2" @click="toggleMute">
            <span class="flex h-14 w-14 items-center justify-center rounded-full" :class="muted ? 'bg-white text-slate-900' : 'bg-white/15 text-white'">
              <MicOff v-if="muted" class="h-6 w-6" />
              <Mic v-else class="h-6 w-6" />
            </span>
            <span class="text-xs font-bold text-white/70">{{ muted ? 'Unmute' : 'Mute' }}</span>
          </button>

          <button class="flex flex-col items-center gap-2" @click="hangUp">
            <span class="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition">
              <PhoneOff class="h-7 w-7 text-white" />
            </span>
            <span class="text-xs font-bold text-white/70">End</span>
          </button>

          <button v-if="kind === 'video'" class="flex flex-col items-center gap-2" @click="toggleCamera">
            <span class="flex h-14 w-14 items-center justify-center rounded-full" :class="cameraOff ? 'bg-white text-slate-900' : 'bg-white/15 text-white'">
              <VideoOff v-if="cameraOff" class="h-6 w-6" />
              <Video v-else class="h-6 w-6" />
            </span>
            <span class="text-xs font-bold text-white/70">{{ cameraOff ? 'Camera on' : 'Camera off' }}</span>
          </button>
        </div>
      </template>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Mic, MicOff, Phone, PhoneIncoming, PhoneOff, Video, VideoOff } from 'lucide-vue-next';
import { useCall } from '@/composables/core/useCall';

/**
 * The single call surface for the whole app.
 *
 * Mounted once in the layout so a call reaches the user wherever they are, rather than
 * only on the order page they happened to open.
 */
const { state, kind, peerName, remoteStream, localStream, muted, cameraOff, error, elapsed,
  acceptCall, declineCall, hangUp, toggleMute, toggleCamera } = useCall();

const remoteEl = ref<HTMLVideoElement | null>(null);
const localEl = ref<HTMLVideoElement | null>(null);

watch([remoteStream, state], () => {
  if (remoteEl.value && remoteStream.value) remoteEl.value.srcObject = remoteStream.value;
}, { flush: 'post' });

watch([localStream, state], () => {
  if (localEl.value && localStream.value) localEl.value.srcObject = localStream.value;
}, { flush: 'post' });

const clock = computed(() => {
  const mins = Math.floor(elapsed.value / 60);
  const secs = elapsed.value % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
});
</script>
