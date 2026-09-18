<template>
  <div class="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 mt-6">
    
    <!-- Header Space -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
      <div class="flex-1 relative">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Earnings & Payouts</h1>
        <p class="text-gray-500 text-sm font-medium max-w-lg leading-relaxed">Track your delivery tips, base fees, and manage your withdrawal history with complete transparency.</p>
      </div>
      <div class="flex flex-col items-end gap-1">
        <button v-if="balance > 0" @click="showWithdrawDrawer = true" :disabled="balance < minimumPayout" class="group relative px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-gray-900/20 hover:shadow-gray-900/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center gap-3 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-gray-900/20">
          <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
          <span class="relative z-10">Request Payout</span>
          <svg class="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
        <p v-if="balance > 0 && balance < minimumPayout" class="text-xs text-rose-500 font-bold">Minimum withdrawal amount is ₦{{ minimumPayout.toLocaleString() }}</p>
      </div>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 2" :key="i" class="bg-white/50 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-white/40 shadow-sm animate-pulse h-48" />
    </div>

    <div v-else class="space-y-10 animate-fade-in">
      <!-- Balance Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Available Balance Card -->
        <div class="relative overflow-hidden p-6 md:p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm group hover:shadow transition-all duration-300">
          <div class="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700 ease-out"></div>
          <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700 ease-out"></div>
          
          <div class="relative z-10 flex flex-col h-full justify-between gap-6">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-gray-500 tracking-wide uppercase">Available for Payout</p>
              <div class="p-2 bg-gray-50 rounded-xl border border-gray-100">
                <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            
            <div>
              <h2 class="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900">
                <span class="text-3xl font-bold align-top text-gray-400">₦</span>{{ balance?.toLocaleString() || '0' }}
              </h2>
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Verified Balance</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Lifetime Earnings Card -->
        <div class="relative overflow-hidden p-6 md:p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm group hover:shadow transition-all duration-300">
          <div class="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-[#FF5C1A]/10 to-transparent rounded-bl-full pointer-events-none"></div>
          
          <div class="relative z-10 flex flex-col h-full justify-between gap-6">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-gray-500 tracking-wide uppercase">Lifetime Earnings</p>
              <div class="p-2 bg-gray-50 rounded-xl border border-gray-100 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
            </div>
            
            <div>
              <h2 class="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900">
                <span class="text-3xl font-bold align-top text-gray-300">₦</span>{{ wallet?.totalEarned?.toLocaleString() || '0' }}
              </h2>
              <p class="text-sm font-medium text-gray-500">Total revenue generated from all your completed errands.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Section -->
      <section class="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">Payout Configuration</h3>
            <p class="text-sm text-gray-500 font-medium">Manage how and where you receive your money.</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <!-- Frequency -->
          <div class="space-y-4">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Settlement Frequency</label>
            <div class="flex gap-2 p-1.5 bg-gray-50 border border-gray-100 rounded-2xl shadow-inner">
              <button v-for="p in ['daily', 'weekly', 'monthly']" :key="p"
                @click="handleUpdateFrequency(p)"
                class="flex-1 py-3.5 rounded-xl text-sm font-bold transition-all capitalize relative overflow-hidden group"
                :class="wallet?.payoutPreference === p ? 'bg-white text-gray-900 shadow-md border border-gray-100' : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'"
              >
                <span class="relative z-10">{{ p }}</span>
              </button>
            </div>
            <div class="flex items-start gap-2 px-1">
              <svg class="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p class="text-xs text-gray-500 font-medium leading-relaxed">Standard processing fees may apply for daily settlements. Weekly and monthly settlements are completely free.</p>
            </div>
          </div>

          <!-- Bank Account -->
          <div class="space-y-4 flex flex-col h-full">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Destination Bank Account</label>
            
            <div class="flex-1 p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/60 relative overflow-hidden group hover:border-gray-300 transition-colors">
              <div class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              
              <div class="space-y-1 mt-2">
                <p class="text-sm font-semibold text-gray-500">{{ wallet?.bankDetails?.bankName || 'No Bank Linked' }}</p>
                <p class="text-xl font-bold text-gray-900 tracking-wider font-mono">{{ wallet?.bankDetails?.accountNumber || '•••• •••• ••••' }}</p>
                <p class="text-sm font-bold text-gray-700 uppercase mt-4 block">{{ wallet?.bankDetails?.accountName || 'NOT CONFIGURED' }}</p>
              </div>
            </div>

            <button @click="showBankDrawer = true" class="mt-4 w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl text-sm font-bold border border-gray-200 transition-colors flex items-center justify-center gap-2">
              Update Account Information
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
        </div>
      </section>

      <!-- History -->
      <section class="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            </div>
            <h3 class="font-extrabold text-gray-900 text-xl tracking-tight">Ledger History</h3>
          </div>
          <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">{{ transactions.length }} Events</span>
        </div>
        
        <div class="pb-6">
          <div v-if="transactions.length === 0" class="py-20 flex flex-col items-center justify-center text-center px-4">
            <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-gray-100">
              <span class="text-4xl filter grayscale opacity-50">🍃</span>
            </div>
            <h4 class="text-xl font-bold text-gray-900 mb-2">No earnings yet</h4>
            <p class="text-gray-500 text-sm max-w-sm">Complete your first delivery to see your tips, base fees, and payout history appear here.</p>
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50/50">
                  <th class="py-4 px-8 font-bold text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Description</th>
                  <th class="py-4 px-8 font-bold text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap text-right">Amount</th>
                  <th class="py-4 px-8 font-bold text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap text-right">Date & Time</th>
                  <th class="py-4 px-8 font-bold text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="tx in transactions" :key="tx._id" class="hover:bg-gray-50/80 transition-colors group">
                  <td class="py-5 px-8 min-w-[250px]">
                    <div class="flex items-center gap-4">
                      <div :class="tx.type === 'credit' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'" class="w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-white">
                        <svg v-if="tx.type === 'credit'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path></svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path></svg>
                      </div>
                      <div>
                        <p class="text-sm text-gray-900 font-bold group-hover:text-parentPrimary transition-colors">{{ tx.description }}</p>
                        <p v-if="tx.order" class="text-xs text-gray-400 font-medium mt-1 font-mono tracking-wider">REF: {{ tx.order.slice(-8) }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-5 px-8 text-right">
                    <p :class="tx.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'" class="text-base font-extrabold font-mono tracking-tight">
                      {{ tx.type === 'credit' ? '+' : '-' }}₦{{ tx.amount.toLocaleString() }}
                    </p>
                  </td>
                  <td class="py-5 px-8 text-right">
                    <p class="text-sm text-gray-900 font-bold">{{ new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }}</p>
                    <p class="text-xs text-gray-400 font-medium mt-1">{{ new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
                  </td>
                  <td class="py-5 px-8 text-right">
                    <button @click="downloadReceipt(tx._id)" class="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 hover:text-[#FF5C1A] hover:bg-[#FF5C1A]/10 transition-colors flex items-center justify-end gap-1.5 border border-gray-100 shadow-sm bg-white ml-auto">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      Receipt
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>

 <!-- Modals -->
 <!-- Bank Details SideDrawer -->
 <SideDrawer :isOpen="showBankDrawer" @close="showBankDrawer = false">
 <div class="space-y-6">
 <div class="border-b border-gray-100 pb-4">
 <h3 class="text-2xl font-bold text-gray-900 ">Bank Information</h3>
 <p class="text-gray-500 text-base mt-1">Your earnings will be sent to this bank account.</p>
 </div>

 <div class="space-y-5">
 <div class="space-y-1.5">
 <label class="text-sm font-semibold text-gray-400 ml-1 ">Select Bank</label>
 <div class="relative group">
 <select v-model="bankForm.bankCode" @change="onBankChange" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-base font-medium focus:ring-2 focus:ring-parentPrimary/20 focus:bg-white transition-all appearance-none cursor-pointer">
 <option value="" disabled>Choose your bank</option>
 <option v-for="bank in banks" :key="bank.code" :value="bank.code">{{ bank.name }}</option>
 </select>
 <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">⌄</div>
 </div>
 </div>
 <div class="space-y-1.5">
 <label class="text-sm font-semibold text-gray-400 ml-1 ">Account Number</label>
 <div class="relative">
 <input v-model="bankForm.accountNumber" @input="isAccountVerified = false" type="text" maxlength="10" class="w-full pl-4 pr-24 py-3 bg-gray-50 border border-gray-100 rounded-xl text-base font-medium focus:ring-2 focus:ring-parentPrimary/20 focus:bg-white transition-all" placeholder="10-digit NUBAN">
 <button 
 @click="resolveAccount" 
 :disabled="bankForm.accountNumber.length !== 10 || !bankForm.bankCode || resolving"
 class="absolute right-2 top-1.5 bottom-1.5 px-4 rounded-lg bg-gray-900 text-white text-sm font-bold disabled:opacity-30 hover:bg-black transition-all shadow-sm border border-gray-100 shadow-gray-900/10"
 >
 {{ resolving ? 'Wait...' : 'Verify' }}
 </button>
 </div>
 </div>
 <Transition name="fade">
 <div v-if="bankForm.accountName" class="p-4 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1 shadow-inner">
 <p class="text-sm text-emerald-600 font-bold ">Verified Beneficiary</p>
 <p class="text-base text-emerald-900 font-bold ">{{ bankForm.accountName }}</p>
 </div>
 </Transition>
 </div>
 
 <div class="pt-6 border-t border-gray-100 flex gap-4 mt-6">
 <button @click="handleSaveBank" :disabled="!isAccountVerified" class="w-full py-4 bg-parentPrimary text-white rounded-xl text-base font-bold shadow-sm border border-gray-100 shadow-parentPrimary/20 disabled:opacity-30 hover:brightness-110 active:scale-[0.98] transition-all">Update Bank Account</button>
 </div>
 </div>
 </SideDrawer>

 <!-- Withdraw SideDrawer -->
 <SideDrawer :isOpen="showWithdrawDrawer" @close="showWithdrawDrawer = false">
 <div class="flex flex-col items-center justify-center py-4 border-b border-gray-100 space-y-4">
 <div class="w-20 h-20 bg-parentPrimary/10 text-parentPrimary rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner border border-white">💸</div>
 <div class="text-center">
 <h3 class="text-2xl font-bold text-gray-900 mb-1">Request Payout</h3>
 <p class="text-gray-500 text-base">Withdraw your earnings to your linked bank account.</p>
 </div>
 </div>

 <div class="space-y-6 pt-6">
 <div class="space-y-2">
 <div class="relative">
 <span class="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">₦</span>
 <input v-model="formattedWithdrawAmount" type="text" class="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl text-3xl font-bold text-center focus:ring-4 focus:ring-parentPrimary/10 focus:bg-white transition-all shadow-inner" placeholder="0">
 </div>
 <p class="text-sm text-gray-400 font-medium text-center">Available: ₦{{ balance?.toLocaleString() }}</p>
 </div>

 <div class="pt-6 border-t border-gray-100 flex flex-col gap-3">
  <!-- Instant Toggle -->
  <label class="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
   <div class="flex flex-col">
    <span class="text-sm font-bold text-gray-900">Instant Withdrawal</span>
    <span class="text-[10px] text-gray-500 font-medium">Get funds immediately (Max ₦5,000)</span>
   </div>
   <div class="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" v-model="isInstant" class="sr-only peer" :disabled="withdrawAmount > 5000">
    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-parentPrimary"></div>
   </div>
  </label>
  <p v-if="isInstant && withdrawAmount > 5000" class="text-[10px] text-red-500 font-bold px-1 text-center">Instant withdrawal is limited to ₦5,000</p>
  
  <button @click="handleWithdraw" :disabled="withdrawAmount < minimumPayout || withdrawAmount > (balance || 0) || (isInstant && withdrawAmount > 5000)" class="w-full py-4 bg-parentPrimary text-white rounded-xl font-bold text-base shadow-sm border border-gray-100 shadow-parentPrimary/20 hover:brightness-110 disabled:opacity-30 active:scale-[0.98] transition-all ">
  Confirm Withdrawal
  </button>
  <p v-if="withdrawAmount > 0 && withdrawAmount < minimumPayout" class="text-[10px] text-red-500 font-bold px-1 text-center">Minimum payout is ₦{{ minimumPayout.toLocaleString() }}</p>
 </div>
 </div>
 </SideDrawer>
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useWallet } from '@/composables/modules/wallets';
import { wallets_api } from '@/api_factory/modules/wallets';
import { settings_api } from '@/api_factory/modules/settings';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCustomToast } from '@/composables/core/useCustomToast';
import SideDrawer from '@/components/ui/SideDrawer.vue';

const { showToast } = useCustomToast();
const { balance, wallet, fetchWallet, withdrawFunds, updatePreferences, downloadReceipt } = useWallet();
const transactions = ref<any[]>([]);
const loading = ref(true);
const minimumPayout = ref(1000);
const showWithdrawDrawer = ref(false);
const showBankDrawer = ref(false);
const withdrawAmount = ref(0);
const isInstant = ref(false);
const formattedWithdrawAmount = computed({
 get() {
 if (withdrawAmount.value === 0 || withdrawAmount.value === null || withdrawAmount.value === undefined) return '';
 return withdrawAmount.value.toLocaleString('en-US');
 },
 set(val) {
 const clean = val.replace(/[^0-9.]/g, '');
 withdrawAmount.value = clean ? Number(clean) : 0;
 }
});
const banks = ref<any[]>([]);
const resolving = ref(false);
const isAccountVerified = ref(false);

definePageMeta({
 layout: 'errander'
})

const bankForm = ref({
 bankName: '',
 bankCode: '',
 accountNumber: '',
 accountName: '',
});

const loadData = async () => {
 loading.value = true;
  try {
  const txRes = await wallets_api.getTransactions();
  transactions.value = txRes.data;
  await fetchWallet();

  try {
    const pRes = await settings_api.getPayoutSettings();
    if (pRes.data) {
      minimumPayout.value = pRes.data.amount || 1000;
    }
  } catch(e) {
    console.error('Failed to load minimum payout setting', e);
  }

  if (wallet.value?.bankDetails) {
 bankForm.value = { ...wallet.value.bankDetails };
 isAccountVerified.value = !!wallet.value.bankDetails.accountName;
 }
 const banksRes: any = await api.get('/payments/banks');
 banks.value = banksRes.data || [];
 } catch (e) {
 console.error(e);
 } finally {
 loading.value = false;
 }
};

const onBankChange = () => {
 const selectedBank = banks.value.find(b => b.code === bankForm.value.bankCode);
 if (selectedBank) {
 bankForm.value.bankName = selectedBank.name;
 }
 isAccountVerified.value = false;
 bankForm.value.accountName = '';
};

const resolveAccount = async () => {
 if (bankForm.value.accountNumber.length !== 10 || !bankForm.value.bankCode) return;
 resolving.value = true;
 try {
 const res: any = await api.post('/payments/resolve-account', {
 account_number: bankForm.value.accountNumber,
 bank_code: bankForm.value.bankCode
 });
 bankForm.value.accountName = res.data.account_name;
 isAccountVerified.value = true;
 } catch (e: any) {
 showToast({
 title: 'Verification Failed',
 message: e.data?.message || 'Failed to resolve account',
 toastType: 'error'
 });
 } finally {
 resolving.value = false;
 }
};

const handleUpdateFrequency = async (preference: string) => {
 await updatePreferences({ preference });
};

const handleSaveBank = async () => {
 if (!isAccountVerified.value) return;
 await updatePreferences({
 preference: wallet.value?.payoutPreference || 'weekly',
 bankDetails: bankForm.value
 });
 showBankDrawer.value = false;
};

const handleWithdraw = async () => {
 if (withdrawAmount.value <= 0 || withdrawAmount.value > balance.value) return;
 if (isInstant.value && withdrawAmount.value > 5000) {
  showToast({ title: 'Error', message: 'Instant withdrawals are limited to ₦5,000', toastType: 'error' });
  return;
 }
 await withdrawFunds(withdrawAmount.value, isInstant.value);
 withdrawAmount.value = 0;
 showWithdrawDrawer.value = false;
 await loadData();
};

onMounted(loadData);
useHead({ title: 'Earnings - Errandr Dashboard' });
</script>

<style scoped>
.animate-fade-in {
 animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.animate-scale-in {
 animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.animate-shimmer {
 animation: shimmer 2s infinite linear;
}
@keyframes fadeIn {
 from { opacity: 0; transform: translateY(20px); }
 to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
 from { opacity: 0; transform: scale(0.9) translateY(10px); }
 to { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes shimmer {
 100% { transform: translateX(100%); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
