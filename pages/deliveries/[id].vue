<template>
 <div>
  <!-- Loading State -->
  <div v-if="loadingOrder" class="max-w-4xl w-full mx-auto space-y-4 md:space-y-6 md:space-y-10 pb-32 mt-6 flex flex-col items-center justify-center pt-20">
    <Loader2 class="w-10 h-10 animate-spin text-[#FF5C1A] mb-4" />
    <p class="text-gray-500 font-medium">Loading delivery details...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="orderError" class="max-w-4xl w-full mx-auto space-y-4 md:space-y-6 md:space-y-10 pb-32 mt-6 flex flex-col items-center justify-center pt-20">
    <div class="text-4xl mb-4">⚠️</div>
    <h2 class="text-xl font-bold text-gray-900 mb-2">Could not load order</h2>
    <p class="text-gray-500 mb-6">{{ orderError }}</p>
    <button @click="loadOrder" class="px-6 py-2 bg-[#FF5C1A] text-white rounded-lg font-bold hover:bg-orange-600 transition-colors">Try Again</button>
  </div>

  <div class="max-w-4xl w-full mx-auto space-y-4 md:space-y-6 md:space-y-10 pb-32 animate-fade-in mt-6" v-else-if="order">
 <!-- Stunning Header -->
 <div class="relative p-4 md:p-5 rounded-xl md:rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm group">
 <!-- Animated Background Effects -->
 <div class="absolute -right-20 -top-20 w-64 h-64 bg-[#FF5C1A]/10 rounded-full blur-[80px] group-hover:scale-150 group-hover:opacity-70 transition-all duration-1000 ease-in-out" />
 
 <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6 mb-10 relative z-10">
 <div class="space-y-2">
 <div class="inline-flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 ">
 <span class="w-2 h-2 rounded-full bg-[#FF5C1A] animate-pulse"></span>
 <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Delivery Tracking</p>
 </div>
 <div class="flex flex-col gap-1 items-start">
   <h1 class="text-3xl font-black text-gray-900 tracking-tight">Order #{{ order.orderNumber }}</h1>
   <span v-if="order.isGroupOrder" class="inline-block text-[10px] font-bold tracking-widest text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded border border-emerald-100">👥 GROUP ORDER</span>
 </div>
 </div>
 <div class="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 ">
 <StatusBadge :status="order.status" class="scale-110 " />
 </div>
 </div>

 <div class="space-y-4 relative z-10 bg-gray-50 p-5 rounded-2xl border border-gray-100 ">
 <div class="flex items-center justify-between">
 <span class="text-xs font-bold text-gray-500 tracking-wide uppercase">Delivery Progress</span>
 <span class="text-xs font-black text-[#FF5C1A] bg-[#FF5C1A]/10 px-3 py-1 rounded-full border border-[#FF5C1A]/20">Step {{ currentStep + 1 }} of 4</span>
 </div>
 <div class="flex items-center gap-3">
 <div v-for="(step, i) in steps" :key="step" class="flex-1 h-2.5 rounded-full transition-all duration-1000 relative overflow-hidden " :class="currentStep >= i ? 'bg-[#FF5C1A]' : 'bg-gray-200'">
 <div v-if="currentStep === i" class="absolute inset-0 bg-white/30 animate-pulse" />
 </div>
 </div>
 </div>
 </div>

 <div class="grid grid-cols-1 lg:grid-cols-5 gap-5 md:gap-10">
 <!-- Delivery Info & Content -->
 <div class="lg:col-span-3 space-y-4 md:space-y-6">
 <!-- Delivery Points -->
 <div class="bg-white p-4 md:p-4 rounded-2xl border border-gray-100 space-y-5 md:space-y-8 relative group">
 <div class="flex items-start gap-3 md:gap-6 relative">
 <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center text-sm border border-amber-100/20 flex-shrink-0 group-hover:scale-105 transition-transform">🏪</div>
 <div class="min-w-0 pt-0.5 w-full">
 <p class="text-[10px] font-bold text-amber-600 tracking-wider mb-1 uppercase">{{ (order.interception?.status === 'accepted' && !isPrimaryErrander) ? 'Hand-off Location' : 'Pickup Location' }}</p>
 <p class="text-sm font-bold text-gray-900 leading-tight mb-1 truncate">
 {{ (order.interception?.status === 'accepted' && !isPrimaryErrander) ? order.interception.point : (order.type === 'custom_errand' ? (order.customDetails?.pickupLocation || 'Custom Pickup') : order.vendor?.storeName) }}
 </p>
 <p class="text-xs font-medium text-gray-500 mb-2">{{ (order.interception?.status === 'accepted' && !isPrimaryErrander) ? 'Meet the previous errander here' : (order.type === 'custom_errand' ? 'Special Request Pickup' : (order.vendor?.address || 'Vendor Address')) }}</p>
 
 <div v-if="order.type !== 'custom_errand' && order.vendor" class="flex flex-col gap-2 mt-2 w-full sm:w-auto">
   <div v-if="order.vendor?.phone" class="flex gap-2">
     <a :href="`tel:${order.vendor.phone}`" class="flex-1 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[11px] font-bold hover:bg-amber-100 transition-all transform active:scale-95 border border-amber-100 flex items-center justify-center gap-1.5">
       Call Store
     </a>
     <a :href="getWhatsAppLink(order.vendor.phone, 'vendor')" target="_blank" class="flex-1 px-3 py-1.5 bg-[#25D366]/10 text-[#25D366] rounded-lg text-[11px] font-bold hover:bg-[#25D366]/20 transition-all transform active:scale-95 border border-[#25D366]/30 flex items-center justify-center gap-1.5">
       <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
         <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413z" />
       </svg>
       WhatsApp
     </a>
   </div>
   <button 
   @click.stop.prevent="openChat(order.vendor?._id || order.vendor?.owner || order.vendor, order.vendor?.storeName + ' (Store)', order.vendor?.logo || order.vendor?.storeLogo)" 
   class="w-full px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[11px] font-bold hover:bg-amber-100 transition-all transform active:scale-95 border border-amber-100 flex items-center justify-center gap-1.5"
   >
   <MessageSquare class="w-3 h-3" /> In-App Message Store
   </button>
 </div>
 </div>
 </div>
 
 <div class="absolute left-[1.75rem] top-20 bottom-24 w-px border-l-2 border-dashed border-gray-100" />
 
 <div class="flex items-start gap-3 md:gap-6 relative w-full">
    <div class="w-8 h-8 rounded-lg bg-[#FF5C1A]/10 text-[#FF5C1A] flex items-center justify-center text-sm border border-[#FF5C1A]/20 flex-shrink-0 group-hover:scale-105 transition-transform">📍</div>
    <div class="min-w-0 pt-0.5 w-full">
      <p class="text-[10px] font-bold text-[#FF5C1A] tracking-wider mb-1 uppercase">Drop-off Point</p>
      <p class="text-sm font-bold text-gray-900 leading-tight mb-1 truncate">{{ order.customer?.firstName }} {{ order.customer?.lastName }}</p>
      <p class="text-xs font-medium text-gray-500 line-clamp-2 mb-3">{{ order.deliveryAddress }} {{ order.type === 'custom_errand' ? `(${order.customDetails?.dropoffLocation})` : '' }}</p>
      
      <!-- Student Contact Options -->
      <div class="flex flex-col gap-2 mt-2">
        <div v-if="order.customer?.phone" class="flex gap-2">
          <a :href="`tel:${order.customer.phone}`" class="flex-1 px-3 py-1.5 bg-[#FF5C1A]/10 text-[#FF5C1A] rounded-lg text-[11px] font-bold hover:bg-[#FF5C1A]/20 transition-all transform active:scale-95 border border-[#FF5C1A]/30 flex items-center justify-center gap-1.5">
            Call Customer
          </a>
          <a :href="getWhatsAppLink(order.customer.phone, 'student')" target="_blank" class="flex-1 px-3 py-1.5 bg-[#25D366]/10 text-[#25D366] rounded-lg text-[11px] font-bold hover:bg-[#25D366]/20 transition-all transform active:scale-95 border border-[#25D366]/30 flex items-center justify-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>
        <button 
          @click.stop.prevent="openChat(order.customer?._id || order.customer, (order.customer?.firstName ? `${order.customer.firstName} ${order.customer.lastName}` : 'Student') + ' (Customer)')" 
          class="w-full px-3 py-1.5 bg-[#FF5C1A]/5 text-[#FF5C1A] rounded-lg text-[11px] font-bold hover:bg-[#FF5C1A]/10 transition-all transform active:scale-95 border border-[#FF5C1A]/20 flex items-center justify-center gap-1.5"
        >
          <MessageSquare class="w-3 h-3" /> In-App Message Customer
        </button>
      </div>
    </div>
  </div>
  </div>

 <!-- Order Items / Custom Description -->
 <div class="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 relative overflow-hidden group shadow-sm">
 <h3 class="text-sm font-bold text-gray-900 tracking-wider mb-6 flex items-center gap-3 uppercase">
 <div class="w-1.5 h-1.5 rounded-full bg-[#FF5C1A]" /> 
 {{ order.type === 'custom_errand' ? 'Request Details' : (order.packs?.length > 0 ? `Order Content (${order.packs.length} packs)` : `Order Content (${order.items?.length || 0} items)`) }}
 </h3>
 
 
  <div v-if="order.type === 'custom_errand'" class="space-y-4">
    <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-700 leading-relaxed font-bold">
      {{ order.customDetails?.description }}
    </div>
    
    <div v-if="order.pendingTopupAmount > 0" class="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3">
      <Loader2 class="w-5 h-5 text-orange-500 animate-spin" />
      <div>
        <p class="text-xs font-bold text-orange-800">Waiting for Student...</p>
        <p class="text-[10px] text-orange-600 font-medium mt-0.5">They need to authorize the extra ₦{{ order.pendingTopupAmount.toLocaleString() }} before you buy.</p>
      </div>
    </div>
    
    <div class="flex items-center justify-between p-4 bg-[#FF5C1A]/5 rounded-xl border border-[#FF5C1A]/10">
      <span class="text-sm font-bold text-[#FF5C1A] uppercase tracking-widest">Est. Item Cost</span>
      <span class="text-sm font-bold text-[#FF5C1A]">₦{{ order.customDetails?.estimatedItemCost?.toLocaleString() || 0 }}</span>
    </div>
    
    <div v-if="order.status === 'confirmed' || order.status === 'preparing'" class="flex gap-2">
      <button 
        @click="showCancelModal = true"
        class="flex-1 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 border border-red-200 transition-all"
      >
        Cancel Errand (Item Unavailable)
      </button>
      <button 
        @click="showTopupModal = true"
        :disabled="order.pendingTopupAmount > 0"
        class="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 border border-blue-200 transition-all disabled:opacity-50"
      >
        Request Extra Funds
      </button>
    </div>
  </div>

 <div v-else class="space-y-3">
  <!-- Packs Rendering -->
  <template v-if="order.packs && order.packs.length > 0">
    <div v-for="pack in order.packs" :key="pack.name" class="mb-6">
      <h4 class="text-[11px] font-bold text-[#FF5C1A] uppercase tracking-widest mb-3 pl-1">{{ pack.name || 'Pack' }}</h4>
      <div class="space-y-3">
        <div v-for="item in pack.items" :key="item.name" class="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#FF5C1A]/30 transition-colors">
         <div class="flex items-start justify-between">
         <div>
         <span class="text-sm font-bold text-gray-900 tracking-tight">{{ item.name }}</span>
         <p v-if="item.customizations?.length" class="text-[10px] font-medium text-gray-500 mt-1">Base: ₦{{ item.price?.toLocaleString() || 0 }}</p>
         </div>
         <div class="flex flex-col items-end gap-1">
         <span class="text-sm font-bold text-[#FF5C1A] px-2.5 py-1 bg-[#FF5C1A]/10 rounded-md border border-[#FF5C1A]/20">x{{ item.quantity || item.qty }}</span>
         <span class="text-xs font-bold text-gray-700">₦{{ item.price?.toLocaleString() || 0 }}</span>
         </div>
         </div>
         
         <div v-if="item.customizations?.length" class="mt-3 mb-2 pl-3 border-l-2 border-[#FF5C1A]/20 space-y-1.5">
         <p v-for="(c, cIdx) in getGroupedCustomizations(item.customizations)" :key="cIdx" class="text-[11px] text-gray-500 flex justify-between font-medium">
         <span class="truncate flex items-center gap-1">
         <span class="text-gray-300">+</span>
         {{ c.quantity > 1 ? c.quantity + 'x ' : '' }}{{ c.name }}
         </span>
         <span v-if="c.price > 0" class="text-gray-700 shrink-0">+₦{{ c.price.toLocaleString() }}</span>
         </p>
         </div>
         
         <div class="flex justify-end mt-2 pt-2 border-t border-gray-200">
         <span class="text-xs font-bold text-gray-900">Total: ₦{{ (item.subtotal || (item.price * (item.quantity || item.qty))).toLocaleString() }}</span>
         </div>

         <div v-if="['confirmed', 'preparing'].includes(order.status) && item.status !== 'unavailable' && item.status !== 'substituted'" class="flex gap-2 mt-3 pt-3 border-t border-gray-200">
           <button @click="markItemUnavailable(item)" class="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-100 border border-red-200 transition-all">Mark Unavailable</button>
           <button @click="openSubstituteModal(item)" class="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold hover:bg-blue-100 border border-blue-200 transition-all">Suggest Substitute</button>
         </div>
         <div v-if="item.status === 'unavailable'" class="mt-3 pt-2 border-t border-red-100">
           <span class="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">❌ Unavailable & Refunded</span>
         </div>
         <div v-if="item.status === 'substituted'" class="mt-3 pt-2 border-t border-blue-100">
           <span class="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">🔄 Substituted</span>
         </div>

        </div>
      </div>
    </div>
  </template>

  <!-- Fallback Legacy Items Rendering -->
  <template v-else>
   <div v-for="item in order.items" :key="item._id" class="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#FF5C1A]/30 transition-colors">
   <div class="flex items-start justify-between">
   <div>
   <span class="text-sm font-bold text-gray-900 tracking-tight">{{ item.name }}</span>
   <p v-if="item.customizations?.length" class="text-[10px] font-medium text-gray-500 mt-1">Base: ₦{{ item.price?.toLocaleString() || 0 }}</p>
   </div>
   <div class="flex flex-col items-end gap-1">
   <span class="text-sm font-bold text-[#FF5C1A] px-2.5 py-1 bg-[#FF5C1A]/10 rounded-md border border-[#FF5C1A]/20">x{{ item.quantity || item.qty }}</span>
   <span class="text-xs font-bold text-gray-700">₦{{ item.price?.toLocaleString() || 0 }}</span>
   </div>
   </div>
   
   <div v-if="item.customizations?.length" class="mt-3 mb-2 pl-3 border-l-2 border-[#FF5C1A]/20 space-y-1.5">
   <p v-for="(c, cIdx) in getGroupedCustomizations(item.customizations)" :key="cIdx" class="text-[11px] text-gray-500 flex justify-between font-medium">
   <span class="truncate flex items-center gap-1">
   <span class="text-gray-300">+</span>
   {{ c.quantity > 1 ? c.quantity + 'x ' : '' }}{{ c.name }}
   </span>
   <span v-if="c.price > 0" class="text-gray-700 shrink-0">+₦{{ c.price.toLocaleString() }}</span>
   </p>
   </div>
   
   <div class="flex justify-end mt-2 pt-2 border-t border-gray-200">
   <span class="text-xs font-bold text-gray-900">Total: ₦{{ (item.subtotal || (item.price * (item.quantity || item.qty))).toLocaleString() }}</span>
   </div>

         <div v-if="['confirmed', 'preparing'].includes(order.status) && item.status !== 'unavailable' && item.status !== 'substituted'" class="flex gap-2 mt-3 pt-3 border-t border-gray-200">
           <button @click="markItemUnavailable(item)" class="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-100 border border-red-200 transition-all">Mark Unavailable</button>
           <button @click="openSubstituteModal(item)" class="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold hover:bg-blue-100 border border-blue-200 transition-all">Suggest Substitute</button>
         </div>
         <div v-if="item.status === 'unavailable'" class="mt-3 pt-2 border-t border-red-100">
           <span class="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">❌ Unavailable & Refunded</span>
         </div>
         <div v-if="item.status === 'substituted'" class="mt-3 pt-2 border-t border-blue-100">
           <span class="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">🔄 Substituted</span>
         </div>

   </div>
  </template>
 </div>
 </div>

 <!-- Delivery Location (Interactive) -->
 <div class="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden relative group h-[300px]">
  <MapboxMap 
    v-if="mapboxToken" 
    :order="order" :mapbox-token="mapboxToken" 
    :errander-location="currentLocation" 
  />
  <div v-else class="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-4 text-center">
    <Loader2 class="w-8 h-8 animate-spin text-gray-400 mb-2" />
    <p class="text-sm font-bold text-gray-400">Loading map...</p>
  </div>
 </div>
 </div>

 <!-- Sidebar: Actions & Customer -->
 <div class="lg:col-span-2 space-y-4 md:space-y-6"> 
 <!-- Customer Details Card -->
 <div class="bg-gradient-to-b from-gray-50 to-white p-4 md:p-5 rounded-xl md:rounded-3xl border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 hover: transition-all duration-500 relative overflow-hidden">
 <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500"></div>
 
 <div class="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-4 group-hover:rotate-6 transition-transform border-4 border-white relative overflow-hidden">
 <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
 {{ order.customer?.firstName?.[0] }}{{ order.customer?.lastName?.[0] }}
 </div>
 
 <p class="text-[9px] font-black text-teal-600 uppercase tracking-[0.2em] mb-2 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 ">Primary Contact</p>
 <h4 class="text-lg font-black text-gray-900 mb-2 truncate w-full tracking-tight">{{ order.customer?.firstName }} {{ order.customer?.lastName }}</h4>
 <div v-if="order.customer?.gender" class="text-xs font-bold text-gray-500 mb-6 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 inline-flex items-center">
   {{ order.customer.gender === 'Male' ? '🙋🏽‍♂️ MALE' : (order.customer.gender === 'Female' ? '🙋🏽‍♀️ FEMALE' : '👤 ' + order.customer.gender.toUpperCase()) }}
 </div>
 <div v-else class="mb-6"></div>
 
 <div class="flex flex-col gap-3 w-full">
 <div class="flex gap-2 w-full">
   <a :href="`tel:${order.customer?.phone}`" class="flex-1 py-3.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-600 hover:text-white hover: hover:shadow-emerald-500/20 transition-all transform active:scale-95 border border-emerald-200 flex items-center justify-center gap-2">
     <Phone class="w-4 h-4" /> Call
   </a>
   <a v-if="order.customer?.phone" :href="getWhatsAppLink(order.customer.phone, 'customer')" target="_blank" class="flex-1 py-3.5 bg-[#25D366]/10 text-[#25D366] rounded-xl text-sm font-bold hover:bg-[#25D366]/20 transition-all transform active:scale-95 border border-[#25D366]/30 flex items-center justify-center gap-2">
     <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413z" />
     </svg>
     WhatsApp
   </a>
 </div>
 <button @click.stop.prevent="openChat(order.customer?._id || order.customer, order.customer?.firstName ? `${order.customer.firstName} ${order.customer.lastName}` : 'Student', order.customer?.avatar)" class="w-full py-3.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white hover: hover:shadow-blue-500/20 transition-all transform active:scale-95 border border-blue-200 flex items-center justify-center gap-2">
 <MessageSquare class="w-4 h-4" /> In-App Message
 </button>
 </div>
 </div>

  <!-- Awaiting Payment -->
  <div v-if="order.status === 'awaiting_payment'" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 md:p-5 flex flex-col items-center text-center mt-6">
    <h3 class="text-xl font-black text-emerald-900 tracking-tight mb-2">Offer Accepted!</h3>
    <p class="text-sm font-medium text-emerald-700 leading-relaxed">The student has accepted your offer of ₦{{ order.deliveryFee?.toLocaleString() }}. The system is now waiting for them to make a secure payment.</p>
    
    <div class="w-full flex items-center justify-center p-3 bg-white/50 rounded-xl border border-emerald-100/50 mt-4">
      <div class="flex items-center gap-2">
        <Loader2 class="w-4 h-4 text-emerald-500 animate-spin" />
        <span class="text-xs font-bold text-emerald-800">Waiting for payment...</span>
      </div>
    </div>
  </div>

  <!-- P2P Payment Confirmation -->
  <div v-if="order.status === 'awaiting_payment_confirmation'" class="bg-blue-50 border border-blue-200 rounded-2xl p-4 md:p-5 flex flex-col items-center text-center mt-6">
   <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
     <Check class="w-6 h-6" />
   </div>
   <h3 class="text-blue-900 font-bold text-lg mb-1">Payment Sent by Student</h3>
   <p class="text-blue-700 text-sm mb-4">The student has indicated they have transferred <strong>₦{{ order.total?.toLocaleString() }}</strong> to your bank account. Please check your banking app.</p>
   
   <div v-if="order.customDetails?.proofOfPayment" class="w-full mb-4 bg-white rounded-xl overflow-hidden border border-blue-100 p-2">
     <p class="text-xs font-bold text-blue-900 mb-2 text-left">Proof of Payment:</p>
     <img :src="order.customDetails.proofOfPayment" class="w-full h-auto rounded-lg" alt="Proof of payment" />
   </div>
   
   <button @click="confirmP2PPayment" :disabled="confirmingPayment" class="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all">
     <Loader2 v-if="confirmingPayment" class="w-5 h-5 animate-spin" />
     <span v-else>✅</span>
     {{ confirmingPayment ? 'CONFIRMING...' : 'I Have Received The Money' }}
   </button>
 </div>

  <!-- Vendor Payment Section -->
  <div v-if="order.type === 'custom_errand' && order.itemCostDisbursementStatus === 'pending' && (order.status === 'confirmed' || order.status === 'ready_for_pickup' || order.status === 'picked_up')" class="bg-white border-2 border-[#FF5C1A] rounded-2xl p-4 md:p-5 flex flex-col items-center mt-6 shadow-md relative overflow-hidden">
    <div class="absolute top-0 right-0 w-16 h-16 bg-[#FF5C1A]/10 rounded-bl-full flex items-center justify-center">
      <span class="text-2xl ml-4 mb-4">💳</span>
    </div>
    
    <h3 class="text-[#FF5C1A] font-bold text-lg mb-2 self-start">Pay the Vendor</h3>
    <p class="text-gray-600 text-sm mb-4 self-start leading-relaxed text-left">
      The customer's payment is held securely in the system. 
      You need to transfer <strong>₦{{ ((order.customDetails?.estimatedItemCost || 0) + (order.customDetails?.itemCostBuffer || 0)).toLocaleString() }}</strong> directly to the vendor's bank account.
    </p>

    <!-- Photo Upload Section -->
    <div class="w-full mb-4">
      <label class="block text-xs font-bold text-gray-700 mb-1">1. Take a photo of the purchased items</label>
      <button v-if="!itemsPhotoUrl" @click="cameraTarget = 'items'; isCameraModalOpen = true" :disabled="uploadingItemsPhoto" class="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-colors">
        <Loader2 v-if="uploadingItemsPhoto" class="w-6 h-6 animate-spin text-[#FF5C1A]" />
        <Camera v-else class="w-6 h-6 text-[#FF5C1A]" />
        <span class="text-sm font-semibold">{{ uploadingItemsPhoto ? 'Uploading...' : 'Tap to snap photo' }}</span>
      </button>
      <div v-else class="relative w-full rounded-xl overflow-hidden border border-gray-200 group">
        <img :src="itemsPhotoUrl" class="w-full h-32 object-cover" />
        <button @click="itemsPhotoUrl = ''" class="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600">
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="w-full mb-4">
      <label class="block text-xs font-bold text-gray-700 mb-1">2. Vendor Bank</label>
      <select v-model="vendorBankForm.bankCode" class="w-full bg-gray-50 text-sm py-3 px-4 rounded-xl border border-gray-200 focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 outline-none">
        <option value="" disabled>Select Bank...</option>
        <option v-for="bank in vendorBanks" :key="bank.code" :value="bank.code">{{ bank.name }}</option>
      </select>
    </div>
    
    <div class="w-full mb-4">
      <label class="block text-xs font-bold text-gray-700 mb-1">3. Account Number</label>
      <div class="relative">
        <input v-model="vendorBankForm.accountNumber" @input="resolveVendorAccount" type="text" maxlength="10" placeholder="0123456789" class="w-full bg-gray-50 text-sm py-3 px-4 rounded-xl border border-gray-200 focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 outline-none font-mono" />
        <Loader2 v-if="resolvingVendorAccount" class="absolute right-3 top-3 w-5 h-5 text-[#FF5C1A] animate-spin" />
      </div>
    </div>

    <div v-if="vendorBankForm.accountName" class="w-full p-3 bg-green-50 border border-green-200 rounded-xl mb-4">
      <p class="text-xs text-green-700 font-bold mb-1">Verified Account Name:</p>
      <p class="text-sm text-green-900 font-black">{{ vendorBankForm.accountName }}</p>
    </div>

    <div v-if="vendorBankForm.accountName" class="w-full mb-4">
      <label class="block text-xs font-bold text-gray-700 mb-1">4. Amount to Transfer (₦)</label>
      <input 
        type="text" 
        :value="vendorBankForm.amount ? vendorBankForm.amount.toLocaleString() : ''" 
        @input="e => { 
          const val = e.target.value.replace(/\\D/g, ''); 
          vendorBankForm.amount = val ? parseInt(val, 10) : 0;
          e.target.value = vendorBankForm.amount ? vendorBankForm.amount.toLocaleString() : '';
        }"
        placeholder="Enter exact amount" 
        class="w-full bg-gray-50 text-sm py-3 px-4 rounded-xl border border-gray-200 focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 outline-none" 
      />
      <p class="text-[10px] text-gray-500 mt-1">Maximum allowed: ₦{{ ((order.customDetails?.estimatedItemCost || 0) + (order.customDetails?.itemCostBuffer || 0)).toLocaleString() }}</p>
      <p v-if="vendorBankForm.amount > ((order.customDetails?.estimatedItemCost || 0) + (order.customDetails?.itemCostBuffer || 0))" class="text-xs text-red-500 mt-1 font-semibold">Amount exceeds maximum allowed</p>
    </div>
    
    <button 
      @click="isConfirmVendorPaymentModalOpen = true" 
      :disabled="!isVendorAccountVerified || !itemsPhotoUrl || !vendorBankForm.amount || vendorBankForm.amount <= 0 || vendorBankForm.amount > ((order.customDetails?.estimatedItemCost || 0) + (order.customDetails?.itemCostBuffer || 0))" 
      class="w-full py-3.5 bg-[#FF5C1A] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#E04D12] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
    >
      Pay Vendor Now
    </button>
  </div>
  
  <div v-else-if="order.type === 'custom_errand' && order.itemCostDisbursementStatus === 'transferred'" class="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 mt-6">
    <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
      <Check class="w-5 h-5" />
    </div>
    <div>
      <p class="text-green-900 font-bold text-sm">Vendor has been paid!</p>
      <p class="text-green-700 text-xs">₦{{ order.actualItemCost?.toLocaleString() || ((order.customDetails?.estimatedItemCost || 0) + (order.customDetails?.itemCostBuffer || 0)).toLocaleString() }} transferred successfully.</p>
    </div>
  </div>

 <!-- Status Update Actions -->
 <div v-if="order.status === 'confirmed' || order.status === 'ready_for_pickup' || order.status === 'picked_up' || order.status === 'interception_in_progress'" class="space-y-4">
 <div v-if="order.status === 'confirmed' || order.status === 'ready_for_pickup'" class="animate-bounce-subtle space-y-2">
 <button @click="updateStatus('picked_up')" :disabled="updatingStatus" class="w-full py-3 bg-[#FF5C1A] text-white rounded-lg text-sm font-semibold hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 transition-all flex items-center justify-center gap-2 group">
 <Loader2 v-if="updatingStatus" class="w-4 h-4 animate-spin" />
 <span v-else class="text-lg group-hover:rotate-12 transition-transform">📦</span> 
 <template v-if="order.type === 'custom_errand'">
   {{ updatingStatus ? 'UPDATING...' : 'I have picked up the item' }}
 </template>
 <template v-else>
   {{ updatingStatus ? 'UPDATING...' : 'Confirm Food Pickup' }}
 </template>
 </button>
 <p v-if="order.type === 'custom_errand'" class="text-[10px] text-gray-400 text-center font-medium px-4 leading-tight">
  Only click this button AFTER you have physically arrived at the location and picked up the item.
 </p>
 <p v-else class="text-[10px] text-gray-400 text-center font-medium px-4 leading-tight">
  Only click this after you have collected the food from the vendor.
 </p>
 </div>
 
 <div v-if="(order.status === 'picked_up' || order.status === 'interception_in_progress') && isActiveErrander" class="space-y-3">
 <button @click="updateStatus('in_transit')" :disabled="updatingStatus" class="w-full py-3 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 transition-all flex items-center justify-center gap-2 group">
 <Loader2 v-if="updatingStatus" class="w-4 h-4 animate-spin" />
 <span v-else class="text-lg group-hover:scale-110 transition-transform">🚀</span> 
 {{ updatingStatus ? 'UPDATING...' : 'Start Delivery' }}
 </button>
 <p class="text-xs text-gray-400 text-center font-medium">Update status once you depart.</p>
 </div>
 </div>

 <!-- Request Hand-off Action -->
 <div v-if="(order.status === 'picked_up' || order.status === 'in_transit') && !order.interception && isPrimaryErrander" class="mt-6 border-t border-gray-100 pt-6">
   <button @click="isHandoffModalOpen = true" class="w-full py-3 bg-purple-50 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-100 transform active:scale-95 transition-all flex items-center justify-center gap-2 border border-purple-200">
     <span class="text-lg">🤝</span> 
     Request Hand-off (Interception)
   </button>
   <p class="text-xs text-gray-400 text-center font-medium mt-2 leading-tight">Need someone else to complete the delivery? You will split the earnings (60:40).</p>
 </div>
 
 <div v-if="order.interception?.status === 'pending' && isPrimaryErrander" class="mt-6 bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center">
   <div class="text-3xl mb-2 animate-bounce">⏳</div>
   <h3 class="text-purple-900 font-bold text-sm mb-1">Hand-off Requested</h3>
   <p class="text-purple-700 text-xs mb-3">Waiting for another errander to accept the hand-off.</p>
 </div>

 <div v-if="(order.interception?.status === 'accepted' || order.interception?.status === 'completed') && isPrimaryErrander" class="mt-6">
    <!-- If order is delivered, show completion card for primary errander -->
    <div v-if="order.status === 'delivered'" class="bg-emerald-500 rounded-2xl p-4 md:p-5 text-center space-y-4 md:space-y-6 relative overflow-hidden group border border-white/10">
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-90" />
      <div class="absolute -right-16 -bottom-16 w-38 h-38 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
      <div class="relative z-10 space-y-4 md:space-y-6">
        <div class="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto text-3xl border border-emerald-50 text-emerald-600 transform rotate-6 animate-pulse">💰</div>
        <div>
          <h3 class="text-white font-medium text-2xl mb-3">Delivery Completed</h3>
          <p class="text-white/90 font-medium text-xl">+ ₦{{ myEarnings?.toLocaleString() }} Earned</p>
          <p class="text-emerald-200 text-xs font-bold mt-1">(Your 60% share — Hand-off split)</p>
        </div>
        <div class="max-w-xs mx-auto">
          <p class="text-emerald-100 text-xs font-medium mb-6">Funds have been added to your wallet.</p>
          <NuxtLink to="/deliveries" class="block w-full py-3 bg-white text-emerald-600 rounded-lg font-bold text-sm hover:bg-emerald-50 active:scale-95 transition-all">Return to Deliveries</NuxtLink>
        </div>
      </div>
    </div>
    <!-- If order is still in progress, show hand-off accepted status -->
    <div v-else class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
      <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-3 mx-auto">
        <span class="text-xl">🤝</span>
      </div>
      <h3 class="text-emerald-900 font-bold text-sm mb-1">Hand-off Accepted!</h3>
      <p class="text-emerald-700 text-xs mb-2">Another errander is on their way to complete the delivery.</p>
      <p class="text-emerald-600 text-[10px] font-bold mt-3 bg-emerald-100 px-3 py-1.5 rounded-lg inline-block">You'll earn 60% (₦{{ Math.round((order.erranderPayout || order.deliveryFee || 0) * 0.6).toLocaleString() }}) when delivered</p>
    </div>
  </div>

 <!-- Premium Verification Interface -->
 <div v-if="(order.status === 'in_transit' || order.status === 'interception_in_progress') && isActiveErrander" class="bg-white rounded-xl md:rounded-3xl p-4 md:p-5 space-y-4 md:space-y-6 relative overflow-hidden group border border-gray-100 shadow-sm">
 <div class="absolute -right-32 -top-32 w-64 h-64 bg-[#FF5C1A]/5 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000" />
 
 <div class="text-center space-y-2 relative z-10">
 <h3 class="text-[#FF5C1A] text-2xl font-black tracking-tight leading-none">Security PIN</h3>
 <p class="text-gray-500 text-xs font-bold tracking-[0.1em] uppercase">Request the 4-digit code from the user</p>
 </div>
 
 <div class="flex justify-center gap-3 relative z-10 px-4">
    <input
      v-for="(digit, index) in 4"
      :key="index"
      :ref="(el) => { if (el) pinInputs[index] = el }"
      v-model="pinArray[index]"
      @input="onPinInput(index, $event)"
      @keydown="onPinKeydown(index, $event)"
      @paste="onPinPaste"
      type="text"
      inputmode="text"
      maxlength="1"
      placeholder="•"
      class="w-16 h-20 text-center text-4xl font-black text-gray-900 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#FF5C1A] focus:ring-4 focus:ring-[#FF5C1A]/10 focus:bg-white focus:outline-none transition-all placeholder:text-gray-300 uppercase shadow-inner"
    />
  </div>
 
 <button 
 @click="completeOrder" 
 :disabled="verificationCode.length !== 4 || completing"
 class="w-full py-2 bg-[#FF5C1A] text-white rounded-xl text-sm font-black shadow-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all relative z-10 group active:scale-95"
 >
 <Loader2 v-if="completing" class="w-5 h-5 animate-spin flex-shrink-0" />
 <span v-else class="text-lg group-hover:scale-110 transition-transform">✅</span> 
 {{ completing ? 'VERIFYING SECURE PIN...' : 'Finalize Secure Delivery' }}                                                       
 </button>
 
 <div class="pt-6 mt-6 border-t border-gray-100 text-center relative z-10 space-y-3">
 <p class="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Customer unavailable?</p>
 <label class="block w-full cursor-pointer py-3.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 hover:border-gray-300 disabled:opacity-50 transition-all active:scale-95">
 
 <div class="flex items-center justify-center gap-2">
 <Loader2 v-if="uploadingDropoff" class="w-4 h-4 animate-spin text-[#FF5C1A]" />
 <span v-else class="text-lg opacity-80">📸</span>
 <span :class="uploadingDropoff ? 'text-[#FF5C1A]' : ''">{{ uploadingDropoff ? 'UPLOADING PROOF...' : 'Contactless Drop-off' }}</span>
 </div>
 </label>
 </div>
 </div>

 <!-- Delivery Completed State -->
 <div v-if="order.status === 'delivered' && !isPrimaryErrander || (order.status === 'delivered' && isPrimaryErrander && !isInterceptionOrder)" class="bg-emerald-500 rounded-2xl p-4 md:p-5 text-center space-y-4 md:space-y-6 relative overflow-hidden group border border-white/10">
 <div class="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-90" />
 <div class="absolute -right-16 -bottom-16 w-38 h-38 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
 
 <div class="relative z-10 space-y-4 md:space-y-6">
 <div class="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto text-3xl border border-emerald-50 text-emerald-600 transform rotate-6 animate-pulse">💰</div>
 <div>
 <h3 class="text-white font-medium text-2xl mb-3">Delivery Completed</h3>
 <p v-if="order.type !== 'custom_errand'" class="text-white/90 font-medium text-xl">+ ₦{{ myEarnings?.toLocaleString() }} Earned</p>
 <p v-if="isInterceptionOrder && order.type !== 'custom_errand'" class="text-emerald-200 text-xs font-bold mt-1">(Your {{ isActiveErrander ? '40%' : '60%' }} share — Hand-off split)</p>
 <p v-if="order.type === 'custom_errand'" class="text-white/90 font-medium text-xl">Custom Errand Delivered ✅</p>
 </div>
 
 <div class="max-w-xs mx-auto">
 <p v-if="order.type !== 'custom_errand'" class="text-emerald-100 text-xs font-medium mb-6">Funds have been added to your wallet.</p>
 <p v-else class="text-emerald-100 text-xs font-medium mb-6">The student paid you directly for this errand. No wallet credit applied.</p>
 
 <NuxtLink to="/deliveries" class="block w-full py-3 bg-white text-emerald-600 rounded-lg font-bold text-sm hover:bg-emerald-50 active:scale-95 transition-all">
 Return to Deliveries
 </NuxtLink>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- Order Chat Component -->
 <OrderChat
 v-if="order"
 :is-open="isChatOpen"
 :order-id="order._id"
 :current-user-id="user?._id || ''"
 :receiver-id="chatReceiverId"
 :receiver-name="chatReceiverName"
 :receiver-avatar="chatReceiverAvatar"
 @close="isChatOpen = false"
 />
 </div>
 </div>

  <!-- Vendor Payment Confirmation Modal -->
  <UiModal
    :is-open="isConfirmVendorPaymentModalOpen"
    title="Confirm Vendor Payment"
    description="Please verify the vendor details"
    size="sm"
    @close="isConfirmVendorPaymentModalOpen = false"
  >
    <div class="flex flex-col items-center text-center py-4">
      <div class="w-16 h-16 rounded-full bg-[#FF5C1A]/10 border border-[#FF5C1A]/20 flex items-center justify-center mb-4">
        <span class="text-3xl">💸</span>
      </div>
      <h4 class="text-lg font-bold text-gray-900 mb-2">Transfer to Vendor?</h4>
      <p class="text-sm text-gray-500 leading-relaxed max-w-[260px]">
        You are about to transfer 
        <strong class="text-gray-900">₦{{ vendorBankForm.amount?.toLocaleString() }}</strong> 
        to <strong class="text-gray-900">{{ vendorBankForm.accountName }}</strong> ({{ vendorBankForm.bankName }}). 
        This cannot be undone.
      </p>
    </div>

    <template #footer>
      <button 
        @click="isConfirmVendorPaymentModalOpen = false" 
        class="px-5 py-3 w-full rounded-xl bg-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-200 transition-colors"
      >
        Cancel
      </button>
      <button 
        @click="executeVendorPayment" 
        :disabled="submittingVendorPayment"
        class="px-6 py-3 w-full rounded-xl bg-[#FF5C1A] text-center text-white font-bold text-sm hover:bg-[#E04D12] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Loader2 v-if="submittingVendorPayment" class="w-4 h-4 animate-spin" />
        <span>Yes, Pay Vendor</span>
      </button>
    </template>
  </UiModal>

  <!-- P2P Payment Confirmation Modal -->
  <UiModal
    :is-open="isConfirmPaymentModalOpen"
    title="Confirm Receipt"
    description="Please verify you've received the money"
    size="sm"
    @close="isConfirmPaymentModalOpen = false"
  >
    <div class="flex flex-col items-center text-center py-4">
      <div class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
        <Check class="w-8 h-8 text-blue-600" />
      </div>
      <h4 class="text-lg font-bold text-gray-900 mb-2">Are you absolutely sure?</h4>
      <p class="text-sm text-gray-500 leading-relaxed max-w-[260px]">
        You are confirming that you have received exactly 
        <strong class="text-gray-900">₦{{ order?.total?.toLocaleString() }}</strong> 
        in your bank account. This action cannot be undone.
      </p>
    </div>

    <template #footer>
      <button 
        @click="isConfirmPaymentModalOpen = false" 
        class="px-5 py-3 w-full rounded-xl bg-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-100 transition-colors"
      >
        Cancel
      </button>
      <button 
        @click="executeConfirmP2PPayment" 
        :disabled="confirmingPayment"
        class="px-6 py-3 w-full rounded-xl bg-blue-600 text-center text-white font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Loader2 v-if="confirmingPayment" class="w-4 h-4 animate-spin" />
        <span>Yes, I got it</span>
      </button>
    </template>
  </UiModal>

  <!-- Request Hand-off Modal -->
  <UiModal
    :is-open="isHandoffModalOpen"
    title="Request Hand-off"
    description="Set an interception point for another errander to pick up the item."
    size="sm"
    @close="isHandoffModalOpen = false"
  >
    <div class="space-y-4 py-4">
      <div class="bg-purple-50 border border-purple-100 p-3 rounded-lg flex gap-3 text-sm text-purple-800">
        <span class="text-xl">⚠️</span>
        <p>You will receive <strong>60%</strong> of the delivery fee, and the second errander will receive <strong>40%</strong>.</p>
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-700 mb-1">Interception Location</label>
        <input v-model="handoffLocation" placeholder="E.g. Main Gate, Male Hostel B..." class="w-full bg-gray-50 text-sm py-3 px-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-700 mb-1">Additional Note (Optional)</label>
        <textarea v-model="handoffNote" rows="2" placeholder="E.g. I am waiting near the security post" class="w-full bg-gray-50 text-sm py-3 px-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"></textarea>
      </div>
    </div>
    <template #footer>
      <button @click="isHandoffModalOpen = false" class="px-5 py-3 w-full rounded-xl bg-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-200 transition-colors">Cancel</button>
      <button @click="submitHandoff" :disabled="!handoffLocation || requestingHandoff" class="px-6 py-3 w-full rounded-xl bg-purple-600 text-center text-white font-bold text-sm hover:bg-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
        <Loader2 v-if="requestingHandoff" class="w-4 h-4 animate-spin" />
        <span>Request Interception</span>
      </button>
    </template>
  </UiModal>

  <!-- Camera Modal -->
  <UiCameraModal 
    :is-open="isCameraModalOpen" 
    @close="isCameraModalOpen = false" 
    @capture="handleCapturedPhoto" 
  />

  <!-- Substitute Modal -->
  <div v-if="showSubstituteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeSubstituteModal"></div>
    <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
      <div class="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 class="text-lg font-black text-gray-900 tracking-tight">Suggest Substitute</h3>
        <button @click="closeSubstituteModal" class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
          <X class="w-4 h-4" />
        </button>
      </div>
      
      <div class="p-5 overflow-y-auto">
        <div class="mb-5 p-4 bg-orange-50 rounded-xl border border-orange-100">
          <p class="text-xs font-bold text-orange-800 uppercase tracking-widest mb-1">Original Item</p>
          <p class="text-sm font-black text-gray-900">{{ activeSubstituteItem?.name }}</p>
          <p class="text-xs font-bold text-gray-500 mt-1">₦{{ activeSubstituteItem?.price?.toLocaleString() }}</p>
        </div>
        
        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Available Same-Price Options</h4>
        
        <div v-if="isLoadingSubstitutes" class="flex flex-col items-center justify-center py-8">
          <Loader2 class="w-8 h-8 animate-spin text-[#FF5C1A] mb-2" />
          <p class="text-xs font-bold text-gray-500">Loading vendor menu...</p>
        </div>
        
        <div v-else-if="substituteOptions.length === 0" class="text-center py-8">
          <p class="text-sm font-bold text-gray-500">No substitute items found with the exact same price (₦{{ activeSubstituteItem?.price?.toLocaleString() }}).</p>
        </div>
        
        <div v-else class="space-y-2">
          <button 
            v-for="opt in substituteOptions" 
            :key="opt._id"
            @click="requestSubstitute(opt._id)"
            :disabled="isSubmittingSubstitute"
            class="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-[#FF5C1A] hover:bg-orange-50 transition-all text-left disabled:opacity-50"
          >
            <div>
              <p class="text-sm font-bold text-gray-900">{{ opt.name }}</p>
              <p class="text-xs font-medium text-gray-500 mt-0.5" v-if="opt.description">{{ opt.description.substring(0, 40) }}...</p>
            </div>
            <span class="text-xs font-bold text-[#FF5C1A] bg-orange-100 px-2 py-1 rounded">Select</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Request Topup Modal -->
  <div v-if="showTopupModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showTopupModal = false"></div>
    <div class="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6">
      <h3 class="text-lg font-black text-gray-900 mb-2">Request Extra Funds</h3>
      <p class="text-sm text-gray-500 mb-4">How much extra do you need to buy the item?</p>
      <input type="number" v-model="topupAmount" placeholder="Amount (e.g. 1000)" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 text-sm font-bold focus:outline-none focus:border-blue-500" />
      <div class="flex gap-2">
        <button @click="showTopupModal = false" class="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200">Cancel</button>
        <button @click="requestTopup" :disabled="isRequestingTopup || !topupAmount" class="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50">Request</button>
      </div>
    </div>
  </div>

  
  <!-- Cancel Errand Modal -->
  <div v-if="showCancelModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showCancelModal = false"></div>
    <div class="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6">
      <h3 class="text-lg font-black text-gray-900 mb-2">Cancel Errand</h3>
      <p class="text-sm text-gray-500 mb-4">Why are you cancelling this errand?</p>
      <select v-model="cancelReason" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 text-sm font-bold focus:outline-none focus:border-red-500">
        <option value="">Select a reason</option>
        <option value="Item completely unavailable">Item completely unavailable</option>
        <option value="Student declined substitute">Student declined substitute</option>
        <option value="Store is closed">Store is closed</option>
      </select>
      
      <p class="text-sm text-gray-500 mb-2 font-bold">Provide Photo Proof</p>
      <div class="mb-4">
        <div v-if="cancellationPhotoUrl" class="relative rounded-xl overflow-hidden mb-2">
          <img :src="cancellationPhotoUrl" class="w-full h-32 object-cover" />
          <button @click="cancellationPhotoUrl = ''" class="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 backdrop-blur-sm hover:bg-black/70">
            <X class="w-4 h-4" />
          </button>
        </div>
        <button v-else @click="cameraTarget = 'cancellation'; isCameraModalOpen = true" class="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors" :disabled="uploadingCancellationPhoto">
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <Loader2 v-if="uploadingCancellationPhoto" class="w-6 h-6 text-red-500 animate-spin mb-2" />
            <Camera v-else class="w-6 h-6 text-gray-400 mb-2" />
            <p class="text-xs text-gray-500 font-semibold">{{ uploadingCancellationPhoto ? 'Uploading...' : 'Tap to snap photo' }}</p>
          </div>
          
        </button>
      </div>

      <div class="flex gap-2">
        <button @click="showCancelModal = false" class="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200">Go Back</button>
        <button @click="cancelCustomErrand" :disabled="isCancelling || !cancelReason || !cancellationPhotoUrl" class="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-all">Cancel Errand</button>
      </div>
    </div>
  </div>


