<template>
  <div class="min-h-screen w-full bg-white flex items-center justify-center p-4 relative overflow-hidden">
    <div class="w-full max-w-[340px] relative z-10">
      <div class="w-full">
        <!-- Header -->
        <div class="text-center space-y-3 mb-6">
          <div class="flex items-center justify-center transition-transform">
            <img src="@/assets/img/logo-light.png" class="w-auto h-9" alt="Errandr" />
          </div>
          <h1 class="text-lg font-medium text-gray-900 tracking-tight mb-2">Errand Ninja Login🥷</h1>
          <p class="text-gray-500 font-medium text-sm">Sign in to your Errand Ninja dashboard</p>
        </div>

        <!-- Google Sign In -->
        <div class="space-y-5">
          <transition name="fade">
            <div v-if="error" class="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] font-bold text-red-600">
              <AlertCircle class="w-4 h-4 shrink-0" />
              {{ error }}
            </div>
          </transition>

          <form @submit.prevent="handleEmailLogin" class="space-y-4">
            <UiAnimatedInput 
              v-model="email" 
              type="email" 
              label="Email Address" 
              :hasError="!!validationErrors.email"
              :errorMessage="validationErrors.email"
              @input="validationErrors.email = ''" 
              required 
            />
            
            <div class="space-y-2">
              <UiAnimatedInput 
                v-model="password" 
                type="password" 
                label="Password" 
                :hasError="!!validationErrors.password"
                :errorMessage="validationErrors.password"
                @input="validationErrors.password = ''" 
                required 
              />
              <div class="flex justify-end">
                <NuxtLink to="/auth/forgot-password" class="text-xs font-semibold text-[#FF5C1A] hover:underline">
                  Forgot password?
                </NuxtLink>
              </div>
            </div>

            <button type="submit" :disabled="loading"
              class="w-full py-2 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl flex items-center justify-center gap-3 font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm">
              <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
              {{ loading ? 'signing in...' : 'Sign in' }}
            </button>
          </form>

          <div class="flex items-center gap-3 my-4">
            <div class="flex-1 h-px bg-gray-100" />
            <span class="text-xs text-gray-400 font-bold">or</span>
            <div class="flex-1 h-px bg-gray-100" />
          </div>

          <button type="button" @click="handleGoogleLogin" :disabled="firebaseLoading"
            class="w-full py-2 border-2 border-gray-100 rounded-xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm">
            <Loader2 v-if="firebaseLoading" class="animate-spin w-4 h-4" />
            <svg v-else class="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {{ firebaseLoading ? 'Connecting...' : 'Continue with Google' }}
          </button>

          <p class="text-center text-gray-400 text-xs font-medium leading-relaxed">
            By continuing, you agree to our
            <NuxtLink to="/terms" class="text-[#FF5C1A] hover:underline">Terms of Service</NuxtLink>
            and
            <NuxtLink to="/terms" class="text-[#FF5C1A] hover:underline">Privacy Policy</NuxtLink>
          </p>
        </div>

        <!-- Footer -->
        <div class="mt-6 text-center pt-8 border-t border-gray-200">
          <p class="text-gray-500 font-medium text-sm">
            Want to become a rider? 
            <NuxtLink to="/auth/register" class="text-[#FF5C1A] font-bold hover:underline">Apply Now</NuxtLink>
          </p>
        </div>
      </div>
      
      <div class="mt-5 text-center flex items-center justify-center gap-4 text-sm font-bold text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} Errandr</p>
        <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
        <NuxtLink to="/terms" class="hover:text-gray-600 transition-colors">Terms & Privacy</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Loader2, AlertCircle } from 'lucide-vue-next'
import { useAuth } from '@/composables/modules/auth'
import { useUser } from '@/composables/modules/auth/user'

definePageMeta({ layout: false })
useHead({ title: 'Rider Sign In - Errandr' })

const { login, firebaseLogin, loading, firebaseLoading } = useAuth()
const { isLoggedIn } = useUser()
const error = ref('')

const email = ref('')
const password = ref('')

const validationErrors = reactive({
  email: '',
  password: ''
})

onMounted(() => {
  if (isLoggedIn.value) {
    navigateTo('/dashboard')
  }
})

const validate = () => {
  let isValid = true
  validationErrors.email = ''
  validationErrors.password = ''

  if (!email.value) {
    validationErrors.email = 'Email address is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    validationErrors.email = 'Please enter a valid email'
    isValid = false
  }

  if (!password.value) {
    validationErrors.password = 'Password is required'
    isValid = false
  }

  return isValid
}

const handleEmailLogin = async () => {
  error.value = ''
  if (!validate()) return

  try {
    await login({ email: email.value, password: password.value, role: 'dispatch' })
    navigateTo('/dashboard')
  } catch (e: any) {
    error.value = e?.data?.message || e?.response?.data?.message || 'Invalid credentials'
  }
}

const handleGoogleLogin = async () => {
  error.value = ''
  try {
    const res = await firebaseLogin({ redirect: false, isSignUp: false, role: 'dispatch' })
    const isNewUser = res?.isNewUser
    if (isNewUser) {
      // New user trying to login — redirect to signup to complete profile
      navigateTo('/auth/complete-profile')
    } else {
      navigateTo('/dashboard')
    }
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Login failed. Please try again.'
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
