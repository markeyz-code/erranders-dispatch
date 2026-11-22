<template>
  <div class="space-y-8 animate-fade-in max-w-7xl mx-auto pb-16 from-slate-50/80 via-white to-white   rounded-lg  overflow-hidden">
    <!-- The one card a rider checks before starting: am I on, and what is waiting -->
    <section class="duty-card">
      <div class="duty-top">
        <p class="duty-eyebrow">
          <span class="duty-spark" aria-hidden="true">✦</span>
          Errand Ninja
        </p>
        <button
          type="button"
          class="duty-toggle"
          :class="{ on: isOnDuty }"
          :aria-pressed="isOnDuty"
          :disabled="togglingDuty"
          @click="toggleDuty"
        >
          <span class="duty-knob"></span>
          <span class="duty-state">{{ togglingDuty ? '…' : (isOnDuty ? 'ON' : 'OFF') }}</span>
        </button>
      </div>

      <h2 class="duty-hello">Hello, {{ user?.firstName || 'Rider' }}.</h2>
      <p class="duty-sub">
        {{ isOnDuty ? 'You are on duty and visible for jobs.' : 'You are off duty. Turn this on to receive jobs.' }}
      </p>

      <div class="duty-meta">
        <div>
          <p class="duty-meta-label">Tier</p>
          <p class="duty-meta-value">{{ tierLabel }}</p>
        </div>
        <div>
          <p class="duty-meta-label">Delivered</p>
          <p class="duty-meta-value">{{ stats[0].value }}</p>
        </div>
        <div>
          <p class="duty-meta-label">Open jobs</p>
          <p class="duty-meta-value">{{ activeOrders.length }} for you</p>
        </div>
      </div>
    </section>

    <!-- What the numbers are, quietly, under the card -->
    <div class="quick-stats">
      <div v-for="stat in stats.slice(1)" :key="stat.label" class="quick-stat">
        <p class="quick-value">{{ stat.value }}</p>
        <p class="quick-label">{{ stat.label }}</p>
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
              <span class="text-[10px] font-medium text-parentPrimary uppercase ">Batch mode active</span>
            </div>
            <span v-else-if="activeOrders.length > 0" class="text-[10px] font-semibold text-[#FF5C1A] bg-[#FF5C1A]/5 px-3 py-1 rounded-full border border-[#FF5C1A]/10">In Progress</span>
          </div>

          <div v-if="loadingOrders" class="p-5">
            <div class="h-20 bg-gray-50 rounded-xl animate-pulse"></div>
          </div>
          <div v-else-if="activeOrders.length > 0" class="ad-list">
            <article v-for="order in activeOrders" :key="order._id" class="ad-card">
              <div class="ad-top">
                <p class="ad-ref">#{{ order.orderNumber }}</p>
                <span class="ad-type" :class="order.type === 'custom_errand' ? 'custom' : 'store'">
                  {{ order.type === 'custom_errand' ? 'Custom errand' : 'Store order' }}
                </span>
              </div>

              <p class="ad-route">
                {{ order.type === 'custom_errand' ? (order.customDetails?.pickupLocation || 'Pick up') : (order.vendor?.storeName || 'Store') }}
                <span class="ad-arrow" aria-hidden="true">→</span>
                {{ order.type === 'custom_errand' ? (order.customDetails?.dropoffLocation || 'Drop off') : (order.deliveryAddress || 'Delivery') }}
              </p>

              <div class="ad-chips">
                <span class="ad-chip">{{ statusEmoji(order.status) }} {{ statusLabel(order.status) }}</span>
                <span v-if="getOrderEarnings(order) > 0" class="ad-chip money">₦{{ getOrderEarnings(order).toLocaleString() }}</span>
              </div>

              <NuxtLink :to="`/deliveries/${order._id}`" class="ad-action">
                Manage dispatch
                <ChevronRight class="w-4 h-4" aria-hidden="true" />
              </NuxtLink>
            </article>
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
            <NuxtLink to="/deliveries/pool" class="text-sm font-semibold text-emerald-600 hover:underline">View All →</NuxtLink>
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
                  <span v-else class="text-sm font-bold">CUS</span>
                </div>
                <div>
                  <h4 class="font-semibold text-sm text-gray-900 truncate max-w-[200px] flex items-center gap-2">
                    {{ order.type === 'custom_errand' ? 'Custom Errand' : (order.vendor?.storeName || 'Order') }}
                    <span :class="getOrderTypeColor(order)" class="text-[9px] px-1.5 py-0.5 rounded uppercase border font-bold shrink-0">{{ getOrderTypeLabel(order) }}</span>
                  </h4>
                  <p class="text-sm text-gray-400 line-clamp-1 max-w-[200px]">
                    {{ order.type === 'custom_errand' ? order.customDetails?.dropoffLocation : (order.deliveryAddress || 'Customer Location') }}
                  </p>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <p v-if="order.status === 'negotiating'" class="font-bold text-sm text-amber-600">₦{{ (order.proposedDeliveryFee || order.deliveryFee || 0).toLocaleString() }}</p>
                <p v-else class="font-bold text-sm text-emerald-600">₦{{ getOrderEarnings(order).toLocaleString() }}</p>
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
            <NuxtLink to="/deliveries" class="text-sm font-semibold text-[#FF5C1A] hover:underline">View All →</NuxtLink>
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
                <h4 class="font-semibold text-sm text-gray-900 truncate flex items-center gap-2">
                  {{ order.type === 'custom_errand' ? 'Custom Errand' : (order.vendor?.storeName || 'Order') }} #{{ order.orderNumber }}
                  <span :class="getOrderTypeColor(order)" class="text-[9px] px-1.5 py-0.5 rounded uppercase border font-bold shrink-0">{{ getOrderTypeLabel(order) }}</span>
                </h4>
                <p class="text-sm text-gray-400">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="font-bold text-sm text-emerald-600">+₦{{ getOrderEarnings(order).toLocaleString() }}</p>
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
            <p class="text-sm text-gray-400 font-medium mb-1">Total Earned</p>
            <h3 class="text-2xl font-bold tracking-tight mb-4">₦{{ (earningsData.totalEarnings || 0).toLocaleString() }}</h3>
            
            <div class="space-y-2 mb-6">
              <div class="flex justify-between text-sm font-medium">
                <span class="text-gray-400">Rating</span>
                <span class="text-white">{{ (earningsData.rating || 0).toFixed(1) }} ⭐</span>
              </div>
              <div class="flex justify-between text-sm font-medium">
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
          <p class="text-sm text-gray-400 font-medium mb-3">Your Rating</p>
          <div class="flex items-center gap-0.5 mb-2">
            <span v-for="i in 5" :key="i" class="text-xl" :class="i <= Math.round(errandrProfile?.rating || 0) ? 'text-amber-400' : 'text-gray-200'">★</span>
          </div>
          <div class="flex items-baseline gap-2">
            <h4 class="text-4xl font-bold text-gray-900 tracking-tight">{{ (errandrProfile?.rating || 0).toFixed(1) }}</h4>
            <span class="text-sm text-gray-400 font-medium">/ 5.0</span>
          </div>
          <p v-if="errandrProfile?.rating >= 4.5" class="text-[11px] text-amber-600 font-semibold mt-3 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 inline-block">⭐ Top Rated Rider</p>
        </div>

        <!-- Quick Help -->
        <!-- <div class="  rounded-lg  p-4 ">
          <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
            Need Help?
          </h3>
          <p class="text-sm text-gray-500 mb-4">Get in touch with our support team for any delivery issues.</p>
          <button class="w-full py-3 bg-gray-50 border border-gray-50 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all">
            Contact Support
          </button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { erranders_api } from '@/api_factory/modules/erranders'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'

