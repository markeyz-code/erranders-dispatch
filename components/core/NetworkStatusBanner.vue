<template>
  <Transition name="slide-down">
    <div v-if="!isOnline || isSlowNetwork" class="fixed top-0 left-0 right-0 z-[999999] flex justify-center p-2 pointer-events-none">
      <div 
        class="px-4 py-2 rounded-full shadow-sm border border-gray-50 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-4 duration-300 pointer-events-auto"
        :class="!isOnline ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'"
      >
        <span v-if="!isOnline">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 2l20 20"/><path d="M8.5 8.5C10.5 7.2 13.5 7 15.5 8.5l-7 7"/><path d="M16 16l3.5 3.5"/><path d="M4.5 19.5L1 23"/><path d="M12 12l-2-2"/></svg>
        </span>
        <span v-else>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </span>
        {{ !isOnline ? 'You are currently offline. Please check your internet connection.' : 'Slow network detected. Actions may take longer.' }}
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useNetworkStatus } from '@/composables/core/useNetworkStatus';

const { isOnline, isSlowNetwork, initNetworkListeners, destroyNetworkListeners } = useNetworkStatus();

onMounted(() => {
  initNetworkListeners();
});

onUnmounted(() => {
  destroyNetworkListeners();
});
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