</template>
<script setup lang="ts">
const route = useRoute();
import { GATEWAY_ENDPOINT_WITH_AUTH as api, GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA } from '@/api_factory/axios.config';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import UiModal from '@/components/ui/UiModal.vue';
import UiCameraModal from '@/components/ui/CameraModal.vue';
import OrderChat from '@/components/core/OrderChat.vue';
import MapboxMap from '@/components/ui/MapboxMap.vue';
import { useUser } from '@/composables/modules/auth/user';
import { useCustomToast } from "@/composables/core/useCustomToast"
import { Phone, MessageSquare, Loader2, Camera, X, Upload, Check } from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted } from 'vue';

const { user } = useUser();

definePageMeta({
 layout: 'errander'
})

const order = ref<any>(null);
const loadingOrder = ref(true);
const orderError = ref('');
const verificationCode = ref('');
const completing = ref(false);

const pinArray = ref(['', '', '', '']);
const pinInputs = ref<any[]>([]);

watch(pinArray, (newVal) => {
  verificationCode.value = newVal.join('');
}, { deep: true });

const onPinInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement;
  const val = input.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  pinArray.value[index] = val;
  input.value = val;
  
  if (val && index < 3) {
    pinInputs.value[index + 1]?.focus();
  }
};

const onPinKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !pinArray.value[index] && index > 0) {
    pinInputs.value[index - 1]?.focus();
  }
};

const onPinPaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pasteData = event.clipboardData?.getData('text');
  if (pasteData) {
    const cleanData = pasteData.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4);
    for (let i = 0; i < 4; i++) {
      pinArray.value[i] = cleanData[i] || '';
    }
    if (cleanData.length > 0) {
      pinInputs.value[Math.min(cleanData.length - 1, 3)]?.focus();
    }
  }
};

const isHandoffModalOpen = ref(false);
const requestingHandoff = ref(false);
const handoffLocation = ref('');
const handoffNote = ref('');

const isPrimaryErrander = computed(() => {
  if (!order.value || !user.value) return false;
  const erranderId = order.value.errander?._id || order.value.errander;
  return erranderId === user.value._id;
});

const isActiveErrander = computed(() => {
  if (!order.value || !user.value) return false;
  if (order.value.interception?.status === 'accepted' || order.value.interception?.status === 'completed') {
    const secondErranderId = order.value.interception?.secondErrander?._id || order.value.interception?.secondErrander;
    return secondErranderId === user.value._id;
  }
  return isPrimaryErrander.value;
});

const myEarnings = computed(() => {
  if (!order.value) return 0;
  const total = order.value.erranderPayout || order.value.deliveryFee || 0;
  const hasInterception = order.value.interception && 
    (order.value.interception.status === 'accepted' || order.value.interception.status === 'completed');
  if (hasInterception && order.value.interception?.secondErrander) {
    if (isPrimaryErrander.value) return Math.round(total * 0.6);
    if (isActiveErrander.value) return Math.round(total * 0.4);
  }
  return total;
});

