<template>
  <div class="h-screen w-screen flex bg-[#F0F2F5] overflow-hidden fixed inset-0 z-50">
    <!-- Left Sidebar (WhatsApp Web style) -->
    <div 
      :class="[
        'w-full md:w-[35%] lg:w-[30%] max-w-[420px] min-w-[320px] flex-col bg-white border-r border-gray-200 flex-shrink-0 transition-all',
        activeChat ? 'hidden md:flex' : 'flex'
      ]"
    >
      <!-- Header: ours, not a messenger's -->
      <div class="chats-head">
        <button type="button" class="chats-back" aria-label="Back to Home" @click="navigateTo('/dashboard')">
          <ArrowLeft class="w-5 h-5" />
        </button>
        <h1 class="chats-title">Chats</h1>
        <span class="chats-me">{{ myInitials }}</span>
      </div>

      <!-- Search -->
      <div class="chats-search">
        <Search class="w-[18px] h-[18px]" />
        <input v-model="searchQuery" type="text" placeholder="Search by name or order" aria-label="Search chats" />
      </div>

      <!-- Chat List -->
      <div class="chats-list">
        <div v-if="loading" class="chats-skeleton">
          <div v-for="i in 5" :key="i" class="skeleton-row" />
        </div>

        <div v-else-if="filteredChats.length === 0" class="chats-empty">
          <MessageSquare class="w-10 h-10" />
          <p class="chats-empty-title">No chats yet</p>
          <p class="chats-empty-sub">Conversations with customers and vendors appear here once a delivery starts.</p>
        </div>

        <template v-else>
          <button
            v-for="chat in filteredChats"
            :key="chat.id"
            type="button"
            class="chat-row"
            :class="{ on: activeChat?.id === chat.id }"
            @click="selectChat(chat)"
          >
            <span class="chat-avatar">{{ initialsOf(chat) }}</span>

            <span class="chat-body">
              <span class="chat-line">
                <span class="chat-name">{{ nameOf(chat) }}</span>
                <span class="chat-time">{{ formatTime(chat.order?.createdAt) }}</span>
              </span>
              <span class="chat-line">
                <span class="chat-preview">
                  {{ chat.receiverType ? String(chat.receiverType) : 'Chat' }}<template v-if="chat.order?.orderNumber"> · #{{ chat.order.orderNumber }}</template>
                </span>
                <span v-if="unreadCounts[chat.order?._id] > 0" class="chat-badge">{{ unreadCounts[chat.order._id] }}</span>
              </span>
            </span>
          </button>
        </template>
      </div>
    </div>

    <!-- Right Area (Chat View) -->
    <div 
      :class="[
        'flex-1 flex-col bg-[#F0F2F5] border-l border-[#E1E1E1]',
        !activeChat ? 'hidden md:flex' : 'flex'
      ]"
    >
      <div v-if="!activeChat" class="flex-1 flex flex-col items-center justify-center text-center p-5 bg-[#F0F2F5]">
        <div class="w-80 h-80 mb-8 opacity-20 mx-auto">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100Z" fill="#075E54"/>
            <path d="M70.5 35.5C70.5 35.5 68.5 32 63.5 32C58.5 32 55.5 35.5 55.5 35.5C55.5 35.5 53 38 52 38.5C51 39 48.5 38 46 36.5C43.5 35 42.5 32 42.5 32C42.5 32 44.5 29 42.5 27.5C40.5 26 38.5 23 37.5 23C36.5 23 34.5 24.5 33 26.5C31.5 28.5 30 33 34.5 39C39 45 44.5 50 49 51.5C53.5 53 58.5 53 62.5 51.5C66.5 50 69.5 47 70.5 45C71.5 43 70.5 35.5 70.5 35.5Z" fill="white"/>
          </svg>
        </div>
        <h2 class="text-[32px] font-light text-[#41525D] mb-4">Erranders for Web</h2>
        <p class="text-[14px] text-[#667781] max-w-md leading-relaxed">
          Send and receive messages without keeping your phone online.<br/>
          Use Erranders on up to 4 linked devices and 1 phone at the same time.
        </p>
        <div class="mt-10 flex items-center justify-center gap-1.5 text-[14px] text-[#8696A0]">
          <Lock class="w-3.5 h-3.5" />
          <span>End-to-end encrypted</span>
        </div>
      </div>

      <EmbeddedOrderChat 
        v-else
        :key="activeChat.id"
        :is-open="true"
        :order-id="activeChat.order._id"
        :current-user-id="user?.id || user?._id"
        :receiver-id="activeChat.receiverId"
        :receiver-name="activeChat.receiverName"
        :receiver-avatar="activeChat.avatar"
        @close="activeChat = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, ArrowLeft, MessageSquare, MoreVertical, CheckCheck, Lock } from 'lucide-vue-next'
import EmbeddedOrderChat from '@/components/core/EmbeddedOrderChat.vue'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useUser } from '@/composables/modules/auth/user'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: false
})

const { user } = useUser()
const route = useRoute()

const orders = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')
const activeChat = ref<any>(null)
const unreadCounts = ref<Record<string, number>>({})

import { useSocket } from '@/composables/useSocket'
const { on, connect } = useSocket('chat')

