<template>
 <Transition name="modal">
 <div v-if="isOpen" class="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4 drop-shadow-sm border border-gray-50" role="dialog" aria-modal="true">
 <!-- Backdrop -->
 <div 
 class="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" 
 @click="$emit('close')"
 ></div>

 <!-- Modal panel -->
 <div 
 class="relative bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-sm border border-gray-50 overflow-hidden flex flex-col transform transition-all duration-300 ease-out"
 :class="[
 size === 'sm' ? 'sm:max-w-md' : 
 size === 'md' ? 'sm:max-w-2xl' : 
 size === 'lg' ? 'sm:max-w-4xl' : 'sm:max-w-full'
 ]"
 >
 <!-- Header -->
 <div class="px-4 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
 <div>
 <h3 class="text-xl font-medium text-gray-900 tracking-tight">{{ title }}</h3>
 <p v-if="description" class="text-sm font-bold text-gray-400  mt-1">{{ description }}</p>
 </div>
 <button 
 @click="$emit('close')"
 class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-95"
 >
 <X class="w-5 h-5" />
 </button>
 </div>

 <!-- Content -->
 <div class="flex-1 overflow-y-auto p-4 sm:p-5 hide-scrollbar">
 <slot></slot>
 </div>

 <!-- Footer (Optional) -->
 <div v-if="$slots.footer" class="px-5 py-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3 shrink-0">
 <slot name="footer"></slot>
 </div>
 </div>
 </div>
 </Transition>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';

withDefaults(defineProps<{
 isOpen: boolean;
 title: string;
 description?: string;
 size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}>(), {
 size: 'md'
});

defineEmits(['close']);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
 transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
 opacity: 0;
 transform: translateY(20px) scale(0.98);
}

.modal-enter-to,
.modal-leave-from {
 opacity: 1;
 transform: translateY(0) scale(1);
}

@media (max-width: 640px) {
 .modal-enter-from,
 .modal-leave-to {
 transform: translateY(100%);
 }
}
</style>
