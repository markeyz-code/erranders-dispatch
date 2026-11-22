<template>
 <div class="min-h-screen bg-[#f8f9fb] overflow-x-hidden w-full max-w-[100vw]">
 <!-- Desktop Sidebar -->
 <aside class="hidden lg:flex flex-col bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 z-50 transition-all duration-300" :class="isSidebarMinimized ? 'w-20' : 'w-64'">
 <!-- Logo -->
 <div class="p-4 pb-8 flex items-center gap-3 relative" :class="isSidebarMinimized ? 'justify-center px-0' : ''">
  <!-- <img src="@/assets/img/logo-light.png" class="h-10 w-auto" /> -->

 <div v-if="!isSidebarMinimized" class="flex flex-col">
  <img src="@/assets/img/logo-light.png" class="h-10 w-auto" />
 <!-- <span class="text-lg font-bold text-gray-900 tracking-tight leading-none">Errandr</span>
 <span class="text-[10px] font-semibold text-[#FF5C1A] tracking-wide leading-none mt-0.5">Rider Portal</span> -->
 </div>
  <div v-if="isSidebarMinimized" class="w-10 h-10 bg-gradient-to-br from-[#FF5C1A] to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm border border-gray-50 shadow-[#FF5C1A]/20 shrink-0">
 <!-- erranders-icon-2048.png -->
   <img src="@/assets/img/erranders-icon-2048.png" class="h-10 w-auto" />
 </div>

 <!-- Toggle Button -->
 <button 
  @click="isSidebarMinimized = !isSidebarMinimized"
  class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-25 rounded-full flex items-center justify-center shadow-sm text-gray-500 hover:text-[#FF5C1A] hover:border-[#FF5C1A] z-50 transition-colors"
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
        isActive(item.path) ? 'bg-[#FF5C1A] text-white shadow-sm border border-gray-50 shadow-[#FF5C1A]/20' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
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

 <!-- Main Content -->
 <main class="rider-main flex-1 flex flex-col min-h-screen transition-all duration-300 pb-24 lg:pb-0 pt-[env(safe-area-inset-top)] lg:pt-0" :class="isSidebarMinimized ? 'lg:ml-20' : 'lg:ml-64'">
 <!-- Desktop Header -->
 <header class="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30 px-5 py-3.5 hidden lg:flex items-center justify-end">
 <div class="flex items-center gap-3">
  <!-- Operating Campus Pill -->
  <button
    type="button"
    @click="openPicker"
    class="flex items-center gap-2 bg-gray-50 hover:bg-white text-gray-900 border border-gray-100 hover:border-[#FF5C1A]/50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm group"
    title="Change operating campus"
  >
    <MapPin class="w-3.5 h-3.5 text-[#FF5C1A] shrink-0" />
    <span class="max-w-[150px] truncate">{{ currentCampusLabel }}</span>
    <ChevronDown class="w-3 h-3 text-gray-400 group-hover:text-gray-700 shrink-0" />
  </button>

  <NuxtLink to="/notifications" class="relative group">
 <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm border border-gray-50 group-hover:text-[#FF5C1A] transition-all border border-transparent group-hover:border-gray-100">
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
 <div class="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white text-sm font-bold shadow-sm border border-gray-50">
 {{ userInitials }}
 </div>
 </div>
 </div>
 </header>

  <!-- Global Verification Banner -->
  <div v-if="errandrProfile && (!errandrProfile.verificationLevel || errandrProfile.verificationLevel < 3) && route.path !== '/verification'" class="bg-gray-900 m-5 md:mx-8 md:mt-8 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm border border-gray-50 animate-fade-in z-20 flex-col sm:flex-row">
    
    <!-- Pending / Not Started / Upgrade -->
    <template v-if="!errandrProfile.verificationStatus || errandrProfile.verificationStatus === 'pending' || errandrProfile.verificationStatus === 'approved'">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-[#FF5C1A] rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm border border-gray-50">
          <ShieldAlert class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-white font-bold text-sm tracking-tight">
            {{ errandrProfile.verificationLevel === 2 ? 'Action Required: Upgrade to Tier 3' : 'Action Required: Verify Account' }}
          </h3>
          <p class="text-gray-400 text-sm mt-0.5 max-w-sm">
            {{ errandrProfile.verificationLevel === 2 ? 'Submit guarantor details to unlock Pro rider benefits.' : 'Please complete identity verification to start accepting deliveries.' }}
          </p>
        </div>
      </div>
      <NuxtLink to="/verification" class="px-5 py-2.5 bg-[#FF5C1A] hover:bg-[#E54D12] text-white text-sm font-bold rounded-lg transition-all whitespace-nowrap shadow-sm border border-gray-50 w-full sm:w-auto text-center">
        {{ errandrProfile.verificationLevel === 2 ? 'Upgrade Now' : 'Verify Now' }}
      </NuxtLink>
    </template>

   <!-- Reviewing -->
   <template v-else-if="errandrProfile.verificationStatus === 'reviewing'">
     <div class="flex items-center gap-3">
       <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm border border-gray-50">
         <Clock class="w-5 h-5" />
       </div>
       <div>
         <h3 class="text-white font-bold text-sm tracking-tight">Verification Under Review</h3>
         <p class="text-gray-400 text-sm mt-0.5 max-w-sm">Your documents are being reviewed. We will notify you once approved.</p>
       </div>
     </div>
     <button disabled class="px-5 py-2.5 bg-gray-800 text-gray-400 text-sm font-bold rounded-lg whitespace-nowrap shadow-sm border border-gray-50 w-full sm:w-auto text-center cursor-not-allowed border border-gray-700">
       Pending Approval
     </button>
   </template>

   <!-- Rejected -->
   <template v-else-if="errandrProfile.verificationStatus === 'rejected'">
     <div class="flex items-center gap-3">
       <div class="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm border border-gray-50">
         <XCircle class="w-5 h-5" />
       </div>
       <div>
         <h3 class="text-white font-bold text-sm tracking-tight">Verification Rejected</h3>
         <p class="text-gray-400 text-sm mt-0.5 max-w-sm">There was an issue with your documents. Please review and resubmit.</p>
       </div>
     </div>
     <NuxtLink to="/verification" class="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-lg transition-all whitespace-nowrap shadow-sm border border-gray-50 w-full sm:w-auto text-center">
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
 <p class="text-sm text-gray-400 font-medium">© {{ new Date().getFullYear() }} Errandr Rider</p>
 <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
 <NuxtLink to="/terms" class="text-sm text-gray-400 hover:text-[#FF5C1A] font-medium transition-colors">Terms</NuxtLink>
 <NuxtLink to="/privacy" class="text-sm text-gray-400 hover:text-[#FF5C1A] font-medium transition-colors">Privacy</NuxtLink>
 <NuxtLink to="/refund" class="text-sm text-gray-400 hover:text-[#FF5C1A] font-medium transition-colors">Refunds</NuxtLink>
 <NuxtLink to="/contact" class="text-sm text-gray-400 hover:text-[#FF5C1A] font-medium transition-colors">Contact</NuxtLink>
 </div>
 </footer> -->
 </main>

 <!-- Bottom tabs: the five places a rider goes, within thumb reach -->
 <!-- Hidden where the screen owns its own bottom edge, such as the chat composer. -->
 <nav v-if="!isFullScreenRoute" class="bottom-tabs lg:hidden" aria-label="Main">
   <NuxtLink
     v-for="tab in bottomTabs"
     :key="tab.path"
     :to="tab.path"
     class="tab"
     :class="{ on: isActive(tab.path) }"
   >
     <span class="tab-icon">
       <component :is="tab.icon" class="w-[22px] h-[22px]" />
       <span v-if="tab.badge" class="tab-badge">{{ tab.badge > 9 ? '9+' : tab.badge }}</span>
     </span>
     <span class="tab-label">{{ tab.label }}</span>
   </NuxtLink>

   <button type="button" class="tab" :class="{ on: moreSheetOpen }" @click="moreSheetOpen = true">
     <span class="tab-icon"><Users class="w-[22px] h-[22px]" /></span>
     <span class="tab-label">More</span>
   </button>
 </nav>

 <!-- More: the rest, without a second navigation system -->
 <Transition name="sheet">
   <div v-if="moreSheetOpen" class="sheet-wrap">
     <div class="sheet-scrim" @click="moreSheetOpen = false" />
     <div class="sheet">
       <div class="sheet-grip" aria-hidden="true" />

       <NuxtLink to="/profile" class="sheet-row" @click="moreSheetOpen = false">
         <span class="sheet-avatar">{{ userInitials }}</span>
         <span class="sheet-text">
           <span class="sheet-title">{{ userDisplayName }}</span>
           <span class="sheet-sub">{{ user?.email }}</span>
         </span>
       </NuxtLink>

       <button type="button" class="sheet-row" @click="moreSheetOpen = false; openPicker()">
         <MapPin class="w-[18px] h-[18px]" />
         <span class="sheet-title">{{ currentCampusLabel }}</span>
         <span class="sheet-action">Switch</span>
       </button>

       <NuxtLink to="/earnings" class="sheet-row" @click="moreSheetOpen = false">
         <Wallet class="w-[18px] h-[18px]" />
         <span class="sheet-title">Earnings</span>
       </NuxtLink>

       <NuxtLink to="/notifications" class="sheet-row" @click="moreSheetOpen = false">
         <Bell class="w-[18px] h-[18px]" />
         <span class="sheet-title">Notifications</span>
         <span v-if="unreadCount > 0" class="sheet-badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
       </NuxtLink>

       <NuxtLink to="/profile" class="sheet-row" @click="moreSheetOpen = false">
         <User class="w-[18px] h-[18px]" />
         <span class="sheet-title">Profile</span>
       </NuxtLink>

       <button type="button" class="sheet-row danger" @click="moreSheetOpen = false; handleLogoutClick()">
         <LogOut class="w-[18px] h-[18px]" />
         <span class="sheet-title">Log out</span>
       </button>
     </div>
   </div>
 </Transition>

 <!-- Logout Confirmation Modal -->
 <Transition name="fade">
 <div v-if="logoutModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4" @click.self="logoutModalOpen = false">
 <div class="bg-white rounded-3xl shadow-sm border border-gray-50 max-w-sm w-full p-5 flex flex-col items-center text-center space-y-6 animate-scale-in">
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
 <button @click="confirmLogout" class="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-sm border border-gray-50 shadow-rose-500/20 transition-all active:scale-[0.98]">
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
  XCircle,
  MapPin,
  ChevronDown,
  Users
 } from 'lucide-vue-next'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import { useInstitution } from '@/composables/useInstitution'
import InAppToast from '@/components/InAppToast.vue'

const { toastQueue } = useRealtimeNotifications()
const { unreadCount } = useNotifications()
const { institution, openPicker } = useInstitution()
const toastRef = ref<any>(null)
const errandrProfile = ref<any>(null)

const route = useRoute()
const router = useRouter()
const { user, logOut } = useUser()

const currentCampusLabel = computed(() => {
  return institution.value?.shortName || institution.value?.name || (user.value as any)?.school || 'Select Campus'
})

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

/**
 * Screens that are their own full-page context.
 *
 * The chat view is a fixed overlay with a message composer at the very bottom; a tab bar there would sit on top of the
 * box a rider types into.
 */
const isFullScreenRoute = computed(() =>
  route.path.startsWith('/deliveries/chats') || route.path.startsWith('/incoming'),
)

const bottomTabs = computed(() => [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/deliveries/pool', label: 'Pool', icon: Layers },
  { path: '/deliveries', label: 'Deliveries', icon: Bike },
  { path: '/deliveries/chats', label: 'Chats', icon: MessageSquare, badge: unreadCount.value },
])

/** Everything that is not a place to be: earnings, alerts, you, the campus you work, and leaving. */
const moreSheetOpen = ref(false)

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

/*
 * Mobile-first navigation.
 *
 * The app was driven by a desktop sidebar with a slide-in drawer on a phone: the primary destinations sat behind a
 * hamburger in the top corner, which is the furthest point from a thumb. They are now permanent tabs along the bottom
 * edge, where a rider's hand already is, with the header reduced to identity and alerts.
 */
.bottom-tabs {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 45;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  border-top: 1px solid #eef0f3;
}

.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 2px;
  border-radius: 12px;
  text-decoration: none;
  color: #9aa1ac;
  transition: color 0.15s ease;
}

.tab.on {
  color: #ff5c1a;
}

.tab-icon {
  position: relative;
  display: grid;
  place-items: center;
}

.tab-badge {
  position: absolute;
  top: -4px;
  right: -8px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: #ff5c1a;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  line-height: 16px;
  text-align: center;
}

.tab-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.01em;
}
</style>

