<template>
  <div class="min-h-screen w-full bg-white flex items-center justify-center p-4 relative overflow-hidden">
    <div class="w-full max-w-[420px] relative z-10">
      <!-- Main Content -->
      <div class="w-full">
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-[#FF5C1A]/10 text-[#FF5C1A] mb-6 shadow-inner">
            <Lock class="w-8 h-8" />
          </div>
          <h1 class="text-xl font-medium text-gray-900 tracking-tight mb-2">Create New Password</h1>
          <p class="text-gray-500 font-medium text-sm">Your new password must be different from previous used passwords.</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleReset" class="space-y-6">
          <UiAnimatedInput 
            v-model="password" 
            type="password" 
            label="New Password" 
            :hasError="!!validationErrors.password"
            :errorMessage="validationErrors.password"
            @input="validationErrors.password = ''" 
          />
          
          <UiAnimatedInput 
            v-model="confirmPassword" 
            type="password" 
            label="Confirm New Password" 
            :hasError="!!validationErrors.confirmPassword"
            :errorMessage="validationErrors.confirmPassword"
            @input="validationErrors.confirmPassword = ''" 
          />

          <transition name="fade">
            <div v-if="error" class="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] font-bold text-red-600">
              <AlertCircle class="w-4 h-4 shrink-0" />
              {{ error }}
            </div>
          </transition>

          <button type="submit" :disabled="loading"
            class="w-full py-2.5 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm border border-gray-100 shadow-[#FF5C1A]/20 group active:scale-[0.98]">
            <Loader2 v-if="loading" class="animate-spin w-5 h-5" />
            <span v-else>Reset Password</span>
            <ArrowRight v-if="!loading" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Lock, Loader2, ArrowRight, AlertCircle } from 'lucide-vue-next'
import { useAuth } from '@/composables/modules/auth'
import { useRoute } from 'vue-router'

definePageMeta({ layout: false })
useHead({ title: 'Reset Password - Errandr' })

const route = useRoute()
const email = route.query.email as string || ''
const otp = route.query.otp as string || ''

const { resetPassword, loading } = useAuth()
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

onMounted(() => {
  if (!email || !otp) {
    navigateTo('/auth/forgot-password')
  }
})

const validationErrors = reactive({
  password: '',
  confirmPassword: ''
})

const validate = () => {
  let isValid = true
  validationErrors.password = ''
  validationErrors.confirmPassword = ''

  if (!password.value) {
    validationErrors.password = 'Password is required'
    isValid = false
  } else if (password.value.length < 6) {
    validationErrors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  if (password.value !== confirmPassword.value) {
    validationErrors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handleReset = async () => {
  error.value = ''
  if (!validate()) return

  try { 
    await resetPassword({ 
      email, 
      otp, 
      newPassword: password.value, 
      confirmPassword: confirmPassword.value 
    })
  }
  catch (e: any) { 
    error.value = e.data?.message || e.response?.data?.message || 'Failed to reset password' 
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
