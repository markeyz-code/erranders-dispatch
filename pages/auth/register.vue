<template>
  <div class="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
    <div class="w-full max-w-[500px] relative z-10">
      
      <!-- Back to Login -->
      <!-- <NuxtLink v-if="!showSuccess" to="/auth/login" class="absolute -top-12 left-0 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft class="w-4 h-4" /> Back to login
      </NuxtLink> -->

        <div class="w-full">
          <!-- Header -->
          <div class="text-center space-y-3 mb-8">
                    <div class="flex items-center justify-center group-hover:scale-110 transition-transform">
            <img src="@/assets/img/logo-light.png" class="w-auto h-10" alt="Errandr" />
          </div>
            <h1 class="text-3xl font-medium text-gray-900 tracking-tight mb-2">Become an Errand Ninja! 🥷</h1>
            <p class="text-gray-500 font-medium text-sm">Create your account and start delivering</p>
          </div>

          <div class="space-y-5">
            <button type="button" @click="firebaseLogin()" :disabled="firebaseLoading" class="w-full py-3.5 border border-gray-100 rounded-2xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <Loader2 v-if="firebaseLoading" class="animate-spin w-5 h-5" />
              <svg v-else class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {{ firebaseLoading ? 'Connecting...' : 'Sign up with Google' }}
            </button>

            <div class="flex items-center gap-3">
              <div class="flex-1 h-px bg-gray-100" />
              <span class="text-sm text-gray-400 font-bold">or</span>
              <div class="flex-1 h-px bg-gray-100" />
            </div>

            <form @submit.prevent="handleRegister" class="space-y-5">
              <div class="grid grid-cols-2 gap-4">
              <UiAnimatedInput v-model="form.firstName" type="text" label="First Name" required />
              <UiAnimatedInput v-model="form.lastName" type="text" label="Last Name" required />
            </div>
            <UiAnimatedInput v-model="form.email" type="email" label="Email Address" required />
            <UiAnimatedInput v-model="form.phone" type="tel" label="Phone Number" />
            <UiSelectInput v-model="form.school" label="School (Optional)" :options="nigerianSchools" />
            <UiAnimatedInput v-model="form.matricNumber" type="text" label="Matric Number (Optional)" pattern="[A-Za-z0-9/.\-]+" title="Only alphanumeric characters, slashes, and dashes allowed" minlength="5" />
            <UiSelectInput v-model="form.gender" label="Gender" :options="['Male', 'Female', 'Other']" placeholder="Select your gender" />
            <UiAnimatedInput v-model="form.password" type="password" label="Password" required minlength="6" />
            <UiAnimatedInput v-model="form.referredBy" type="text" label="Referral Code (Optional)" @input="formatReferralCode" />

            <transition name="fade">
              <div v-if="error" class="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl text-[13px] font-bold text-red-600">
                <AlertCircle class="w-4 h-4 shrink-0" />
                {{ error }}
              </div>
            </transition>

            <button type="submit" :disabled="loading || validatingReferral"
              class="w-full py-3 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-2xl font-medium text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm border border-gray-100 shadow-[#FF5C1A]/20 active:scale-[0.98] group mt-4">
              <Loader2 v-if="loading || validatingReferral" class="animate-spin w-5 h-5" />
              <span v-else>Apply to Ride</span>
              <ArrowRight v-if="!loading && !validatingReferral" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

              <p class="text-center text-gray-500 text-sm font-medium mt-6">
                Already have an account? <NuxtLink to="/auth/login" class="text-[#FF5C1A] font-bold hover:underline">Sign in</NuxtLink>
              </p>
            </form>
          </div>
          
          <div class="mt-8 text-center flex items-center justify-center gap-4 text-sm font-bold text-gray-400 border-t border-gray-100 pt-8">
            <p>&copy; {{ new Date().getFullYear() }} Errandr</p>
            <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
            <NuxtLink to="/terms" class="hover:text-gray-600 transition-colors">Terms & Privacy</NuxtLink>
          </div>
          </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-vue-next'
import { ref, reactive, watch } from 'vue'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'
import { useAuth } from '@/composables/modules/auth'

definePageMeta({ layout: false })
useHead({ title: 'Become a Rider - Errandr' })

const { register, firebaseLogin, loading, firebaseLoading } = useAuth()
const error = ref('')
const form = reactive({ firstName: '', lastName: '', email: '', password: '', phone: '', role: 'errander', referredBy: '', school: '', matricNumber: '', gender: '' })

const nigerianSchools = [
  { label: 'University of Lagos (UNILAG)', value: 'UNILAG' },
  { label: 'Obafemi Awolowo University (OAU)', value: 'OAU' },
  { label: 'Ahmadu Bello University (ABU)', value: 'ABU' },
  { label: 'University of Ibadan (UI)', value: 'UI' },
  { label: 'Yaba College of Technology (YABATECH)', value: 'YABATECH' },
  { label: 'Lagos State University (LASU)', value: 'LASU' },
  { label: 'Covenant University', value: 'CU' },
  { label: 'Babcock University', value: 'BABCOCK' },
  { label: 'University of Nigeria Nsukka (UNN)', value: 'UNN' },
  { label: 'University of Ilorin (UNILORIN)', value: 'UNILORIN' },
  { label: 'Federal University of Technology Akure (FUTA)', value: 'FUTA' },
  { label: 'Federal University of Technology Minna (FUTMINNA)', value: 'FUTMINNA' },
  { label: 'Federal University of Technology Owerri (FUTO)', value: 'FUTO' },
  { label: 'University of Benin (UNIBEN)', value: 'UNIBEN' },
  { label: 'University of Port Harcourt (UNIPORT)', value: 'UNIPORT' },
  { label: 'Afe Babalola University (ABUAD)', value: 'ABUAD' },
  { label: 'University of Abuja (UNIABUJA)', value: 'UNIABUJA' },
  { label: 'Nnamdi Azikiwe University (UNIZIK)', value: 'UNIZIK' },
  { label: 'Bayero University Kano (BUK)', value: 'BUK' },
  { label: 'Other', value: 'OTHER' }
]

const validatingReferral = ref(false)

const formatReferralCode = () => {
  if (!form.referredBy) return;
  let val = form.referredBy;
  let formatted = val.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  if (formatted.startsWith('ERR-')) {
    formatted = formatted.substring(4);
  } else if (formatted.startsWith('ERR')) {
    formatted = formatted.substring(3);
  } else if (formatted.startsWith('ER')) {
    formatted = formatted.substring(2);
  } else if (formatted.startsWith('E')) {
    formatted = formatted.substring(1);
  }
  
  if (formatted.length > 0) {
    form.referredBy = 'ERR-' + formatted.replace(/-/g, '');
  } else if (val.length > 0 && !['ERR', 'ER', 'E'].includes(val.toUpperCase())) {
     form.referredBy = 'ERR-';
  } else {
    form.referredBy = val.toUpperCase();
  }
}

const handleRegister = async () => {
  error.value = ''
  if (form.referredBy) {
    validatingReferral.value = true
    try {
      const res = await GATEWAY_ENDPOINT.get(`/referrals/validate-code/${form.referredBy}`);
      if (res?.data?.type === 'ERROR' || res?.type === 'ERROR') throw res;
    } catch (e: any) {
       error.value = e?.response?.data?.message || e?.data?.message || 'Invalid referral code';
       return;
    } finally {
      validatingReferral.value = false
    }
  }
  try { 
    await register(form, { redirect: false }) 
    navigateTo(`/auth/verify-email?email=${encodeURIComponent(form.email)}`)
  }
  catch (e: any) { error.value = e.data?.message || 'Registration failed' }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