<style scoped>
/* The mobile app bar is gone; content starts under the status bar instead. */
@media (max-width: 1023px) {
  .rider-main {
    padding-top: max(10px, env(safe-area-inset-top));
  }
}

/* The More sheet: everything that is not a destination, one tap from the bar. */
.sheet-wrap {
  position: fixed;
  inset: 0;
  z-index: 60;
}

.sheet-scrim {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
}

.sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 8px 12px calc(20px + env(safe-area-inset-bottom));
  border-radius: 20px 20px 0 0;
  background: #fff;
  box-shadow: 0 -12px 40px rgba(15, 23, 42, 0.18);
}

.sheet-grip {
  width: 40px;
  height: 4px;
  margin: 4px auto 10px;
  border-radius: 999px;
  background: #e5e7eb;
}

.sheet-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 13px 10px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #14110d;
  font-size: 15px;
  font-weight: 650;
  text-decoration: none;
  text-align: left;
}

.sheet-row:active {
  background: #f7f7f8;
}

.sheet-row.danger {
  color: #dc2626;
}

.sheet-avatar {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background: #14110d;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.sheet-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sheet-title {
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sheet-sub {
  font-size: 12.5px;
  color: #9aa1ac;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sheet-action {
  margin-left: auto;
  font-size: 12.5px;
  font-weight: 750;
  color: #ff5c1a;
}

.sheet-badge {
  margin-left: auto;
  min-width: 20px;
  padding: 1px 6px;
  border-radius: 999px;
  background: #ff5c1a;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  text-align: center;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.18s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
</style>