const isInterceptionOrder = computed(() => {
  return order.value?.interception && 
    (order.value.interception.status === 'accepted' || order.value.interception.status === 'completed');
});

const submitHandoff = async () => {
  if (!handoffLocation.value) return;
  requestingHandoff.value = true;
  try {
    const res = await api.post<any>(`/orders/${route.params.id}/interception/request`, {
      point: handoffLocation.value,
      notes: handoffNote.value
    });
    
    if (res && res.type === 'ERROR') {
      showToast({ title: 'Request Failed', message: res.data?.message || 'Could not request hand-off', toastType: 'error' });
      return;
    }
    
    // Reload fully populated order instead of using raw response
    await loadOrder();
    isHandoffModalOpen.value = false;
    showToast({ title: 'Hand-off Requested', message: 'Interception requested successfully. Waiting for another errander.', toastType: 'success' });
  } catch (e: any) {
    showToast({ title: 'Request Failed', message: e.response?.data?.message || 'Could not request hand-off', toastType: 'error' });
  } finally {
    requestingHandoff.value = false;
  }
};

const getGroupedCustomizations = (customizations: any[]) => {
 if (!customizations) return [];
 const grouped: Record<string, any> = {};
 customizations.forEach(c => {
 if (grouped[c.name]) {
 grouped[c.name].quantity += 1;
 grouped[c.name].price += c.price;
 } else {
 grouped[c.name] = { ...c, quantity: 1 };
 }
 });
 return Object.values(grouped);
};

