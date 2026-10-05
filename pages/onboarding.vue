<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 pb-24 relative overflow-hidden">
    <!-- Ambient Background -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF5C1A]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
    </div>

    <div class="max-w-xl w-full space-y-8 relative z-10">
      <!-- Progress Bar -->
      <div class="flex gap-2 mb-12">
        <div v-for="i in 3" :key="i" 
          class="h-1 flex-1 rounded-full transition-all duration-500"
          :class="step >= i ? 'bg-[#FF5C1A] shadow-[0_0_15px_rgba(6,95,219,0.5)]' : 'bg-white/10'"
        />
      </div>

      <!-- Step Content -->
      <div class="bg-white/5  p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden border border-gray-25">
        
        <!-- Step 1: Rider Profile -->
        <div v-if="step === 1" class="space-y-6 animate-fade-in">
          <div class="text-center space-y-2 mb-10">
            <div class="w-20 h-20 bg-[#FF5C1A]/20 text-[#FF5C1A] rounded-lg flex items-center justify-center mx-auto mb-6 border border-[#FF5C1A]/20 ">
              <User class="w-10 h-10" />
            </div>
            <h2 class="text-3xl font-medium text-white tracking-tighter">Become a Rider</h2>
            <p class="text-gray-400 text-xs font-bold uppercase tracking-widest">Let's build your delivery profile</p>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="block text-[10px] font-medium text-gray-500 uppercase tracking-widest ml-1">First Name</label>
                <input v-model="form.firstName" type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white font-bold focus:ring-4 focus:ring-[#FF5C1A]/20 outline-none transition-all" placeholder="John" />
              </div>
              <div class="space-y-1.5">
                <label class="block text-[10px] font-medium text-gray-500 uppercase tracking-widest ml-1">Last Name</label>
                <input v-model="form.lastName" type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white font-bold focus:ring-4 focus:ring-[#FF5C1A]/20 outline-none transition-all" placeholder="Doe" />
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="block text-[10px] font-medium text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
              <input v-model="form.phone" type="tel" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white font-bold focus:ring-4 focus:ring-[#FF5C1A]/20 outline-none transition-all" placeholder="0801 234 5678" />
            </div>
          </div>
        </div>

        <!-- Step 2: Vehicle Selection -->
        <div v-if="step === 2" class="space-y-6 animate-fade-in">
          <div class="text-center space-y-2 mb-10">
            <div class="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center mx-auto mb-6 border border-emerald-400/20 ">
              <Bike class="w-10 h-10" />
            </div>
            <h2 class="text-3xl font-medium text-white tracking-tighter">How do you deliver?</h2>
            <p class="text-gray-400 text-xs font-bold uppercase tracking-widest">Select your primary mode of transport</p>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div v-for="mode in deliveryModes" :key="mode.id" 
              class="flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer group"
              :class="form.deliveryMode === mode.id ? 'bg-[#FF5C1A] border-[#FF5C1A] border border-gray-25' : 'bg-white/5 border-white/10 hover:border-white/30'"
              @click="form.deliveryMode = mode.id"
            >
              <div class="flex items-center gap-5">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-colors" :class="form.deliveryMode === mode.id ? 'bg-white text-[#FF5C1A]' : 'bg-white/10 text-white'">
                  <component :is="mode.icon" class="w-6 h-6" />
                </div>
                <div>
                  <p class="font-bold text-white tracking-tight" :class="form.deliveryMode === mode.id ? 'text-white' : ''">{{ mode.label }}</p>
                  <p class="text-[10px] font-medium" :class="form.deliveryMode === mode.id ? 'text-white/70' : 'text-gray-500'">{{ mode.desc }}</p>
                </div>
              </div>
              <div class="w-6 h-6 rounded-full border flex items-center justify-center transition-all" :class="form.deliveryMode === mode.id ? 'border-white bg-white' : 'border-white/20'">
                <Check v-if="form.deliveryMode === mode.id" class="w-4 h-4 text-[#FF5C1A]" />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Student Status -->
        <div v-if="step === 3" class="space-y-6 animate-fade-in">
          <div class="text-center space-y-2 mb-10">
            <div class="w-20 h-20 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mx-auto mb-6 border border-purple-400/20 ">
              <ShieldCheck class="w-10 h-10" />
            </div>
            <h2 class="text-3xl font-medium text-white tracking-tighter">Verification</h2>
            <p class="text-gray-400 text-xs font-bold uppercase tracking-widest">Ensure you are a verified student</p>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="p-5 border border-dashed border-white/10 rounded-lg text-center hover:border-[#FF5C1A]/50 transition-all cursor-pointer group bg-white/5 flex flex-col items-center justify-center">
                <div class="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload class="w-6 h-6 text-gray-400" />
                </div>
                <p class="text-xs font-bold text-white mb-1">Student ID</p>
                <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Required</p>
              </div>
              
              <div class="p-5 border border-dashed border-white/10 rounded-lg text-center hover:border-[#FF5C1A]/50 transition-all cursor-pointer group bg-white/5 flex flex-col items-center justify-center">
                <div class="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload class="w-6 h-6 text-gray-400" />
                </div>
                <p class="text-xs font-bold text-white mb-1">NIN Slip</p>
                <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Required</p>
              </div>
            </div>
            
            <div class="flex items-center gap-4 p-5 bg-[#FF5C1A]/10 rounded-lg border border-[#FF5C1A]/20">
              <Info class="w-5 h-5 text-[#FF5C1A] flex-shrink-0" />
              <p class="text-[10px] text-[#FF5C1A] font-medium leading-tight uppercase tracking-wider">Verification usually takes less than 2 hours during session.</p>
            </div>
          </div>
        </div>

        <!-- Nav Buttons -->
        <div class="flex gap-4 mt-12 pt-6 border-t border-white/10">
          <button v-if="step > 1" @click="step--" class="flex-1 py-5 bg-white/5 text-white rounded-lg text-[10px] font-medium uppercase tracking-widest hover:bg-white/10 transition-all">Back</button>
          <button @click="nextStep" class="flex-[2] py-5 bg-[#FF5C1A] text-white rounded-lg text-[10px] font-medium uppercase tracking-widest hover:brightness-110 transition-all border border-gray-25 shadow-[#FF5C1A]/20">
            {{ step === 3 ? 'Start My Journey' : 'Continue' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useHead } from '#imports'
import { 
  User, Bike, Check, Upload, 
  ShieldCheck, Info, Footprints, Car
} from 'lucide-vue-next'

definePageMeta({ layout: false })
useHead({ title: 'Rider Onboarding - Errandr' })

const router = useRouter()
const step = ref(1)

const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  deliveryMode: 'bike'
})

const deliveryModes = [
  { id: 'bicycle', label: 'Bicycle', icon: Bike, desc: 'Eco-friendly and fast for short distances' },
  { id: 'bike', label: 'Motorbike', icon: Bike, desc: 'Highest efficiency and coverage' },
  { id: 'walking', label: 'Walking', icon: Footprints, desc: 'Great for same-hostel deliveries' }
]

const nextStep = () => {
  if (step.value < 3) {
    step.value++
  } else {
    // In a real app, we would call an API here
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
