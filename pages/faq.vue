<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">


    <!-- Hero Section -->
    <section class="relative pt-40 pb-20 overflow-hidden bg-gray-50/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-10 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-50 text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400 mb-8 shadow-sm">
          <HelpCircle class="w-3.5 h-3.5 text-parentPrimary" />
          Rider Knowledge Base
        </div>
        <h1 class="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9] text-gray-900 mb-6 max-w-4xl mx-auto">
          Rider <span class="text-parentPrimary ">Intel.</span>
        </h1>
        <p class="text-xl text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed tracking-tight">
          Master the art of the 15-minute campus dash. Insights for our dispatch community.
        </p>
      </div>
    </section>

    <!-- FAQ Accordion -->
    <section class="py-24 bg-white font-sans">
      <div class="max-w-4xl mx-auto px-4 sm:px-10">
        <div class="space-y-4">
          <div v-for="(faq, i) in faqs" :key="i" class="group border border-gray-50 rounded-[2rem] overflow-hidden transition-all duration-500" :class="{ 'bg-gray-50/50 border-parentPrimary/20 shadow-sm border border-gray-50 shadow-parentPrimary/5': openIndex === i }">
            <button @click="openIndex = openIndex === i ? -1 : i" class="w-full flex items-center justify-between p-5 text-left outline-none">
              <span class="text-xl font-medium text-gray-900 tracking-tight group-hover:text-parentPrimary transition-colors">{{ faq.q }}</span>
              <div class="w-10 h-10 rounded-full bg-white border border-gray-50 flex items-center justify-center text-gray-400 group-hover:text-parentPrimary transition-all" :class="{ 'rotate-180 bg-parentPrimary text-white border-transparent': openIndex === i }">
                <ChevronDown class="w-5 h-5" />
              </div>
            </button>
            <transition name="fade">
              <div v-show="openIndex === i" class="px-5 pb-8">
                <div class="h-px bg-gray-200/50 mb-6"></div>
                <p class="text-lg text-gray-500 font-bold leading-relaxed tracking-tight">{{ faq.a }}</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup lang="ts">
import { HelpCircle, ChevronDown } from 'lucide-vue-next'
import { ref } from 'vue'
definePageMeta({ layout: 'landing' })
useHead({ 
  title: 'Rider Help Center - FAQ',
  meta: [{ name: 'description', content: 'Answers to common questions for Errandr riders about earnings, delivery rules, and account support.' }] 
})

const openIndex = ref(0)
const faqs = [
  { q: 'Onboarding & Verification', a: 'Join the community by creating an account and uploading your student ID. Verification is typically completed within 24 hours, giving you immediate access to campus gigs.' },
  { q: 'Vehicle Requirements', a: 'Zero. Most campus deliveries are within a 15-minute walk. You can use your feet, a bicycle, or a skateboard — we just prioritize safety and speed.' },
  { q: 'Earnings Potential', a: 'Payouts are performance-based. Top riders on active campuses earn between ₦10,000 and ₦25,000 weekly by focusing on peak lunch and dinner spikes.' },
  { q: 'Instant Wallet Payouts', a: 'No waiting periods. Your delivery fee is credited to your Errandr wallet the second the order is marked as delivered by the customer.' },
  { q: 'Order Autonomy', a: 'You are an independent partner. See the pickup, drop-off, and payout amount upfront, and decide which orders fit your route on campus.' },
  { q: 'Safety Standards', a: 'Safety first. All deliveries are tracked, and we provide a 24/7 emergency support line for any transit incidents within university grounds.' }
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

