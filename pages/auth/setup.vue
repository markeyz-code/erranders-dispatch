<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-white overflow-hidden py-8 px-4 sm:px-4 lg:px-5">
    <div class="w-full max-w-xl flex flex-col justify-center px-4 sm:px-8 py-8 bg-white sm:rounded-[2rem] relative z-10 my-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      
      <div class="mb-6 text-center flex flex-col items-center">
        <NuxtLink to="/" class="flex items-center gap-2 mb-6 inline-block group">
          <div class="flex items-center justify-center group-hover:scale-110 transition-transform">
            <img src="@/assets/img/logo-light.png" class="w-auto h-8" alt="Errandr" />
          </div>
        </NuxtLink>
        <h1 class="text-lg font-extrabold text-gray-900 mb-2 tracking-tight">Complete your profile</h1>
        <p class="text-gray-500 text-sm">Just a few more details to start earning.</p>
      </div>

      <!-- Step Indicator -->
      <div class="flex items-center justify-center mb-8 gap-2">
        <div v-for="step in 2" :key="step" class="flex items-center">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
            currentStep === step ? 'bg-[#FF5C1A] text-white' : currentStep > step ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
          ]">
            <Check v-if="currentStep > step" class="w-4 h-4" />
            <span v-else>{{ step }}</span>
          </div>
          <div v-if="step < 2" :class="[
            'w-12 h-1 transition-colors',
            currentStep > step ? 'bg-green-500' : 'bg-gray-100'
          ]"></div>
        </div>
      </div>

      <form @submit.prevent="nextStep" class="space-y-6 w-full">
        <!-- Step 1: Personal Details -->
        <div v-if="currentStep === 1" class="space-y-4 animate-fade-in">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Phone Number *</label>
            <input v-model="form.phone" type="tel" required placeholder="+234..." class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF5C1A] focus:ring-4 focus:ring-[#FF5C1A]/10 transition-all text-sm outline-none" />
          </div>
        </div>

        <!-- Step 2: Review -->
        <div v-if="currentStep === 2" class="space-y-4 animate-fade-in">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Review Your Info</h2>
          <div class="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-3">
            <div class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-500 text-sm">Phone</span>
              <span class="font-bold text-gray-900">{{ form.phone || 'Not provided' }}</span>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center gap-4 mt-5 pt-6 border-t border-gray-100">
          <button v-if="currentStep > 1" type="button" @click="prevStep" :disabled="saving" class="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors disabled:opacity-50">
            Back
          </button>
          
          <button v-if="currentStep < 2" type="submit" class="flex-1 py-2 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-bold text-sm transition-colors">
            Continue
          </button>
          
          <button v-if="currentStep === 2" type="button" @click="handleSave" :disabled="saving" class="flex-1 py-2 bg-[#008950] hover:bg-[#007040] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
            <Loader2 v-if="saving" class="animate-spin w-4 h-4" />
            {{ saving ? 'Saving...' : 'Finish Setup' }}
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Check, Loader2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useUser } from '@/composables/modules/auth/user'
import { auth_api } from '@/api_factory/modules/auth'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: false })
useHead({ title: 'Complete Setup - Errandr' })

const router = useRouter()
const { user, setUser } = useUser()
const { showToast } = useCustomToast()

const currentStep = ref(1)
const saving = ref(false)

const form = reactive({
  phone: ''
})

onMounted(() => {
  if (user.value) {
    if (user.value.phone) {
      router.push('/dashboard')
    }
  }
})

const nextStep = () => {
  if (currentStep.value === 1 && !form.phone) {
    showToast({ title: 'Error', message: 'Phone number is required', toastType: 'error' })
    return
  }
  if (currentStep.value < 2) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const handleSave = async () => {
  saving.value = true
  try {
    const payload = { phone: form.phone }
    const res = await auth_api.updateProfile(payload)
    setUser(res.data?.user || res.data)
    
    showToast({
      title: 'Setup Complete',
      message: 'Your profile has been updated.',
      toastType: 'success'
    })
    
    router.push('/dashboard')
  } catch (err: any) {
    showToast({
      title: 'Update Failed',
      message: err.response?.data?.message || err.message || 'Failed to update profile',
      toastType: 'error'
    })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
