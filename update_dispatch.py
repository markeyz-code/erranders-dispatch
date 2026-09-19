import re

with open("pages/deliveries/[id].vue", "r") as f:
    content = f.read()

# Update UI 
ui_search = r'<div v-else-if="substituteOptions\.length === 0" class="text-center py-8">.*?<div v-else class="space-y-2">.*?</div>\n      </div>'
ui_replace = """<div v-else-if="substituteOptions.length === 0" class="text-center py-8">
          <p class="text-sm font-bold text-gray-500">No substitute items found.</p>
        </div>
        
        <div v-else class="space-y-2 pb-24">
          <button 
            v-for="opt in substituteOptions" 
            :key="opt._id"
            @click="toggleSubstituteSelection(opt._id)"
            class="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl transition-all text-left"
            :class="selectedSubstituteIds.includes(opt._id) ? 'border-[#FF5C1A] bg-orange-50 ring-2 ring-orange-200' : 'hover:border-gray-300'"
          >
            <div>
              <p class="text-sm font-bold text-gray-900">{{ opt.name }}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <p class="text-xs font-black text-gray-900 font-mono">₦{{ (opt.pricePerPortion ?? opt.price).toLocaleString() }}</p>
                <span v-if="(opt.pricePerPortion ?? opt.price) > basePriceToMatch" class="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">Costs Extra</span>
                <span v-else-if="(opt.pricePerPortion ?? opt.price) < basePriceToMatch" class="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">Cheaper</span>
              </div>
            </div>
            <div class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border"
                 :class="selectedSubstituteIds.includes(opt._id) ? 'bg-[#FF5C1A] border-[#FF5C1A] text-white' : 'border-gray-300 text-transparent'">
              <Check class="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
      <div v-if="substituteOptions.length > 0" class="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <button 
          @click="sendSubstituteRequest"
          :disabled="isSubmittingSubstitute || selectedSubstituteIds.length === 0"
          class="w-full py-4 bg-[#FF5C1A] text-white font-bold rounded-xl hover:bg-[#e04f14] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
        >
          <Loader2 v-if="isSubmittingSubstitute" class="w-5 h-5 animate-spin" />
          <span>Send Options to Student ({{ selectedSubstituteIds.length }})</span>
        </button>
      </div>"""
content = re.sub(ui_search, ui_replace, content, flags=re.DOTALL)

# Update logic
logic_search = r'const openSubstituteModal = async.*?const closeSubstituteModal = \(\) => {'
logic_replace = """const selectedSubstituteIds = ref<string[]>([]);
const basePriceToMatch = ref<number>(0);

const toggleSubstituteSelection = (id: string) => {
  if (selectedSubstituteIds.value.includes(id)) {
    selectedSubstituteIds.value = selectedSubstituteIds.value.filter(i => i !== id);
  } else {
    if (selectedSubstituteIds.value.length >= 3) {
      showToast({ title: 'Limit Reached', message: 'You can select up to 3 options.', toastType: 'info' });
      return;
    }
    selectedSubstituteIds.value.push(id);
  }
};

const sendSubstituteRequest = async () => {
  if (!order.value || !activeSubstituteItem.value || selectedSubstituteIds.value.length === 0) return;
  
  isSubmittingSubstitute.value = true;
  try {
    const payload = {
      itemId: activeSubstituteItem.value.id || activeSubstituteItem.value._id || activeSubstituteItem.value.menuItemId,
      substituteItemIds: selectedSubstituteIds.value,
      itemName: activeSubstituteItem.value.name
    };
    
    await api.post(`/orders/${order.value._id}/items/${payload.itemId}/substitute/request`, payload);
    
    showToast({ title: 'Success', message: 'Substitute options sent to student', toastType: 'success' });
    closeSubstituteModal();
    // Re-fetch order to update UI statuses if needed, though they don't change locally yet until resolved
  } catch (err: any) {
    showToast({ title: 'Error', message: err.response?.data?.message || 'Failed to request substitute', toastType: 'error' });
  } finally {
    isSubmittingSubstitute.value = false;
  }
};

const openSubstituteModal = async (item: any) => {
  activeSubstituteItem.value = item;
  showSubstituteModal.value = true;
  substituteOptions.value = [];
  selectedSubstituteIds.value = [];
  
  const vendorRef = order.value?.vendor;
  const vendorId = vendorRef?._id || vendorRef;
  
  if (vendorId) {
    isLoadingSubstitutes.value = true;
    try {
      const res = await api.get<any>(`/menu/items/vendor/${vendorId}`);
      if (res && res.type === 'ERROR') {
        throw new Error(res.message || 'Failed to fetch vendor items');
      }
      
      const items = res?.data || res || [];
      const originalPrice = Number(item.price);
      const originalMenuItemRef = String(item.menuItem || item.product || item._id);
      const originalMenuDoc = items.find((opt: any) => String(opt._id || opt.id) === originalMenuItemRef);
      
      let basePrice = originalPrice;
      if (originalMenuDoc) {
        basePrice = Number(originalMenuDoc.pricePerPortion ?? originalMenuDoc.price);
      } else {
        basePrice = Math.floor(originalPrice / 1.05);
      }
      basePriceToMatch.value = basePrice;

      substituteOptions.value = items.filter((opt: any) => {
        const optId = String(opt._id || opt.id);
        return optId !== originalMenuItemRef;
      });

    } catch (e) {
      console.error('Failed to load substitutes', e);
      showToast({ title: 'Error', message: 'Failed to load menu items', toastType: 'error' });
    } finally {
      isLoadingSubstitutes.value = false;
    }
  }
};


const closeSubstituteModal = () => {"""
content = re.sub(logic_search, logic_replace, content, flags=re.DOTALL)

with open("pages/deliveries/[id].vue", "w") as f:
    f.write(content)
