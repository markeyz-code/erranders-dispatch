<template>
  <div class="min-h-screen w-full bg-white flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Pure White Background -->
    <div class="w-full max-w-[340px] relative z-10">
      <!-- Back to Login -->
      <NuxtLink to="/auth/login" class="absolute -top-16 left-0 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft class="w-4 h-4" /> Back to login
      </NuxtLink>

      <!-- Main Content -->
      <div class="w-full">
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-[#FF5C1A]/10 text-[#FF5C1A] mb-6 shadow-inner">
            <KeyRound class="w-8 h-8" />
          </div>
          <h1 class="text-lg font-medium text-gray-900 tracking-tight mb-2">Forgot Password</h1>
          <p class="text-gray-500 font-medium text-sm">Enter your email to receive a reset code</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleForgot" class="space-y-6">
          <UiAnimatedInput 
            v-model="email" 
            type="email" 
            label="Email Address" 
            :hasError="!!error"
            :errorMessage="error"
            @input="error = ''" 
          />

          <button type="submit" :disabled="loading || !email"
            class="w-full py-2 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm border border-gray-100 shadow-[#FF5C1A]/20 group active:scale-[0.98]">
            <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
            <span v-else>Send Reset Code</span>
            <ArrowRight v-if="!loading" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { KeyRound, Loader2, ArrowRight, ArrowLeft } from 'lucide-vue-next'
import { useAuth } from '@/composables/modules/auth'

definePageMeta({ layout: false })
useHead({ title: 'Forgot Password - Errandr' })

const { forgotPassword, loading } = useAuth()
const email = ref('')
const error = ref('')

const handleForgot = async () => {
  error.value = ''
  if (!email.value) {
    error.value = 'Email address is required'
    return
  }

  try { 
    await forgotPassword(email.value)
  }
  catch (e: any) { 
    error.value = e.data?.message || e.response?.data?.message || 'Failed to send reset code' 
  }
}
</script>
