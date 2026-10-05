<template>
 <Teleport to="body">
 <div v-if="isOpen" class="fixed inset-0 z-[100] flex justify-end animate-fade-in font-sans">
 <!-- Backdrop -->
 <div @click="$emit('close')" class="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity" />
 
 <!-- Chat Panel -->
 <div class="relative w-full max-w-md bg-gray-50 h-full shadow-sm border border-gray-50 flex flex-col animate-slide-left overflow-hidden">
 <!-- Header -->
 <div class="px-4 py-3 bg-[#FF5C1A] text-white flex items-center gap-3 sticky top-0 z-20 shadow-sm border border-[#FF5C1A]/10">
 <button @click="$emit('close')" class="p-1 hover:bg-white/10 rounded-full transition-colors mr-1">
 <ArrowLeft class="w-5 h-5 text-white" />
 </button>
 <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold overflow-hidden border border-white/10">
 <img v-if="receiverAvatar" :src="receiverAvatar" class="w-full h-full object-cover" />
 <User v-else class="w-5 h-5 text-white/70" />
 </div>
 <div class="flex-1 min-w-0">
 <h3 class="text-base font-bold truncate leading-tight">{{ receiverName || 'Order Coordination' }}</h3>
 <p class="text-[11px] text-white/70 font-medium truncate">
 {{ isTyping ? 'typing...' : (isOnline ? 'online' : 'tap for info') }}
 </p>
 </div>
 <div class="flex items-center gap-4 ml-2">
 <Video class="w-5 h-5 text-white/80 cursor-not-allowed opacity-50" />
 <Phone class="w-5 h-5 text-white/80 cursor-not-allowed opacity-50" />
 <MoreVertical class="w-5 h-5 text-white/80" />
 </div>
 </div>

 <!-- Messages Area -->
 <div ref="messageContainer" class="flex-1 overflow-y-auto px-4 py-4 space-y-2 scroll-smooth bg-gray-50">
 
 <!-- Date Marker -->
 <div class="flex justify-center mb-6 sticky top-2 z-10">
 <span class="px-3 py-1 bg-[#D1E9F6] text-[#54656F] text-[11px] font-bold rounded-lg shadow-sm tracking-wide ">
 Order Coordination
 </span>
 </div>

 <div v-if="loading" class="flex flex-col items-center justify-center h-40 space-y-4">
 <div class="w-8 h-8 border border-[#FF5C1A]/20 border-t-[#FF5C1A] rounded-full animate-spin" />
 </div>
 
 <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center p-10 text-center space-y-3 mt-10">
 <div class="p-5 bg-white rounded-3xl shadow-sm">
 <p class="text-[12px] text-gray-500 font-medium leading-relaxed">
 🔒 Messages are end-to-end encrypted. No one outside of this chat, not even Errandr, can read them.
 </p>
 </div>
 </div>

 <div v-for="(msg, idx) in messages" :key="msg._id || idx" 
 class="flex flex-col w-full animate-message-in" 
 :class="isMe(msg) ? 'items-end' : 'items-start'">
 
 <div :class="[
 'relative max-w-[85%] px-3 py-1.5 rounded-lg text-[14.5px] shadow-sm mb-1 group transition-all',
 isMe(msg) 
 ? 'bg-[#FF5C1A] text-white rounded-tr-none ml-10' 
 : 'bg-white text-gray-900 rounded-tl-none mr-10'
 ]">
 <!-- Speech Bubble Tail -->
 <div v-if="shouldShowTail(msg, idx)" 
 :class="[
 'absolute top-0 w-3 h-4',
 isMe(msg) 
 ? 'right-[-8px] text-[#FF5C1A]' 
 : 'left-[-8px] text-white -scale-x-100'
 ]">
 <svg viewBox="0 0 8 13" width="8" height="13" class="fill-current">
 <path v-if="isMe(msg)" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" />
 <path v-else d="M2.812 1H8v11.193L1.533 3.568C.474 2.156 1.042 1 2.812 1z" />
 </svg>
 </div>

 <!-- Sender name for groups/receivers -->
 <p v-if="!isMe(msg) && shouldShowSender(msg, idx)" class="text-[12px] font-bold text-[#FF5C1A] mb-0.5">
 {{ getSenderId(msg) === receiverId ? receiverName : 'System' }}
 </p>

 <!-- Media Content -->
 <div v-if="msg.messageType === 'image'" class="mb-1 -mx-1 -mt-0.5">
 <img :src="msg.attachment" class="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity" @click="msg.attachment && openImage(msg.attachment)" />
 </div>
 <div v-if="msg.messageType === 'voice'" class="mb-1 min-w-[200px] flex items-center gap-3 py-2">
 <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
 <Mic class="w-5 h-5" :class="isMe(msg) ? 'text-white' : 'text-[#FF5C1A]'" />
 </div>
 <audio :src="msg.attachment" controls class="h-8 w-full custom-audio" />
 </div>

 <div class="flex items-end gap-2 flex-wrap">
 <span v-if="msg.message" class="break-words flex-1 min-w-0 font-medium">{{ msg.message }}</span>
 <div class="flex items-center gap-1 shrink-0 mt-1 self-end">
 <span class="text-[10px] text-gray-400 font-medium">
 {{ formatTime(msg.createdAt) }}
 </span>
 <!-- Status Ticks -->
 <div v-if="isMe(msg)" class="flex items-center">
 <Check v-if="!msg._id" class="w-3.5 h-3.5" :class="isMe(msg) ? 'text-white' : 'text-gray-400'" />
 <CheckCheck v-else class="w-3.5 h-3.5" :class="isMe(msg) ? 'text-white' : 'text-[#FF5C1A]'" />
 </div>
 </div>
 </div>
 </div>
 </div>
 
 <div v-if="isTyping" class="flex items-center ml-2 transition-all">
 <div class="bg-white px-3 py-2 rounded-lg shadow-sm text-[12px] text-[#FF5C1A] font-bold  animate-pulse">
 {{ receiverName || 'User' }} is typing...
 </div>
 </div>

 <!-- Media Preview if uploading -->
 <div v-if="uploadingMedia" class="flex flex-col items-center justify-center p-4 bg-white/50 backdrop-blur-sm rounded-2xl mx-10 animate-pulse border border-emerald-100">
 <div class="w-8 h-8 border border-[#FF5C1A]/20 border-t-[#FF5C1A] rounded-full animate-spin mb-2" />
 <p class="text-[10px] font-bold text-emerald-600 tracking-widest">Sending media...</p>
 </div>
 </div>

 <!-- Input Bar -->
 <div class="px-2 py-3 bg-white flex flex-col gap-2 border-t border-gray-100">
 <!-- Voice Recording UI -->
 <div v-if="isRecording" class="flex items-center gap-3 px-4 py-2 bg-[#FFF0EA] rounded-xl animate-pulse">
 <div class="flex items-center gap-2 flex-1">
 <div class="w-2 h-2 rounded-full bg-red-500 animate-ping" />
 <span class="text-sm font-bold text-[#FF5C1A]">{{ recordingDuration }}s</span>
 <div class="flex-1 h-1 bg-[#FFD1BF] rounded-full overflow-hidden">
 <div class="h-full bg-[#FF5C1A] animate-progress" />
 </div>
 </div>
 <button @click="cancelRecording" class="text-xs font-bold text-red-500 tracking-widest">Cancel</button>
 </div>

 <div class="flex items-center gap-2">
 <div class="flex items-center gap-2 px-1">
 <Smile class="w-6 h-6 text-[#54656F] cursor-pointer" />
 <label class="cursor-pointer">
 <input type="file" class="hidden" accept="image/*" @change="handleImageUpload" />
 <Paperclip class="w-6 h-6 text-[#54656F] -rotate-45" />
 </label>
 </div>
 
 <div class="flex-1 bg-white rounded-xl px-4 py-2.5 flex items-center shadow-sm border border-transparent focus-within:border-gray-100 transition-all">
 <input 
 v-model="newMsgText" 
 type="text" 
 placeholder="Type a message" 
 class="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-[#111B21] placeholder:text-gray-400"
 @input="handleTyping"
 @keyup.enter="handleSend"
 />
 </div>

 <button 
 @click="isRecording ? stopRecording() : (newMsgText.trim() ? handleSend() : startRecording())"
 :class="[
 'w-12 h-12 text-white rounded-full flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-sm border border-gray-50 shrink-0',
 isRecording ? 'bg-red-500' : 'bg-[#FF5C1A]'
 ]"
 >
 <Send v-if="newMsgText.trim() && !isRecording" class="w-5 h-5 ml-0.5" />
 <Mic v-else-if="!isRecording" class="w-5 h-5" />
 <Square v-else class="w-5 h-5" />
 </button>
 </div>
 </div>
 </div>
 </div>
 </Teleport>
