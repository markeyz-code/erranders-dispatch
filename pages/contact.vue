<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">


    <!-- Hero Section -->
    <section class="relative pt-40 pb-20 overflow-hidden">
      <div class="absolute inset-0 z-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-parentPrimary/5 rounded-full blur-[100px] translate-x-1/4"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-10 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-50 text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400 mb-8">
          <span class="w-2 h-2 rounded-full bg-parentPrimary animate-ping"></span>
          Dispatch Support
        </div>
        <h1 class="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9] text-gray-900 mb-6 max-w-4xl mx-auto">
          We've got <br />
          <span class="text-parentPrimary  bg-parentPrimary/5 px-4 rounded-3xl">your back.</span>
        </h1>
        <p class="text-xl text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed tracking-tight">
          Dedicated assistance for our rider community. From live order support to payout inquiries, we're with you every mile.
        </p>
      </div>
    </section>

    <!-- Support Grid -->
    <section class="py-24 bg-white font-sans">
      <div class="max-w-7xl mx-auto px-4 sm:px-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Help Desk -->
          <div class="bg-gray-50/50 p-5 rounded-[2.5rem] border border-gray-50 hover:bg-white hover:shadow-sm border border-gray-50 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-parentPrimary/10 rounded-2xl flex items-center justify-center text-parentPrimary mb-8 group-hover:scale-110 transition-transform">
              <Mail class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 tracking-tight mb-3 text-left">Rider Help</h3>
            <p class="text-[13px] text-gray-500 font-bold leading-relaxed mb-6 text-left">Account issues and delivery disputes.</p>
            <a href="mailto:riders@errandr.shop" class="text-sm font-medium text-parentPrimary hover:underline block text-left uppercase">Open Ticket</a>
          </div>

          <!-- Emergency -->
          <div class="bg-gray-50/50 p-5 rounded-[2.5rem] border border-gray-50 hover:bg-white hover:shadow-sm border border-gray-50 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-8 group-hover:scale-110 transition-transform">
              <AlertTriangle class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 tracking-tight mb-3 text-left">Safety 24/7</h3>
            <p class="text-[13px] text-gray-500 font-bold leading-relaxed mb-6 text-left">Critical incidents and transit safety help.</p>
            <a href="tel:+234800ERRANDR" class="text-sm font-medium text-red-600 hover:underline block text-left uppercase">Emergency Call</a>
          </div>

          <!-- Payouts -->
          <div class="bg-gray-50/50 p-5 rounded-[2.5rem] border border-gray-50 hover:bg-white hover:shadow-sm border border-gray-50 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-8 group-hover:scale-110 transition-transform">
              <Wallet class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 tracking-tight mb-3 text-left">Earnings Support</h3>
            <p class="text-[13px] text-gray-500 font-bold leading-relaxed mb-6 text-left">Wallet help and payout discrepancies.</p>
            <a href="mailto:payouts@errandr.shop" class="text-sm font-medium text-amber-600 hover:underline block text-left uppercase text-[10px]  whitespace-nowrap">payouts@errandr.shop</a>
          </div>

          <!-- Ambassadors -->
          <div class="bg-gray-50/50 p-5 rounded-[2.5rem] border border-gray-50 hover:bg-white hover:shadow-sm border border-gray-50 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-8 group-hover:scale-110 transition-transform">
              <Users class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 tracking-tight mb-3 text-left">Community</h3>
            <p class="text-[13px] text-gray-500 font-bold leading-relaxed mb-6 text-left">Lead the rider movement on your campus.</p>
            <a href="mailto:ambassadors@errandr.shop" class="text-sm font-medium text-purple-600 hover:underline block text-left uppercase text-[10px]  whitespace-nowrap">Join Ambassadors</a>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup lang="ts">
import { Mail, AlertTriangle, Wallet, Users } from 'lucide-vue-next'
definePageMeta({ layout: 'landing' })
useHead({ 
  title: 'Rider Support - Errandr Help Center',
  meta: [{ name: 'description', content: 'Contact Errandr rider support for help with deliveries, earnings, and safety on campus.' }] 
})
</script>

