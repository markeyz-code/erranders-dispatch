<template>
 <div class="space-y-4 md:space-y-6 animate-fade-in max-w-7xl w-full mx-auto pb-10">
 <!-- Header -->
 <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
 <div>
 <h1 class="text-2xl font-bold text-gray-900 tracking-tight mb-1">My Deliveries</h1>
 <p class="text-gray-500 text-sm">Manage your active tasks and view completed deliveries.</p>
 </div>
 <span class="text-sm font-medium text-gray-400">{{ orders.length }} total deliveries</span>
 </div>

 <!-- Search + Filters -->
 <div class="flex flex-col md:flex-row gap-4">
 <div class="flex-1 relative max-w-lg">
 <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <input 
 v-model="searchQuery"
 type="text" 
 placeholder="Search by order ID or store name..." 
 class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A]/30 transition-all"
 />
 </div>
 
 <div class="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
 <button
 v-for="status in filters" 
 :key="status.key" 
 @click="activeFilter = status.key"
 class="px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
 :class="activeFilter === status.key ? 'bg-[#FF5C1A] text-white ' : 'text-gray-500 hover:bg-gray-100 bg-white border border-gray-200'"
 >
 {{ status.label }}
 </button>
 </div>
 </div>

 <!-- Loading -->
 <div v-if="loading" class="space-y-3">
 <div v-for="i in 6" :key="i" class="h-16 bg-white rounded-xl border border-gray-100 animate-pulse"></div>
 </div>

 <!-- Empty State -->
 <div v-else-if="filteredOrders.length === 0" class="bg-white rounded-2xl border border-gray-100 py-20 text-center">
 <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">📦</div>
 <h3 class="text-base font-bold text-gray-900 mb-1">{{ activeFilter === 'all' ? 'No deliveries yet' : `No ${activeFilter} deliveries` }}</h3>
 <p class="text-sm text-gray-400 mb-6">{{ activeFilter === 'all' ? 'Accept orders from the marketplace to get started!' : 'Check back later for updates.' }}</p>
 <NuxtLink v-if="activeFilter === 'all'" to="/" class="inline-block px-4 md:px-4 py-2.5 bg-[#FF5C1A] text-white rounded-xl font-semibold text-sm shadow-[#FF5C1A]/20 hover:brightness-110 transition-all">
 Browse Marketplace
 </NuxtLink>
 </div>

 <!-- Deliveries Table -->
 <div v-else class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
 <div class="overflow-x-auto">
 <table class="w-full text-left">
 <thead>
 <tr class="border-b border-gray-100 bg-gray-50/50">
 <th class="py-3 px-5 text-[11px] font-semibold text-gray-400 tracking-wider">Order</th>
 <th class="py-3 px-5 text-[11px] font-semibold text-gray-400 tracking-wider">Store</th>
 <th class="py-3 px-5 text-[11px] font-semibold text-gray-400 tracking-wider hidden md:table-cell">Drop-off</th>
 <th class="py-3 px-5 text-[11px] font-semibold text-gray-400 tracking-wider text-right">Amount</th>
 <th class="py-3 px-5 text-[11px] font-semibold text-gray-400 tracking-wider text-right">Status</th>
 <th class="py-3 px-2 w-10"></th>
 </tr>
 </thead>
 <tbody class="divide-y divide-gray-50">
 <tr 
 v-for="order in filteredOrders" 
 :key="order._id" 
 @click="selectedOrder = order" 
 class="hover:bg-gray-50/60 transition-colors cursor-pointer group"
 >
 <td class="py-3.5 px-5">
 <div class="flex items-center gap-3">
 <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sm flex-shrink-0">
 {{ statusEmoji(order.status) }}
 </div>
 <div>
 <p class="font-semibold text-sm text-gray-900">#{{ order.orderNumber }}</p>
 <p class="text-[11px] text-gray-400">{{ new Date(order.createdAt).toLocaleDateString() }}</p>
 </div>
 </div>
 </td>
 <td class="py-3.5 px-5">
 <p class="text-sm font-medium text-gray-700 truncate max-w-[140px]">
 {{ order.type === 'custom_errand' ? (order.customer?.firstName ? `${order.customer.firstName}'s Errand` : 'Custom Errand') : (order.vendor?.storeName || 'Unknown Store') }}
 </p>
 </td>
 <td class="py-3.5 px-5 hidden md:table-cell">
 <p class="text-sm text-gray-500 truncate max-w-[180px]">
 {{ order.type === 'custom_errand' ? 'Dynamic Route' : (order.deliveryAddress || 'No Address Provided') }}
 </p>
 </td>
 <td class="py-3.5 px-5 text-right">
 <div class="flex flex-col items-end">
 <p class="text-sm font-medium text-emerald-600 tracking-tight">+₦{{ (order.erranderPayout || order.deliveryFee || 0)?.toLocaleString() }}</p>
 <p class="text-[9px] font-bold text-gray-400 tracking-widest mt-0.5 uppercase">Earnings</p>
 </div>
 </td>
 <td class="py-3.5 px-5 text-right">
 <span :class="getStatusClasses(order.status)" class="text-[10px] font-bold px-2.5 py-1 rounded-lg inline-block capitalize border">
 {{ order.status?.replace(/_/g, ' ') }}
 </span>
 </td>
 <td class="py-3.5 px-2">
 <ChevronRight class="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>

 <!-- Delivery Details Drawer -->
 <SideDrawer :isOpen="!!selectedOrder" @close="selectedOrder = null">
 <template v-if="selectedOrder">
 <div class="flex flex-col items-center justify-center py-4 border-b border-gray-100">
 <div class="w-14 h-14 bg-white rounded-[1.25rem] border border-gray-50 flex items-center justify-center text-2xl mb-3">
 {{ statusEmoji(selectedOrder.status) }}
 </div>
 <h3 class="text-lg font-medium text-gray-900 tracking-tighter">Delivery #{{ selectedOrder.orderNumber }}</h3>
 <span :class="getStatusClasses(selectedOrder.status)" class="mt-2 text-[10px] font-bold px-3 py-1 rounded-xl capitalize border">
 {{ selectedOrder.status?.replace(/_/g, ' ') }}
 </span>
 </div>

 <div class="py-4 space-y-4 md:space-y-6">
 <!-- Route Info -->
 <div class="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-4">
 <p class="text-[10px] font-medium text-gray-400 tracking-widest mb-2">Delivery Intelligence</p>
 
 <div class="space-y-4 relative">
 <div class="absolute left-3 top-4 bottom-4 w-px border-l-2 border-dashed border-gray-200"></div>
 
 <div class="flex items-start gap-4 relative z-10">
 <div class="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[10px] ">🏪</div>
 <div>
 <p class="text-[9px] text-gray-400 font-bold tracking-widest mb-0.5 whitespace-nowrap">Source: Prep Station</p>
 <p class="text-sm font-medium text-gray-900 tracking-tight">{{ selectedOrder.vendor?.storeName || 'Store' }}</p>
 </div>
 </div>
 
 <div class="flex items-start gap-4 relative z-10">
 <div class="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[10px] ">📍</div>
 <div>
 <p class="text-[9px] text-gray-400 font-bold tracking-widest mb-0.5 whitespace-nowrap">Destination: Customer</p>
 <p class="text-sm font-medium text-[#FF5C1A] tracking-tight">{{ selectedOrder.deliveryAddress }}</p>
 <p class="text-[11px] font-medium text-gray-400 mt-0.5">{{ selectedOrder.customer?.firstName }} {{ selectedOrder.customer?.lastName }}</p>
 </div>
 </div>
 </div>
 
 <div class="pt-4 border-t border-gray-100 flex flex-col gap-2">
 <div class="flex justify-between items-center text-[10px] font-bold text-gray-400 tracking-widest">
 <span>Customer Pays</span>
 <span class="text-gray-900">₦{{ selectedOrder.total?.toLocaleString() }}</span>
 </div>
  <div class="flex justify-between items-center">
  <span class="text-xs text-gray-500 font-medium tracking-wider">Your Earnings</span>
  <span class="text-2xl font-medium text-emerald-600 tracking-tight">₦{{ (selectedOrder.erranderPayout || selectedOrder.erranderShare || selectedOrder.deliveryFee || 0).toLocaleString() }}</span>
  </div>
  </div>
 </div>

 <!-- Actions -->
 <NuxtLink 
 :to="`/deliveries/${selectedOrder._id}`" 
 class="w-full px-5 py-3.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all flex items-center justify-center gap-2 group"
 >
 Open Live Tracker <span class="group-hover:translate-x-0.5 inline-block transition-transform">→</span>
 </NuxtLink>
 </div>
 </template>
 </SideDrawer>
 </div>
