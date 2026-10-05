<template>
  <div class="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in w-full max-w-lg mx-auto">
    <div class="w-20 h-20 mb-6 rounded-full bg-gray-50 flex items-center justify-center text-4xl shadow-sm border border-gray-50">
      <slot name="icon">
        <span v-if="!$slots.icon" class="text-xl">📋</span>
      </slot>
    </div>
    <h3 class="text-xl font-bold text-gray-900 mb-2 font-display tracking-tight">{{ title }}</h3>
    <p class="text-gray-500 max-w-sm mx-auto mb-8 text-sm leading-relaxed font-medium">
      {{ description }}
    </p>
    <button v-if="actionLabel" @click="$emit('action')" class="px-5 py-3.5 rounded-full font-bold text-sm shadow-sm transition-all focus:ring-4 focus:ring-parentPrimary/20 bg-parentPrimary text-white hover:bg-green-600 active:scale-[0.98]">
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  actionLabel?: string;
}>();

defineEmits(['action']);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.font-display {
  font-family: 'Roobert PRO', sans-serif;
}
</style>
