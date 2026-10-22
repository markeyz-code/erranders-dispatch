<template>
  <div class="flex gap-2">
    <button
      type="button"
      class="flex-1 py-2.5 bg-[#FF5C1A] text-white rounded-lg text-sm font-bold hover:bg-[#E54D12] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
      :disabled="!!disabledReason"
      :title="disabledReason || 'Call in the app'"
      @click="call('voice')"
    >
      <Phone class="w-3.5 h-3.5" /> Call
    </button>
    <button
      type="button"
      class="flex-1 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
      :disabled="!!disabledReason"
      :title="disabledReason || 'Video call in the app'"
      @click="call('video')"
    >
      <Video class="w-3.5 h-3.5" /> Video
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Phone, Video } from 'lucide-vue-next';
import { useCall } from '@/composables/core/useCall';

/**
 * In-app call buttons for one person on an order.
 *
 * Unlike a `tel:` link this keeps the call inside the product, so neither side has to give
 * away a personal number — and the order records that the call happened.
 */
const props = defineProps<{
  orderId: string;
  toUserId?: string;
  name?: string;
}>();

const { startCall, state, connect } = useCall();

// A call can only be placed while nothing else is in progress, and only when the order
// knows who to call.
const disabledReason = computed(() => {
  if (!props.orderId) return 'This order is not ready for calls yet.';
  if (!props.toUserId) return 'Nobody has been assigned to this order yet.';
  if (state.value !== 'idle') return 'You are already on a call.';
  return '';
});

const call = (type: 'voice' | 'video') => {
  if (disabledReason.value) return;
  connect();
  void startCall({
    orderId: props.orderId,
    toUserId: String(props.toUserId),
    type,
    name: props.name,
  });
};
</script>