</template>

<script setup lang="ts">
import { 
 ArrowLeft, User, Phone, Video, MoreVertical, 
 Smile, Paperclip, Send, Mic, Check, CheckCheck, Square 
} from 'lucide-vue-next';
import { ref, onMounted, nextTick, watch } from 'vue';
import { useOrderChat } from '@/composables/useOrderChat';

export interface Message {
 _id: string;
 orderId: string;
 senderId: string;
 receiverId: string;
 message: string;
 messageType?: 'text' | 'image' | 'voice';
 attachment?: string;
 sender?: {
 firstName: string;
 lastName: string;
 avatar?: string;
 };
 createdAt: string;
}

const props = defineProps<{
 isOpen: boolean;
 orderId: string;
 currentUserId: string;
 receiverId: string;
 receiverName?: string;
 receiverAvatar?: string;
 isOnline?: boolean;
}>();

const emit = defineEmits(['close']);
const newMsgText = ref('');
const messageContainer = ref<HTMLElement | null>(null);
const uploadingMedia = ref(false);

// Voice Recording State
const isRecording = ref(false);
const recordingDuration = ref(0);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const recordingInterval = ref<any>(null);

const { 
  messages, 
  loading, 
  isTyping, 
  fetchMessages, 
  sendMessage, 
  sendTyping, 
  setupListeners 
} = useOrderChat(
  () => props.orderId,
  () => props.currentUserId,
  () => props.receiverId
);

