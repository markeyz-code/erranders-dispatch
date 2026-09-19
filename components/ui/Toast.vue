<template>
  <ClientOnly>
    <Teleport to="body">
      <div class="fixed left-1/2 transform -translate-x-1/2 z-[9999999] flex flex-col gap-3 max-w-sm w-full items-center px-4 pointer-events-none" style="top: calc(env(safe-area-inset-top, 0px) + 1rem)">
        <TransitionGroup name="toast">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="[
              'toast-base',
              {
                'bg-rose-500 border-rose-600 text-white': toast.type === 'error',
                'bg-emerald-500 border-emerald-600 text-white': toast.type === 'success',
                'bg-amber-500 border-amber-600 text-white': toast.type === 'warning',
                'bg-blue-500 border-blue-600 text-white': toast.type === 'info'
              }
            ]"
            class="w-full rounded-2xl border p-[12px] flex items-center gap-3 cursor-pointer pointer-events-auto"
            @click="removeToast(toast.id)"
          >
            <div class="flex-shrink-0">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center',
                {
                  'bg-white/20 text-white': toast.type === 'error',
                  'bg-white/20 text-white': toast.type === 'success', 
                  'bg-white/20 text-white': toast.type === 'warning',
                  'bg-white/20 text-white': toast.type === 'info'
                }
              ]">
                <CheckCircle v-if="toast.type === 'success'" :size="18" />
                <AlertCircle v-else-if="toast.type === 'error'" :size="18" />

                <AlertTriangle v-else-if="toast.type === 'warning'" :size="18" />
                <Info v-else :size="18" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p :class="[
                'font-medium text-sm leading-tight',
                {
                  'text-white': toast.type === 'error',
                  'text-white': toast.type === 'success',
                  'text-white': toast.type === 'warning', 
                  'text-white': toast.type === 'info'
                }
              ]">
                {{ toast.message }}
              </p>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-vue-next'

interface Toast {
  id: number
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
  timeoutId?: number
}

const toasts = ref<Toast[]>([])
let toastCounter = 0

// Create a new toast
const showToast = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 5000) => {
  const id = toastCounter++
  const newToast: Toast = { id, title, message, type, duration }
  
  toasts.value.push(newToast)
  
  // Auto-remove toast after duration
  const timeoutId = window.setTimeout(() => {
    removeToast(id)
  }, duration)
  
  // Store timeout ID for cleanup
  newToast.timeoutId = timeoutId
  
  return id
}

// Remove a toast by ID
const removeToast = (id: number) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index !== -1) {
    // Clear the timeout if it exists
    if (toasts.value[index].timeoutId) {
      clearTimeout(toasts.value[index].timeoutId)
    }
    toasts.value.splice(index, 1)
  }
}

// IMPORTANT: Explicitly expose methods to parent components
defineExpose({
  showToast,
  removeToast
})
</script>

<style scoped>
/* Animations */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.toast-base {
  transition: all 0.2s ease-in-out;
}

.toast-base:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
</style>