</template>

<script setup lang="ts">
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { Search, ChevronRight } from 'lucide-vue-next';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import { ref, computed, onMounted } from 'vue';

definePageMeta({
 layout: 'errander'
})

const loading = ref(true);
const orders = ref<any[]>([]);
const activeFilter = ref('all');
const searchQuery = ref('');
const selectedOrder = ref<any>(null);

const filters = [
 { key: 'all', label: 'All' },
 { key: 'active', label: 'Active' },
 { key: 'intercepted', label: 'Intercepted' },
 { key: 'delivered', label: 'Completed' },
];

const filteredOrders = computed(() => {
 let list = orders.value;
  if (activeFilter.value !== 'all') {
  if (activeFilter.value === 'active') {
  list = list.filter(o => !['delivered', 'cancelled', 'interception_pending', 'interception_in_progress'].includes(o.status));
  } else if (activeFilter.value === 'intercepted') {
  list = list.filter(o => ['interception_pending', 'interception_in_progress'].includes(o.status));
  } else {
  list = list.filter(o => o.status === activeFilter.value);
  }
  }
 
 if (searchQuery.value) {
 const q = searchQuery.value.toLowerCase();
 list = list.filter(o => 
 o.orderNumber?.toLowerCase().includes(q) ||
 o.vendor?.storeName?.toLowerCase().includes(q) ||
 o.deliveryAddress?.toLowerCase().includes(q)
 );
 }
 return list;
});