const steps = ['confirmed', 'picked_up', 'in_transit', 'delivered'];
const currentStep = computed(() => {
  if (!order.value) return -1;
  const status = order.value.status;
  if (status === 'interception_pending' || status === 'interception_in_progress') return 1; // Treat as 'picked_up' in UI
  return steps.indexOf(status);
});
const formatStatus = (s: string) => s?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

const { connect, emit, on } = useSocket('');
const { connect: connectTracking, emit: emitTracking, disconnect: disconnectTracking } = useSocket('/tracking');

const mapboxToken = ref(useRuntimeConfig().public.mapboxToken);
const currentLocation = ref<[number, number] | undefined>(undefined);
let watchId: number | null = null;

const startLocationTracking = () => {
  connectTracking();
  if ('geolocation' in navigator) {
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        currentLocation.value = [longitude, latitude];
        
        if (order.value?._id && user.value?._id) {
          emitTracking('updateLocation', {
            erranderId: user.value._id,
            orderId: order.value._id,
            coordinates: [longitude, latitude]
          });
        }
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};

onUnmounted(() => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }
  disconnectTracking();
});

const isChatOpen = ref(false);
const chatReceiverId = ref('');
const chatReceiverName = ref('');
const chatReceiverAvatar = ref('');

const openChat = (receiverId: any, name: string, avatar?: string) => {
 const resolvedId = String(receiverId || '');
 if (!resolvedId || resolvedId === 'undefined' || resolvedId === 'null') {
    return;
 }
 chatReceiverId.value = resolvedId;
 chatReceiverName.value = name;
 chatReceiverAvatar.value = avatar || '';
 isChatOpen.value = true;
};

