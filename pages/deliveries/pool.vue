<template>
  <div class="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-medium text-gray-900 tracking-tight mb-1">Available Errands</h1>
        <p class="text-gray-400 text-xs md:text-sm font-medium">Claim available orders in real-time from the open orders list.</p>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-[9px] font-medium text-emerald-600 uppercase tracking-[0.2em]">Available Orders</span>
      </div>
    </div>

    <!-- Alert for Batching -->
    <div v-if="batchStatus?.isActive" class="bg-parentPrimary/[0.03] border border-parentPrimary/10 rounded-lg p-5 flex items-center gap-4 group hover:bg-parentPrimary/5 transition-all">
      <div class="w-12 h-12 rounded-xl bg-parentPrimary flex items-center justify-center text-white text-xl flex-shrink-0">📦</div>
      <div>
        <h4 class="text-sm font-medium text-gray-900">Multi-Order Mode Active</h4>
        <p class="text-[11px] text-gray-400 font-medium">You can accept up to 5 orders at once. Deliver multiple orders to save time!</p>
      </div>
    </div>

    <!-- Orders Table -->
    <div v-if="loading" class="bg-white rounded-lg border border-gray-50 overflow-hidden animate-pulse">
      <div class="p-5 space-y-4">
        <div v-for="i in 4" :key="i" class="h-24 bg-gray-50 rounded-xl w-full"></div>
      </div>
    </div>

    <div v-else-if="availableOrders.length === 0" class="bg-white rounded-lg border border-gray-50 py-32 text-center">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 scale-110">🚲</div>
      <h3 class="text-xl font-medium text-gray-900 mb-2">The pool is currently empty</h3>
      <p class="text-xs text-gray-400 max-w-xs mx-auto mb-8 font-medium">All orders have been claimed. New orders will appear here automatically.</p>
    </div>

    <div v-else class="bg-white rounded-lg border border-gray-50 overflow-hidden">
      <!-- Mobile Card Layout (visible on small screens only) -->
      <div class="md:hidden divide-y divide-gray-100">
        <div 
          v-for="order in availableOrders" 
          :key="'m-'+order._id"
          @click="viewDetails(order)"
          class="p-4 hover:bg-gray-50/50 transition-all cursor-pointer active:bg-gray-100/50"
        >
          <!-- Card Header: Icon + Title + Badges -->
          <div class="flex items-start gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-gray-950 flex items-center justify-center text-lg overflow-hidden flex-shrink-0">
              <img v-if="order.type !== 'custom_errand' && order.vendor?.logo" :src="order.vendor.logo" class="w-full h-full object-cover" />
              <span v-else class="text-white text-[9px] font-bold">CUS</span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold text-gray-900 truncate">
                {{ order.type === 'custom_errand' ? 'Custom Errand' : (order.vendor?.storeName || 'Store Order') }}
              </h3>
              <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                <span class="text-[8px] font-medium tracking-widest text-[#FF5C1A] uppercase bg-[#FF5C1A]/5 px-1.5 py-0.5 rounded">#{{ order.orderNumber?.slice(-8) }}</span>
                <span v-if="order.isGroupOrder" class="text-[8px] font-bold tracking-widest text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">👥 GROUP</span>
                <span v-if="order.customerGender" class="text-[8px] font-bold tracking-widest text-indigo-700 uppercase bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                  {{ order.customerGender === 'Male' ? '🙋🏽‍♂️' : (order.customerGender === 'Female' ? '🙋🏽‍♀️' : '👤') }}
                </span>
                <span v-if="order.status === 'negotiating'" class="text-[8px] font-bold tracking-widest text-amber-700 uppercase bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 animate-pulse">🔥 NEGOTIATING</span>
                <span v-if="order.status === 'interception_pending'" class="text-[8px] font-bold tracking-widest text-purple-700 uppercase bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 animate-pulse">🤝 HAND-OFF</span>
                <span v-if="order.locationType === 'outside_campus'" class="text-[8px] font-bold tracking-widest text-blue-700 uppercase bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">📍 Off-Campus</span>
                <span v-if="order.locationType === 'campus_environs'" class="text-[8px] font-bold tracking-widest text-indigo-700 uppercase bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">📍 Environs</span>
                <span class="text-[8px] font-bold text-gray-400 flex items-center gap-0.5">
                  <Clock class="w-2.5 h-2.5" /> {{ formatTime(order.createdAt) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Card Body: Description / Items -->
          <div class="p-2.5 bg-gray-50/70 rounded-lg border border-gray-50/50 mb-3">
            <p v-if="order.type === 'custom_errand' && order.customDetails?.description" class="text-xs text-gray-600 line-clamp-2 mb-1.5 whitespace-pre-line">
              {{ order.customDetails.description }}
            </p>
            <p v-if="order.status === 'interception_pending'" class="text-xs text-purple-700 font-bold bg-purple-50 p-2 rounded-lg border border-purple-200 mb-1.5">
              📍 Pick up from: {{ order.interception?.point }}
            </p>
            <div v-if="order.type === 'custom_errand' && order.customDetails?.estimatedItemCost > 0" class="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 mb-1">
              <Banknote class="w-3 h-3 text-emerald-500" /> Item Cost: <strong class="text-gray-700">₦{{ order.customDetails.estimatedItemCost.toLocaleString() }}</strong>
            </div>
            <div v-if="order.type !== 'custom_errand' && order.items?.length > 0" class="text-[10px] font-medium text-gray-500 line-clamp-1">
              📦 {{ order.items.length }} Item{{ order.items.length > 1 ? 's' : '' }}: <span class="text-gray-400">{{ order.items.map((i: any) => i.name).join(', ') }}</span>
            </div>
          </div>

          <!-- Voice Note -->
          <div v-if="order.type === 'custom_errand' && order.customDetails?.attachedVoiceNote" class="mb-3" @click.stop>
            <audio :src="order.customDetails.attachedVoiceNote" controls class="h-8 w-full max-w-[250px]  rounded-full" preload="metadata" />
          </div>

          <!-- Card Footer: Earnings + Actions -->
          <div class="flex items-center justify-between gap-3">
            <!-- Earnings -->
            <div v-if="order.status === 'negotiating'" class="flex-shrink-0">
              <p class="text-[10px] font-medium text-amber-600 mb-0.5">Student proposed</p>
              <p v-if="(order.proposedDeliveryFee || order.deliveryFee) > 0" class="text-base font-bold text-amber-700 leading-tight">₦{{ (order.proposedDeliveryFee || order.deliveryFee).toLocaleString() }}</p>
              <p v-else class="text-sm font-bold text-amber-700 leading-tight">Make an Offer</p>
            </div>
            <div v-else class="flex-shrink-0">
              <p class="text-[10px] font-medium text-gray-400 mb-0.5">You Earn</p>
              <p class="text-base font-bold text-emerald-600 leading-tight">₦{{ order.status === 'interception_pending' ? ((order.erranderPayout || order.erranderShare || order.deliveryFee || 150) * 0.4).toLocaleString() : (order.erranderPayout || order.erranderShare || order.deliveryFee || 150).toLocaleString() }}</p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <button 
                v-if="order.status === 'negotiating'"
                @click.stop="viewDetails(order)"
                class="px-3 py-2 bg-amber-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-amber-600 transition-all"
              >
                Place Bid
              </button>
              <button 
                @click.stop="order.status === 'interception_pending' ? acceptInterception(order._id) : acceptOrder(order._id)"
                :disabled="acceptingId === order._id"
                class="px-3 py-2 bg-gray-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-parentPrimary transition-all disabled:opacity-50"
              >
                <span v-if="acceptingId === order._id" class="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin inline-block"></span>
                <span v-else>Accept</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Table Layout (hidden on small screens) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th class="py-5 px-4 text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em]">Order Details</th>
              <th class="py-5 px-4 text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] hidden lg:table-cell">Drop-off</th>
              <th class="py-5 px-4 text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] text-right">You Earn</th>
              <th class="py-5 px-4 text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr 
              v-for="order in availableOrders" 
              :key="order._id"
              @click="viewDetails(order)"
              class="group hover:bg-gray-50/50 transition-all duration-300 cursor-pointer"
            >
              <!-- Errand Info -->
              <td class="py-5 px-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-gray-950 flex items-center justify-center text-xl overflow-hidden">
                    <img v-if="order.type !== 'custom_errand' && order.vendor?.logo" :src="order.vendor.logo" class="w-full h-full object-cover" />
                    <span v-else class="text-white text-xs">CUS</span>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                      {{ order.type === 'custom_errand' ? 'Custom Errand' : (order.vendor?.storeName || 'Store Order') }}
                    </h3>
                    <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span class="text-[9px] font-medium tracking-widest text-[#FF5C1A] uppercase bg-[#FF5C1A]/5 px-2 py-0.5 rounded">#{{ order.orderNumber?.slice(-8) }}</span>
                      <span v-if="order.isGroupOrder" class="text-[9px] font-bold tracking-widest text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">👥 GROUP ORDER</span>
                      <span v-if="order.customerGender" class="text-[9px] font-bold tracking-widest text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {{ order.customerGender === 'Male' ? '🙋🏽‍♂️ MALE' : (order.customerGender === 'Female' ? '🙋🏽‍♀️ FEMALE' : '👤 ' + order.customerGender) }}
                      </span>
                      <span v-if="order.status === 'negotiating'" class="text-[9px] font-bold tracking-widest text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">🔥 NEGOTIATING</span>
                      <span v-if="order.status === 'interception_pending'" class="text-[9px] font-bold tracking-widest text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded border border-purple-200 animate-pulse">🤝 HAND-OFF</span>
                      <span v-if="order.locationType === 'outside_campus'" class="text-[9px] font-bold tracking-widest text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">📍 Far Off-Campus</span>
                      <span v-if="order.locationType === 'campus_environs'" class="text-[9px] font-bold tracking-widest text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">📍 Campus Environs</span>
                      <span class="text-[9px] font-bold text-gray-400 flex items-center gap-1">
                        <Clock class="w-2.5 h-2.5" /> {{ formatTime(order.createdAt) }}
                      </span>
                    </div>
                    <div class="mt-2 p-2 bg-gray-50/70 rounded-lg border border-gray-50/50">
                      <p v-if="order.type === 'custom_errand' && order.customDetails?.description" class="text-xs text-gray-600 line-clamp-2 max-w-md mb-1.5 whitespace-pre-line">
                        {{ order.customDetails.description }}
                      </p>
                      <p v-if="order.status === 'interception_pending'" class="text-xs text-purple-700 font-bold bg-purple-50 p-2 rounded-lg border border-purple-200 mb-1.5">
                         📍 Pick up from: {{ order.interception?.point }}
                      </p>
                      <div v-if="order.type === 'custom_errand' && order.customDetails?.estimatedItemCost > 0" class="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 mb-1">
                        <Banknote class="w-3 h-3 text-emerald-500" /> Item Cost: <strong class="text-gray-700">₦{{ order.customDetails.estimatedItemCost.toLocaleString() }}</strong>
                      </div>
                      <div v-if="order.type !== 'custom_errand' && order.items?.length > 0" class="text-[10px] font-medium text-gray-500 line-clamp-1 max-w-sm">
                        📦 {{ order.items.length }} Item{{ order.items.length > 1 ? 's' : '' }}: <span class="text-gray-400">{{ order.items.map((i: any) => i.name).join(', ') }}</span>
                      </div>
                    </div>
                    <div v-if="order.type === 'custom_errand' && order.customDetails?.attachedVoiceNote" class="mt-2" @click.stop>
                      <audio :src="order.customDetails.attachedVoiceNote" controls class="h-8 w-48 max-w-[200px]  rounded-full" preload="metadata" />
                    </div>
                  </div>
                </div>
              </td>

              <!-- Destination -->
              <td class="py-5 px-4 hidden lg:table-cell max-w-[200px]">
                <div class="flex flex-col gap-2">
                  <div class="flex items-start gap-2">
                    <div class="w-5 h-5 rounded-md bg-gray-50 flex items-center justify-center text-[9px] flex-shrink-0 mt-0.5">S</div>
                    <p class="text-[11px] font-medium text-gray-500 line-clamp-1 leading-tight">
                      {{ order.status === 'interception_pending' ? order.interception?.point : (order.type === 'custom_errand' ? order.customDetails?.pickupLocation : (order.vendor?.address || 'Store Location')) }}
                    </p>
                  </div>
                  <div class="flex items-start gap-2">
                    <div class="w-5 h-5 rounded-md bg-indigo-50 flex items-center justify-center text-[9px] flex-shrink-0 mt-0.5 text-indigo-600">D</div>
                    <p class="text-[11px] font-bold text-gray-600 line-clamp-2 leading-tight">
                      {{ order.type === 'custom_errand' ? order.customDetails?.dropoffLocation : (order.deliveryAddress || 'Customer Location') }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Pay -->
              <td class="py-5 px-4 text-right">
                <div v-if="order.status === 'negotiating'" class="flex flex-col items-end">
                  <p class="text-xs font-medium text-amber-600 tracking-tight leading-none mb-1">Student proposed</p>
                  <p v-if="(order.proposedDeliveryFee || order.deliveryFee) > 0" class="text-lg font-bold text-amber-700 tracking-tight leading-none mb-1">₦{{ (order.proposedDeliveryFee || order.deliveryFee).toLocaleString() }}</p>
                  <p v-else class="text-sm font-bold text-amber-700 tracking-tight leading-none mb-1 mt-1 border-b border-amber-300 pb-0.5">Make an Offer</p>
                  <p class="text-[8px] font-medium text-amber-500 uppercase tracking-widest mt-1">Bid to Earn</p>
                </div>
                <div v-else class="flex flex-col items-end">
                  <p class="text-lg font-medium text-emerald-600 tracking-tight leading-none mb-1">₦{{ order.status === 'interception_pending' ? ((order.erranderPayout || order.erranderShare || order.deliveryFee || 150) * 0.4).toLocaleString() : (order.erranderPayout || order.erranderShare || order.deliveryFee || 150).toLocaleString() }}</p>
                  <p class="text-[8px] font-medium text-gray-300 uppercase tracking-widest">Paid Immediately</p>
                </div>
              </td>

              <!-- Action -->
              <td class="py-5 px-4">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    @click.stop="viewDetails(order)"
                    class="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95"
                    title="View Details"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button 
                    v-if="order.status === 'negotiating'"
                    @click.stop="viewDetails(order)"
                    class="px-4 py-2 bg-amber-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-amber-600 hover: border border-amber-400 transition-all min-w-[90px]"
                  >
                    Place Bid
                  </button>
                  <button 
                    @click.stop="order.status === 'interception_pending' ? acceptInterception(order._id) : acceptOrder(order._id)"
                    :disabled="acceptingId === order._id"
                    class="px-4 py-2 bg-gray-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-parentPrimary hover:border border-gray-25 hover:shadow-parentPrimary/20 transition-all disabled:opacity-50 min-w-[90px]"
                  >
                    <span v-if="acceptingId === order._id" class="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span v-else>Accept</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detailed Order Drawer -->
    <SideDrawer :isOpen="isDrawerOpen" @close="isDrawerOpen = false">
      <div v-if="selectedOrder" class="space-y-8 pb-10">
        <!-- Drawer Header -->
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-xl bg-gray-950 flex items-center justify-center text-3xl overflow-hidden">
            <img v-if="selectedOrder.type !== 'custom_errand' && selectedOrder.vendor?.logo" :src="selectedOrder.vendor.logo" class="w-full h-full object-cover" />
            <span v-else class="text-white text-xs">CUS</span>
          </div>
          <div>
            <h2 class="text-xl font-medium text-gray-900 leading-tight">
              {{ selectedOrder.type === 'custom_errand' ? 'Custom Errand' : selectedOrder.vendor?.storeName }}
            </h2>
            <p class="text-xs font-bold text-gray-400 tracking-widest uppercase">#{{ selectedOrder.orderNumber }}</p>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div v-if="selectedOrder.status === 'negotiating'" class="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <p class="text-[9px] font-medium text-amber-500 uppercase tracking-widest mb-1">Student Proposed</p>
            <p v-if="(selectedOrder.proposedDeliveryFee || selectedOrder.deliveryFee) > 0" class="text-xl font-bold text-amber-700 tracking-tight">₦{{ (selectedOrder.proposedDeliveryFee || selectedOrder.deliveryFee).toLocaleString() }}</p>
            <p v-else class="text-lg font-bold text-amber-700 tracking-tight">Open to Offers</p>
          </div>
          <div v-else class="p-4 bg-gray-50 rounded-lg">
            <p class="text-[9px] font-medium text-gray-400 uppercase tracking-widest mb-1">You Earn</p>
            <p class="text-xl font-medium text-emerald-600 tracking-tight">₦{{ selectedOrder.status === 'interception_pending' ? ((selectedOrder.erranderPayout || selectedOrder.erranderShare || selectedOrder.deliveryFee) * 0.4).toLocaleString() : (selectedOrder.erranderPayout || selectedOrder.erranderShare || selectedOrder.deliveryFee).toLocaleString() }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-[9px] font-medium text-gray-400 uppercase tracking-widest mb-1">Prep Time</p>
            <p class="text-xl font-medium text-gray-900 tracking-tight">~15 Mins</p>
          </div>
        </div>

        <!-- Outside Campus / Negotiation Banner -->
        <div v-if="selectedOrder.status === 'negotiating' || selectedOrder.locationType === 'outside_campus' || selectedOrder.locationType === 'campus_environs'" class="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-lg">📍</span>
            <h4 class="text-xs font-bold text-amber-800 uppercase tracking-wide">{{ selectedOrder.locationType === 'campus_environs' ? 'Campus Environs Delivery' : 'Outside Campus Delivery' }}</h4>
          </div>
          <p class="text-sm font-medium text-amber-700 leading-relaxed">
            This order requires delivery <strong>{{ selectedOrder.locationType === 'campus_environs' ? 'to the campus environs' : 'outside campus' }}</strong>.
            <span v-if="(selectedOrder.proposedDeliveryFee || selectedOrder.deliveryFee) > 0">The student proposed a delivery fee of <strong>₦{{ (selectedOrder.proposedDeliveryFee || selectedOrder.deliveryFee).toLocaleString() }}</strong>.</span>
            <span v-else>The student is open to offers.</span>
            You can accept their offer or counter with your own price.
          </p>
          <div v-if="selectedOrder.outsideCampusAddress" class="mt-2 p-3  rounded-lg border border-amber-100">
            <p class="text-[9px] font-medium text-amber-500 uppercase tracking-widest mb-1">Delivery Location</p>
            <p class="text-sm font-bold text-gray-900">{{ selectedOrder.outsideCampusAddress }}</p>
          </div>
          <div v-if="negotiationViewerCount > 0" class="flex items-center gap-2 mt-2">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span class="text-xs font-bold text-amber-700">{{ negotiationViewerCount }} rider{{ negotiationViewerCount === 1 ? '' : 's' }} viewing this request</span>
          </div>
        </div>

        <!-- Locations -->
        <div class="space-y-4">
          <div class="relative flex gap-4 pl-1">
            <div class="absolute left-3 top-6 bottom-6 w-px border-l-2 border-dashed border-gray-100"></div>
            <div class="z-10 w-6 h-6 rounded-md bg-gray-950 flex items-center justify-center text-[10px] flex-shrink-0 text-white">S</div>
            <div>
              <p class="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Pickup Location</p>
              <p class="text-sm font-bold text-gray-900">
                {{ selectedOrder.status === 'interception_pending' ? selectedOrder.interception?.point : (selectedOrder.type === 'custom_errand' ? selectedOrder.customDetails?.pickupLocation : (selectedOrder.vendor?.address || 'Store Address')) }}
              </p>
            </div>
          </div>
          <div class="flex gap-4 pl-1">
            <div class="z-10 w-6 h-6 rounded-md bg-[#FF5C1A] flex items-center justify-center text-[10px] flex-shrink-0 text-white">D</div>
            <div>
              <p class="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Delivery Point</p>
              <p class="text-sm font-bold text-gray-900">
                {{ selectedOrder.type === 'custom_errand' ? selectedOrder.customDetails?.dropoffLocation : (selectedOrder.deliveryAddress || 'Customer Location') }}
              </p>
              <p v-if="selectedOrder.specificAddress" class="text-xs font-medium text-gray-500 mt-1">Note: {{ selectedOrder.specificAddress }}</p>
            </div>
          </div>
        </div>

        <!-- Order Items or Description -->
        <div class="space-y-4 pt-4 border-t border-gray-100">
          <h4 class="text-xs font-medium text-gray-900 uppercase tracking-widest">{{ selectedOrder.type === 'custom_errand' ? 'Request Details' : 'Order Summary' }}</h4>
          <div v-if="selectedOrder.type === 'custom_errand'" class="p-4 bg-gray-50/50 rounded-xl text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {{ selectedOrder.customDetails?.description }}
            
            <div v-if="selectedOrder.customDetails?.attachedVoiceNote" class="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-widest">Attached Voice Note</span>
              <audio :src="selectedOrder.customDetails.attachedVoiceNote" controls class="w-full h-10 bg-white rounded-full " preload="metadata" />
            </div>

            <div v-if="selectedOrder.customDetails?.attachedImages?.length > 0 || selectedOrder.customDetails?.attachedImage" class="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-widest">Attached Images</span>
              <div class="flex flex-wrap gap-2">
                <a v-for="(img, idx) in (selectedOrder.customDetails?.attachedImages?.length ? selectedOrder.customDetails.attachedImages : [selectedOrder.customDetails.attachedImage])" 
                   :key="idx" 
                   :href="img" 
                   target="_blank" 
                   class="relative inline-block hover:opacity-80 transition-opacity">
                  <img :src="img" class="h-20 w-20 object-cover rounded-xl border border-gray-25 " />
                </a>
              </div>
            </div>

            <div v-if="selectedOrder.status !== 'interception_pending' && selectedOrder.customDetails?.estimatedItemCost > 0" class="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-xs">
              <span class="font-medium text-gray-500">Estimated Item Cost</span>
              <span class="font-bold text-gray-900">₦{{ (selectedOrder.customDetails?.estimatedItemCost || 0).toLocaleString() }}</span>
            </div>
          </div>
            <div v-if="groupedOrderItems.length > 0" class="space-y-4">
              <div v-for="group in groupedOrderItems" :key="group.name" class="space-y-2">
                <h5 v-if="group.name !== 'Other Items' || groupedOrderItems.length > 1" class="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">{{ group.name }}</h5>
                <div v-for="item in group.items" :key="item.name || item._id" class="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                  <div class="flex items-center gap-3">
                    <span class="w-6 h-6 bg-white border border-gray-50 rounded-lg flex items-center justify-center text-[10px] font-medium text-gray-900">{{ item.qty || item.quantity }}x</span>
                    <span class="text-sm font-bold text-gray-900 tracking-tight">{{ item.name }}</span>
                  </div>
                  <span class="text-xs font-medium text-gray-400 ">₦{{ (item.price || 0).toLocaleString() }}</span>
                </div>
              </div>
            </div>
        </div>

        <!-- Customer Note -->
        <div v-if="selectedOrder.recipientName" class="p-5 bg-[#FF5C1A]/[0.02] border border-[#FF5C1A]/10 rounded-lg space-y-2">
          <div class="flex items-center gap-2">
            <User class="w-3.5 h-3.5 text-parentPrimary" />
            <h4 class="text-[10px] font-medium text-parentPrimary uppercase tracking-widest">Customer Details</h4>
          </div>
          <p class="text-sm font-medium text-gray-900 tracking-tight">For: {{ selectedOrder.recipientName }}</p>
          <p class="text-xs font-medium text-gray-500">{{ selectedOrder.recipientPhone }}</p>
        </div>

        <!-- Item Cost Bank Transfer Notice -->
        <div v-if="selectedOrder.status !== 'interception_pending' && selectedOrder.type === 'custom_errand' && selectedOrder.customDetails?.estimatedItemCost > 0" class="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
          <div class="flex items-center gap-2">
            <Banknote class="w-4 h-4 text-blue-600" />
            <h4 class="text-xs font-bold text-blue-800 uppercase tracking-wide">Money for Items</h4>
          </div>
          <p class="text-sm font-medium text-blue-700 leading-relaxed">
            ₦{{ (selectedOrder.customDetails.estimatedItemCost).toLocaleString() }} will be transferred to your <strong>bank account</strong> immediately when you accept this order, so you can purchase the items.
          </p>
          <p class="text-[11px] font-medium text-blue-500">Make sure your bank details are set up in Wallet → Settings.</p>
        </div>

        <!-- Awaiting Payment Block -->
        <div v-if="selectedOrder.status === 'awaiting_payment'" class="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex flex-col items-center text-center mt-4 space-y-3">
           <div class="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center border border-gray-25 shadow-emerald-500/30">
              <Check class="w-6 h-6" />
           </div>
           <h3 class="text-xl font-black text-emerald-900 tracking-tight">Offer Accepted!</h3>
           <p class="text-sm font-medium text-emerald-700 leading-relaxed">The student has accepted your offer of ₦{{ selectedOrder.deliveryFee?.toLocaleString() }}. The system is now waiting for them to make a secure payment.</p>
           <div class="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-emerald-100 ">
             <span class="relative flex h-2.5 w-2.5">
               <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
             </span>
             <span class="text-xs font-bold text-emerald-800">Waiting for payment...</span>
           </div>
        </div>

        <!-- Actions inside drawer -->
        <div v-if="selectedOrder.status !== 'awaiting_payment'" class="space-y-3">
          <!-- NEGOTIATING orders: Bid-only mode -->
          <div v-if="selectedOrder.status === 'negotiating'" class="space-y-4">
            <div class="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg space-y-3">
              <h4 class="text-xs font-bold text-amber-800 uppercase tracking-wide">Submit Your Delivery Bid</h4>
              <p class="text-xs text-amber-600">Enter how much you want to charge for this delivery. The student will see your offer in real-time.</p>
              <div class="flex gap-2">
                <div class="relative flex-1">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 font-bold">₦</span>
                  <input v-model="formattedBidAmount" type="text" placeholder="Your Price" class="w-full bg-white border border-amber-200 rounded-lg pl-8 pr-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 font-bold text-gray-900 text-lg" />
                </div>
                <button 
                  @click="placeBid(selectedOrder._id)"
                  :disabled="!bidAmount || biddingId === selectedOrder._id"
                  class="bg-amber-500 text-white text-sm font-bold px-5 py-3 rounded-lg disabled:opacity-50 hover:bg-amber-600 transition-colors shrink-0  shadow-amber-200 flex items-center justify-center gap-2"
                >
                  <Loader2 v-if="biddingId === selectedOrder._id" class="w-4 h-4 animate-spin" />
                  <span>{{ biddingId === selectedOrder._id ? 'Sending...' : '🚀 Send Bid' }}</span>
                </button>
              </div>
              <div v-if="hasPlacedBid(selectedOrder) && getBidStatus() === 'counter_offer' && getBidLastRole() === 'student'" class="mt-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p class="text-xs font-bold text-amber-800 mb-2">Student Counter-Offered: ₦{{ getMyBid(selectedOrder)?.toLocaleString() }}</p>
                <div class="flex gap-2">
                  <button 
                    @click="acceptCounter(selectedOrder._id)"
                    :disabled="acceptingId === selectedOrder._id"
                    class="flex-1 bg-parentPrimary text-white text-xs font-bold py-2 rounded-lg hover:bg-parentPrimary/90 transition-all flex items-center justify-center gap-1"
                  >
                    <Loader2 v-if="acceptingId === selectedOrder._id" class="w-3 h-3 animate-spin" />
                    Accept
                  </button>
                  <div class="relative flex-[2] flex gap-1">
                    <input v-model="formattedBidAmount" type="text" placeholder="New Price" class="w-full bg-white border border-amber-200 rounded-lg px-2 py-1 outline-none focus:border-amber-500 text-sm font-bold" />
                    <button 
                      @click="placeBid(selectedOrder._id)"
                      :disabled="!bidAmount || biddingId === selectedOrder._id"
                      class="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      Counter
                    </button>
                  </div>
                </div>
              </div>
              <p v-else-if="hasPlacedBid(selectedOrder)" class="text-xs font-bold text-green-600 mt-1 bg-green-50 p-2.5 rounded-lg text-center border border-green-100">
                ✅ You offered ₦{{ getMyBid(selectedOrder)?.toLocaleString() }} — waiting for student's response
              </p>
            </div>
            <button 
              @click="rejectOrder(selectedOrder._id)"
              class="w-full py-2.5 bg-gray-50 text-gray-400 border border-gray-50 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all text-center"
            >
              Not Interested
            </button>
          </div>

          <!-- Normal orders: Accept/Reject + optional counter-offer -->
          <div v-else>
            <div class="flex gap-3">
              <button 
                @click="rejectOrder(selectedOrder._id)"
                :disabled="acceptingId === selectedOrder._id || biddingId === selectedOrder._id"
                class="flex-1 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <X class="w-4 h-4" />
                Reject
              </button>

              <button 
                @click="selectedOrder.status === 'interception_pending' ? acceptInterception(selectedOrder._id) : acceptOrder(selectedOrder._id); isDrawerOpen = false"
                :disabled="acceptingId === selectedOrder._id || biddingId === selectedOrder._id"
                class="flex-[2] py-2.5 bg-gray-950 text-white rounded-lg text-sm font-bold hover:bg-parentPrimary transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Zap v-if="acceptingId !== selectedOrder._id" class="w-4 h-4 fill-current" />
                <span v-else class="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ acceptingId === selectedOrder._id ? 'Accepting...' : 'Accept at ₦' + (selectedOrder.erranderPayout || selectedOrder.erranderShare || selectedOrder.deliveryFee).toLocaleString() }}
              </button>
            </div>

            <div v-if="selectedOrder.type === 'custom_errand'" class="border-t border-gray-100 pt-4 mt-2">
              <p class="text-xs font-bold text-gray-500 mb-2">Or offer a different price:</p>
              <div class="flex gap-2">
                <div class="relative flex-1">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₦</span>
                  <input v-model="formattedBidAmount" type="text" placeholder="Your Price" class="w-full bg-gray-50 border border-gray-25 rounded-lg pl-8 pr-4 py-2.5 outline-none focus:border-parentPrimary font-bold text-gray-900 text-base" />
                </div>
                <button 
                  @click="placeBid(selectedOrder._id)"
                  :disabled="!bidAmount || biddingId === selectedOrder._id"
                  class="bg-parentPrimary text-white text-sm font-bold px-4 py-2.5 rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors shrink-0"
                >
                  {{ biddingId === selectedOrder._id ? 'Sending...' : 'Send Offer' }}
                </button>
              </div>
              <p v-if="hasPlacedBid(selectedOrder)" class="text-xs font-bold text-green-600 mt-2 bg-green-50 p-2 rounded-lg text-center">
                You offered ₦{{ getMyBid(selectedOrder) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SideDrawer>

    <!-- Full Screen Loading Modal for Accepting Order or Bidding -->
    <Teleport to="body" v-if="acceptingId || biddingId">
      <div class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-900/95 backdrop-blur-sm text-white transition-opacity">
        <div class="w-16 h-16 border-4 border-white/20 border-t-[#FF5C1A] rounded-full animate-spin mb-6"></div>
        <h2 class="text-2xl font-bold tracking-tight mb-2">{{ biddingId ? 'Sending Bid...' : 'Accepting Order...' }}</h2>
        <p class="text-white/60 font-medium text-sm">{{ biddingId ? 'Please wait while we send your offer to the student.' : 'Please wait while we secure this errand for you.' }}</p>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'
import { useUser } from '@/composables/modules/auth/user'
import { useRouter } from 'vue-router'
import { Clock, Zap, ChevronRight, Eye, User, X, Banknote, Check, Loader2 } from 'lucide-vue-next'
import SideDrawer from '@/components/ui/SideDrawer.vue'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import { io, Socket } from 'socket.io-client'

definePageMeta({
  layout: 'errander'
})

const router = useRouter()
const { socket } = useRealtimeSocket()
const { toastQueue } = useRealtimeNotifications()
const loading = ref(true)
const availableOrders = ref<any[]>([])
const acceptingId = ref<string | null>(null)
const batchStatus = ref<any>(null)

// Details Drawer State
const isDrawerOpen = ref(false)
const selectedOrder = ref<any>(null)

const groupedOrderItems = computed(() => {
  if (!selectedOrder.value?.items) return [];
  
  const packMap = new Map<string, any[]>();
  const categoryMap = new Map<string, any[]>();
  
  selectedOrder.value.items.forEach((item: any) => {
    if (item.packId) {
      if (!packMap.has(item.packId)) packMap.set(item.packId, []);
      packMap.get(item.packId)!.push(item);
    } else {
      const cat = item.category || 'Meals';
      if (!categoryMap.has(cat)) categoryMap.set(cat, []);
      categoryMap.get(cat)!.push(item);
    }
  });
  
  const result = [];
  let packCounter = 1;
  
  for (const [packId, items] of packMap.entries()) {
    const name = packId.toLowerCase().includes('pack') ? packId : `Pack ${packCounter++}`;
    result.push({ name, items, isPack: true });
  }
  
  for (const [cat, items] of categoryMap.entries()) {
    result.push({ name: cat, items, isPack: false });
  }
  
  return result;
});const localPlacedBid = ref<number | null>(null)
const bidAmount = ref<number | null>(null)
const biddingId = ref<string | null>(null)

// Negotiation WebSocket State
const negotiationViewerCount = ref(0)
let negotiationSocket: Socket | null = null
const runtimeConfig = useRuntimeConfig()

const formattedBidAmount = computed({
  get: () => bidAmount.value ? bidAmount.value.toLocaleString('en-NG') : '',
  set: (val: string) => {
    if (!val) {
      bidAmount.value = null
      return
    }
    const numStr = val.toString().replace(/[^0-9]/g, '')
    bidAmount.value = numStr ? parseInt(numStr, 10) : null
  }
})

const pushToast = (title: string, body: string, type: string = 'GENERAL') => {
  toastQueue.value.push({
    id: `toast_${Date.now()}`,
    title,
    body,
    type,
    createdAt: new Date().toISOString()
  })
}

const loadAvailableOrders = async () => {
  loading.value = true
  try {
    const res = await api.get('/orders/available')
    if (res && res.data) {
      availableOrders.value = res.data
      const queryOrderId = router.currentRoute.value.query.orderId
      if (queryOrderId) {
        const orderToView = availableOrders.value.find(o => o._id === queryOrderId)
        if (orderToView) {
          viewDetails(orderToView)
        }
      }
    }
  } catch (e) {
    console.error('Failed to load available orders:', e)
  } finally {
    loading.value = false
  }
}

const loadBatchStatus = async () => {
  try {
    const res = await api.get('/orders/batch/status')
    if (res && res.data) {
      batchStatus.value = res.data
    }
  } catch (e) {}
}

const connectNegotiationSocket = (orderId: string) => {
  disconnectNegotiationSocket()
  const baseUrl = runtimeConfig.public.wsBase || runtimeConfig.public.apiBase || 'http://localhost:3005'
  const wsUrl = baseUrl.replace(/\/v1\/?$/, '').replace(/\/api\/?$/, '')
  console.log('[NegotiationSocket] Connecting to', `${wsUrl}/negotiation`)
  negotiationSocket = io(`${wsUrl}/negotiation`, {
    withCredentials: true,
    transports: ['polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    timeout: 10000,
  })
  negotiationSocket.on('connect', () => {
    console.log('[NegotiationSocket] Connected, joining room for', orderId)
    negotiationSocket?.emit('joinNegotiation', { orderId, role: 'rider' })
  })
  negotiationSocket.on('connect_error', (err: any) => {
    console.error('[NegotiationSocket] Connection error:', err.message)
  })
  negotiationSocket.on('disconnect', (reason: string) => {
    console.warn('[NegotiationSocket] Disconnected:', reason)
  })
  negotiationSocket.on('viewerCountUpdate', (data: { count: number }) => {
    negotiationViewerCount.value = data.count
  })
  negotiationSocket.on('bidAccepted', (data: any) => {
    if (data.orderId) {
      if (data.riderId === user.value?._id) {
        // This rider won the bid
        pushToast('Offer Accepted!', 'The student accepted your offer. Navigating to delivery...', 'SUCCESS')
        setTimeout(() => {
          router.push(`/deliveries/${data.orderId}`)
        }, 1000)
      } else {
        // Another rider won the bid, remove from available
        availableOrders.value = availableOrders.value.filter(o => o._id !== data.orderId)
        if (selectedOrder.value?._id === data.orderId) {
          pushToast('Negotiation Closed', 'The student accepted a bid for this order.', 'GENERAL')
          isDrawerOpen.value = false
        }
      }
    }
  })

  negotiationSocket.on('orderAcceptedDirectly', (data: any) => {
    if (data.orderId) {
      if (data.winningUserId === user.value?._id) {
        pushToast('Offer Accepted!', 'The bid was accepted. Navigating to delivery...', 'SUCCESS')
        setTimeout(() => {
          router.push(`/deliveries/${data.orderId}`)
        }, 1000)
      } else {
        availableOrders.value = availableOrders.value.filter(o => o._id !== data.orderId)
        if (selectedOrder.value?._id === data.orderId) {
          pushToast('Negotiation Closed', 'This order was given to another rider.', 'GENERAL')
          isDrawerOpen.value = false
        }
      }
    }
  })

  negotiationSocket.on('bidCountered', (bid: any) => {
    const orderId = bid.order?._id || bid.order;
    const riderId = bid.rider?._id || bid.rider;
    if (orderId?.toString() === selectedOrder.value?._id?.toString() && riderId?.toString() === user.value?._id?.toString()) {
      if (bid.lastNegotiatorRole === 'student') {
        pushToast('Offer Countered!', `The student proposed ₦${bid.bidAmount.toLocaleString()}`, 'GENERAL')
        
        // Ensure localPlacedBid object holds the full bid object to extract the bidId
        localPlacedBid.value = bid
        
        // Also update formatted amount to reflect the student's counter
        formattedBidAmount.value = bid.bidAmount.toString()
        bidAmount.value = bid.bidAmount
      }
    }
  })

  negotiationSocket.on('bidRejected', (bid: any) => {
    const orderId = bid.order?._id || bid.order;
    const riderId = bid.rider?._id || bid.rider;
    if (orderId?.toString() === selectedOrder.value?._id?.toString() && riderId?.toString() === user.value?._id?.toString()) {
      pushToast('Offer Declined', 'The student has declined your offer.', 'ERROR')
      localPlacedBid.value = null
      bidAmount.value = null
      formattedBidAmount.value = ''
    }
  })
}

const disconnectNegotiationSocket = () => {
  if (negotiationSocket) {
    if (selectedOrder.value?._id) {
      negotiationSocket.emit('leaveNegotiation', { orderId: selectedOrder.value._id, role: 'rider' })
    }
    negotiationSocket.disconnect()
    negotiationSocket = null
    negotiationViewerCount.value = 0
  }
}

const fetchExistingBid = async (orderId: string) => {
  try {
    const res = await api.get(`/orders/${orderId}/custom/bid/me`)
    if (res && res.data) {
      localPlacedBid.value = res.data
      if (res.data.bidAmount) {
        bidAmount.value = res.data.bidAmount
      } else if (res.data.amount) { // fallback for legacy embedded bid
        bidAmount.value = res.data.amount
      }
    }
  } catch (e) {
    console.error('Failed to fetch existing bid:', e)
  }
}

const viewDetails = async (order: any) => {
  selectedOrder.value = order
  localPlacedBid.value = null
  isDrawerOpen.value = true
  if (socket.value && order._id) {
    socket.value.emit('viewing_errand', { orderId: order._id, isViewing: true })
  }
  if (order._id) {
    api.post(`/orders/${order._id}/view`).catch(e => console.error('Failed to record view:', e))
  }
  
  // Fetch any existing bid we might have for this order
  if (order._id) {
    await fetchExistingBid(order._id)
  }

  // Connect to negotiation socket for NEGOTIATING orders
  if (order.status === 'negotiating' && order._id) {
    connectNegotiationSocket(order._id)
  }
}

watch(isDrawerOpen, (newVal) => {
  if (!newVal && selectedOrder.value?._id && socket.value) {
    socket.value.emit('viewing_errand', { orderId: selectedOrder.value._id, isViewing: false })
  }
  if (!newVal) {
    disconnectNegotiationSocket()
  }
})

const acceptOrder = async (id: string) => {
  acceptingId.value = id
  try {
    const res = await api.put(`/orders/${id}/accept`)
    if (res && (res as any).type !== 'ERROR') {
      pushToast('🚀 Order Claimed!', 'Loading your delivery instructions...', 'SUCCESS')
      setTimeout(() => {
        router.push(`/deliveries/${id}`)
      }, 1000)
    } else {
      availableOrders.value = availableOrders.value.filter(o => o._id !== id)
      pushToast('Claim Error', (res as any)?.data?.message || 'This order was already accepted by another rider.', 'ERROR')
    }
  } catch (e: any) {
    console.error('Accept error:', e)
    const errorMsg = e.response?.data?.message || 'Failed to accept order.'
    pushToast('Claim Failed', errorMsg, 'ERROR')
    loadAvailableOrders()
  } finally {
    acceptingId.value = null
  }
}

const acceptInterception = async (id: string) => {
  acceptingId.value = id;
  try {
    const res = await api.post(`/orders/${id}/interception/accept`);
    if (res && (res as any).type !== 'ERROR') {
      pushToast('🚀 Hand-off Accepted!', 'Loading delivery instructions...', 'SUCCESS');
      setTimeout(() => {
        router.push(`/deliveries/${id}`);
      }, 1000);
    } else {
      availableOrders.value = availableOrders.value.filter(o => o._id !== id);
      pushToast('Claim Error', (res as any)?.data?.message || 'This hand-off was already accepted by another rider.', 'ERROR');
    }
  } catch (e: any) {
    console.error('Accept Interception error:', e);
    const errorMsg = e.response?.data?.message || 'Failed to accept hand-off.';
    pushToast('Claim Failed', errorMsg, 'ERROR');
    loadAvailableOrders();
  } finally {
    acceptingId.value = null;
  }
}

const rejectOrder = (id: string) => {
  availableOrders.value = availableOrders.value.filter(o => o._id !== id)
  if (selectedOrder.value?._id === id) {
    isDrawerOpen.value = false
  }
}

const placeBid = async (id: string) => {
  if (!bidAmount.value) return;
  biddingId.value = id;
  try {
    const order = selectedOrder.value;
    
    if (order?.status === 'negotiating') {
      if (!negotiationSocket || !negotiationSocket.connected) {
        if (!negotiationSocket) {
          connectNegotiationSocket(id);
        } else {
          negotiationSocket.connect();
        }
        
        let retries = 0;
        while (!negotiationSocket?.connected && retries < 20) {
          await new Promise(r => setTimeout(r, 250));
          retries++;
        }

        if (!negotiationSocket?.connected) {
          pushToast('Bid Error', 'Network unstable. Could not reach negotiation server. Please check your connection.', 'ERROR');
          biddingId.value = null;
          return;
        }
      }
      
      // Use emitWithAck with timeout - works with NestJS @SubscribeMessage
      try {
        const response = await negotiationSocket.timeout(8000).emitWithAck('submitBid', {
          orderId: id,
          riderId: user.value?._id,
          bidAmount: bidAmount.value,
        });
        
        console.log('[placeBid] Response:', response);
        
        if (response?.success) {
          pushToast('🚀 Bid Sent!', `Your delivery bid of ₦${bidAmount.value?.toLocaleString()} has been sent to the student.`, 'SUCCESS');
          localPlacedBid.value = response.bid;
        } else {
          pushToast('Bid Error', response?.error || 'Failed to submit bid.', 'ERROR');
        }
      } catch (socketErr: any) {
        console.error('[placeBid] Socket error:', socketErr);
        // If emitWithAck times out or fails, the bid may still have been sent
        // Check if we got a newBid event in the meantime
        if (socketErr?.message?.includes('timeout')) {
          pushToast('Bid Timeout', 'The server took too long to respond. Your bid may have been sent — please check.', 'ERROR');
        } else {
          pushToast('Bid Error', 'Failed to send bid. Please try again.', 'ERROR');
        }
      }
      biddingId.value = null;
      return;
    }
    
    // REST API for custom errand counter-offers
    const res = await api.post(`/orders/${id}/custom/bid`, { amount: bidAmount.value });
    if (res && (res as any).type !== 'ERROR') {
      pushToast('Offer Sent!', 'Your offer has been sent to the customer.', 'SUCCESS');
      selectedOrder.value = res.data;
      const idx = availableOrders.value.findIndex(o => o._id === id);
      if (idx !== -1) availableOrders.value[idx] = res.data;
    } else {
      pushToast('Bid Error', (res as any)?.data?.message || 'Failed to submit bid.', 'ERROR');
    }
  } catch (e: any) {
    console.error('Bid error:', e);
    pushToast('Bid Failed', e.response?.data?.message || 'Failed to submit bid.', 'ERROR');
  } finally {
    biddingId.value = null;
  }
}

const getBidStatus = () => {
  if (typeof localPlacedBid.value === 'object' && localPlacedBid.value !== null) {
    return (localPlacedBid.value as any).status;
  }
  return null;
}

const getBidLastRole = () => {
  if (typeof localPlacedBid.value === 'object' && localPlacedBid.value !== null) {
    return (localPlacedBid.value as any).lastNegotiatorRole;
  }
  return null;
}

const acceptCounter = async (id: string) => {
  acceptingId.value = id;
  try {
    const bidId = typeof localPlacedBid.value === 'object' ? (localPlacedBid.value as any)._id : null;
    if (!bidId) throw new Error('No bid found to accept');

    const res = await api.put(`/orders/${id}/custom/bid/${bidId}/accept`);
    if (res && (res as any).type !== 'ERROR') {
      pushToast('🚀 Counter Accepted!', 'Loading your delivery instructions...', 'SUCCESS');
      setTimeout(() => {
        router.push(`/deliveries/${id}`);
      }, 1000);
    } else {
      pushToast('Claim Error', (res as any)?.data?.message || 'Failed to accept counter.', 'ERROR');
    }
  } catch (e: any) {
    console.error('Accept error:', e);
    const errorMsg = e.response?.data?.message || 'Failed to accept counter.';
    pushToast('Claim Failed', errorMsg, 'ERROR');
  } finally {
    acceptingId.value = null;
  }
}

const getMyBid = (order: any) => {
  if (localPlacedBid.value !== null) {
    if (typeof localPlacedBid.value === 'object') return (localPlacedBid.value as any).bidAmount;
    return localPlacedBid.value;
  }
  return bidAmount.value; 
}

const hasPlacedBid = (order: any) => {
  if (localPlacedBid.value !== null) return true;
  return order.bids?.length > 0 && bidAmount.value !== null;
}

const formatTime = (date: string) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Real-time handling
const handleNewOrder = (payload: any) => {
  const orderData = payload.data || payload
  
  // Guard against ghost orders (e.g. from misrouted ORDER_ACCEPTED payloads)
  if (orderData?.type === 'ORDER_ACCEPTED') return
  
  if (!orderData || !orderData.orderId || !orderData.orderNumber) {
    console.warn('handleNewOrder: Dropping malformed payload', payload)
    return
  }

  const exists = availableOrders.value.some(o => o._id === orderData.orderId)
  if (!exists) {
    const newOrder = {
      _id: orderData.orderId,
      orderNumber: orderData.orderNumber,
      vendor: {
        storeName: orderData.vendorName,
        logo: orderData.vendorLogo,
        address: orderData.vendorAddress
      },
      deliveryAddress: orderData.deliveryAddress,
      total: orderData.total,
      erranderPayout: orderData.erranderPayout,
      erranderShare: orderData.erranderShare,
      status: orderData.status,
      type: orderData.type,
      locationType: orderData.locationType,
      proposedDeliveryFee: orderData.proposedDeliveryFee,
      createdAt: new Date().toISOString(),
      customDetails: orderData.customDetails,
      bids: orderData.bids || [],
    }
    availableOrders.value.unshift(newOrder)
  }
}

const { user } = useUser()

const handleOrderAccepted = (payload: any) => {
  const orderId = payload.data?.orderId || payload.orderId
  const winningUserId = payload.data?.winningUserId
  
  if (winningUserId && user.value?._id === winningUserId) {
    if (selectedOrder.value?._id === orderId) {
      selectedOrder.value.status = 'awaiting_payment'
    }
    availableOrders.value = availableOrders.value.filter(o => o._id !== orderId)
    return
  }

  availableOrders.value = availableOrders.value.filter(o => o._id !== orderId)
  if (selectedOrder.value?._id === orderId) {
    isDrawerOpen.value = false
  }
}

const handleNewNotification = (payload: any) => {
  if (payload?.type === 'ORDER_BIDS_UPDATE' || payload?.type === 'BID_COUNTERED') {
    if (payload.data?.orderId && selectedOrder.value?._id === payload.data.orderId) {
      fetchExistingBid(payload.data.orderId)
    }
  }
  
  // Interception requested — new hand-off order appeared, reload to pick it up
  if (payload?.type === 'INTERCEPTION_REQUESTED') {
    loadAvailableOrders()
  }
  
  // Interception accepted — remove from pool (another rider took it)
  if (payload?.type === 'INTERCEPTION_ACCEPTED') {
    const orderId = payload.data?.orderId
    if (orderId) {
      availableOrders.value = availableOrders.value.filter(o => o._id !== orderId)
      if (selectedOrder.value?._id === orderId) {
        isDrawerOpen.value = false
      }
    }
  }
}

let currentSocket: any = null

watch(() => socket.value, (newSocket) => {
  if (currentSocket) {
    currentSocket.off('notification:new-order', handleNewOrder)
    currentSocket.off('notification:order-accepted', handleOrderAccepted)
    currentSocket.off('notification:new', handleNewNotification)
  }
  
  if (newSocket) {
    currentSocket = newSocket
    newSocket.on('notification:new-order', handleNewOrder)
    newSocket.on('notification:order-accepted', handleOrderAccepted)
    newSocket.on('notification:new', handleNewNotification)
  }
}, { immediate: true })

onMounted(() => {
  loadAvailableOrders()
  loadBatchStatus()
})

onUnmounted(() => {
  if (currentSocket) {
    currentSocket.off('notification:new-order', handleNewOrder)
    currentSocket.off('notification:order-accepted', handleOrderAccepted)
    currentSocket.off('notification:new', handleNewNotification)
  }
  disconnectNegotiationSocket()
})

useHead({ 
  title: 'Order Pool - Errandr',
  meta: [
    { name: 'description', content: 'Claim available orders in real-time.' }
  ]
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
