<template>
  <div v-if="showPrompt" class="fixed bottom-20 left-4 right-4 md:bottom-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-sm border border-gray-50 border border-[#FF5C1A]/20 p-4 z-50 flex flex-col gap-3">
    <div class="flex items-start gap-3">
      <div class="bg-orange-100 p-2 rounded-full text-[#FF5C1A] shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell-ring"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>
      </div>
      <div>
        <h4 class="font-semibold text-gray-900">Enable Push Notifications</h4>
        <p class="text-sm text-gray-600 mt-1">Get real-time updates about your orders and exclusive Errander offers!</p>
      </div>
    </div>
    <div class="flex items-center justify-end gap-2 mt-2">
      <button @click="dismiss" class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        Later
      </button>
      <button @click="enable" :disabled="loading" class="px-4 py-2 text-sm font-medium text-white bg-[#FF5C1A] hover:bg-orange-600 rounded-lg transition-colors flex items-center gap-2">
        <span v-if="loading" class="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></span>
        Enable
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDispatchNotifications } from '@/composables/useDispatchNotifications'

const showPrompt = ref(false)
const loading = ref(false)
const { requestPermissionAndRegister } = useDispatchNotifications()

onMounted(() => {
  // Only show the prompt if push messaging is supported and permission hasn't been asked yet
  if ('Notification' in window && 'serviceWorker' in navigator) {
    if (Notification.permission === 'default') {
      // Don't show immediately, give them a few seconds to settle in
      setTimeout(() => {
        showPrompt.value = true
      }, 3000)
    }
  }
})

const dismiss = () => {
  showPrompt.value = false
}

const enable = async () => {
  loading.value = true
  try {
    await requestPermissionAndRegister()
  } finally {
    loading.value = false
    showPrompt.value = false
  }
}
</script>
