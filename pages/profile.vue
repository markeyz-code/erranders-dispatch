<template>
 <div class="space-y-6 animate-fade-in max-w-7xl mx-auto pb-16">
 <!-- Header -->
 <div>
 <h1 class="text-2xl font-bold text-gray-900 tracking-tight mb-1">My Profile</h1>
 <p class="text-gray-500 text-sm">Manage your personal information and account settings.</p>
 </div>

 <div v-if="loading" class="space-y-4">
 <div v-for="i in 3" :key="i" class="h-24 bg-white rounded-lg border border-gray-50 animate-pulse"></div>
 </div>

 <div v-else class="space-y-6">
 <!-- Avatar & Name -->
 <div class="bg-white rounded-lg border border-gray-50 p-4">
 <div class="flex items-center gap-5">
 <div class="w-20 h-20 rounded-lg bg-[#FF5C1A] text-white flex items-center justify-center font-bold text-2xl border border-gray-25 shadow-[#FF5C1A]/20 flex-shrink-0">
 {{ userInitials }}
 </div>
 <div class="flex-1 min-w-0">
 <h2 class="text-xl font-bold text-gray-900 tracking-tight">{{ userDisplayName }}</h2>
 <p class="text-sm text-gray-400 truncate">{{ user?.email }}</p>
 <div class="flex items-center gap-2 mt-2">
 <span v-if="errandrProfile?.isVerified" class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">Verified Rider</span>
 <span v-if="errandrProfile?.rating >= 4.5" class="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">⭐ Top Rated</span>
 <span v-if="isOnline" class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">🟢 Online</span>
 <span v-else class="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-50">Offline</span>
 </div>
 </div>
 </div>
 </div>

 <!-- Personal Information -->
 <div class="bg-white rounded-lg border border-gray-50 overflow-hidden">
 <div class="px-4 py-4 border-b border-gray-50 flex items-center justify-between">
 <h3 class="text-base font-bold text-gray-900">Personal Information</h3>
 <button v-if="!isEditing" @click="startEdit" class="text-xs font-semibold text-[#FF5C1A] hover:underline">Edit</button>
 <div v-else class="flex gap-2">
 <button @click="saveProfile" :disabled="saving" class="text-xs font-semibold text-white bg-[#FF5C1A] px-4 py-1.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50">
 {{ saving ? 'Saving...' : 'Save' }}
 </button>
 <button @click="cancelEdit" class="text-xs font-semibold text-gray-500 hover:text-gray-700">Cancel</button>
 </div>
 </div>

 <div class="p-4 space-y-5">
 <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div>
 <label class="text-[11px] font-medium text-gray-400 tracking-wider mb-1.5 block">First Name</label>
 <input 
 v-model="form.firstName"
 :disabled="!isEditing"
 class="w-full px-4 py-2.5 bg-gray-50 border border-gray-50 rounded-xl text-base font-medium focus:ring-2 focus:ring-[#FF5C1A]/20 focus:bg-white focus:border-[#FF5C1A]/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
 />
 </div>
 <div>
 <label class="text-[11px] font-medium text-gray-400 tracking-wider mb-1.5 block">Last Name</label>
 <input 
 v-model="form.lastName"
 :disabled="!isEditing"
 class="w-full px-4 py-2.5 bg-gray-50 border border-gray-50 rounded-xl text-base font-medium focus:ring-2 focus:ring-[#FF5C1A]/20 focus:bg-white focus:border-[#FF5C1A]/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
 />
 </div>
 </div>
 <div>
 <label class="text-[11px] font-medium text-gray-400 tracking-wider mb-1.5 block">Email Address</label>
 <input 
 :value="user?.email"
 disabled
 class="w-full px-4 py-2.5 bg-gray-50 border border-gray-50 rounded-xl text-base font-medium opacity-60 cursor-not-allowed"
 />
 </div>
 <div>
 <label class="text-[11px] font-medium text-gray-400 tracking-wider mb-1.5 block">Phone Number</label>
 <input 
 v-model="form.phone"
 :disabled="!isEditing"
 class="w-full px-4 py-2.5 bg-gray-50 border border-gray-50 rounded-xl text-base font-medium focus:ring-2 focus:ring-[#FF5C1A]/20 focus:bg-white focus:border-[#FF5C1A]/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
 placeholder="Enter your phone number"
 />
 </div>
 </div>
 </div>

 <!-- Account Stats -->
 <div class="bg-white rounded-lg border border-gray-50 overflow-hidden">
 <div class="px-4 py-4 border-b border-gray-50">
 <h3 class="text-base font-bold text-gray-900">Account Overview</h3>
 </div>
 <div class="p-4">
 <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
 <div class="text-center p-4 bg-gray-50 rounded-xl">
 <p class="text-2xl font-bold text-gray-900 mb-1">{{ errandrProfile?.totalDeliveries || 0 }}</p>
 <p class="text-[11px] text-gray-400 font-medium">Deliveries</p>
 </div>
 <div class="text-center p-4 bg-gray-50 rounded-xl">
 <p class="text-2xl font-bold text-gray-900 mb-1">{{ (errandrProfile?.rating || 0).toFixed(1) }}</p>
 <p class="text-[11px] text-gray-400 font-medium">Rating</p>
 </div>
 <div class="text-center p-4 bg-gray-50 rounded-xl">
 <p class="text-2xl font-bold text-gray-900 mb-1">{{ errandrProfile?.rank || '—' }}</p>
 <p class="text-[11px] text-gray-400 font-medium">Rank</p>
 </div>
 <div class="text-center p-4 bg-gray-50 rounded-xl">
 <p class="text-2xl font-bold text-gray-900 mb-1">{{ memberSince }}</p>
 <p class="text-[11px] text-gray-400 font-medium">Member Since</p>
 </div>
 </div>
 </div>
 </div>

 <!-- Availability Toggle -->
 <div class="bg-white rounded-lg border border-gray-50 overflow-hidden">
 <div class="px-4 py-4 border-b border-gray-50">
 <h3 class="text-base font-bold text-gray-900">Availability</h3>
 </div>
 <div class="p-4">
 <div class="flex items-center justify-between">
 <div>
 <p class="text-sm font-semibold text-gray-900">Accept New Deliveries</p>
 <p class="text-xs text-gray-400 mt-0.5">Toggle to go online or offline for new orders</p>
 </div>
 <button 
 @click="toggleAvailability" 
 :disabled="togglingStatus"
 :class="isOnline ? 'bg-emerald-500' : 'bg-gray-300'"
 class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors disabled:opacity-50"
 >
 <span 
 :class="isOnline ? 'translate-x-6' : 'translate-x-1'"
 class="inline-block h-5 w-5 transform rounded-full bg-white border border-gray-25 transition-transform"
 />
 </button>
 </div>
 </div>
 </div>

 <!-- Security -->
 <div class="bg-white rounded-lg border border-gray-50 overflow-hidden">
 <div class="px-4 py-4 border-b border-gray-50">
 <h3 class="text-base font-bold text-gray-900">Security</h3>
 </div>
 <div class="p-4 space-y-4">
 <button class="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group">
 <span class="flex items-center gap-3">
 <span class="text-base">🔒</span>
 Change Password
 </span>
 <ChevronRight class="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
 </button>
 </div>
 </div>
 </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { useUser } from '@/composables/modules/auth/user'
