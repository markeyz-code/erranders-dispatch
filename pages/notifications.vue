<template>
  <div class="space-y-6 animate-fade-in max-w-7xl mx-auto pb-16">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight mb-1">Notifications</h1>
        <p class="text-gray-500 text-sm">Stay updated on your orders and deliveries.</p>
      </div>
      <button
        v-if="notifications.length > 0 && unreadCount > 0"
        @click="markAllAsRead"
        class="text-xs font-semibold text-[#FF5C1A] hover:underline"
      >
        Mark all as read
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-20 bg-white rounded-lg border border-gray-50 animate-pulse" />
    </div>

    <!-- Empty State -->
    <div v-else-if="notifications.length === 0" class="text-center py-20">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">🔔</div>
      <h3 class="text-lg font-bold text-gray-900 mb-1">No notifications yet</h3>
      <p class="text-sm text-gray-400">When orders come in or statuses change, you'll see them here.</p>
    </div>

    <!-- Notification List -->
    <div v-else class="space-y-2">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        :class="notif.read ? 'bg-white' : 'bg-[#FF5C1A]/[0.02] border-[#FF5C1A]/10'"
        class="rounded-lg border border-gray-50 overflow-hidden transition-all hover:border border-gray-25 group cursor-pointer"
        @click="handleNotifClick(notif)"
      >
        <div class="p-4 flex items-start gap-4">
          <!-- Icon -->
          <div
            :class="{
              'bg-blue-50': notif.type === 'NEW_ORDER_AVAILABLE',
              'bg-emerald-50': notif.type === 'ORDER_ACCEPTED',
              'bg-amber-50': notif.type === 'ORDER_STATUS_UPDATE',
              'bg-gray-50': !['NEW_ORDER_AVAILABLE', 'ORDER_ACCEPTED', 'ORDER_STATUS_UPDATE'].includes(notif.type),
            }"
            class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          >
            {{ getEmoji(notif.type) }}
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <h4 class="text-sm font-bold text-gray-900">{{ notif.title }}</h4>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="text-[10px] text-gray-400 whitespace-nowrap">{{ formatTime(notif.createdAt) }}</span>
                <div v-if="!notif.read" class="w-2 h-2 rounded-full bg-[#FF5C1A] flex-shrink-0" />
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ notif.body }}</p>
            
            <!-- Earnings badge for new orders -->
            <div v-if="notif.type === 'NEW_ORDER_AVAILABLE' && notif.data?.erranderShare" class="mt-2">
              <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                💰 ₦{{ notif.data.erranderShare.toLocaleString() }}
              </span>
            </div>

            <!-- Action buttons -->
            <div v-if="notif.type === 'NEW_ORDER_AVAILABLE' && !notif.data?.accepted" class="flex gap-2 mt-3">
              <button
                @click.stop="acceptNotifOrder(notif)"
                :disabled="notif.accepting"
                class="px-4 py-2 text-xs font-bold text-white bg-[#FF5C1A] rounded-xl hover:brightness-110 transition-all  disabled:opacity-50"
              >
                {{ notif.accepting ? 'Accepting...' : 'Accept Order' }}
              </button>
              <button
                @click.stop="dismissNotification(notif.id)"
                class="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { showToast } = useCustomToast()

definePageMeta({
  layout: 'errander'
})

useHead({ title: 'Notifications - Errandr' })

const {
  notifications,
  unreadCount,
  loading,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  dismissNotification,
} = useNotifications()

const getEmoji = (type: string) => ({
  NEW_ORDER_AVAILABLE: '🚀',
  ORDER_ACCEPTED: '✅',
  ORDER_STATUS_UPDATE: '📦',
  NEW_CHAT_MESSAGE: '💬',
}[type] || '🔔')

const formatTime = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const handleNotifClick = (notif: any) => {
  if (!notif.read) {
    markAsRead(notif.id)
  }
  if (notif.type === 'NEW_CHAT_MESSAGE' && notif.data?.orderId) {
    navigateTo(`/deliveries/chats?orderId=${notif.data.orderId}`)
    return
  }
  if (notif.data?.orderId) {
    navigateTo(`/deliveries/${notif.data.orderId}`)
  }
}

const acceptNotifOrder = async (notif: any) => {
  notif.accepting = true
  try {
    const res = await api.put(`/orders/${notif.data?.orderId}/accept`)
    if (res && (res as any).type !== 'ERROR') {
      showToast({
        title: '🎉 Order Accepted!',
        message: `You've accepted order #${notif.data?.orderNumber}. Head to the store for pickup!`,
        toastType: 'success',
        duration: 5000,
      })
      notif.data.accepted = true
      markAsRead(notif.id)
      navigateTo(`/deliveries/${notif.data?.orderId}`)
    } else {
      showToast({
        title: 'Could not accept',
        message: (res as any)?.data?.message || 'This order may have been accepted by another rider.',
        toastType: 'error',
        duration: 5000,
      })
    }
  } catch (e: any) {
    showToast({
      title: 'Error',
      message: e?.response?.data?.message || 'Failed to accept order.',
      toastType: 'error',
      duration: 5000,
    })
  } finally {
    notif.accepting = false
  }
}

onMounted(() => {
  fetchNotifications()
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
</style>
