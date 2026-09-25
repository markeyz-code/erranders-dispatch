<template>
  <div class="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
    <div class="w-full max-w-[420px] relative z-10">
      <div class="w-full">
        <!-- Header -->
        <div class="text-center space-y-3 mb-10">
          <div class="flex items-center justify-center transition-transform">
            <img src="@/assets/img/logo-light.png" class="w-auto h-10" alt="Errandr" />
          </div>
          <h1 class="text-3xl font-medium text-gray-900 tracking-tight mb-2">Become an Errand Ninja! 🥷</h1>
          <p class="text-gray-500 font-medium text-sm">Sign up with Google to start delivering</p>
        </div>

        <!-- Google Sign Up -->
        <div class="space-y-5">
          <transition name="fade">
            <div v-if="error" class="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl text-[13px] font-bold text-red-600">
              <AlertCircle class="w-4 h-4 shrink-0" />
              {{ error }}
            </div>
          </transition>

          <button type="button" @click="handleGoogleSignup" :disabled="firebaseLoading"
            class="w-full py-4 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-md shadow-[#FF5C1A]/20">
            <Loader2 v-if="firebaseLoading" class="animate-spin w-5 h-5" />
            <svg v-else class="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="currentColor" fill-opacity="0.3"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" fill-opacity="0.4"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" fill-opacity="0.5"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" fill-opacity="0.6"/>
            </svg>
            {{ firebaseLoading ? 'Creating your account...' : 'Sign up with Google' }}
          </button>

          <p class="text-center text-gray-400 text-xs font-medium leading-relaxed">
            By signing up, you agree to our
            <NuxtLink to="/terms" class="text-[#FF5C1A] hover:underline">Terms of Service</NuxtLink>
            and
            <NuxtLink to="/terms" class="text-[#FF5C1A] hover:underline">Privacy Policy</NuxtLink>
          </p>
        </div>

        <!-- Footer -->
        <div class="mt-10 text-center pt-8 border-t border-gray-200">
          <p class="text-gray-500 font-medium text-sm">
            Already have an account?
            <NuxtLink to="/auth/login" class="text-[#FF5C1A] font-bold hover:underline">Sign in</NuxtLink>
          </p>
        </div>
      </div>

      <div class="mt-8 text-center flex items-center justify-center gap-4 text-sm font-bold text-gray-400 border-t border-gray-100 pt-8">
        <p>&copy; {{ new Date().getFullYear() }} Errandr</p>
        <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
        <NuxtLink to="/terms" class="hover:text-gray-600 transition-colors">Terms & Privacy</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, AlertCircle } from 'lucide-vue-next'
import { ref } from 'vue'
import { useAuth } from '@/composables/modules/auth'

definePageMeta({ layout: false })
useHead({ title: 'Become a Rider - Errandr' })

const { firebaseLogin, firebaseLoading } = useAuth()
const error = ref('')

const handleGoogleSignup = async () => {
  error.value = ''
  try {
    const res = await firebaseLogin({ redirect: false, isSignUp: true })
    // After Google signup, always redirect to complete-profile to fill remaining info
    navigateTo('/auth/complete-profile')
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Signup failed. Please try again.'
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