// Custom sendMessage that supports attachments
const sendMediaMessage = async (type: 'image' | 'voice', attachment: string, text = '') => {
 sendMessage(text, props.receiverId, props.currentUserId, type, attachment);
};

const handleImageUpload = async (event: Event) => {
 const target = event.target as HTMLInputElement;
 const file = target.files?.[0];
 if (!file) return;

 uploadingMedia.value = true;
 try {
 const formData = new FormData();
 formData.append('file', file);
 
 const config = useRuntimeConfig();
 const res = await fetch(`${config.public.apiBase}/upload?resourceType=image`, {
 method: 'POST',
 body: formData,
 headers: {
 'Authorization': `Bearer ${localStorage.getItem('token')}`
 }
 });
 
 if (!res.ok) throw new Error('Upload failed');
 const data = await res.json();
 
 await sendMediaMessage('image', data.url);
 } catch (e) {
 console.error('Image upload failed', e);
 } finally {
 uploadingMedia.value = false;
 target.value = '';
 }
};

const startRecording = async () => {
 try {
 const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
 mediaRecorder.value = new MediaRecorder(stream);
 audioChunks.value = [];

 mediaRecorder.value.ondataavailable = (event) => {
 audioChunks.value.push(event.data);
 };

 mediaRecorder.value.onstop = async () => {
 const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
 await uploadVoiceMessage(audioBlob);
 stream.getTracks().forEach(track => track.stop());
 };

 mediaRecorder.value.start();
 isRecording.value = true;
 recordingDuration.value = 0;
 recordingInterval.value = setInterval(() => {
 recordingDuration.value++;
 }, 1000);
 } catch (e) {
 console.error('Failed to start recording', e);
 }
};