const { showToast } = useCustomToast();

// Custom Errand State
const showTopupModal = ref(false);
const topupAmount = ref<number | null>(null);
const isRequestingTopup = ref(false);

const showCancelModal = ref(false);
const cancelReason = ref('');
const isCancelling = ref(false);
const cancellationPhotoUrl = ref('');
const uploadingCancellationPhoto = ref(false);

const requestTopup = async () => {
  if (!topupAmount.value || topupAmount.value <= 0 || !order.value) return;
  isRequestingTopup.value = true;
  try {
    await api.post(`/orders/${order.value._id}/custom/topup/request`, {
      amount: topupAmount.value
    });
    useNuxtApp().$toast.success('Top-up request sent to student!');
    showTopupModal.value = false;
    topupAmount.value = null;
    await loadOrder(true);
  } catch (err: any) {
    useNuxtApp().$toast.error(err.response?.data?.message || 'Failed to request top-up');
  } finally {
    isRequestingTopup.value = false;
  }
};

const cancelCustomErrand = async () => {
  if (!cancelReason.value || !cancellationPhotoUrl.value || !order.value) return;
  isCancelling.value = true;
  try {
    await api.post(`/orders/${order.value._id}/custom/cancel`, {
      reason: cancelReason.value,
      photoProof: cancellationPhotoUrl.value
    });
    useNuxtApp().$toast.success('Errand cancelled and student refunded');
    showCancelModal.value = false;
    navigateTo('/deliveries');
  } catch (err: any) {
    useNuxtApp().$toast.error(err.response?.data?.message || 'Failed to cancel errand');
  } finally {
    isCancelling.value = false;
  }
};

