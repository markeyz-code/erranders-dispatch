<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">


    <!-- Hero Section -->
    <section class="relative pt-40 pb-24 overflow-hidden">
      <div class="absolute inset-0 z-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-parentPrimary/5 rounded-full blur-[120px] translate-x-1/4"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-10 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-50 text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400 mb-8">
          <Bike class="w-3.5 h-3.5 text-parentPrimary" />
          Rider Community
        </div>
        <h1 class="text-6xl md:text-8xl font-medium tracking-tighter leading-[0.9] text-gray-900 mb-10 max-w-4xl mx-auto">
          Earn on <br />
          <span class="text-parentPrimary  bg-parentPrimary/5 px-4 rounded-3xl">your terms.</span>
        </h1>
        <p class="text-xl text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed tracking-tight">
          Turn your campus walks into earnings. Errandr empowers students at CMUL to earn money between lectures.
        </p>
      </div>
    </section>

    <!-- Experience Grid -->
    <section class="py-24 bg-gray-50/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Flexibility -->
          <div class="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-sm border border-gray-50 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-parentPrimary mb-8 group-hover:scale-110 transition-transform">
              <Zap class="w-8 h-8" />
            </div>
            <h3 class="text-2xl font-medium text-gray-900 tracking-tight mb-4">Pure Flexibility</h3>
            <p class="text-gray-500 font-bold leading-relaxed mb-6">No shifts, no bosses. Go online when you have a free hour between classes and offline when you need to study.</p>
            <div class="flex items-center gap-2 text-[10px] font-medium text-parentPrimary uppercase tracking-widest">
              <div class="h-px flex-1 bg-parentPrimary/10"></div>
              Your Schedule
            </div>
          </div>

          <!-- Walkable -->
          <div class="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-sm border border-gray-50 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform">
              <MapPin class="w-8 h-8" />
            </div>
            <h3 class="text-2xl font-medium text-gray-900 tracking-tight mb-4">Campus-Only</h3>
            <p class="text-gray-500 font-bold leading-relaxed mb-6">Deliver within the CMUL environs. Most orders are walkable or bike-friendly, keeping you within the safety of campus.</p>
            <div class="flex items-center gap-2 text-[10px] font-medium text-emerald-600 uppercase tracking-widest">
              <div class="h-px flex-1 bg-emerald-500/10"></div>
              Hyper-Local
            </div>
          </div>

          <!-- Payouts -->
          <div class="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-sm border border-gray-50 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-16 h-16 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-amber-600 mb-8 group-hover:scale-110 transition-transform">
              <Wallet class="w-8 h-8" />
            </div>
            <h3 class="text-2xl font-medium text-gray-900 tracking-tight mb-4">Instant Cash</h3>
            <p class="text-gray-500 font-bold leading-relaxed mb-6">Your earnings hit your wallet immediately after every successful delivery. Withdraw to your bank account anytime.</p>
            <div class="flex items-center gap-2 text-[10px] font-medium text-amber-600 uppercase tracking-widest">
              <div class="h-px flex-1 bg-amber-500/10"></div>
              Real-time Payouts
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Support Section -->
    <section class="py-32 bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-10">
        <div class="flex flex-col lg:flex-row items-center gap-20">
          <div class="flex-1 space-y-10 text-center lg:text-left">
            <h2 class="text-5xl md:text-6xl font-medium tracking-tighter leading-[0.95] text-gray-900">
              Fueling the <br />
              <span class="text-parentPrimary ">next generation.</span>
            </h2>
            <p class="text-xl text-gray-500 font-bold leading-relaxed tracking-tight max-w-2xl">
              Errandr Dispatch isn't just a delivery app — it's a platform for students to gain financial independence while serving their own community at CMUL.
            </p>
            <div class="pt-6">
              <NuxtLink to="/auth/register" class="inline-flex items-center gap-4 px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-medium text-sm uppercase tracking-widest shadow-sm border border-gray-50 hover:bg-parentPrimary transition-all group">
                Apply to ride
                <ArrowRight class="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </NuxtLink>
            </div>
          </div>
          <div class="flex-1 bg-gray-50 p-12 rounded-[4rem] relative">
            <div class="absolute inset-0 bg-parentPrimary/5 blur-[100px] rounded-full animate-pulse-slow"></div>
            <div class="relative z-10 space-y-8">
              <div v-for="item in steps" :key="item.t" class="flex gap-6 items-start text-left">
                <div class="w-10 h-10 rounded-full bg-white border border-gray-50 flex items-center justify-center text-sm font-medium text-parentPrimary shadow-sm">{{ item.n }}</div>
                <div>
                   <h4 class="font-medium text-gray-900 mb-2 uppercase text-[12px] tracking-widest">{{ item.t }}</h4>
                   <p class="text-gray-500 font-bold text-sm">{{ item.d }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup lang="ts">
import { Bike, Zap, MapPin, Wallet, ArrowRight } from 'lucide-vue-next'
definePageMeta({ layout: 'landing' })
useHead({ 
  title: 'Ride with Errandr - Student Delivery Platform',
  meta: [{ name: 'description', content: 'Earn money delivering on campus. Flexible hours, no vehicle required, instant payouts for student riders.' }] 
})

const steps = [
  { n: 1, t: "Quick Verification", d: "Sign up and verify your student status to start." },
  { n: 2, t: "Accept Gigs", d: "Get real-time alerts for orders on your campus route." },
  { n: 3, t: "Deliver & Earn", d: "Walk, ride or skate. Get paid instantly per delivery." }
]
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.2; transform: scale(1.1); }
}
</style>