const stopRecording = () => {
 if (mediaRecorder.value && isRecording.value) {
 mediaRecorder.value.stop();
 isRecording.value = false;
 clearInterval(recordingInterval.value);
 }
};

const cancelRecording = () => {
 if (mediaRecorder.value && isRecording.value) {
 mediaRecorder.value.onstop = null;
 mediaRecorder.value.stop();
 isRecording.value = false;
 clearInterval(recordingInterval.value);
 audioChunks.value = [];
 }
};

const uploadVoiceMessage = async (blob: Blob) => {
 uploadingMedia.value = true;
 try {
 const formData = new FormData();
 formData.append('file', blob, 'recording.webm');
 
 const config = useRuntimeConfig();
 const res = await fetch(`${config.public.apiBase}/upload?resourceType=video`, {
 method: 'POST',
 body: formData,
 headers: {
 'Authorization': `Bearer ${localStorage.getItem('token')}`
 }
 });
 
 if (!res.ok) throw new Error('Upload failed');
 const data = await res.json();
 
 await sendMediaMessage('voice', data.url);
 } catch (e) {
 console.error('Voice upload failed', e);
 } finally {
 uploadingMedia.value = false;
 }
};

const openImage = (url: string) => {
 window.open(url, '_blank');
};

const handleSend = () => {
 if (!newMsgText.value.trim()) return;
 sendMessage(newMsgText.value, props.receiverId, props.currentUserId);
 newMsgText.value = '';
 scrollToBottom();
};

const handleTyping = () => {
 sendTyping(props.currentUserId);
};

const scrollToBottom = async () => {
 await nextTick();
 if (messageContainer.value) {
 messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
 }
};

const getSenderId = (msg: any) => {
  if (!msg) return '';
  return String(msg.senderId || msg.sender?._id || msg.sender?.id || msg.sender || '');
};

const isMe = (msg: any) => {
  const senderId = getSenderId(msg);
  const myId = String(props.currentUserId || '');
  return !!senderId && !!myId && senderId === myId;
};

const shouldShowSender = (msg: any, idx: number) => {
 if (idx === 0) return true;
 return getSenderId(messages.value[idx - 1]) !== getSenderId(msg);
};

const shouldShowTail = (msg: any, idx: number) => {
 if (idx === 0) return true;
 return getSenderId(messages.value[idx - 1]) !== getSenderId(msg);
};

const formatTime = (dateStr: string) => {
 if (!dateStr) return '';
 const d = new Date(dateStr);
 return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

watch(() => props.isOpen, (val) => {
 if (val) {
 setupListeners();
 fetchMessages();
 scrollToBottom();
 }
});

watch(messages, () => {
 scrollToBottom();
}, { deep: true });

onMounted(() => {
 if (props.isOpen) {
 setupListeners();
 fetchMessages();
 }
});
</script>

<style scoped>
.animate-fade-in {
 animation: fadeIn 0.2s ease-out;
}
.animate-slide-left {
 animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.animate-message-in {
 animation: messageIn 0.2s ease-out forwards;
}

@keyframes fadeIn {
 from { opacity: 0; }
 to { opacity: 1; }
}
@keyframes slideLeft {
 from { transform: translateX(100%); }
 to { transform: translateX(0); }
}
@keyframes messageIn {
 from { opacity: 0; transform: translateY(8px) scale(0.95); }
 to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Custom scrollbar for better look */
::-webkit-scrollbar {
 width: 6px;
}
::-webkit-scrollbar-thumb {
 background: rgba(0,0,0,0.1);
 border-radius: 10px;
}
</style>
