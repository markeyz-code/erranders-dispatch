<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
    <!-- Navbar -->
    <LandingNavbar />

    <!-- Hero Section -->
    <section class="relative pt-40 pb-20 overflow-hidden bg-gray-50/30">
      <div class="absolute inset-0 z-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-parentPrimary/5 rounded-full blur-[120px] translate-x-1/4"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-10 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-50 text-sm font-medium tracking-[0.2em] text-gray-400 mb-8 shadow-sm hover:scale-105 transition-transform">
          <RefreshCcw class="w-4 h-4 text-parentPrimary" />
          Customer Guarantee
        </div>
        <h1 class="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9] text-gray-900 mb-6 max-w-4xl mx-auto">
          Refund <span class="text-parentPrimary bg-parentPrimary/5 px-4 rounded-3xl">Policy.</span>
        </h1>
        <p class="text-[11px] font-medium text-gray-400 tracking-[0.2em] uppercase">Last updated: September 2026</p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-24 bg-white relative">
      <div class="max-w-4xl mx-auto px-4 sm:px-10 relative z-10">
        <div class="space-y-20">
          <div v-for="(section, index) in refundSections" :key="index" class="group bg-gray-50/30 p-8 md:p-12 rounded-[3rem] border border-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/20 transition-all duration-500">
            <div class="flex flex-col md:flex-row gap-6 md:gap-10">
              <div class="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-50 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-parentPrimary/30 group-hover:text-parentPrimary transition-all duration-500">
                <component :is="section.icon" class="w-7 h-7 text-gray-400 group-hover:text-parentPrimary transition-colors" />
              </div>
              <div class="space-y-4">
                <h2 class="text-3xl font-medium text-gray-900 tracking-tight">{{ section.title }}</h2>
                <div class="text-lg text-gray-500 font-medium leading-loose tracking-tight" v-html="section.content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <LandingFooter class="mt-20" />
  </div>
</template>

<script setup lang="ts">
import { RefreshCcw, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-vue-next'
definePageMeta({ layout: false })
useHead({ 
  title: 'Refund Policy - Errandr',
  meta: [{ name: 'description', content: 'Our policies regarding refunds and cancellations on the Errandr platform.' }] 
})

const refundSections = [
  {
    icon: RefreshCcw,
    title: "General Policy",
    content: "At Erranders, we strive to ensure a smooth and reliable experience. Due to the nature of on-demand logistics and third-party vendor goods, refunds are evaluated on a case-by-case basis to ensure fairness to both customers and vendors."
  },
  {
    icon: CheckCircle,
    title: "Eligible Reasons for Refund",
    content: "You may be eligible for a refund under the following circumstances:<br/><br/><ul class='list-disc pl-5 space-y-2'><li>The vendor cannot fulfill your order (e.g. out of stock, store closed).</li><li>The wrong item was delivered to you.</li><li>The item arrived significantly damaged or compromised.</li><li>No dispatch rider was available to fulfill the errand after a designated waiting period.</li></ul>"
  },
  {
    icon: AlertTriangle,
    title: "Non-Refundable Situations",
    content: "Unfortunately, we cannot process refunds in the following situations:<br/><br/><ul class='list-disc pl-5 space-y-2'><li>Orders already picked up and dispatched cannot be cancelled or refunded unless there is an issue with the delivered item.</li><li>Change of mind after the vendor has started preparing the order.</li><li>Minor delays in delivery due to campus traffic or weather conditions.</li></ul>"
  },
  {
    icon: MessageSquare,
    title: "How to Request a Refund",
    content: "To request a refund, please contact our support team within 24 hours of your order being completed. Provide your order number and any relevant photos if applicable. Contact us at <a href='mailto:support@erranders.com' class='text-parentPrimary font-bold hover:underline'>support@erranders.com</a>."
  }
]
</script>
