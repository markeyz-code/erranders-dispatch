<template>
  <div class="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[100] flex flex-col items-start">
    <!-- Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0 translate-y-2"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 translate-y-2"
    >
      <div v-if="isOpen" class="mb-4 bg-white rounded-2xl shadow-xl border border-gray-50 p-4 w-64 origin-bottom-left">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold text-gray-900 text-sm">Support Team</h3>
          <button @click="isOpen = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="w-4 h-4" />
          </button>
        </div>
        <p class="text-sm text-gray-500 font-medium mb-4">Reply time: Usually within 5 mins.</p>
        
        <div class="space-y-2">
          <a
            v-for="agent in agents"
            :key="agent.name"
            :href="`https://wa.me/${agent.number}?text=Hi%20${agent.name},%20I%20need%20some%20help`"
            target="_blank"
            class="flex items-center gap-3 p-2 hover:bg-green-50 rounded-xl transition-colors group border border-transparent hover:border-green-100"
          >
            <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <span class="text-green-600 font-bold text-sm">{{ agent.initial }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors">{{ agent.name }}</p>
              <p class="text-[10px] text-gray-500 font-medium">Support Agent</p>
            </div>
            <MessageCircle class="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </a>
        </div>
      </div>
    </Transition>

    <!-- Floating Button -->
    <button
      @click="isOpen = !isOpen"
      class="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all focus:outline-none focus:ring-4 focus:ring-green-500/20"
      aria-label="WhatsApp Support"
    >
      <svg v-if="!isOpen" class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
      </svg>
      <X v-else class="w-6 h-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessageCircle, X } from 'lucide-vue-next'

const isOpen = ref(false)

const agents = [
  { name: 'Ruth', initial: 'R', number: '2348106600919' },
  { name: 'Ife', initial: 'I', number: '2348179495795' },
  { name: 'Kim', initial: 'K', number: '2348052854256' },
  { name: 'Brandy', initial: 'B', number: '2348139908262' },
]
</script>