const { user } = useUser()
const { socket, connectSocket } = useRealtimeSocket()

const getOrderEarnings = (ord: any) => {
  if (!ord) return 0;
  let payout = ord.erranderPayout || ord.erranderShare;
  if (!payout || (ord.deliveryFee >= 350 && payout < 300)) {
    payout = ord.deliveryFee >= 350 ? 300 : (ord.deliveryFee || 150);
  }
  return payout;
};

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

/** Availability, and the tier label a rider recognises. */
const isOnDuty = computed(() => {
  const status = String(errandrProfile.value?.status || (user.value as any)?.status || '').toLowerCase();
  return status === 'available' || status === 'online' || status === 'busy';
})

const tierLabel = computed(() => {
  const tier = errandrProfile.value?.verificationLevel ?? errandrProfile.value?.tier;
  if (tier === undefined || tier === null || tier === '') return 'Tier 1';
  const n = Number(tier);
  return Number.isFinite(n) ? `Tier ${n}` : String(tier);
})

const togglingDuty = ref(false)

const toggleDuty = async () => {
  if (togglingDuty.value) return
  togglingDuty.value = true
  try {
    await erranders_api.toggleOnline()
    const res: any = await erranders_api.getProfile()
    if (res?.data) errandrProfile.value = res.data
  } catch (e) {
    console.error('Could not change availability:', e)
  } finally {
    togglingDuty.value = false
  }
}

