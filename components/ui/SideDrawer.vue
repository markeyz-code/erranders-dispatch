<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex justify-end" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300" 
          @click="$emit('close')"
          aria-hidden="true"
        ></div>

        <!-- Drawer panel -->
        <div class="relative w-full max-w-md h-full bg-white shadow-sm border border-gray-50 flex flex-col pointer-events-auto transform transition-transform duration-500 ease-in-out" style="padding-top: env(safe-area-inset-top, 0px)">
          
          <!-- Header area for Close Button -->
          <div class="absolute right-0 flex items-center z-10" style="top: calc(env(safe-area-inset-top, 0px) + 1.5rem); padding-right: 1.5rem;">
            <button 
              type="button" 
              class="rounded-full flex items-center justify-center w-10 h-10 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all" 
              @click="$emit('close')"
            >
              <span class="sr-only">Close panel</span>
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Scrollable Content slot -->
          <div class="flex-1 overflow-y-auto hide-scrollbar p-5 pt-12">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
}>();

defineEmits(['close']);
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

.drawer-enter-to,
.drawer-leave-from {
  transform: translateX(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
