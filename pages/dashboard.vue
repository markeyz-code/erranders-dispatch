<template>
  <div class="space-y-8 animate-fade-in max-w-7xl mx-auto pb-16 from-slate-50/80 via-white to-white   rounded-lg  overflow-hidden">
    <!-- Welcome Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Welcome back, {{ user?.firstName || 'Rider' }} 👋</h1>
        <p class="text-gray-500 text-sm mt-1">Here's a summary of your delivery activity.</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div v-if="loadingStats" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="  rounded-lg  h-28 animate-pulse "></div>
    </div>
    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="stat in stats" 
        :key="stat.label" 
        class="  rounded-lg border border-[0.5px] border-gray-50 p-4 transition-all duration-300 transform hover:scale-105 group"
      >
        <div class="flex items-center justify-between mb-4">
          <div :class="stat.bgClass" class="w-10 h-10 rounded-xl flex items-center justify-center text-lg">
            {{ stat.emoji }}
          </div>
        </div>
        <p class="text-xs text-gray-400 font-medium mb-1">{{ stat.label }}</p>
        <h3 class="text-2xl font-bold text-gray-900 tracking-tight">{{ stat.value }}</h3>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Active Delivery + Recent Deliveries -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Active Deliveries Section -->
        <div class="  rounded-lg  overflow-hidden border border-gray-25">
          <div class="px-4 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 class="text-base font-bold text-gray-900">Active Deliveries</h3>
            <div v-if="batchStatus?.isActive" class="flex items-center gap-2 px-3 py-1 bg-parentPrimary/10 border border-parentPrimary/20 rounded-full animate-pulse">
              <span class="w-1.5 h-1.5 rounded-full bg-parentPrimary"></span>
              <span class="text-[10px] font-medium text-parentPrimary uppercase tracking-widest">Batch mode active</span>
            </div>
            <span v-else-if="activeOrders.length > 0" class="text-[10px] font-semibold text-[#FF5C1A] bg-[#FF5C1A]/5 px-3 py-1 rounded-full border border-[#FF5C1A]/10">In Progress</span>
          </div>

          <div v-if="loadingOrders" class="p-5">
            <div class="h-20 bg-gray-50 rounded-xl animate-pulse"></div>
          </div>
          <div v-else-if="activeOrders.length > 0" class="divide-y space-y-3.5 p-3 divide-gray-50">
            <div v-for="order in activeOrders" :key="order._id" class="p-4   rounded-lg   hover:border border-gray-25 transition-all transform hover:-translate-y-0.5">
              <div class="flex flex-col md:flex-row gap-6 items-start">
                <div class="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">
                  {{ statusEmoji(order.status) }}
                </div>
                
                <div class="flex-1 space-y-4">
                  <div>
                    <h4 class="text-lg font-bold text-gray-900 tracking-tight mb-1">
                      {{ order.type === 'custom_errand' ? 'Custom Errand' : 'Order' }} #{{ order.orderNumber }}
                    </h4>
                    <p class="text-xs text-gray-400">
                      {{ order.type === 'custom_errand' ? order.customDetails?.pickupLocation : (order.vendor?.storeName || 'Store') }} 
                      → 
                      {{ order.type === 'custom_errand' ? order.customDetails?.dropoffLocation : (order.deliveryAddress || 'Delivery') }}
                    </p>
                  </div>
                  
                  <div class="flex flex-wrap gap-3">
                    <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 line-clamp-1">
                      <div class="w-1.5 h-1.5 rounded-full bg-[#FF5C1A] shrink-0" />
                      {{ order.type === 'custom_errand' ? order.customDetails?.pickupLocation : (order.vendor?.storeName || 'Pick-up') }}
                    </div>
                    <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 line-clamp-1">
                      <div class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      {{ order.type === 'custom_errand' ? order.customDetails?.dropoffLocation : (order.deliveryAddress || 'Drop-off') }}
                    </div>
                  </div>
                </div>
                
                <NuxtLink :to="`/deliveries/${order._id}`" class="px-4 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm border border-gray-25 hover:bg-black hover:border border-gray-25 transition-all flex-shrink-0">
                  Manage Dispatch
                </NuxtLink>
              </div>
            </div>
          </div>
          
          <div v-else class="py-16 text-center px-4">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🚲</div>
            <h4 class="text-base font-bold text-gray-900 mb-1">No active deliveries</h4>
            <p class="text-sm text-gray-400 mb-6">You don't have any deliveries in progress right now.</p>
            <NuxtLink to="/deliveries" class="inline-block px-4 py-3 bg-[#FF5C1A] text-white rounded-xl font-semibold text-sm border border-gray-25 shadow-[#FF5C1A]/20 hover:brightness-110 transition-all">
              View Available Errands
            </NuxtLink>
          </div>
        </div>

        <!-- Available Errands Section -->
        <div class="  rounded-lg  overflow-hidden  border border-emerald-100 mb-6">
          <div class="px-4 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Available Errands
            </h3>
            <NuxtLink to="/deliveries/pool" class="text-xs font-semibold text-emerald-600 hover:underline">View All →</NuxtLink>
          </div>
          
          <div v-if="loadingOrders" class="p-4 space-y-3">
            <div v-for="i in 2" :key="i" class="h-14 bg-gray-50 rounded-xl animate-pulse"></div>
          </div>
          <div v-else-if="availableOrders.length === 0" class="py-12 text-center px-4">
            <div class="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">🚲</div>
            <p class="text-sm text-gray-400">No new errands available right now. Check back soon!</p>
          </div>
          <div v-else class="divide-y divide-gray-50">
            <NuxtLink 
              v-for="order in availableOrders.slice(0, 3)" 
              :key="order._id" 
              :to="`/deliveries/pool?orderId=${order._id}`"
              class="px-4 py-4   hover:bg-emerald-50/50 transition-all flex items-center justify-between gap-4 group cursor-pointer"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-gray-950 text-white overflow-hidden">
                  <img v-if="order.type !== 'custom_errand' && order.vendor?.logo" :src="order.vendor.logo" class="w-full h-full object-cover" />
                  <span v-else class="text-xs font-bold">CUS</span>
                </div>
                <div>
                  <h4 class="font-semibold text-sm text-gray-900 truncate max-w-[200px]">
                    {{ order.type === 'custom_errand' ? 'Custom Errand' : (order.vendor?.storeName || 'Order') }}
                  </h4>
                  <p class="text-xs text-gray-400 line-clamp-1 max-w-[200px]">
                    {{ order.type === 'custom_errand' ? order.customDetails?.dropoffLocation : (order.deliveryAddress || 'Customer Location') }}
                  </p>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <p v-if="order.status === 'negotiating'" class="font-bold text-sm text-amber-600">₦{{ (order.proposedDeliveryFee || order.deliveryFee || 0).toLocaleString() }}</p>
                <p v-else class="font-bold text-sm text-emerald-600">₦{{ (order.erranderPayout || order.erranderShare || order.deliveryFee || 150).toLocaleString() }}</p>
                <span v-if="order.status === 'negotiating'" class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase mt-0.5 inline-block border border-amber-200 animate-pulse">🔥 Bid Now</span>
                <span v-else class="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded uppercase mt-0.5 inline-block border border-emerald-100">Claim Now</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Recent Deliveries -->
        <div class="  rounded-lg  overflow-hidden border border-gray-25">
          <div class="px-4 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 class="text-base font-bold text-gray-900">Recent Deliveries</h3>
            <NuxtLink to="/deliveries" class="text-xs font-semibold text-[#FF5C1A] hover:underline">View All →</NuxtLink>
          </div>
          
          <div v-if="loadingOrders" class="p-4 space-y-3">
            <div v-for="i in 4" :key="i" class="h-14 bg-gray-50 rounded-xl animate-pulse"></div>
          </div>
          <div v-else-if="recentOrders.length === 0" class="py-12 text-center">
            <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">📦</div>
            <p class="text-sm text-gray-400">No deliveries yet. Your recent orders will appear here.</p>
          </div>
          <div v-else class="divide-y space-y-3 p-3 divide-gray-50">
            <NuxtLink 
              v-for="order in recentOrders" 
              :key="order._id" 
              :to="`/deliveries/${order._id}`"
              class="px-4 py-4   rounded-xl  hover:border border-gray-25 transition-all flex items-center gap-4 group cursor-pointer"
            >
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-gray-50 group-hover:scale-105 transition-transform">
                {{ statusEmoji(order.status) }}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-sm text-gray-900 truncate">
                  {{ order.type === 'custom_errand' ? 'Custom Errand' : (order.vendor?.storeName || 'Order') }} #{{ order.orderNumber }}
                </h4>
                <p class="text-xs text-gray-400">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="font-bold text-sm text-emerald-600">+₦{{ (order.erranderPayout || order.deliveryFee || 0)?.toLocaleString() }}</p>
                <span :class="getStatusClasses(order.status)" class="text-[10px] font-semibold px-2 py-0.5 rounded capitalize inline-block mt-0.5">
                  {{ order.status?.replace(/_/g, ' ') }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="space-y-6">
        <!-- Earnings Summary -->
        <div class="bg-gray-900 rounded-lg p-4 text-white relative overflow-hidden">
          <div class="absolute -right-16 -bottom-16 w-48 h-48 bg-[#FF5C1A]/20 rounded-full blur-[60px]" />
          <div class="relative z-10">
            <p class="text-xs text-gray-400 font-medium mb-1">Total Earned</p>
            <h3 class="text-2xl font-bold tracking-tight mb-4">₦{{ (earningsData.totalEarnings || 0).toLocaleString() }}</h3>
            
            <div class="space-y-2 mb-6">
              <div class="flex justify-between text-xs font-medium">
                <span class="text-gray-400">Rating</span>
                <span class="text-white">{{ (earningsData.rating || 0).toFixed(1) }} ⭐</span>
              </div>
              <div class="flex justify-between text-xs font-medium">
                <span class="text-gray-400">Deliveries</span>
                <span class="text-white">{{ earningsData.totalDeliveries || 0 }}</span>
              </div>
            </div>
            
            <NuxtLink to="/earnings" class="block w-full py-3 bg-white text-gray-900 rounded-xl font-semibold text-sm text-center hover:bg-[#FF5C1A] hover:text-white transition-all">
              View Earnings
            </NuxtLink>
          </div>
        </div>

        <!-- Rating Card -->
        <div class="  rounded-lg  p-4 ">
          <p class="text-xs text-gray-400 font-medium mb-3">Your Rating</p>
          <div class="flex items-center gap-0.5 mb-2">
            <span v-for="i in 5" :key="i" class="text-xl" :class="i <= Math.round(errandrProfile?.rating || 0) ? 'text-amber-400' : 'text-gray-200'">★</span>
          </div>
          <div class="flex items-baseline gap-2">
            <h4 class="text-4xl font-bold text-gray-900 tracking-tight">{{ (errandrProfile?.rating || 0).toFixed(1) }}</h4>
            <span class="text-xs text-gray-400 font-medium">/ 5.0</span>
          </div>
          <p v-if="errandrProfile?.rating >= 4.5" class="text-[11px] text-amber-600 font-semibold mt-3 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 inline-block">⭐ Top Rated Rider</p>
        </div>

        <!-- Quick Help -->
        <!-- <div class="  rounded-lg  p-4 ">
          <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
            Need Help?
          </h3>
          <p class="text-xs text-gray-500 mb-4">Get in touch with our support team for any delivery issues.</p>
          <button class="w-full py-3 bg-gray-50 border border-gray-50 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all">
            Contact Support
          </button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { erranders_api } from '@/api_factory/modules/erranders'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'

const { user } = useUser()

definePageMeta({
  layout: 'errander'
})

useHead({
  title: 'Dashboard - Errandr',
  meta: [
    { name: 'description', content: 'Manage your errands, track earnings, and complete deliveries with Errandr.' }
  ]
})

const loadingStats = ref(true)
const loadingOrders = ref(true)
const orders = ref<any[]>([])
const availableOrders = ref<any[]>([])
const errandrProfile = ref<any>(null)
const earningsData = ref<any>({ totalEarnings: 0, totalDeliveries: 0, rating: 0 })

const stats = computed(() => [
  { label: 'Deliveries Done', value: earningsData.value.totalDeliveries || orders.value.filter(o => o.status === 'delivered').length || '0', emoji: '🏁', bgClass: 'bg-emerald-50' },
  { label: 'Total Earned', value: `₦${(earningsData.value.totalEarnings || 0).toLocaleString()}`, emoji: '💰', bgClass: 'bg-amber-50' },
  { label: 'Avg. Rating', value: (earningsData.value.rating || errandrProfile.value?.rating || 0).toFixed(1), emoji: '⭐', bgClass: 'bg-purple-50' },
  { label: 'Active Orders', value: orders.value.filter(o => ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit'].includes(o.status)).length || '0', emoji: '📦', bgClass: 'bg-blue-50' },
])

const activeOrders = computed(() => {
  return orders.value.filter(o => ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit'].includes(o.status))
})

const batchStatus = ref<any>(null)

const recentOrders = computed(() => {
  return orders.value.filter(o => ['delivered', 'cancelled'].includes(o.status)).slice(0, 5)
})

const statusEmoji = (s: string) => ({
  pending: '⏳',
  confirmed: '✅',
  preparing: '👨‍🍳',
  ready_for_pickup: '📦',
  picked_up: '🏃',
  in_transit: '🚀',
  delivered: '🎉',
  cancelled: '❌'
}[s] || '📋')

const getStatusClasses = (s: string) => {
  if (['delivered', 'confirmed'].includes(s)) return 'bg-emerald-50 text-emerald-700';
  if (['in_transit', 'picked_up'].includes(s)) return 'bg-blue-50 text-blue-700';
  if (['pending', 'preparing', 'ready_for_pickup'].includes(s)) return 'bg-amber-50 text-amber-700';
  if (s === 'cancelled') return 'bg-rose-50 text-rose-700';
  return 'bg-gray-50 text-gray-500';
}

const formatDate = (date: string) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays === 1) return 'Yesterday'
  return d.toLocaleDateString()
}

const loadDashboard = async () => {
  // Load orders
  loadingOrders.value = true
  try {
    const res = await api.get<any[]>('/orders/errander')
    if (res && (res as any).type !== 'ERROR' && Array.isArray(res.data)) {
      orders.value = res.data
    } else {
      orders.value = []
    }
  } catch (e) {
    console.error('Failed to load orders:', e)
    orders.value = []
  }
  
  try {
    const resAvailable = await api.get<any[]>('/orders/available')
    if (resAvailable && (resAvailable as any).type !== 'ERROR' && Array.isArray(resAvailable.data)) {
      availableOrders.value = resAvailable.data
    }
  } catch (e) {
    console.error('Failed to load available orders:', e)
  } finally {
    loadingOrders.value = false
  }

  // Load errandr profile and earnings
  loadingStats.value = true
  try {
    const [profileRes, earningsRes] = await Promise.all([
      erranders_api.getProfile().catch(() => null),
      erranders_api.getEarnings().catch(() => null),
    ])
    if (profileRes && (profileRes as any).type !== 'ERROR' && profileRes.data) {
      errandrProfile.value = profileRes.data
    }
    if (earningsRes && (earningsRes as any).type !== 'ERROR' && earningsRes.data) {
      earningsData.value = earningsRes.data
    }
  } catch (e) {
    console.error('Failed to load stats:', e)
  } finally {
    loadingStats.value = false
  }

  // Load batch status
  try {
    const res = await api.get('/orders/batch/status')
    if (res && res.data) {
      batchStatus.value = res.data
    }
  } catch (e) {
    console.error('Failed to load batch status:', e)
  }
}

onMounted(loadDashboard)
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>