const stats = computed(() => [
  { label: 'Deliveries Done', value: earningsData.value.totalDeliveries || orders.value.filter(o => o.status === 'delivered').length || '0', emoji: '🏁', bgClass: 'bg-emerald-50' },
  { label: 'Total Earned', value: `₦${(earningsData.value.totalEarnings || 0).toLocaleString()}`, emoji: '💰', bgClass: 'bg-amber-50' },
  { label: 'Avg. Rating', value: (earningsData.value.rating || errandrProfile.value?.rating || 0).toFixed(1), emoji: '⭐', bgClass: 'bg-purple-50' },
  { label: 'Active Orders', value: orders.value.filter(o => ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit', 'negotiating', 'awaiting_payment'].includes(o.status)).length || '0', emoji: '📦', bgClass: 'bg-blue-50' },
])

const activeOrders = computed(() => {
  return orders.value.filter(o => ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit', 'negotiating', 'awaiting_payment'].includes(o.status))
})

const batchStatus = ref<any>(null)

const recentOrders = computed(() => {
  return orders.value.filter(o => ['delivered', 'cancelled'].includes(o.status)).slice(0, 5)
})

const statusLabel = (s: string) =>
  ({
    pending: 'Awaiting payment',
    confirmed: 'Ready to collect',
    preparing: 'Being prepared',
    ready_for_pickup: 'Ready to collect',
    picked_up: 'Collected',
    in_transit: 'On the way',
    negotiating: 'Negotiating',
    awaiting_payment: 'Awaiting payment',
  } as Record<string, string>)[s] || String(s || '').replace(/_/g, ' ');

const statusEmoji = (s: string) => ({
  pending: '⏳',
  confirmed: '✅',
  preparing: '👨‍🍳',
  ready_for_pickup: '📦',
  picked_up: '🏃',
  in_transit: '🚀',
  delivered: '🎉',
  cancelled: '❌',
  negotiating: '💬',
  awaiting_payment: '💳'
}[s] || '📋')

const getStatusClasses = (s: string) => {
  if (['delivered', 'confirmed'].includes(s)) return 'bg-emerald-50 text-emerald-700';
  if (['in_transit', 'picked_up'].includes(s)) return 'bg-blue-50 text-blue-700';
  if (['pending', 'preparing', 'ready_for_pickup'].includes(s)) return 'bg-amber-50 text-amber-700';
  if (['negotiating', 'awaiting_payment'].includes(s)) return 'bg-indigo-50 text-indigo-700';
  if (s === 'cancelled') return 'bg-rose-50 text-rose-700';
  return 'bg-gray-50 text-gray-500';
}

const getOrderTypeLabel = (order: any) => {
  if (!order) return 'Order'
  if (order.type === 'custom_errand') {
    if (order.customDetails?.description?.includes('[Barter Tx ID:')) {
      return 'Barter Delivery'
    }
    return 'Custom Errand'
  }
  return 'Marketplace'
}

const getOrderTypeColor = (order: any) => {
  if (!order) return 'bg-gray-50 text-gray-700 border-gray-200'
  if (order.type === 'custom_errand') {
    if (order.customDetails?.description?.includes('[Barter Tx ID:')) {
      return 'bg-purple-50 text-purple-700 border-purple-200'
    }
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }
  return 'bg-blue-50 text-blue-700 border-blue-200'
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

const handleNewOrder = (payload: any) => {
  const orderData = payload?.data || payload
  if (!orderData || orderData.type === 'ORDER_ACCEPTED') return
  const id = orderData.orderId || orderData._id
  if (!id) return

  const exists = availableOrders.value.some(o => o._id === id)
  if (!exists) {
    availableOrders.value.unshift({
      _id: id,
      orderNumber: orderData.orderNumber,
      vendor: {
        storeName: orderData.vendorName,
        logo: orderData.vendorLogo,
        address: orderData.vendorAddress
      },
      deliveryAddress: orderData.deliveryAddress,
      total: orderData.total,
      deliveryFee: orderData.deliveryFee,
      erranderPayout: orderData.erranderPayout,
      erranderShare: orderData.erranderShare,
      status: orderData.status,
      type: orderData.type,
      locationType: orderData.locationType,
      proposedDeliveryFee: orderData.proposedDeliveryFee,
      createdAt: orderData.createdAt || new Date().toISOString(),
      customDetails: orderData.customDetails,
    })
  }
}

const handleOrderAccepted = (payload: any) => {
  const orderId = payload?.data?.orderId || payload?.orderId || payload?.data?._id || payload?._id
  if (!orderId) return
  availableOrders.value = availableOrders.value.filter(o => o._id !== orderId)
  loadDashboard()
}

const handleOrderCancelled = (payload: any) => {
  const orderId = payload?.data?.orderId || payload?.orderId || payload?.data?._id || payload?._id
  if (orderId) {
    availableOrders.value = availableOrders.value.filter(o => o._id !== orderId)
  }
  loadDashboard()
}

let dashboardSocket: any = null

watch(() => socket.value, (newSocket) => {
  if (dashboardSocket) {
    dashboardSocket.off('notification:new-order', handleNewOrder)
    dashboardSocket.off('notification:order-accepted', handleOrderAccepted)
    dashboardSocket.off('notification:order-cancelled', handleOrderCancelled)
    dashboardSocket.off('notification:order-status-update', loadDashboard)
  }

  if (newSocket) {
    dashboardSocket = newSocket
    newSocket.on('notification:new-order', handleNewOrder)
    newSocket.on('notification:order-accepted', handleOrderAccepted)
    newSocket.on('notification:order-cancelled', handleOrderCancelled)
    newSocket.on('notification:order-status-update', loadDashboard)
  }
}, { immediate: true })

onMounted(() => {
  loadDashboard();
  connectSocket();
});

onUnmounted(() => {
  if (dashboardSocket) {
    dashboardSocket.off('notification:new-order', handleNewOrder)
    dashboardSocket.off('notification:order-accepted', handleOrderAccepted)
    dashboardSocket.off('notification:order-cancelled', handleOrderCancelled)
    dashboardSocket.off('notification:order-status-update', loadDashboard)
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* The four numbers are the dashboard; give them room and drop the hover-scale, which does nothing on a phone. */
.stat-card {
  padding: 14px;
  border-radius: 14px;
  border: 1px solid #eef0f3;
  background: #fff;
}

.stat-label {
  margin: 10px 0 2px;
  font-size: 12px;
  font-weight: 650;
  color: #9aa1ac;
}

.stat-value {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: #14110d;
}

.duty-card {
  padding: 20px;
  border-radius: 20px;
  background: linear-gradient(160deg, #1b1613 0%, #14110d 60%);
  color: #fff;
}

.duty-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.duty-eyebrow {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #b9b0a4;
}

.duty-spark { color: #ff5c1a; }

.duty-toggle {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 5px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;
}

.duty-toggle.on { background: #ff5c1a; }

.duty-knob {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: #fff;
}

.duty-state {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.duty-hello {
  margin: 18px 0 0;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.duty-sub {
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.45;
  color: #b9b0a4;
}

.duty-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.duty-meta-label {
  margin: 0;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8f877c;
}

.duty-meta-value {
  margin: 4px 0 0;
  font-size: 15px;
  font-weight: 750;
  color: #fff;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.quick-stat {
  padding: 14px;
  border-radius: 14px;
  border: 1px solid #eef0f3;
  background: #fff;
}

.quick-value {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #14110d;
}

.quick-label {
  margin: 3px 0 0;
  font-size: 11.5px;
  font-weight: 650;
  color: #9aa1ac;
}

.ad-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
}

.ad-card {
  padding: 14px;
  border-radius: 14px;
  border: 1px solid #eef0f3;
}

.ad-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ad-ref {
  margin: 0;
  font-size: 13px;
  font-weight: 800;
  color: #14110d;
}

.ad-type {
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 750;
}

.ad-type.custom { background: #fff7ed; color: #b45309; }
.ad-type.store { background: #ecfdf5; color: #047857; }

.ad-route {
  margin: 10px 0 0;
  font-size: 15px;
  font-weight: 650;
  line-height: 1.35;
  color: #14110d;
}

.ad-arrow { color: #b6bcc6; padding: 0 2px; }

.ad-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.ad-chip {
  padding: 4px 9px;
  border-radius: 999px;
  background: #f4f5f7;
  color: #6b7280;
  font-size: 11.5px;
  font-weight: 700;
}

.ad-chip.money { background: #ecfdf5; color: #047857; }

.ad-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  border-radius: 12px;
  background: #14110d;
  color: #fff;
  font-size: 14.5px;
  font-weight: 750;
  text-decoration: none;
}
</style>