const statusEmoji = (s: string) => ({
 pending: '⏳',
 confirmed: '✅',
 preparing: '👨‍🍳',
 ready_for_pickup: '📦',
 picked_up: '🏃',
 in_transit: '🚀',
 interception_pending: '🔄',
 interception_in_progress: '🏃‍♂️',
 delivered: '🎉',
 cancelled: '❌'
}[s] || '📋');

const getStatusClasses = (s: string) => {
 if (['delivered', 'confirmed'].includes(s)) return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
 if (['in_transit', 'picked_up'].includes(s)) return 'bg-blue-50 text-blue-700 border border-blue-100';
 if (['pending', 'preparing', 'ready_for_pickup'].includes(s)) return 'bg-amber-50 text-amber-700 border border-amber-100';
 if (['interception_pending', 'interception_in_progress'].includes(s)) return 'bg-purple-50 text-purple-700 border border-purple-100';
 if (s === 'cancelled') return 'bg-rose-50 text-rose-700 border border-rose-100';
 return 'bg-gray-50 text-gray-500 border border-gray-100';
}

const loadOrders = async () => {
 try { 
 const res = await api.get<any[]>('/orders/errander');
 if (res && (res as any).type !== 'ERROR' && Array.isArray(res.data)) {
 orders.value = res.data;
 } else {
 orders.value = [];
 }
 }
 catch (e) { console.error(e); orders.value = []; }
 finally { loading.value = false; }
};

onMounted(async () => {
 await loadOrders();
});

useHead({ title: 'My Deliveries - Errandr' });
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
