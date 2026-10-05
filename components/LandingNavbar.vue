<template>
  <header 
    class="fixed w-full top-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
    :class="[scrolled ? 'py-4' : 'py-4']"
  >
    <div 
      class="mx-auto transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :class="[scrolled ? 'max-w-5xl px-2 sm:px-4' : 'max-w-7xl px-4 sm:px-10']"
    >
      <nav 
        class="flex items-center justify-between transition-all duration-500 relative"
        :class="[
          scrolled 
            ? 'bg-white/70 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 rounded-[2rem] px-4 py-3' 
            : 'bg-transparent'
        ]"
      >
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group relative z-10">
                 <div class="flex items-center justify-center group-hover:scale-110 transition-transform">
            <img src="@/assets/img/logo-light.png" class="w-auto h-10" alt="Errandr" />
          </div>
        </NuxtLink>
        
        <!-- Desktop Links -->
        <div class="hidden lg:flex items-center gap-1">
           <NuxtLink 
             v-for="link in links" 
             :key="link.path" 
             :to="link.path"
             class="relative px-5 py-2.5 text-[15px] font-bold transition-colors group"
             :class="[
               scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-900 hover:text-parentPrimary',
               { '!text-gray-900': route.path === link.path }
             ]"
           >
             {{ link.name }}
             <span class="absolute inset-x-4 bottom-1.5 h-0.5 bg-parentPrimary scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 rounded-full"></span>
           </NuxtLink>
        </div>

        <!-- Desktop Actions -->
        <div class="hidden lg:flex items-center gap-4 relative z-10">
          <template v-if="!isLoggedIn">
            <NuxtLink to="/auth/login" class="text-sm font-bold transition-colors px-4 py-2 text-gray-900 hover:text-parentPrimary">
              Log In
            </NuxtLink>
            <NuxtLink to="/auth/register" class="relative group overflow-hidden px-7 py-2.5 rounded-full bg-gray-900 text-white text-sm font-bold shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-300">
              <span class="relative z-10 flex items-center gap-2">
                Apply Now <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500"></div>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/dashboard" class="relative group overflow-hidden px-7 py-2.5 rounded-full bg-parentPrimary text-white text-sm font-bold shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-300">
              <span class="relative z-10 flex items-center gap-2">
                Dashboard <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500"></div>
            </NuxtLink>
          </template>
        </div>

        <!-- Mobile Menu Toggle -->
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen" 
          class="lg:hidden relative z-50 w-12 h-12 flex items-center justify-center rounded-full border focus:outline-none shadow-sm transition-colors"
          :class="[scrolled ? 'bg-white border-gray-100 text-gray-900' : 'border-gray-200 text-gray-900 bg-white/50 backdrop-blur-md']"
        >
          <Menu v-if="!isMobileMenuOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </nav>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition name="menu-fade">
      <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl lg:hidden flex flex-col pt-32 px-5 pb-10 overflow-y-auto">
        <div class="flex flex-col gap-6 mb-12">
           <NuxtLink 
             v-for="link in links" 
             :key="link.path" 
             :to="link.path"
             @click="isMobileMenuOpen = false"
             class="text-4xl font-medium text-gray-900 tracking-tighter hover:text-parentPrimary transition-colors"
           >
             {{ link.name }}
           </NuxtLink>
        </div>
        
        <div class="mt-auto flex flex-col gap-4">
          <NuxtLink 
            v-if="!isLoggedIn"
            to="/auth/login" 
            @click="isMobileMenuOpen = false"
            class="w-full py-3 text-center text-sm font-bold text-gray-600 bg-gray-50 rounded-2xl border border-gray-50"
          >
            Log In to Dashboard
          </NuxtLink>
          <NuxtLink 
            :to="isLoggedIn ? '/dashboard' : '/auth/register'" 
            @click="isMobileMenuOpen = false"
            class="w-full py-3 text-center text-sm font-bold text-white bg-parentPrimary rounded-2xl shadow-sm border border-gray-50 shadow-parentPrimary/20 flex items-center justify-center gap-2"
          >
            {{ isLoggedIn ? 'Go to Dashboard' : 'Apply Now' }} <ArrowRight class="w-5 h-5" />
          </NuxtLink>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight, Menu, X } from 'lucide-vue-next'
import { useUser } from '@/composables/modules/auth/user'

const { isLoggedIn } = useUser()
const route = useRoute()
const scrolled = ref(false)
const isMobileMenuOpen = ref(false)

const links = [
  { name: 'Benefits', path: '/#benefits' },
  { name: 'How it works', path: '/#how-it-works' },
  { name: 'Earnings', path: '/#earnings' }
]

const handleScroll = () => {
  scrolled.value = window.scrollY > 40
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(isMobileMenuOpen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}
</style>
