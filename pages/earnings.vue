<template>
  <div class="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12 mt-4">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Earnings & Payouts</h1>
        <p class="text-gray-500 text-sm">Track your delivery earnings and manage withdrawals.</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="showStatementModal = true" class="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium text-sm border border-gray-25 hover:bg-gray-50 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Generate Statement
        </button>
        <button v-if="balance > 0" @click="showWithdrawDrawer = true" :disabled="balance < minimumPayout" class="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          Request Payout
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    </div>
    <p v-if="balance > 0 && balance < minimumPayout" class="text-xs text-rose-500 font-medium">Minimum withdrawal: ₦{{ minimumPayout.toLocaleString() }}</p>

    <!-- Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="i in 2" :key="i" class="bg-gray-50 rounded-lg p-6 animate-pulse h-32" />
    </div>

    <div v-else class="space-y-6 animate-fade-in">
      <!-- Balance Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Available Balance -->
        <div class="p-5 rounded-lg bg-white border border-gray-25">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Available for Payout</p>
            <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">
            <span class="text-sm text-gray-400">₦</span>{{ balance?.toLocaleString() || '0' }}
          </p>
          <div class="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-50">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p class="text-[10px] font-semibold text-emerald-600 uppercase">Verified</p>
          </div>
        </div>

        <!-- Lifetime Earnings -->
        <div class="p-5 rounded-lg bg-white border border-gray-25">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Lifetime Earnings</p>
            <div class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">
            <span class="text-sm text-gray-400">₦</span>{{ wallet?.totalEarned?.toLocaleString() || '0' }}
          </p>
          <p class="text-xs text-gray-400 mt-2">Total from all completed errands</p>
        </div>
      </div>

      <!-- Payout Settings -->
      <section class="bg-white p-5 rounded-lg border border-gray-25">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-900">Payout Settings</h3>
            <p class="text-xs text-gray-500">Configure your payout frequency and bank account.</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Frequency -->
          <div class="space-y-3">
            <label class="text-xs font-medium text-gray-500">Settlement Frequency</label>
            <div class="flex gap-1 p-1 bg-gray-50 border border-gray-25 rounded-lg">
              <button v-for="p in ['manual', 'daily', 'weekly', 'monthly']" :key="p"
                @click="handleUpdateFrequency(p)"
                class="flex-1 py-2 rounded-md text-xs font-semibold transition-all capitalize"
                :class="wallet?.payoutPreference === p ? 'bg-white text-gray-900 border border-gray-25' : 'text-gray-500 hover:text-gray-700'"
              >
                {{ p }}
              </button>
            </div>
            <p class="text-[11px] text-gray-400 leading-relaxed">Daily settlements may incur processing fees. Weekly and monthly are free.</p>
          </div>

          <!-- Bank Account -->
          <div class="space-y-3">
            <label class="text-xs font-medium text-gray-500">Bank Account</label>
            <div class="p-4 rounded-lg bg-gray-50 border border-gray-25">
              <p class="text-xs text-gray-500">{{ wallet?.bankDetails?.bankName || 'No Bank Linked' }}</p>
              <p class="text-base font-semibold text-gray-900 font-mono mt-1">{{ wallet?.bankDetails?.accountNumber || '•••• •••• ••••' }}</p>
              <p class="text-xs font-medium text-gray-600 mt-1">{{ wallet?.bankDetails?.accountName || 'Not configured' }}</p>
            </div>
            <button @click="showBankDrawer = true" class="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-25 transition-colors">
              Update Bank Details
            </button>
          </div>
        </div>
      </section>

      <!-- Ledger -->
      <section class="bg-white rounded-lg border border-gray-25 overflow-hidden">
        <div class="p-4 border-b border-gray-100">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-gray-900 text-sm">Ledger History</h3>
              <span class="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-semibold">{{ filteredTransactions.length }}</span>
            </div>
            
            <!-- Filters -->
            <div class="flex items-center gap-2 flex-wrap">
              <div class="w-32 relative">
                <UiSelectInput v-model="filterType" :options="[{label: 'All Types', value: 'all'}, {label: 'Credits Only', value: 'credit'}, {label: 'Debits Only', value: 'debit'}]" class="w-full h-8 !min-h-[32px] text-xs !px-2 rounded-lg bg-white focus:ring-1 focus:ring-gray-300" />
              </div>
              <div class="w-32">
                <UiDatePicker v-model="filterDateFrom" placeholder="From" />
              </div>
              <div class="w-32">
                <UiDatePicker v-model="filterDateTo" placeholder="To" />
              </div>
              <button v-if="filterType !== 'all' || filterDateFrom || filterDateTo" @click="clearFilters" class="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium">
                Clear
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <div v-if="filteredTransactions.length === 0" class="py-16 flex flex-col items-center justify-center text-center px-4">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <span class="text-2xl opacity-50">🍃</span>
            </div>
            <h4 class="text-sm font-bold text-gray-900 mb-1">{{ transactions.length === 0 ? 'No earnings yet' : 'No matching transactions' }}</h4>
            <p class="text-gray-400 text-xs max-w-sm">{{ transactions.length === 0 ? 'Complete your first delivery to see your history.' : 'Try adjusting the filters above.' }}</p>
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide">Description</th>
                  <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide text-right">Amount</th>
                  <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide text-right">Date</th>
                  <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="tx in filteredTransactions" :key="tx._id" class="hover:bg-gray-50/50 transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                      <div :class="tx.type === 'credit' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'" class="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                        <svg v-if="tx.type === 'credit'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path></svg>
                        <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path></svg>
                      </div>
                      <div>
                        <p class="text-xs text-gray-900 font-semibold">{{ tx.description }}</p>
                        <p v-if="tx.order" class="text-[10px] text-gray-400 font-mono mt-0.5">{{ tx.order.slice(-8) }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <p :class="tx.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'" class="text-xs font-bold font-mono">
                      {{ tx.type === 'credit' ? '+' : '-' }}₦{{ tx.amount.toLocaleString() }}
                    </p>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <p class="text-xs text-gray-700 font-medium">{{ new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }}</p>
                    <p class="text-[10px] text-gray-400 mt-0.5">{{ new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <button @click="downloadReceipt(tx._id)" class="px-2.5 py-1 rounded text-[10px] font-semibold text-gray-500 hover:text-[#FF5C1A] hover:bg-orange-50 transition-colors inline-flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
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

  <!-- Statement Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showStatementModal" class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4" @click.self="showStatementModal = false">
        <div class="bg-white rounded-lg w-full max-w-md p-6 space-y-5">
          <div>
            <h3 class="text-base font-bold text-gray-900">Generate Statement</h3>
            <p class="text-xs text-gray-500 mt-1">Select a date range to download your earnings statement as CSV.</p>
          </div>
          <div class="space-y-3">
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 block">From</label>
              <UiDatePicker v-model="statementFrom" class="w-full" />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 block">To</label>
              <UiDatePicker v-model="statementTo" class="w-full" />
            </div>
          </div>
          <div class="flex gap-3">
            <button @click="showStatementModal = false" class="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
            <button @click="generateStatement" :disabled="!statementFrom || !statementTo" class="flex-1 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40">Download CSV</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Bank Details SideDrawer -->
  <SideDrawer :isOpen="showBankDrawer" @close="showBankDrawer = false">
    <div class="space-y-5">
      <div class="border-b border-gray-100 pb-3">
        <h3 class="text-lg font-bold text-gray-900">Bank Information</h3>
        <p class="text-gray-500 text-sm mt-1">Your earnings will be sent to this account.</p>
      </div>

      <div class="space-y-4">
        <div>
          <label class="text-xs font-medium text-gray-500 mb-1 block">Select Bank</label>
          <UiSelectInput v-model="bankForm.bankCode" :options="banks" class="w-full" @update:modelValue="onBankChange" />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 mb-1 block">Account Number</label>
          <div class="relative">
            <input v-model="bankForm.accountNumber" @input="isAccountVerified = false" type="text" maxlength="10" class="w-full pl-3 pr-20 py-2.5 bg-gray-50 border border-gray-25 rounded-lg text-sm font-medium focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all" placeholder="10-digit NUBAN">
            <button 
              @click="resolveAccount" 
              :disabled="bankForm.accountNumber.length !== 10 || !bankForm.bankCode || resolving"
              class="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-md bg-gray-900 text-white text-xs font-semibold disabled:opacity-30 hover:bg-gray-800 transition-all"
            >
              {{ resolving ? 'Wait...' : 'Verify' }}
            </button>
          </div>
        </div>
        <Transition name="fade">
          <div v-if="bankForm.accountName" class="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
            <p class="text-xs text-emerald-600 font-semibold">Verified Beneficiary</p>
            <p class="text-sm text-emerald-900 font-bold">{{ bankForm.accountName }}</p>
          </div>
        </Transition>
      </div>
      
      <div class="pt-4 border-t border-gray-100">
        <button @click="handleSaveBank" :disabled="!isAccountVerified" class="w-full py-2.5 bg-[#FF5C1A] text-white rounded-lg text-sm font-semibold disabled:opacity-30 hover:bg-[#E54D12] transition-all">Update Bank Account</button>
      </div>
    </div>
  </SideDrawer>

  <!-- Withdraw SideDrawer -->
  <SideDrawer :isOpen="showWithdrawDrawer" @close="showWithdrawDrawer = false">
    <div class="space-y-5">
      <div class="text-center border-b border-gray-100 pb-4">
        <div class="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">💸</div>
        <h3 class="text-lg font-bold text-gray-900">Request Payout</h3>
        <p class="text-gray-500 text-xs">Withdraw to your linked bank account.</p>
      </div>

      <div class="space-y-3">
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-gray-400">₦</span>
          <input v-model="formattedWithdrawAmount" type="text" class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-25 rounded-lg text-xl font-bold text-center focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all" placeholder="0">
        </div>
        <p class="text-xs text-gray-400 text-center">Available: ₦{{ balance?.toLocaleString() }}</p>
      </div>

      <div class="space-y-3">
        <!-- Instant Toggle -->
        <label class="flex items-center justify-between p-3 bg-gray-50 border border-gray-25 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <div>
            <span class="text-xs font-semibold text-gray-900">Instant Withdrawal</span>
            <span class="text-[10px] text-gray-500 block">Max ₦5,000</span>
          </div>
          <div class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="isInstant" class="sr-only peer" :disabled="withdrawAmount > 5000">
            <div class="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
          </div>
        </label>
        <p v-if="isInstant && withdrawAmount > 5000" class="text-[10px] text-red-500 font-medium text-center">Instant withdrawal is limited to ₦5,000</p>
        
        <button @click="handleWithdraw" :disabled="withdrawAmount < minimumPayout || withdrawAmount > (balance || 0) || (isInstant && withdrawAmount > 5000)" class="w-full py-2.5 bg-[#FF5C1A] text-white rounded-lg font-semibold text-sm hover:bg-[#E54D12] disabled:opacity-30 transition-all">
          Confirm Withdrawal
        </button>
        <p v-if="withdrawAmount > 0 && withdrawAmount < minimumPayout" class="text-[10px] text-red-500 font-medium text-center">Minimum payout is ₦{{ minimumPayout.toLocaleString() }}</p>
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
const showStatementModal = ref(false);
const withdrawAmount = ref(0);
const isInstant = ref(false);

// Filters
const filterType = ref('all');
const filterDateFrom = ref('');
const filterDateTo = ref('');

// Statement
const statementFrom = ref('');
const statementTo = ref('');

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

const filteredTransactions = computed(() => {
  let result = [...transactions.value];
  
  if (filterType.value !== 'all') {
    result = result.filter(tx => tx.type === filterType.value);
  }
  
  if (filterDateFrom.value) {
    const from = new Date(filterDateFrom.value);
    from.setHours(0, 0, 0, 0);
    result = result.filter(tx => new Date(tx.createdAt) >= from);
  }
  
  if (filterDateTo.value) {
    const to = new Date(filterDateTo.value);
    to.setHours(23, 59, 59, 999);
    result = result.filter(tx => new Date(tx.createdAt) <= to);
  }
  
  return result;
});

const clearFilters = () => {
  filterType.value = 'all';
  filterDateFrom.value = '';
  filterDateTo.value = '';
};

const banks = ref<any[]>([]);
const resolving = ref(false);
const isAccountVerified = ref(false);

definePageMeta({ layout: 'errander' });

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
      if (pRes.data) minimumPayout.value = pRes.data.amount || 1000;
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
  if (selectedBank) bankForm.value.bankName = selectedBank.name;
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
    showToast({ title: 'Verification Failed', message: e.data?.message || 'Failed to resolve account', toastType: 'error' });
  } finally {
    resolving.value = false;
  }
};

const handleUpdateFrequency = async (preference: string) => {
  await updatePreferences({ preference });
};

const handleSaveBank = async () => {
  if (!isAccountVerified.value) return;
  await updatePreferences({ preference: wallet.value?.payoutPreference || 'manual', bankDetails: bankForm.value });
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

const generateStatement = () => {
  if (!statementFrom.value || !statementTo.value) return;
  
  const from = new Date(statementFrom.value);
  from.setHours(0, 0, 0, 0);
  const to = new Date(statementTo.value);
  to.setHours(23, 59, 59, 999);
  
  const filtered = transactions.value.filter(tx => {
    const d = new Date(tx.createdAt);
    return d >= from && d <= to;
  });
  
  if (filtered.length === 0) {
    showToast({ title: 'No Data', message: 'No transactions found for the selected period.', toastType: 'error' });
    return;
  }
  
  // Build CSV
  const headers = ['Date', 'Time', 'Type', 'Description', 'Amount (₦)', 'Reference'];
  const rows = filtered.map(tx => [
    new Date(tx.createdAt).toLocaleDateString(),
    new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tx.type,
    `"${tx.description || ''}"`,
    `${tx.type === 'credit' ? '+' : '-'}${tx.amount}`,
    tx.order?.slice(-8) || ''
  ]);
  
  // Summary row
  const totalCredit = filtered.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalDebit = filtered.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  rows.push([]);
  rows.push(['Summary']);
  rows.push(['Total Credits', '', '', '', `+${totalCredit}`]);
  rows.push(['Total Debits', '', '', '', `-${totalDebit}`]);
  rows.push(['Net', '', '', '', `${totalCredit - totalDebit}`]);
  
  const csv = [headers.join(','), ...rows.map(r => (r as any[]).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `errandr-statement-${statementFrom.value}-to-${statementTo.value}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  
  showStatementModal.value = false;
  showToast({ title: 'Downloaded', message: `Statement with ${filtered.length} transactions downloaded.`, toastType: 'success' });
};

onMounted(loadData);
useHead({ title: 'Earnings - Errandr Dashboard' });
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
