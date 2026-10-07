<template>
  <div class="z-[999999]">
    <!-- Compact Music Icon (Always Visible) -->
    <button
      v-if="!showControls"
      @click="showControls = true"
      class="group relative w-8 h-8 rounded-full bg-parentPrimary shadow-sm border border-gray-50 hover:shadow-sm border border-gray-50 transition-all duration-300 flex items-center justify-center transform hover:scale-110"
      title="Music controls"
    >
      <Music class="w-4 h-4 text-white" />

      <!-- Pulse animation when playing -->
      <span 
        v-if="isPlaying"
        class="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-30"
      ></span>
    </button>

    <!-- Expanded Controls Panel -->
    <div
      v-else
      class="bg-white rounded-2xl shadow-sm border border-gray-50 p-4 min-w-[280px] animate-slideIn"
    >
      <!-- Header with Close Button -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-full bg-parentPrimary flex items-center justify-center">
            <Music class="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-800 text-sm">Now Playing</h3>
            <p class="text-sm text-gray-500">Background Music</p>
          </div>
        </div>
        
        <!-- Minimize Button -->
        <button
          @click="showControls = false"
          class="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          title="Minimize"
        >
          <ChevronDown class="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <!-- Play/Pause Button -->
      <div class="flex items-center justify-center mb-4">
        <button
          @click="togglePlay"
          class="w-14 h-14 rounded-full bg-parentPrimary shadow-sm border border-gray-50 hover:shadow-sm border border-gray-50 transition-all duration-300 flex items-center justify-center transform hover:scale-105"
        >
          <Play v-if="!isPlaying" class="w-6 h-6 text-white ml-0.5" fill="currentColor" />
          <Pause v-else class="w-6 h-6 text-white" fill="currentColor" />
        </button>
      </div>

      <!-- Volume Control -->
      <div class="flex items-center gap-3 mb-3">
        <Volume2 class="w-5 h-5 text-gray-600" />
        <input
          type="range"
          min="0"
          max="100"
          v-model="volume"
          @input="updateVolume"
          class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <span class="text-sm text-gray-600 w-8">{{ volume }}%</span>
      </div>

      <!-- Optional: Song Selection -->
      <div class="pt-3 border-t border-gray-100">
        <button class="w-full text-sm text-gray-600 hover:text-purple-600 transition-colors flex items-center justify-center gap-1">
          <RotateCcw class="w-4 h-4" />
          Change Track
        </button>
      </div>
    </div>

    <audio
      ref="audioRef"
      :src="src"
      loop
      playsinline
      preload="auto"
    />
  </div>
</template>

<script setup lang="ts">
import { Music, ChevronDown, Play, Pause, Volume2, RotateCcw } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  src: string
}>()

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const showControls = ref(false) // Start minimized
const hasInteracted = ref(false)
const volume = ref(40)

// Aggressive play attempt
const attemptPlay = async () => {
  if (!audioRef.value) return

  try {
    audioRef.value.muted = false
    audioRef.value.volume = volume.value / 100
    await audioRef.value.play()
    isPlaying.value = true
    hasInteracted.value = true
  } catch (e) {
    // If unmuted fails, try muted
    try {
      audioRef.value.muted = true
      await audioRef.value.play()
      isPlaying.value = true
      hasInteracted.value = true
    } catch (err) {
      console.warn('Audio blocked - waiting for user interaction')
      isPlaying.value = false
    }
  }
}

// Handle user interactions to unlock audio
const handleUserInteraction = async () => {
  if (!hasInteracted.value && audioRef.value) {
    await attemptPlay()
  }
}

onMounted(async () => {
  if (!audioRef.value) return

  // Set initial volume
  audioRef.value.volume = volume.value / 100

  // Try to play immediately
  await attemptPlay()

  // Listen for ANY user interaction to unlock audio
  const events = ['click', 'touchstart', 'keydown', 'scroll']
  events.forEach(event => {
    document.addEventListener(event, handleUserInteraction, { once: true, passive: true })
  })

  // Also listen for page visibility changes to resume
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && audioRef.value && !audioRef.value.paused) {
      attemptPlay()
    }
  })
})

const togglePlay = async () => {
  if (!audioRef.value) return

  if (audioRef.value.paused) {
    try {
      await audioRef.value.play()
      isPlaying.value = true
    } catch (e) {
      console.error('Failed to play:', e)
    }
  } else {
    audioRef.value.pause()
    isPlaying.value = false
  }
}

const updateVolume = () => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value / 100
  }
}

// Cleanup
onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.src = ''
  }
})
</script>

<style scoped>
@keyframes ping {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-slideIn {
  animation: slideIn 0.2s ease-out;
}
</style>