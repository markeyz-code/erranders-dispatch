<template>
 <div class="min-h-screen bg-[#f8f9fb] overflow-x-hidden w-full max-w-[100vw]">
 <!-- Desktop Sidebar -->
 <aside class="hidden lg:flex flex-col bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 z-50 transition-all duration-300" :class="isSidebarMinimized ? 'w-20' : 'w-64'">
 <!-- Logo -->
 <div class="p-4 pb-8 flex items-center gap-3 relative" :class="isSidebarMinimized ? 'justify-center px-0' : ''">
  <img src="@/assets/img/logo-light.png" class="h-10 w-auto" />
 <!-- <div class="w-10 h-10 bg-gradient-to-br from-[#FF5C1A] to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm border border-gray-100 shadow-[#FF5C1A]/20 shrink-0">
 E
 </div> -->
 <div v-if="!isSidebarMinimized" class="flex flex-col">
  <img src="@/assets/img/logo-light.png" class="h-10 w-auto" />
 <!-- <span class="text-lg font-bold text-gray-900 tracking-tight leading-none">Errandr</span>
 <span class="text-[10px] font-semibold text-[#FF5C1A] tracking-wide leading-none mt-0.5">Rider Portal</span> -->
 </div>

 <!-- Toggle Button -->
 <button 
  @click="isSidebarMinimized = !isSidebarMinimized"
  class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm text-gray-500 hover:text-[#FF5C1A] hover:border-[#FF5C1A] z-50 transition-colors"
 >
  <ChevronLeft v-if="!isSidebarMinimized" class="w-4 h-4" />
  <ChevronRight v-else class="w-4 h-4" />
 </button>
 </div>
 
 <!-- Navigation -->
 <nav class="flex-1 space-y-1" :class="isSidebarMinimized ? 'px-3' : 'px-4'">
 <p v-if="!isSidebarMinimized" class="text-[10px] font-semibold text-gray-400 tracking-wider mb-3 px-3">Menu</p>
  <template v-for="item in navItems" :key="item.path">
    <NuxtLink
      v-if="!isRestricted(item.path)"
      :to="item.path"
      class="flex items-center py-3 text-sm font-medium rounded-xl transition-all group"
      :class="[
        isActive(item.path) ? 'bg-[#FF5C1A] text-white shadow-sm border border-gray-100 shadow-[#FF5C1A]/20' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
        isSidebarMinimized ? 'justify-center px-0' : 'px-4'
      ]"
      :title="isSidebarMinimized ? item.label : ''"
    >
      <component :is="item.icon" class="w-[18px] h-[18px] transition-transform group-hover:scale-110 shrink-0" :class="isSidebarMinimized ? '' : 'mr-3'" />
      <span v-if="!isSidebarMinimized">{{ item.label }}</span>
    </NuxtLink>
    <button
      v-else
      @click="handleNavClick($event, item.path)"
      class="flex items-center w-full py-3 text-sm font-medium rounded-xl transition-all group opacity-40 cursor-not-allowed text-gray-500 hover:bg-gray-50"
      :class="isSidebarMinimized ? 'justify-center px-0' : 'px-4'"
      :title="isSidebarMinimized ? item.label : ''"
    >
      <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" :class="isSidebarMinimized ? '' : 'mr-3'" />
      <span v-if="!isSidebarMinimized">{{ item.label }}</span>
    </button>
  </template>
 </nav>

 <!-- Logout -->
 <div class="border-t border-gray-100" :class="isSidebarMinimized ? 'p-3' : 'p-4'">
 <button
 @click="handleLogoutClick"
 class="flex items-center w-full py-3 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-all group"
 :class="isSidebarMinimized ? 'justify-center px-0' : 'px-4'"
 :title="isSidebarMinimized ? 'Log Out' : ''"
 >
 <LogOut class="w-[18px] h-[18px] transition-transform group-hover:-translate-x-0.5 shrink-0" :class="isSidebarMinimized ? '' : 'mr-3'" />
 <span v-if="!isSidebarMinimized">Log Out</span>
 </button>
 </div>
 </aside>

 <!-- In-App Toast Mount -->
 <InAppToast ref="toastRef" />

 <!-- Mobile Header -->
 <header class="lg:hidden bg-white border-b border-gray-100 sticky top-0 z-40 px-5 py-3.5 flex items-center justify-between">
 <div class="flex items-center gap-2.5">
  <!-- <img src="@/assets/img/logo-light.png" class="h-10 w-auto" /> -->
 <!-- <div class="w-9 h-9 bg-gradient-to-br from-[#FF5C1A] to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm border border-gray-100 shadow-[#FF5C1A]/10">
 E
 </div> -->
 <img src="@/assets/img/logo-light.png" class="h-10 w-auto" />
 <!-- <span class="text-lg font-bold text-gray-900 tracking-tight">Errandr</span> -->
 </div>
 <div class="flex items-center gap-2">
 <NuxtLink to="/notifications" class="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 transition-all">
 <Bell class="w-5 h-5" />
 <div v-if="unreadCount > 0" class="absolute top-2 right-2 w-4 h-4 bg-[#FF5C1A] border border-white rounded-full flex items-center justify-center">
 <span class="text-[8px] font-bold text-white">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
 </div>
 </NuxtLink>
 <button
 @click="showMobileMenu = !showMobileMenu"
 class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 active:scale-95 transition-all"
 >
 <Menu class="w-5 h-5" />
 </button>
 </div>
 </header>

 <!-- Mobile Overlay -->
 <Transition name="overlay">
 <div v-if="showMobileMenu" class="lg:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" @click="showMobileMenu = false" />
 </Transition>

 <!-- Mobile Sidebar -->
 <Transition name="slide">
 <aside v-if="showMobileMenu" class="lg:hidden w-72 bg-white min-h-screen fixed left-0 top-0 z-50 shadow-sm border border-gray-100 flex flex-col">
 <div class="p-5 border-b border-gray-100 flex items-center justify-between">
 <div class="flex items-center gap-2.5">
  <img src="@/assets/img/logo-light.png" class="h-10 w-auto" />
 <!-- <div class="w-9 h-9 bg-[#FF5C1A] rounded-lg flex items-center justify-center text-white font-bold text-sm">E</div>
 <span class="text-lg font-bold text-gray-900 tracking-tight">Errandr</span> -->
 </div>
 <button @click="showMobileMenu = false" class="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400"><X class="w-5 h-5" /></button>
 </div>

 <div class="p-5 bg-gray-50 border-b border-gray-100">
 <div class="flex items-center gap-4">
 <div class="w-12 h-12 rounded-xl bg-[#FF5C1A] text-white flex items-center justify-center font-bold text-lg shadow-sm border border-gray-100 shadow-[#FF5C1A]/20">
 {{ userInitials }}
 </div>
 <div class="min-w-0">
 <h3 class="font-bold text-gray-900 text-base tracking-tight truncate">{{ userDisplayName }}</h3>
 <p class="text-xs text-gray-400 truncate">{{ user?.email }}</p>
 </div>
 </div>
 </div>
 
 <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
  <template v-for="item in navItems" :key="item.path">
    <NuxtLink
      v-if="!isRestricted(item.path)"
      :to="item.path"
      class="flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all"
      :class="isActive(item.path) ? 'bg-[#FF5C1A] text-white shadow-sm border border-gray-100 shadow-[#FF5C1A]/20' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'"
      @click="showMobileMenu = false"
    >
      <component :is="item.icon" class="w-[18px] h-[18px] mr-3" />
      {{ item.label }}
    </NuxtLink>
    <button
      v-else
      @click="handleNavClick($event, item.path)"
      class="flex items-center w-full px-4 py-3.5 text-sm font-medium rounded-xl transition-all opacity-40 cursor-not-allowed text-gray-500 hover:bg-gray-50"
    >
      <component :is="item.icon" class="w-[18px] h-[18px] mr-3" />
      {{ item.label }}
    </button>
  </template>
 </nav>

 <div class="p-5 border-t border-gray-100">
 <button @click="handleLogoutClick" class="flex items-center w-full px-4 py-3.5 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
 <LogOut class="w-[18px] h-[18px] mr-3" /> Log Out
 </button>
 </div>
 </aside>
 </Transition>

 <!-- Main Content -->
 <main class="flex-1 flex flex-col min-h-screen transition-all duration-300" :class="isSidebarMinimized ? 'lg:ml-20' : 'lg:ml-64'">
 <!-- Desktop Header -->
 <header class="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30 px-5 py-5 hidden lg:flex items-center justify-between">
 <div>
 <h1 class="text-xl font-bold text-gray-900 tracking-tight leading-none">{{ pageTitle }}</h1>
 <p class="text-xs text-gray-400 font-medium mt-1">{{ pageDescription }}</p>
 </div>
 
 <div class="flex items-center gap-4">
 <NuxtLink to="/notifications" class="relative group">
 <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm border border-gray-100 group-hover:text-[#FF5C1A] transition-all border border-transparent group-hover:border-gray-100">
 <Bell class="w-[18px] h-[18px]" />
 </div>
 <div v-if="unreadCount > 0" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FF5C1A] border border-white rounded-full flex items-center justify-center shadow-sm">
 <span class="text-[8px] font-bold text-white">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
 </div>
 </NuxtLink>

 <div class="w-px h-8 bg-gray-100" />
 
 <div class="flex items-center gap-3">
 <div class="text-right">
 <p class="text-sm font-semibold text-gray-900 leading-none mb-0.5">{{ userDisplayName }}</p>
 <p class="text-[10px] font-medium text-gray-400">Rider</p>
 </div>
 <div class="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white text-sm font-bold shadow-sm border border-gray-100">
 {{ userInitials }}
 </div>
 </div>
 </div>
 </header>

  <!-- Global Verification Banner -->
  <div v-if="errandrProfile && (!errandrProfile.verificationLevel || errandrProfile.verificationLevel < 3) && route.path !== '/verification'" class="bg-gray-900 m-5 md:mx-8 md:mt-8 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm border border-gray-100 animate-fade-in z-20 flex-col sm:flex-row">
    
    <!-- Pending / Not Started / Upgrade -->
    <template v-if="!errandrProfile.verificationStatus || errandrProfile.verificationStatus === 'pending' || errandrProfile.verificationStatus === 'approved'">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-[#FF5C1A] rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm border border-gray-100">
          <ShieldAlert class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-white font-bold text-sm tracking-tight">
            {{ errandrProfile.verificationLevel === 2 ? 'Action Required: Upgrade to Tier 3' : 'Action Required: Verify Account' }}
          </h3>
          <p class="text-gray-400 text-xs mt-0.5 max-w-sm">
            {{ errandrProfile.verificationLevel === 2 ? 'Submit guarantor details to unlock Pro rider benefits.' : 'Please complete identity verification to start accepting deliveries.' }}
          </p>
        </div>
      </div>
      <NuxtLink to="/verification" class="px-5 py-2.5 bg-[#FF5C1A] hover:bg-[#E54D12] text-white text-xs font-bold rounded-lg transition-all whitespace-nowrap shadow-sm border border-gray-100 w-full sm:w-auto text-center">
        {{ errandrProfile.verificationLevel === 2 ? 'Upgrade Now' : 'Verify Now' }}
      </NuxtLink>
    </template>

   <!-- Reviewing -->
   <template v-else-if="errandrProfile.verificationStatus === 'reviewing'">
     <div class="flex items-center gap-3">
       <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm border border-gray-100">
         <Clock class="w-5 h-5" />
       </div>
       <div>
         <h3 class="text-white font-bold text-sm tracking-tight">Verification Under Review</h3>
         <p class="text-gray-400 text-xs mt-0.5 max-w-sm">Your documents are being reviewed. We will notify you once approved.</p>
       </div>
     </div>
     <button disabled class="px-5 py-2.5 bg-gray-800 text-gray-400 text-xs font-bold rounded-lg whitespace-nowrap shadow-sm border border-gray-100 w-full sm:w-auto text-center cursor-not-allowed border border-gray-700">
       Pending Approval
     </button>
   </template>

   <!-- Rejected -->
   <template v-else-if="errandrProfile.verificationStatus === 'rejected'">
     <div class="flex items-center gap-3">
       <div class="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm border border-gray-100">
         <XCircle class="w-5 h-5" />
       </div>
       <div>
         <h3 class="text-white font-bold text-sm tracking-tight">Verification Rejected</h3>
         <p class="text-gray-400 text-xs mt-0.5 max-w-sm">There was an issue with your documents. Please review and resubmit.</p>
       </div>
     </div>
     <NuxtLink to="/verification" class="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition-all whitespace-nowrap shadow-sm border border-gray-100 w-full sm:w-auto text-center">
       Try Again
     </NuxtLink>
   </template>

 </div>

 <!-- Page Content -->
 <div class="flex-1 p-2.5 md:p-5">
 <slot />
 </div>
 <!-- Footer -->
 <!-- <footer class="px-5 py-5 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 mt-auto">
 <p class="text-xs text-gray-400 font-medium">© {{ new Date().getFullYear() }} Errandr Rider</p>
 <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
 <NuxtLink to="/terms" class="text-xs text-gray-400 hover:text-[#FF5C1A] font-medium transition-colors">Terms</NuxtLink>
 <NuxtLink to="/privacy" class="text-xs text-gray-400 hover:text-[#FF5C1A] font-medium transition-colors">Privacy</NuxtLink>
 <NuxtLink to="/refund" class="text-xs text-gray-400 hover:text-[#FF5C1A] font-medium transition-colors">Refunds</NuxtLink>
 <NuxtLink to="/contact" class="text-xs text-gray-400 hover:text-[#FF5C1A] font-medium transition-colors">Contact</NuxtLink>
 </div>
 </footer> -->
 </main>

 <!-- Logout Confirmation Modal -->
 <Transition name="fade">
 <div v-if="logoutModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4" @click.self="logoutModalOpen = false">
 <div class="bg-white rounded-3xl shadow-sm border border-gray-100 max-w-sm w-full p-5 flex flex-col items-center text-center space-y-6 animate-scale-in">
 <div class="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100">
 <LogOut class="w-8 h-8 text-rose-500" />
 </div>

 <div class="space-y-2">
 <h3 class="text-xl font-bold text-gray-900 tracking-tight">Log Out?</h3>
 <p class="text-sm text-gray-500">
 Are you sure you want to log out of your account?
 </p>
 </div>

 <div class="flex flex-col gap-2.5 w-full">
 <button @click="confirmLogout" class="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-sm border border-gray-100 shadow-rose-500/20 transition-all active:scale-[0.98]">
 Yes, Log Out
 </button>
 <button @click="logoutModalOpen = false" class="w-full py-3.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all">
 Cancel
 </button>
 </div>
 </div>
 </div>
 </Transition>

 <!-- Chat Widget -->
 <!-- <div class="fixed bottom-6 right-6 z-[99]">
    <ChatWidget />
 </div> -->
 <CorePushNotificationPrompt />
 <CoreWhatsAppWidget />
 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { erranders_api } from '@/api_factory/modules/erranders'
import { useRouter, useRoute } from 'vue-router'
import ChatWidget from '@/components/ChatWidget.vue'
 import { 
  LayoutDashboard, 
  Bike, 
  Wallet, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  ChevronLeft,
  Bell,
  Layers,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  Clock,
  XCircle
 } from 'lucide-vue-next'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import InAppToast from '@/components/InAppToast.vue'

const { toastQueue } = useRealtimeNotifications()
const { unreadCount } = useNotifications()
const toastRef = ref<any>(null)
const errandrProfile = ref<any>(null)

const route = useRoute()
const router = useRouter()
const { user, logOut } = useUser()

let profileInterval: any = null

const fetchProfile = async () => {
  try {
    const res = await erranders_api.getProfile()
    if (res && (res as any).type !== 'ERROR' && res.data) {
      errandrProfile.value = res.data
      
      // Real-time polling if under review
      if (errandrProfile.value.verificationStatus === 'reviewing') {
        if (!profileInterval) {
          profileInterval = setInterval(fetchProfile, 10000) // poll every 10s
        }
      } else {
        if (profileInterval) {
          clearInterval(profileInterval)
          profileInterval = null
        }
      }
    }
  } catch (e) {}
}

const { requestPermissionAndRegister, listenForNotifications } = useDispatchNotifications()

onMounted(() => {
  fetchProfile()
  
  // Initialize Push Notifications
  if ('Notification' in window && Notification.permission === 'granted') {
    requestPermissionAndRegister()
  }
  listenForNotifications()
})

watch(() => route.path, () => {
  fetchProfile()
})

onUnmounted(() => {
  if (profileInterval) clearInterval(profileInterval)
})

// Watch toastQueue to push to component
watch(() => toastQueue.value.length, (newLen, oldLen) => {
 if (newLen > oldLen) {
 // Process all new items added since last watch trigger
 const newItems = toastQueue.value.slice(oldLen, newLen)
 newItems.forEach(item => {
 if (toastRef.value) {
 toastRef.value.addToast(item)
 }
 })
 }
})


const showMobileMenu = ref(false)
const logoutModalOpen = ref(false)
const isSidebarMinimized = ref(false)

const isRestricted = (path: string) => {
  const restrictedPaths = ['/deliveries/pool', '/deliveries', '/deliveries/chats']
  return restrictedPaths.includes(path) && (!errandrProfile.value?.verificationLevel || errandrProfile.value.verificationLevel === 1)
}

const handleNavClick = (e: Event, path: string) => {
  if (isRestricted(path)) {
    e.preventDefault()
    if (toastRef.value) {
      toastRef.value.addToast({
        id: Date.now().toString(),
        title: 'Action Required',
        message: 'Please complete identity verification to access deliveries.',
        type: 'error',
        time: new Date().toLocaleTimeString()
      })
    }
  } else {
    showMobileMenu.value = false
  }
}

const navItems = [
 { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
 { path: '/deliveries/pool', label: 'Available Errands', icon: Layers },
 { path: '/deliveries', label: 'My Deliveries', icon: Bike },
 { path: '/deliveries/chats', label: 'Chats', icon: MessageSquare },
 { path: '/earnings', label: 'Earnings', icon: Wallet },
 { path: '/notifications', label: 'Notifications', icon: Bell },
 { path: '/profile', label: 'Profile', icon: User }
]

const pageTitles: Record<string, { title: string; description: string }> = {
 '/dashboard': { title: 'Dashboard', description: 'Your delivery overview at a glance.' },
 '/deliveries/pool': { title: 'Order Pool', description: 'Real-time pool of pending orders awaiting a rider.' },
 '/deliveries': { title: 'My Deliveries', description: 'Track and manage your active and past deliveries.' },
 '/verification': { title: 'Account Verification', description: 'Submit and manage your identity verification.' },
 '/earnings': { title: 'Earnings', description: 'View your earnings, tips, and payout history.' },
 '/notifications': { title: 'Notifications', description: 'Real-time updates and new delivery opportunities.' },
 '/profile': { title: 'Profile', description: 'Manage your personal information and settings.' }
}

const pageTitle = computed(() => pageTitles[route.path]?.title || 'Dashboard')
const pageDescription = computed(() => pageTitles[route.path]?.description || 'Welcome back!')

const userDisplayName = computed(() => {
 if (!user.value) return 'Rider'
 return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || user.value.email || 'Rider'
})

const userInitials = computed(() => {
 if (!user.value) return 'R'
 const first = user.value.firstName || ''
 const last = user.value.lastName || ''
 return (first[0] || last[0] || user.value.email?.[0] || 'R').toUpperCase()
})

const handleLogoutClick = () => {
 logoutModalOpen.value = true
}

const isActive = (path: string) => {
  if (path === '/deliveries' && route.path === '/deliveries/pool') return false
  return route.path === path || route.path.startsWith(path + '/')
}

const confirmLogout = () => {
 logOut()
}

watch(() => route.path, () => showMobileMenu.value = false)
</script>

<style scoped>
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.3s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-scale-in {
 animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleIn {
 from { opacity: 0; transform: scale(0.95) translateY(8px); }
 to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
