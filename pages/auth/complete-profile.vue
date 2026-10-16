<template>
  <div class="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
    <div class="w-full max-w-[500px] relative z-10">
      
        <div class="w-full">
          <!-- Header -->
          <div class="text-center space-y-3 mb-8">
            <div class="flex items-center justify-center transition-transform">
              <img src="@/assets/img/logo-light.png" class="w-auto h-9" alt="Errandr" />
            </div>
            <h1 class="text-lg font-medium text-gray-900 tracking-tight mb-2">Complete Your Profile</h1>
            <p class="text-gray-500 font-medium text-sm">Tell us a bit more to get you set up as an Errand 🥷</p>
          </div>

          <div class="space-y-5">
            <form @submit.prevent="handleCompleteProfile" class="space-y-5">
              <UiAnimatedInput v-model="form.phone" type="tel" label="Phone Number" required />
              <UiSelectInput v-model="form.institution" label="Operating Campus / Institution" :options="institutionOptions" placeholder="Select your campus" required />
              <UiAnimatedInput v-model="form.matricNumber" type="text" label="Matric Number (Optional)" pattern="[A-Za-z0-9/.\-]+" title="Only alphanumeric characters, slashes, and dashes allowed" minlength="5" />
              <UiSelectInput v-model="form.gender" :options="['Male', 'Female', 'Other']" placeholder="Select your gender" />
              <UiAnimatedInput v-model="form.referredBy" type="text" label="Referral Code (Optional)" @input="formatReferralCode" />

              <transition name="fade">
                <div v-if="error" class="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] font-bold text-red-600">
                  <AlertCircle class="w-4 h-4 shrink-0" />
                  {{ error }}
                </div>
              </transition>

              <button type="submit" :disabled="loading || validatingReferral"
                class="w-full py-3 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm border border-gray-50 shadow-[#FF5C1A]/20 active:scale-[0.98] group mt-4">
                <Loader2 v-if="loading || validatingReferral" class="animate-spin w-4 h-4" />
                <span v-else>Complete Registration</span>
                <ArrowRight v-if="!loading && !validatingReferral" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
          
          <!-- <div class="mt-5 text-center flex items-center justify-center gap-4 text-sm font-bold text-gray-400 border-t border-gray-100 pt-8">
            <p>&copy; {{ new Date().getFullYear() }} Errandr</p>
            <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
            <NuxtLink to="/terms" class="hover:text-gray-600 transition-colors">Terms & Privacy</NuxtLink>
          </div> -->
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, ArrowRight, AlertCircle } from 'lucide-vue-next'
import { ref, reactive, onMounted } from 'vue'
import { auth_api } from '@/api_factory/modules/auth'
import { erranders_api } from '@/api_factory/modules/erranders'
import { institutions_api } from '@/api_factory/modules/institutions'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'
import { useUser } from '@/composables/modules/auth/user'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: false })
useHead({ title: 'Complete Profile - Errandr' })

const { showToast } = useCustomToast()
const { setUser } = useUser()

const error = ref('')
const loading = ref(false)
const form = reactive({ phone: '', referredBy: '', institution: '', school: '', matricNumber: '', gender: '' })

const institutionOptions = ref<{ label: string; value: string; shortName: string }[]>([])
const institutionsList = ref<any[]>([])

onMounted(async () => {
  try {
    const res: any = await institutions_api.list()
    const list = res?.data || []
    institutionsList.value = list
    institutionOptions.value = list.map((inst: any) => ({
      label: `${inst.name} (${inst.shortName || inst.city})`,
      value: inst._id,
      shortName: inst.shortName || inst.name
    }))
  } catch (e) {}
})

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
    const selectedInst = institutionsList.value.find(i => i._id === form.institution)
    if (selectedInst) {
      form.school = selectedInst.shortName || selectedInst.name
    }

    // 1. Update user profile details
    const updateRes = await auth_api.updateProfile(form);
    
    // 2. Create the Errander document stamped with institution
    await erranders_api.register({
      institution: form.institution,
      school: form.school
    });

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
