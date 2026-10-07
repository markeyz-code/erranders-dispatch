<template>
  <footer class="bg-gray-50 border-t border-gray-200 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-4 lg:px-5">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div class="md:col-span-1">
          <div class="flex items-center gap-2 mb-6 cursor-pointer" @click="$router.push('/')">
            <div class="w-8 h-8 bg-parentPrimary rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              <Bike class="w-4 h-4" />
            </div>
            <span class="text-xl font-medium text-parentPrimary tracking-tighter">Errandr Riders</span>
          </div>
          <p class="text-gray-500 text-sm leading-relaxed mb-6 font-medium">Join thousands of students earning extra cash simply by walking to class.</p>
        </div>
        
        <div>
          <h4 class="font-bold text-gray-900 mb-6 tracking-wider text-sm uppercase">Platform</h4>
          <ul class="space-y-4 text-sm font-medium text-gray-500">
            <li><NuxtLink to="/about" class="hover:text-parentPrimary transition-colors">About Us</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-parentPrimary transition-colors">Rider Support</NuxtLink></li>
            <li><NuxtLink to="/faq" class="hover:text-parentPrimary transition-colors">FAQ</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-gray-900 mb-6 tracking-wider text-sm uppercase">Legal</h4>
          <ul class="space-y-4 text-sm font-medium text-gray-500">
            <li><NuxtLink to="/terms" class="hover:text-parentPrimary transition-colors">Rider Agreement</NuxtLink></li>
            <li><NuxtLink to="/terms" class="hover:text-parentPrimary transition-colors">Privacy Policy</NuxtLink></li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-bold text-gray-900 mb-6 tracking-wider text-sm uppercase">Errandr Network</h4>
          <ul class="space-y-4 text-sm font-medium text-gray-500">
            <li><a href="http://errandr.shop" class="hover:text-parentPrimary transition-colors flex items-center gap-2"><Utensils class="w-4 h-4" /> Order Food</a></li>
            <li><a href="http://vendor.errandr.shop" class="hover:text-parentPrimary transition-colors flex items-center gap-2"><Store class="w-4 h-4" /> Open a Store</a></li>
          </ul>
        </div>
      </div>
      
      <div class="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-sm font-medium text-gray-400">
          &copy; {{ new Date().getFullYear() }} Errandr Inc. All rights reserved. For Riders.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Bike, Utensils, Store } from 'lucide-vue-next'
</script>
