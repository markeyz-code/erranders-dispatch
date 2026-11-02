import { ref, onUnmounted, toValue, type MaybeRefOrGetter } from 'vue';
import { useSocket } from '@/composables/useSocket';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

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
  status?: string;
}


/** Compared loosely: casing and spacing vary between the optimistic copy and the echo. */
const normaliseText = (value: any): string =>
  String(value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

export const useOrderChat = (
  orderIdArg: MaybeRefOrGetter<string>,
  currentUserIdArg?: MaybeRefOrGetter<string | undefined>,
  targetUserIdArg?: MaybeRefOrGetter<string | undefined>
) => {
  const { connect, emit, on, off, getSocket } = useSocket('chat');
  const messages = ref<Message[]>([]);
  const loading = ref(false);
  const isTyping = ref(false);
  const typingTimeout = ref<any>(null);

  let newMessageHandler: ((message: any) => void) | null = null;
  let userTypingHandler: ((data: any) => void) | null = null;
  let confirmedHandler: ((message: any) => void) | null = null;

  const fetchMessages = async () => {
    loading.value = true;
    const orderId = toValue(orderIdArg);
    const currentUserId = toValue(currentUserIdArg);
    const targetUserId = toValue(targetUserIdArg);
    try {
      let url = `/chat/order/${orderId}`;
      if (currentUserId && targetUserId) {
        const cleanCurrent = extractObjectId(currentUserId);
        const cleanTarget = extractObjectId(targetUserId);
        url += `?userA=${cleanCurrent}&userB=${cleanTarget}`;
      }
      const res = await api.get(url);
      messages.value = res.data || [];
    } catch (e) {
      console.error('Failed to fetch messages', e);
    } finally {
      loading.value = false;
    }
  };

  const extractObjectId = (str: string) => {
    if (!str) return '';
    const parts = String(str).split(',');
    for (const p of parts) {
      const t = p.trim();
      if (/^[0-9a-fA-F]{24}$/.test(t)) return t;
    }
    return String(str).split(',')[0]?.trim() || '';
  };

  const sendMessage = (text: string, receiverId: string, senderId: string, type: 'text' | 'image' | 'voice' = 'text', attachment?: string) => {
    const orderId = toValue(orderIdArg);
    const cleanSenderId = extractObjectId(senderId);
    const cleanReceiverId = extractObjectId(receiverId);
    
    const tempMsg = {
      _id: Date.now().toString(),
      orderId,
      senderId: cleanSenderId,
      receiverId: cleanReceiverId,
      message: text,
      content: text,
      messageType: type,
      attachment,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    messages.value.push(tempMsg as any);

    const payload: any = {
      orderId,
      senderId: cleanSenderId,
      message: text,
      messageType: type,
      attachment
    };

    if (cleanReceiverId === 'admin_support_channel') {
      payload.roomType = 'support';
      // Do not include receiverId so backend doesn't crash parsing it as ObjectId
    } else {
      payload.receiverId = cleanReceiverId;
    }

    emit('sendMessage', payload);
  };

  const sendTyping = (userId: string) => {
    const orderId = toValue(orderIdArg);
    emit('typing', { orderId, userId });
    if (typingTimeout.value) clearTimeout(typingTimeout.value);
    typingTimeout.value = setTimeout(() => {
      emit('stopTyping', { orderId, userId });
    }, 2000);
  };

  const cleanupListeners = () => {
    if (newMessageHandler) {
      off('newMessage', newMessageHandler);
      off('chat:new-message', newMessageHandler);
      off('newMessageNotification', newMessageHandler);
      newMessageHandler = null;
    }
    if (userTypingHandler) {
      off('userTyping', userTypingHandler);
      off('chat:user-typing', userTypingHandler);
      userTypingHandler = null;
    }
    if (confirmedHandler) {
      off('messageConfirmed', confirmedHandler);
      confirmedHandler = null;
    }
  };

  const setupListeners = () => {
    connect();

    const sock = getSocket();
    const orderId = toValue(orderIdArg);
    const currentUserId = toValue(currentUserIdArg);
    const targetUserId = toValue(targetUserIdArg);

    // Compute a deterministic pairKey for this conversation
    let pairKey: string | undefined;
    if (currentUserId && targetUserId) {
      const cleanCurrent = extractObjectId(currentUserId);
      const cleanTarget = extractObjectId(targetUserId);
      const ids = [cleanCurrent, cleanTarget].sort();
      pairKey = `${ids[0]}_${ids[1]}`;
    }

    console.log(`[useOrderChat] Setting up listeners for order:${orderId}, currentUser:${currentUserId}, pairKey:${pairKey}`);
    emit('joinOrder', { orderId, pairKey });

    if (sock) {
      const reconnectHandler = () => {
        console.log(`[useOrderChat] Reconnected, rejoining order:${orderId}`);
        emit('joinOrder', { orderId: toValue(orderIdArg), pairKey });
      };
      sock.on('connect', reconnectHandler);
    }

    if (currentUserId) {
      emit('markRead', { orderId, userId: currentUserId });
    }

    cleanupListeners();

    newMessageHandler = (message: any) => {
      const orderId = toValue(orderIdArg);
      const currentUserId = toValue(currentUserIdArg);
      const msgOrderId = String(message.orderId || message.order?._id || message.order || '');
      
      const cleanReceiverId = extractObjectId(toValue(targetUserIdArg));
      
      if (msgOrderId === String(orderId) || (cleanReceiverId === 'admin_support_channel' && message.roomType === 'support')) {
        if (currentUserId) {
          const sId = String(message.senderId || message.sender?._id || message.sender || '');
          const cIds = String(currentUserId).split(',').map(id => id.trim());

          if (cIds.includes(sId)) {
            // Our own message coming back. Match the optimistic bubble loosely.
            //
            // The old check compared the text exactly, so a server that trimmed or
            // normalised it never matched — the pending bubble stayed and the real message
            // was appended beside it, which is the duplicate people were seeing.
            const incomingText = normaliseText(message.message);
            const pendingIdx = messages.value.findIndex(
              (m: any) =>
                m.status === 'pending' &&
                normaliseText(m.message) === incomingText &&
                (m.messageType || 'text') === (message.messageType || 'text'),
            );
            if (pendingIdx !== -1) {
              messages.value[pendingIdx] = { ...message, status: 'sent' };
              return;
            }
          }
        }

        if (!message._id || !messages.value.some(m => m._id === message._id)) {
          messages.value.push(message);
        }

        if (currentUserId) {
          emit('markRead', { orderId, userId: currentUserId });
        }
      }
    };

    userTypingHandler = (data: { userId: string, isTyping: boolean }) => {
      isTyping.value = data.isTyping;
    };

    confirmedHandler = (message: any) => {
      const msgOrderId = String(message.orderId || message.order?._id || message.order || '');
      if (msgOrderId === String(toValue(orderIdArg))) {
        // Upgrade the optimistic message with the DB _id
        const idx = messages.value.findIndex(m => m._id === message.tempId || (m.status === 'pending' && m.message === message.message));
        if (idx !== -1) {
          messages.value[idx] = message;
        } else if (!messages.value.some(m => m._id === message._id)) {
          messages.value.push(message);
        }
      }
    };

    // Listen on ALL event names the backend emits
    on('newMessage', newMessageHandler);
    on('chat:new-message', newMessageHandler);
    on('newMessageNotification', newMessageHandler);
    on('userTyping', userTypingHandler);
    on('chat:user-typing', userTypingHandler);
    on('messageConfirmed', confirmedHandler);
  };

  onUnmounted(() => {
    cleanupListeners();
    emit('leaveOrder', { orderId: toValue(orderIdArg) });
  });

  return {
    messages,
    loading,
    isTyping,
    fetchMessages,
    sendMessage,
    sendTyping,
    setupListeners
  };
};