const fetchOrders = async () => {
  loading.value = true
  try {
    const [res, unreadRes] = await Promise.all([
      api.get('/orders/errander'),
      api.get('/chat/unread/orders').catch(() => ({ data: {} }))
    ])
    
    const responseData = (res as any)?.data?.data || (res as any)?.data || res
    orders.value = Array.isArray(responseData) ? responseData : (responseData?.orders || [])
    
    if (unreadRes && unreadRes.data) {
      unreadCounts.value = unreadRes.data
    }
    
    // Check if route has an orderId to auto-select
    if (route.query.orderId) {
      // By default open the customer chat if coming from generic link
      const targetChat = chatList.value.find(c => c.order._id === route.query.orderId && c.receiverType === 'Customer')
      if (targetChat) {
        activeChat.value = targetChat
      }
    }
  } catch (e) {
    console.error('Failed to fetch orders for chat', e)
  } finally {
    loading.value = false
  }
}

const chatList = computed(() => {
  const list: any[] = []
  for (const order of orders.value) {
    // Map Student (Customer) chat
    if (order.customer) {
      list.push({
        id: `customer_${order._id}`,
        order: order,
        receiverId: order.customer._id || order.customer,
        receiverName: `${order.customer.firstName || 'Student'} ${order.customer.lastName || ''}`.trim(),
        receiverType: 'Customer',
        avatar: order.customer.avatar
      })
    }
    // Map Vendor chat
    if (order.vendor) {
      list.push({
        id: `vendor_${order._id}`,
        order: order,
        receiverId: order.vendor.owner || order.vendor._id || order.vendor, // Assuming vendor owner is the user to chat with
        receiverName: `${order.vendor.storeName || 'Vendor'}`.trim(),
        receiverType: 'Vendor',
        avatar: order.vendor.storeLogo || order.vendor.avatar
      })
    }
  }
  return list
})

const filteredChats = computed(() => {
  if (!searchQuery.value) return chatList.value
  const q = searchQuery.value.toLowerCase()
  return chatList.value.filter(c => {
    const orderNum = (c.order.orderNumber || '').toLowerCase()
    const rName = (c.receiverName || '').toLowerCase()
    return orderNum.includes(q) || rName.includes(q)
  })
})

const selectChat = (chat: any) => {
  activeChat.value = chat
  if (chat.order && chat.order._id) {
    unreadCounts.value[chat.order._id] = 0
  }
}

/** Never print "undefined" at someone: a missing name falls back to who they are in the trade. */
const nameOf = (chat: any) =>
  String(chat?.receiverName || chat?.receiver?.firstName || (chat?.receiverType === 'Vendor' ? 'Vendor' : 'Customer')).trim()

const initialsOf = (chat: any) => {
  const name = nameOf(chat)
  const parts = name.split(' ').filter(Boolean)
  const letters = (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
  return (letters || name[0] || 'C').toUpperCase()
}

const myInitials = computed(() => {
  const first = String(user.value?.firstName || '').trim()
  const last = String(user.value?.lastName || '').trim()
  return ((first[0] || '') + (last[0] || first[1] || '')).toUpperCase() || 'R'
})

const getInitials = (name: string) => {
  if (!name) return 'U'
  const parts = name.split(' ')
  const f = parts[0]?.[0] || ''
  const l = parts.length > 1 ? parts[1]?.[0] : ''
  return (f + l).toUpperCase()
}

const formatTime = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

onMounted(() => {
  fetchOrders()
  connect()
  on('newMessageNotification', (msg: any) => {
    const orderId = msg.order?._id || msg.order || msg.orderId;
    if (orderId) {
      // If the chat is not currently open, increment its unread count
      if (!activeChat.value || activeChat.value.order._id !== orderId) {
        unreadCounts.value[orderId] = (unreadCounts.value[orderId] || 0) + 1;
      }
    }
  })
})
</script>

<style scoped>
/* The chat list, in this app's clothes rather than a messenger's. */
.chats-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid #eef0f3;
  background: #fff;
  flex: none;
}

.chats-back {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid #eef0f3;
  background: #fff;
  color: #14110d;
}

.chats-title {
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #14110d;
}

.chats-me {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: #14110d;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.chats-search {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 12px 14px;
  padding: 0 12px;
  border-radius: 12px;
  background: #f4f5f7;
  color: #9aa1ac;
  flex: none;
}

.chats-search input {
  flex: 1;
  min-width: 0;
  padding: 12px 0;
  border: 0;
  background: transparent;
  font-size: 15px;
  color: #14110d;
  outline: none;
}

.chats-list {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.chat-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: 0;
  border-bottom: 1px solid #f4f5f7;
  background: #fff;
  text-align: left;
}

.chat-row:active,
.chat-row.on {
  background: #fbf8f4;
}

.chat-avatar {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 999px;
  background: #fff1e8;
  color: #ff5c1a;
  font-size: 14px;
  font-weight: 800;
  flex: none;
}

.chat-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.chat-line {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.chat-name {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  color: #14110d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-time {
  font-size: 11.5px;
  font-weight: 600;
  color: #9aa1ac;
  flex: none;
}

.chat-preview {
  flex: 1;
  font-size: 13px;
  color: #9aa1ac;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-badge {
  min-width: 20px;
  padding: 1px 6px;
  border-radius: 999px;
  background: #ff5c1a;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  text-align: center;
}

.chats-skeleton {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-row {
  height: 58px;
  border-radius: 12px;
  background: #f4f5f7;
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  50% { opacity: 0.5; }
}

.chats-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 60px 24px;
  text-align: center;
  color: #c3c8d0;
}

.chats-empty-title {
  margin: 8px 0 0;
  font-size: 15px;
  font-weight: 750;
  color: #14110d;
}

.chats-empty-sub {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #9aa1ac;
  max-width: 34ch;
}
</style>
