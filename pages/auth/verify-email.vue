<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-white overflow-hidden py-8 px-4 sm:px-4 lg:px-5">
    <!-- Form Card -->
    <div class="w-full max-w-sm flex flex-col justify-center px-0 sm:px-4 py-8 bg-white relative z-10 my-8">
      
      <transition name="fade" mode="out-in">
        <div v-if="!showSuccess">
          <div class="mb-6 text-center flex flex-col items-center">
            <NuxtLink to="/" class="flex items-center gap-2 mb-8 inline-block group">
                     <div class="flex items-center justify-center group-hover:scale-110 transition-transform">
                <img src="@/assets/img/logo-light.png" class="w-auto h-9" alt="Errandr" />
              </div>
            </NuxtLink>
            <h1 class="text-lg sm:text-lg font-extrabold text-gray-900 mb-2 tracking-tight">Check your inbox</h1>
            <p class="text-gray-500 text-sm sm:text-sm">We sent a verification code to <span class="font-semibold text-gray-900">{{ email }}</span></p>
          </div>

          <form @submit.prevent="handleVerify" class="space-y-8 max-w-sm">
            <div class="space-y-4">
              <label class="text-sm font-bold text-gray-700 ml-1">Verification code</label>
              <UiOtpInput v-model="otp" />
            </div>

            <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>

            <button type="submit" :disabled="loading || otp.length < 6"
              class="w-full py-2 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm border border-gray-100 shadow-[#FF5C1A]/20 active:scale-95">
              <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
              {{ loading ? 'Verifying...' : 'Verify Email' }}
            </button>

            <!-- Resend Section -->
            <div class="text-center mt-6">
              <p class="text-sm text-gray-500 font-medium">
                Didn't receive the code?
                <button type="button" @click="handleResend" :disabled="resendLoading || resendTimer > 0" class="text-[#FF5C1A] hover:text-[#E54D12] font-bold disabled:opacity-50 disabled:cursor-not-allowed ml-1 transition-colors">
                  {{ resendTimer > 0 ? `Resend in ${resendTimer}s` : (resendLoading ? 'Sending...' : 'Resend OTP') }}
                </button>
              </p>
            </div>
          </form>

          <div class="mt-auto pt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 font-medium">
            <p>&copy; {{ new Date().getFullYear() }} Errandr</p>
            <NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink>
            <NuxtLink to="/terms" class="hover:text-gray-600">Privacy</NuxtLink>
          </div>
        </div>

        <!-- Success Modal from register.vue -->
        <div v-else class="w-full flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] bg-white rounded-[2rem] relative z-20 border border-gray-100 shadow-[0_20px_60px_-15px_rgba(255,92,26,0.1)] p-5">
          <div class="relative w-28 h-28 flex items-center justify-center mb-4">
            <div class="absolute inset-0 bg-[#FF5C1A]/10 rounded-full animate-ping" style="animation-duration: 2s;"></div>
            <div class="absolute inset-2 bg-[#FF5C1A]/20 rounded-full animate-ping" style="animation-duration: 2s; animation-delay: 0.5s;"></div>
            <div class="w-24 h-24 bg-gradient-to-br from-[#FF5C1A] to-[#FFA785] rounded-full flex items-center justify-center text-white shadow-sm border border-gray-100 shadow-[#FF5C1A]/40 relative z-10 animate-bounce">
              <Check class="w-12 h-9" stroke-width="3" />
            </div>
          </div>
          
          <div class="space-y-3">
            <h2 class="text-lg font-medium text-gray-900 tracking-tight">Welcome to the fleet! 🎉</h2>
            <div class="relative">
              <p class="text-gray-500 font-medium leading-relaxed max-w-[300px] mx-auto text-[15px]">
                You're officially a campus rider. Get ready to hit the road and start earning! 🚀
              </p>
            </div>
          </div>

          <div class="w-full pt-8 mt-auto">
            <button @click="proceedToDashboard" class="w-full py-2 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-medium text-[17px] transition-all flex items-center justify-center gap-2 shadow-sm border border-gray-100 shadow-[#FF5C1A]/25 active:scale-[0.98] group">
              Proceed to Dashboard <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, Check, ArrowRight } from 'lucide-vue-next'
import { ref, onMounted, nextTick } from 'vue'
import { useAuth } from '@/composables/modules/auth'
import confetti from 'canvas-confetti'

definePageMeta({ layout: false })
useHead({ title: 'Verify Email - Errandr' })

const route = useRoute()
const { verifyOTP, resendOTP, loading } = useAuth()

const email = ref('')
const otp = ref('')
const error = ref('')
const showSuccess = ref(false)
const resendLoading = ref(false)
const resendTimer = ref(0)
let timerInterval: any = null

const handleVerify = async () => {
  error.value = ''
  try {
    await verifyOTP(email.value, otp.value.trim(), { redirect: false })
    showSuccess.value = true
    nextTick(() => {
      triggerConfetti()
    })
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Invalid code or it has expired. Please double-check.'
  }
}

const startResendTimer = () => {
  resendTimer.value = 60
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--
    } else {
      clearInterval(timerInterval)
    }
  }, 1000)
}

const handleResend = async () => {
  if (resendTimer.value > 0 || resendLoading.value) return
  resendLoading.value = true
  error.value = ''
  try {
    await resendOTP(email.value)
    startResendTimer()
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Failed to resend code. Please try again.'
  } finally {
    resendLoading.value = false
  }
}

onMounted(() => {
  if (route.query.email) {
    email.value = route.query.email as string
    startResendTimer() // start timer initially since a code was just sent
  } else {
    navigateTo('/auth/login')
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

const triggerConfetti = () => {
  const duration = 3500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.6 },
      colors: ['#FF5C1A', '#FFA785', '#FFF', '#FFD700', '#FF69B4']
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.6 },
      colors: ['#FF5C1A', '#FFA785', '#FFF', '#FFD700', '#FF69B4']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

const proceedToDashboard = () => {
  navigateTo('/dashboard')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
