<template>
  <div class="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
    <div class="w-full max-w-[500px] relative z-10">
      
        <div class="w-full">
          <!-- Header -->
          <div class="text-center space-y-3 mb-8">
            <div class="flex items-center justify-center transition-transform">
              <img src="@/assets/img/logo-light.png" class="w-auto h-10" alt="Errandr" />
            </div>
            <h1 class="text-xl font-medium text-gray-900 tracking-tight mb-2">Complete Your Profile</h1>
            <p class="text-gray-500 font-medium text-sm">Tell us a bit more to get you set up as an Errand 🥷</p>
          </div>

          <div class="space-y-5">
            <form @submit.prevent="handleCompleteProfile" class="space-y-5">
              <UiAnimatedInput v-model="form.phone" type="tel" label="Phone Number" required />
              <UiSelectInput v-model="form.school" label="School (Optional)" :options="nigerianSchools" />
              <UiAnimatedInput v-model="form.matricNumber" type="text" label="Matric Number (Optional)" pattern="[A-Za-z0-9/.\-]+" title="Only alphanumeric characters, slashes, and dashes allowed" minlength="5" />
              <UiSelectInput v-model="form.gender" label="Gender" :options="['Male', 'Female', 'Other']" placeholder="Select your gender" />
              <UiAnimatedInput v-model="form.referredBy" type="text" label="Referral Code (Optional)" @input="formatReferralCode" />

              <transition name="fade">
                <div v-if="error" class="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] font-bold text-red-600">
                  <AlertCircle class="w-4 h-4 shrink-0" />
                  {{ error }}
                </div>
              </transition>

              <button type="submit" :disabled="loading || validatingReferral"
                class="w-full py-2 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm border border-gray-100 shadow-[#FF5C1A]/20 active:scale-[0.98] group mt-4">
                <Loader2 v-if="loading || validatingReferral" class="animate-spin w-5 h-5" />
                <span v-else>Complete Registration</span>
                <ArrowRight v-if="!loading && !validatingReferral" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
          
          <div class="mt-5 text-center flex items-center justify-center gap-4 text-sm font-bold text-gray-400 border-t border-gray-100 pt-8">
            <p>&copy; {{ new Date().getFullYear() }} Errandr</p>
            <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
            <NuxtLink to="/terms" class="hover:text-gray-600 transition-colors">Terms & Privacy</NuxtLink>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, ArrowRight, AlertCircle } from 'lucide-vue-next'
import { ref, reactive } from 'vue'
import { auth_api } from '@/api_factory/modules/auth'
import { erranders_api } from '@/api_factory/modules/erranders'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'
import { useUser } from '@/composables/modules/auth/user'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: false })
useHead({ title: 'Complete Profile - Errandr' })

const { showToast } = useCustomToast()
const { setUser } = useUser()

const error = ref('')
const loading = ref(false)
const form = reactive({ phone: '', referredBy: '', school: '', matricNumber: '', gender: '' })

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

const handleCompleteProfile = async () => {
  error.value = ''
  if (form.referredBy) {
    validatingReferral.value = true
    try {
      const res = await GATEWAY_ENDPOINT.get(`/referrals/validate-code/${form.referredBy}`);
      if (res?.data?.type === 'ERROR' || res?.type === 'ERROR') throw res;
    } catch (e: any) {
       error.value = e?.response?.data?.message || e?.data?.message || 'Invalid referral code';
       validatingReferral.value = false;
       return;
    } finally {
      validatingReferral.value = false
    }
  }

  loading.value = true;
  try { 
    // 1. Update user profile details
    const updateRes = await auth_api.updateProfile(form);
    
    // 2. Create the Errander document (creates empty/default errander doc)
    await erranders_api.register({});

    // Refresh user context in store
    if (updateRes?.data?.data) {
      setUser(updateRes.data.data);
    } else {
      const profileRes = await auth_api.getProfile();
      if (profileRes?.data?.data) {
        setUser(profileRes.data.data);
      }
    }

    showToast({
      title: "Success",
      message: "Profile completed successfully!",
      toastType: "success",
    });

    navigateTo('/dashboard');
  }
  catch (e: any) { 
    error.value = e.data?.message || e.response?.data?.message || 'Profile update failed. Please try again.' 
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
