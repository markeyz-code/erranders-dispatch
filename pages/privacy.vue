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
          <ShieldCheck class="w-4 h-4 text-parentPrimary" />
          Data Protection
        </div>
        <h1 class="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9] text-gray-900 mb-6 max-w-4xl mx-auto">
          Privacy <span class="text-parentPrimary bg-parentPrimary/5 px-4 rounded-3xl">Policy.</span>
        </h1>
        <p class="text-[11px] font-medium text-gray-400 tracking-[0.2em] uppercase">Last updated: September 2026</p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-24 bg-white relative">
      <div class="max-w-4xl mx-auto px-4 sm:px-10 relative z-10">
        <div class="space-y-20">
          <div v-for="(section, index) in privacySections" :key="index" class="group bg-gray-50/30 p-8 md:p-12 rounded-[3rem] border border-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/20 transition-all duration-500">
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
import { ShieldCheck, Database, Zap, Users, Lock, Mail } from 'lucide-vue-next'
definePageMeta({ layout: false })
useHead({ 
  title: 'Privacy Policy - Errandr',
  meta: [{ name: 'description', content: 'Learn how Errandr collects, uses, and protects your personal data.' }] 
})

const privacySections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: "We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), and other information you choose to provide."
  },
  {
    icon: Zap,
    title: "How We Use Your Information",
    content: "We may use the information we collect about you to:<br/><br/><ul class='list-disc pl-5 space-y-2'><li>Provide, maintain, and improve our Services.</li><li>Perform internal operations, including troubleshooting software bugs and operational problems.</li><li>Send or facilitate communications (i.e. receipts, notifications).</li><li>Personalize and improve the Services.</li></ul>"
  },
  {
    icon: Users,
    title: "Sharing of Information",
    content: "We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows: with vendors and delivery partners to enable them to provide the Services you request."
  },
  {
    icon: Lock,
    title: "Security",
    content: "We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. Your trust is our top priority."
  },
  {
    icon: Mail,
    title: "Contact Us",
    content: "If you have any questions about this Privacy Statement, please contact us at <a href='mailto:support@erranders.com' class='text-parentPrimary font-bold hover:underline'>support@erranders.com</a> or via our hotline at <span class='font-bold text-gray-900'>09040303103</span>."
  }
]
</script>
