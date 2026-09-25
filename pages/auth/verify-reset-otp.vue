<template>
  <div class="min-h-screen w-full bg-white flex items-center justify-center p-4 relative overflow-hidden">
    <div class="w-full max-w-[340px] relative z-10">
      <NuxtLink to="/auth/forgot-password" class="absolute -top-16 left-0 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft class="w-4 h-4" /> Back
      </NuxtLink>

      <div class="w-full">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-[#FF5C1A]/10 text-[#FF5C1A] mb-6 shadow-inner">
            <Mail class="w-8 h-8" />
          </div>
          <h1 class="text-lg font-medium text-gray-900 tracking-tight mb-2">Check your email</h1>
          <p class="text-gray-500 font-medium text-sm leading-relaxed">
            We sent a 6-digit verification code to <br>
            <strong class="text-gray-900">{{ email }}</strong>
          </p>
        </div>

        <div class="flex justify-center gap-2 py-2 mb-6">
          <input 
            v-for="(_, i) in 6" 
            :key="i" 
            :ref="el => { if (el) otpRefs[i] = el as HTMLInputElement }" 
            v-model="otpDigits[i]" 
            @input="handleOTPInput(i)" 
            @keydown.backspace="handleOTPBackspace(i, $event)" 
            @paste.prevent="handleOTPPaste" 
            type="text" 
            maxlength="1" 
            inputmode="numeric" 
            class="w-12 h-14 text-center text-lg font-medium bg-gray-50 border border-gray-200 rounded-xl focus:border-[#FF5C1A] focus:ring-4 focus:ring-[#FF5C1A]/10 outline-none transition-all" 
          />
        </div>

        <transition name="fade">
          <div v-if="error" class="mb-6 flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] font-bold text-red-600">
            <AlertCircle class="w-4 h-4 shrink-0" />
            {{ error }}
          </div>
        </transition>

        <button 
          @click="verifyOTP" 
          :disabled="loading || otpDigits.join('').length < 6" 
          class="w-full py-2 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm border border-gray-100 shadow-[#FF5C1A]/20 active:scale-[0.98]">
          <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
          <span v-else>Verify Code</span>
        </button>

        <div class="mt-5 text-center">
          <button @click="resendOTP" :disabled="resendCooldown > 0" class="text-sm font-bold text-gray-500 hover:text-[#FF5C1A] disabled:opacity-50 transition-colors">
            {{ resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Mail, Loader2, ArrowLeft, AlertCircle } from 'lucide-vue-next'
import { useAuth } from '@/composables/modules/auth'
import { useRoute } from 'vue-router'
import { auth_api } from '@/api_factory/modules/auth'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: false })
useHead({ title: 'Verify OTP - Errandr' })

const route = useRoute()
const email = route.query.email as string || ''
const { verifyResetOTP, loading } = useAuth()
const { showToast } = useCustomToast()
const error = ref('')

const otpDigits = reactive(['', '', '', '', '', ''])
const otpRefs = reactive<HTMLInputElement[]>([])
const resendCooldown = ref(0)
let cooldownInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (!email) {
    navigateTo('/auth/forgot-password')
  }
})

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval)
})

const handleOTPInput = (i: number) => { 
  error.value = ''
  if (otpDigits[i] && i < 5) otpRefs[i + 1]?.focus() 
}

const handleOTPBackspace = (i: number, e: KeyboardEvent) => { 
  error.value = ''
  if (!otpDigits[i] && i > 0) otpRefs[i - 1]?.focus() 
}

const handleOTPPaste = (e: ClipboardEvent) => {
  error.value = ''
  const pasted = e.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6) || ''
  for (let i = 0; i < 6; i++) otpDigits[i] = pasted[i] || ''
  if (pasted.length >= 6) otpRefs[5]?.focus()
}

const startCooldown = () => {
  resendCooldown.value = 60
  if (cooldownInterval) clearInterval(cooldownInterval)
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) { 
      clearInterval(cooldownInterval!)
      cooldownInterval = null 
    }
  }, 1000)
}

const resendOTP = async () => {
  try {
    const res = await auth_api.resendOtp(email)
    showToast({ title: 'Code Sent!', message: 'A fresh code is on its way.', toastType: 'success' })
    startCooldown()
  } catch (e: any) { 
    showToast({ title: 'Oops!', message: 'Could not resend code.', toastType: 'error' }) 
  }
}

const verifyOTP = async () => {
  error.value = ''
  try {
    await verifyResetOTP(email, otpDigits.join(''))
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Invalid code. Try again.'
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