// Substitute State & Logic
const showSubstituteModal = ref(false);
const activeSubstituteItem = ref<any>(null);
const substituteOptions = ref<any[]>([]);
const isLoadingSubstitutes = ref(false);
const isSubmittingSubstitute = ref(false);

const openSubstituteModal = async (item: any) => {
  activeSubstituteItem.value = item;
  showSubstituteModal.value = true;
  substituteOptions.value = [];
  
  // Resolve vendor ID: order.vendor can be a populated object or a raw ObjectId string
  const vendorRef = order.value?.vendor;
  const vendorId = vendorRef?._id || vendorRef;
  
  if (vendorId) {
    isLoadingSubstitutes.value = true;
    try {
      const res = await api.get<any>(`/menu/items/vendor/${vendorId}`);
      if (res && res.type === 'ERROR') {
        throw new Error(res.message || 'Failed to fetch vendor items');
      }
      
      const items = res?.data || res || [];
      
      // The order item price is already marked up. Menu items from findByVendor 
      // also have markup applied (pricePerPortion).
      const originalPrice = Number(item.price);
      const originalItemId = String(item._id || item.id || item.menuItemId);
      
      
      // FIND THE ORIGINAL ITEM IN THE MENU LIST TO GET ITS EXACT BASE PRICE
      // We must match against base prices because item.price in the order already has markup applied.
      const originalMenuItemRef = String(item.menuItem || item.product || item._id);
      const originalMenuDoc = items.find((opt: any) => String(opt._id || opt.id) === originalMenuItemRef);
      
      let basePriceToMatch = originalPrice;
      if (originalMenuDoc) {
        basePriceToMatch = Number(originalMenuDoc.pricePerPortion ?? originalMenuDoc.price);
      } else {
        // Fallback: Try to deduce base price assuming ~5% markup
        basePriceToMatch = Math.floor(originalPrice / 1.05);
      }

      substituteOptions.value = items.filter((opt: any) => {
        const optId = String(opt._id || opt.id);
        const optPrice = Number(opt.pricePerPortion ?? opt.price);
        
        // We allow items with the exact same base price, or if base price deduction failed, 
        // we check if it's extremely close (to avoid floating point issues).
        const priceMatches = originalMenuDoc 
          ? (optPrice === basePriceToMatch)
          : (Math.abs(optPrice - basePriceToMatch) <= 10 || optPrice === originalPrice);

        return optId !== originalMenuItemRef && priceMatches;
      });

    } catch (e) {
      console.error('Failed to load substitutes', e);
      useNuxtApp().$toast.error('Failed to load menu items');
    } finally {
      isLoadingSubstitutes.value = false;
    }
  }
};


const closeSubstituteModal = () => {
  showSubstituteModal.value = false;
  activeSubstituteItem.value = null;
};


const markItemUnavailable = async (item: any) => {
  if (!order.value) return;
  if (!confirm(`Are you sure ${item.name} is unavailable?`)) return;
  
  try {
    await api.post(`/orders/${order.value._id}/items/${item.id}/unavailable`);
    useNuxtApp().$toast.success(`${item.name} marked as unavailable`);
    await loadOrder(true);
  } catch (err: any) {
    useNuxtApp().$toast.error(err.response?.data?.message || 'Failed to mark item unavailable');
  }
};

const requestSubstitute = async (substituteItemId: string) => {
  if (!activeSubstituteItem.value || !order.value) return;
  isSubmittingSubstitute.value = true;
  try {
    const item = activeSubstituteItem.value;
    const itemId = item._id || item.id || item.menuItem || item.product;
    
    await api.post(`/orders/${order.value._id}/items/${itemId}/substitute/request`, {
      substituteItemId
    });
    useNuxtApp().$toast.success('Substitute suggestion sent to student!');
    closeSubstituteModal();
    await loadOrder(true);
  } catch (err: any) {
    useNuxtApp().$toast.error(err.response?.data?.message || 'Failed to suggest substitute');
  } finally {
    isSubmittingSubstitute.value = false;
  }
};



const updatingStatus = ref(false);

// Vendor Payment Flow
const vendorBankForm = ref({
  bankName: '',
  bankCode: '',
  accountNumber: '',
  accountName: '',
  amount: null as number | null,
});
const vendorBanks = ref<any[]>([]);
const isVendorAccountVerified = ref(false);
const resolvingVendorAccount = ref(false);
const submittingVendorPayment = ref(false);
const itemsPhotoUrl = ref('');
const uploadingItemsPhoto = ref(false);
const isConfirmVendorPaymentModalOpen = ref(false);
const isCameraModalOpen = ref(false);
const cameraTarget = ref<'items' | 'receipt' | 'dropoff' | 'cancellation'>('items');

const loadBanks = async () => {
  try {
    const res = await api.get<any>('/payments/banks');
    if (res && res.type !== 'ERROR') {
      vendorBanks.value = res.data;
    }
  } catch (e) {
    console.error('Could not load banks', e);
  }
};

const resolveVendorAccount = async () => {
  if (vendorBankForm.value.accountNumber.length !== 10 || !vendorBankForm.value.bankCode) return;
  
  resolvingVendorAccount.value = true;
  isVendorAccountVerified.value = false;
  vendorBankForm.value.accountName = '';
  
  try {
    const res = await api.post<any>('/payments/resolve-account', {
      account_number: vendorBankForm.value.accountNumber,
      account_bank: vendorBankForm.value.bankCode
    });
    if (res && res.type !== 'ERROR' && res.data?.account_name) {
      vendorBankForm.value.accountName = res.data.account_name;
      const selectedBank = vendorBanks.value.find(b => b.code === vendorBankForm.value.bankCode);
      if (selectedBank) vendorBankForm.value.bankName = selectedBank.name;
      isVendorAccountVerified.value = true;
    } else {
      showToast({ title: 'Invalid Account', message: 'Could not resolve account details.', toastType: 'error' });
    }
  } catch (e: any) {
    showToast({ title: 'Error', message: e.response?.data?.message || 'Could not resolve account details.', toastType: 'error' });
  } finally {
    resolvingVendorAccount.value = false;
  }
};


const handleCapturedPhoto = async (file: File) => {
  if (!file) return;

  const target = cameraTarget.value;
  if (target === 'items') uploadingItemsPhoto.value = true;
  else if (target === 'cancellation') uploadingCancellationPhoto.value = true;
  else if (target === 'receipt') uploadingReceipt.value = true;
  else if (target === 'dropoff') uploadingDropoff.value = true;

  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const resUpload = await GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA.post<any>('/upload/image', formData);
    const uploadedUrl = resUpload.data.imageUrl || resUpload.data.url || resUpload.data;

    if (!uploadedUrl) throw new Error('Upload failed');

    if (target === 'items') {
      itemsPhotoUrl.value = uploadedUrl;
    } else if (target === 'cancellation') {
      cancellationPhotoUrl.value = uploadedUrl;
    } else if (target === 'receipt') {
      receiptUrl.value = uploadedUrl;
    } else if (target === 'dropoff') {
      // Execute contactless dropoff automatically
      await api.post(`/orders/${order.value?._id}/contactless-dropoff`, {
        proofImageUrl: uploadedUrl
      });
      useNuxtApp().$toast.success('Contactless drop-off successful');
      navigateTo('/deliveries');
    }
  } catch (e: any) {
    useNuxtApp().$toast.error({
      title: 'Upload Failed',
      message: e.message || e.response?.data?.message || 'Could not upload photo.'
    });
  } finally {
    if (target === 'items') uploadingItemsPhoto.value = false;
    else if (target === 'cancellation') uploadingCancellationPhoto.value = false;
    else if (target === 'receipt') uploadingReceipt.value = false;
    else if (target === 'dropoff') uploadingDropoff.value = false;
  }
};


const executeVendorPayment = async () => {
  if (!order.value || !isVendorAccountVerified.value || !itemsPhotoUrl.value || !vendorBankForm.value.amount) return;
  
  submittingVendorPayment.value = true;
  try {
    const res = await api.post<any>(`/orders/${route.params.id}/disburse-to-vendor`, {
      ...vendorBankForm.value,
      itemsPhoto: itemsPhotoUrl.value
    });
    
    if (res && res.type === 'ERROR') {
      showToast({ title: 'Transfer Failed', message: res.data?.message || 'Failed to transfer funds to vendor', toastType: 'error' });
      return;
    }
    
    order.value = res.data;
    showToast({ title: 'Transfer Successful', message: 'Vendor has been paid successfully.', toastType: 'success' });
    isConfirmVendorPaymentModalOpen.value = false;
  } catch (error: any) {
    showToast({ title: 'Error', message: error.response?.data?.message || 'Could not process vendor payment', toastType: 'error' });
  } finally {
    submittingVendorPayment.value = false;
  }
};

const actualItemCost = ref<number | null>(null);
const submittingReconciliation = ref(false);