import { erranders_api } from '@/api_factory/modules/erranders'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'

definePageMeta({
 layout: 'errander'
})

const { user } = useUser()
const loading = ref(true)
const isEditing = ref(false)
const saving = ref(false)
const togglingStatus = ref(false)
const errandrProfile = ref<any>(null)

const form = reactive({
 firstName: '',
 lastName: '',
 phone: '',
})

const userDisplayName = computed(() => {
 if (!user.value) return 'Rider'
 return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || user.value.email || 'Rider'
})

const userInitials = computed(() => {
 if (!user.value) return 'R'
 const first = user.value.firstName || ''
 const last = user.value.lastName || ''
 return ((first[0] || '') + (last[0] || '')).toUpperCase() || user.value.email?.[0]?.toUpperCase() || 'R'
})

const isOnline = computed(() => {
 return errandrProfile.value?.status === 'available' || errandrProfile.value?.status === 'AVAILABLE'
})

const memberSince = computed(() => {
 const date = errandrProfile.value?.createdAt || (user.value as any)?.createdAt
 if (!date) return '—'
 const d = new Date(date)
 return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
})

const loadProfile = async () => {
 loading.value = true
 try {
 const res = await erranders_api.getProfile()
 if (res && (res as any).type !== 'ERROR' && res.data) {
 errandrProfile.value = res.data
 }
 
 // Pre-fill form
 form.firstName = user.value?.firstName || ''
 form.lastName = user.value?.lastName || ''
 form.phone = (errandrProfile.value as any)?.phone || (user.value as any)?.phone || ''
 } catch (e) {
 console.error('Failed to load profile:', e)
 // Still fill form with user data
 form.firstName = user.value?.firstName || ''
 form.lastName = user.value?.lastName || ''
 form.phone = ''
 } finally {
 loading.value = false
 }
}

const startEdit = () => {
 isEditing.value = true
}

const saveProfile = async () => {
 saving.value = true
 try {
 await api.put('/users/me', {
 firstName: form.firstName,
 lastName: form.lastName,
 phone: form.phone,
 })
 isEditing.value = false
 } catch (e) {
 console.error('Failed to update profile:', e)
 } finally {
 saving.value = false
 }
}

const cancelEdit = () => {
 form.firstName = user.value?.firstName || ''
 form.lastName = user.value?.lastName || ''
 form.phone = (errandrProfile.value as any)?.phone || (user.value as any)?.phone || ''
 isEditing.value = false
}

const toggleAvailability = async () => {
 togglingStatus.value = true
 try {
 await erranders_api.toggleOnline()
 // Refresh profile to get updated status
 const res = await erranders_api.getProfile()
 errandrProfile.value = res.data
 } catch (e) {
 console.error('Failed to toggle status:', e)
 } finally {
 togglingStatus.value = false
 }
}

onMounted(loadProfile)

useHead({ title: 'Profile - Errandr' })
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
