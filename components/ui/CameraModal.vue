<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
    <div class="relative w-full h-full max-w-md mx-auto flex flex-col">
      <!-- Header -->
      <div class="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
        <button @click="close" class="p-2 bg-black/50 rounded-full text-white hover:bg-black/80 backdrop-blur">
          <X class="w-6 h-6" />
        </button>
        <div class="text-white font-bold text-sm bg-black/50 px-3 py-1.5 rounded-full backdrop-blur">
          Take Photo
        </div>
        <button v-if="hasMultipleCameras" @click="switchCamera" class="p-2 bg-black/50 rounded-full text-white hover:bg-black/80 backdrop-blur">
          <RefreshCcw class="w-6 h-6" />
        </button>
        <div v-else class="w-10"></div>
      </div>

      <!-- Video Feed -->
      <div class="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        <video 
          ref="videoEl" 
          autoplay 
          playsinline 
          class="absolute min-w-full min-h-full object-cover transition-opacity duration-300"
          :class="{ 'opacity-0': !isStreamReady, 'opacity-100': isStreamReady, '-scale-x-100': facingMode === 'user' }"
        ></video>
        
        <div v-if="!isStreamReady && !error" class="text-white flex flex-col items-center gap-2">
          <Loader2 class="w-8 h-8 animate-spin text-[#FF5C1A]" />
          <p class="text-sm">Starting camera...</p>
        </div>
        
        <div v-if="error" class="text-white text-center p-6 flex flex-col items-center gap-3">
          <AlertCircle class="w-10 h-10 text-red-500" />
          <p class="text-sm font-semibold">{{ error }}</p>
          <button @click="startCamera" class="px-4 py-2 bg-[#FF5C1A] rounded-xl text-sm font-bold mt-2">Retry</button>
        </div>
      </div>

      <!-- Controls -->
      <div class="h-32 bg-black w-full flex items-center justify-center pb-8 z-10">
        <button 
          @click="takePhoto" 
          :disabled="!isStreamReady"
          class="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform"
        >
          <div class="w-12 h-12 bg-white rounded-full"></div>
        </button>
      </div>
      
      <!-- Canvas for capturing (hidden) -->
      <canvas ref="canvasEl" class="hidden"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { X, RefreshCcw, Loader2, AlertCircle } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'capture']);

const videoEl = ref<HTMLVideoElement | null>(null);
const canvasEl = ref<HTMLCanvasElement | null>(null);

const isStreamReady = ref(false);
const stream = ref<MediaStream | null>(null);
const facingMode = ref<'environment' | 'user'>('environment');
const hasMultipleCameras = ref(false);
const error = ref('');

const checkCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(device => device.kind === 'videoinput');
    hasMultipleCameras.value = videoInputs.length > 1;
  } catch (err) {
    console.error('Error checking cameras:', err);
  }
};

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
  isStreamReady.value = false;
  if (videoEl.value) {
    videoEl.value.srcObject = null;
  }
};

const startCamera = async () => {
  stopCamera();
  error.value = '';
  isStreamReady.value = false;
  
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: facingMode.value,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });
    
    stream.value = mediaStream;
    
    if (videoEl.value) {
      videoEl.value.srcObject = mediaStream;
      videoEl.value.onloadedmetadata = () => {
        isStreamReady.value = true;
      };
    }
  } catch (err: any) {
    console.error('Camera error:', err);
    error.value = 'Could not access the camera. Please ensure permissions are granted.';
  }
};

const switchCamera = () => {
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment';
  startCamera();
};

const takePhoto = () => {
  if (!videoEl.value || !canvasEl.value || !isStreamReady.value) return;
  
  const video = videoEl.value;
  const canvas = canvasEl.value;
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // If user facing, flip horizontally on canvas
  if (facingMode.value === 'user') {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  canvas.toBlob((blob) => {
    if (blob) {
      const file = new File([blob], `receipt-${Date.now()}.jpg`, { type: 'image/jpeg' });
      emit('capture', file);
      close();
    }
  }, 'image/jpeg', 0.85);
};

const close = () => {
  stopCamera();
  emit('close');
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    checkCameras();
    startCamera();
  } else {
    stopCamera();
  }
});

onBeforeUnmount(() => {
  stopCamera();
});
</script>