const receiptUrl = ref('');
const uploadingReceipt = ref(false);
const receiptInput = ref<HTMLInputElement | null>(null);


const triggerReceiptUpload = () => {
  receiptInput.value?.click();
};



const handleReceiptUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  uploadingReceipt.value = true;
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const resUpload = await GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA.post<any>('/upload/image', formData);
    
    if (!resUpload || !resUpload.data?.url) throw new Error('Upload failed');
    receiptUrl.value = resUpload.data.url;
  } catch (e: any) {
    showToast({
      title: 'Upload Failed',
      message: e.message || e.response?.data?.message || 'Could not upload receipt.',
      toastType: 'error'
    });
  } finally {
    uploadingReceipt.value = false;
    if (receiptInput.value) receiptInput.value.value = '';
  }
};

const submitReconciliation = async () => {
 if (!actualItemCost.value || actualItemCost.value < 0) return;
 submittingReconciliation.value = true;
 try {
 const res = await api.put<any>(`/orders/${route.params.id}/reconcile`, {
 actualItemCost: actualItemCost.value,
 receiptImage: receiptUrl.value
 });
 
 if (res && res.type === 'ERROR') {
 showToast({
 title: 'Submission Failed',
 message: res.data?.message || 'Failed to submit reconciliation',
 toastType: 'error'
 });
 return;
 }

 order.value = res.data;
 showToast({
 title: 'Submitted',
 message: 'Actual cost submitted to customer for approval.',
 toastType: 'success'
 });
 } catch (e: any) {
 showToast({
 title: 'Submission Failed',
 message: e.response?.data?.message || 'Failed to submit reconciliation',
 toastType: 'error'
 });
 } finally {
 submittingReconciliation.value = false;
 }
};

const getWhatsAppLink = (phone: string, type: 'customer' | 'vendor') => {
  if (!phone || !order.value) return '#';
  const cleanPhone = phone.replace(/[^0-9]/g, '').replace(/^0/, '234');
  const o = order.value;
  let message = '';
  
  if (type === 'customer') {
    const storeName = o.type === 'custom_errand' ? (o.customDetails?.pickupLocation || 'Pickup Location') : (o.vendor?.storeName || 'the store');
    const deliveryAddress = o.type === 'custom_errand' ? (o.customDetails?.deliveryAddress || 'your address') : (o.customerAddress?.address || 'your address');
    
    message = `Hello ${o.customer?.firstName}, I am the delivery rider for your order #${o.orderNumber}.

I am handling your pickup from *${storeName}*.

*Delivery Address:* ${deliveryAddress}

I'll keep you updated on my way!`;
  } else if (type === 'vendor') {
    message = `Hello, I am the delivery rider for order #${o.orderNumber}.

I am on my way to pick up the order for *${o.customer?.firstName || 'the customer'}*.

Please confirm if the order is ready for pickup at ${o.vendor?.address || 'your store'}.`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

const updateStatus = async (status: string) => {
 updatingStatus.value = true;
 try {
 const res = await api.put<any>(`/orders/${route.params.id}/status`, { status });
 
 if (res && res.type === 'ERROR') {
 showToast({
 title: 'Update Failed',
 message: res.data?.message || 'Failed to update order status',
 toastType: 'error'
 });
 return;
 }

 order.value = res.data;
 emit('orderStatusUpdate', { orderId: route.params.id, status });
 showToast({
 title: 'Status Updated',
 message: `Order is now ${status.replace(/_/g, ' ')}`,
 toastType: 'success'
 });
 } catch (e: any) { 
 showToast({
 title: 'Update Failed',
 message: e.data?.message || e.response?.data?.message || 'Failed to update order status',
 toastType: 'error'
 });
 }
 finally { updatingStatus.value = false; }
};

const confirmingPayment = ref(false);
const isConfirmPaymentModalOpen = ref(false);

const confirmP2PPayment = () => {
  isConfirmPaymentModalOpen.value = true;
};

const executeConfirmP2PPayment = async () => {
  if (!order.value) return;
  
  confirmingPayment.value = true;
  try {
    const res = await api.post<any>(`/orders/${route.params.id}/custom/p2p-confirm`);
    if (res && res.type === 'ERROR') {
      showToast({ title: 'Confirmation Failed', message: res.data?.message || 'Failed to confirm payment', toastType: 'error' });
      return;
    }
    order.value = res.data;
    showToast({ title: 'Payment Confirmed', message: 'You can now proceed with the errand.', toastType: 'success' });
  } catch (error: any) {
    showToast({ title: 'Error', message: error.response?.data?.message || 'Could not confirm payment', toastType: 'error' });
  } finally {
    confirmingPayment.value = false;
    isConfirmPaymentModalOpen.value = false;
  }
};

const completeOrder = async () => {
 if (verificationCode.value.length !== 4) return;
 completing.value = true;
 try {
 const res = await api.post<any>(`/orders/${route.params.id}/complete`, { 
 verificationCode: verificationCode.value.toUpperCase() 
 });
 
 if (res && res.type === 'ERROR') {
 showToast({
 title: 'Verification Failed',
 message: res.data?.message || 'Invalid PIN. Verify and try again.',
 toastType: 'error'
 });
 return;
 }

 order.value = res.data;
 emit('orderStatusUpdate', { orderId: route.params.id, status: 'delivered' });
 showToast({
 title: 'Delivery Confirmed',
 message: 'Order completed successfully!',
 toastType: 'success'
 });
 } catch (e: any) { 
 showToast({
 title: 'Verification Failed',
 message: e.data?.message || e.response?.data?.message || 'Invalid PIN. Verify and try again.',
 toastType: 'error'
 });
 } finally {
 completing.value = false;
 }
};

const uploadingDropoff = ref(false);


const getStatusBg = (s: string) => {
 if (['delivered', 'confirmed'].includes(s)) return 'bg-emerald-50 text-emerald-600';
 if (['in_transit', 'picked_up'].includes(s)) return 'bg-blue-50 text-blue-600';
 if (['pending', 'preparing', 'ready_for_pickup'].includes(s)) return 'bg-amber-50 text-amber-600';
 return 'bg-gray-50 text-gray-400';
}

const startLocation = () => {
 if ('geolocation' in navigator) {
 navigator.geolocation.watchPosition(
 (pos) => {
 const coords = [pos.coords.longitude, pos.coords.latitude];
 emit('updateLocation', {
 erranderId: (order.value as any)?.errander?.toString(),
 orderId: route.params.id,
 coordinates: coords,
 });
 api.put('/erranders/location', { coordinates: coords }).catch(() => {});
 },
 () => {},
 { enableHighAccuracy: true, timeout: 10000 },
 );
 }
};

  const loadOrder = async (background = false) => {
    if (!background) loadingOrder.value = true;
    orderError.value = '';
    try {
      const res = await api.get<any>(`/orders/${route.params.id}`);
      if (res && res.type === 'ERROR') {
        orderError.value = res.data?.message || res.statusText || 'Failed to load order. Please check your network and try again.';
        if (!background) order.value = null;
      } else {
        order.value = res.data;
      }
    } catch (e: any) {
      console.error(e);
      orderError.value = e.message || 'An unexpected error occurred.';
      if (!background) order.value = null;
    } finally {
      if (!background) loadingOrder.value = false;
    }
  };

let statusPollingInterval: any = null;

 onMounted(async () => {
  await loadOrder();
  loadBanks();

  // Robust fallback: Poll the order status every 5 seconds to ensure we don't get stuck on critical statuses
  statusPollingInterval = setInterval(() => {
    if (order.value?.status && ['awaiting_payment', 'awaiting_payment_confirmation', 'interception_pending', 'in_progress', 'ready_for_pickup'].includes(order.value.status)) {
      loadOrder(true); // background fetch, no spinner
    }
  }, 5000);

  connect();
  emit('trackOrder', { orderId: route.params.id });
  startLocation();
  
  const matchesOrder = (id: any) => id && String(id) === String(route.params.id);
  
  on('notification:order-status-update', (payload: any) => {
    if (matchesOrder(payload.orderId) || matchesOrder(payload.data?.orderId)) {
      loadOrder();
    }
  });
  
  on('notification:new', (payload: any) => {
    const reloadTypes = [
      'ORDER_STATUS_UPDATE', 
      'ORDER_BIDS_UPDATE', 
      'ORDER_AWAITING_PAYMENT_CONFIRMATION',
      'ORDER_ACCEPTED',
      'ORDER_BID_ACCEPTED',
      'ORDER_INTERCEPTION_ACCEPTED',
      'ORDER_INTERCEPTION_REQUESTED'
    ];
    
    if (reloadTypes.includes(payload?.type)) {
      if (matchesOrder(payload.data?.orderId) || matchesOrder(payload.orderId)) {
        loadOrder();
      }
    }
  });
  
  on('notification:order-accepted', (payload: any) => {
    if (matchesOrder(payload.orderId) || matchesOrder(payload.data?.orderId)) {
      loadOrder();
    }
  });
});

onUnmounted(() => {
  if (statusPollingInterval) clearInterval(statusPollingInterval);
});

useHead({ title: computed(() => `Delivery #${order.value?.orderNumber || ''} - Errandr`) });
</script>
