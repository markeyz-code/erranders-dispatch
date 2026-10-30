import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import { useUser } from '@/composables/modules/auth/user'

const LISTENERS_KEY = 'realtime_notification_listeners_v2'

const playSound = (path: string) => {
  try {
    const audio = new Audio(path)
    audio.volume = 1.0;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Audio file playback failed, falling back to synthetic beep:', error);
        playSyntheticBeep();
      });
    }
  } catch (error) {
    playSyntheticBeep();
  }
}

const playNotificationSound = () => playSound('/sounds/notification.wav')
const playOrderAcceptedSound = () => playSound('/sounds/order_accepted.m4a')
const playOrderStatusUpdateSound = () => playSound('/sounds/order_status_update.m4a')
const playCounterOfferSound = () => playSound('/sounds/counter_offer.m4a')

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const unlockAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
      }
    } catch (_) {}
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };
  document.addEventListener('click', unlockAudio, { once: true });
  document.addEventListener('touchstart', unlockAudio, { once: true });
}

const playNewOrderSound = () => {
  try {
    const audio = new Audio('/sounds/order_sound.m4a')
    audio.volume = 1.0;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Audio file playback failed, falling back to synthetic beep:', error);
        playSyntheticBeep();
      });
    }
  } catch (error) {
    playSyntheticBeep();
  }
}

const playSyntheticBeep = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 (loud, piercing)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch(e) {
    console.error('Synthetic beep failed', e);
  }
}

/**
 * Connects to the /realtime WebSocket namespace and listens for all
 * notification events. Must be called once in the layout/app root.
 * 
 * Returns refs to the in-app toast queue for the InAppToast component.
 */
const toastQueue = ref<any[]>([])

export const useRealtimeNotifications = () => {
  const { socket, connectSocket } = useRealtimeSocket()
  const { user } = useUser()
  const { addNotification } = useNotifications()
  const listenersAttached = useState<boolean>(LISTENERS_KEY, () => false)
  
  // Queue for in-app toast display (consumed by InAppToast component)

  const pushToast = (notification: any) => {
    if (!notification) return

    // Never play sound or add persistent records for internal toast clearing commands
    if (notification.type === 'CLEAR_ORDER_TOASTS') {
      toastQueue.value.push(notification)
      return
    }

    // Only play sound if notification has actual visible content
    if (notification.title || notification.body) {
      if (notification.type === 'NEW_ORDER_AVAILABLE') {
        playNewOrderSound()
      } else if (notification.type === 'ORDER_BIDS_UPDATE' || notification.type === 'BID_COUNTERED') {
        playCounterOfferSound()
      } else if (notification.type === 'ORDER_ACCEPTED' || notification.type === 'ORDER_BID_ACCEPTED') {
        playOrderAcceptedSound()
      } else if (notification.type === 'ORDER_STATUS_UPDATE') {
        playOrderStatusUpdateSound()
      } else {
        playNotificationSound()
      }
    }

    toastQueue.value.push(notification)
    if (notification.title || notification.body) {
      addNotification(notification)
    }
  }

  const handleNewOrder = (payload: any) => {
    if (!payload || payload.type === 'ORDER_ACCEPTED') return
    pushToast({
      id: payload.id || `order_${Date.now()}`,
      title: payload.title || '🚀 New Order Available!',
      body: payload.body || `Order from ${payload.vendorName || 'a store'}`,
      type: 'NEW_ORDER_AVAILABLE',
      data: payload.data || payload,
      createdAt: payload.createdAt || new Date().toISOString(),
    })
  }

  const handleNotification = (payload: any) => {
    if (!payload) return

    // Ensure notification is intended for this errander if target is present
    const currentUserId = user.value?._id || user.value?.id
    const targetUserId = payload.userId || payload.customerId || payload.erranderId || payload.data?.erranderId || payload.data?.userId
    if (targetUserId && currentUserId && targetUserId.toString() !== currentUserId.toString()) {
      return
    }

    if (!payload.title && !payload.body && !payload.message) return

    // Aggressively push errander to details page if their bid was accepted
    if (payload.type === 'ORDER_BID_ACCEPTED' && payload.data?.orderId) {
      setTimeout(() => {
        navigateTo(`/deliveries/${payload.data.orderId}`)
      }, 500)
    }

    pushToast({
      id: payload.id || `notif_${Date.now()}`,
      title: payload.title || 'Notification',
      body: payload.body || payload.message || 'You have a new update',
      type: payload.type || 'GENERAL',
      data: payload.data,
      createdAt: payload.createdAt || new Date().toISOString(),
    })
  }

  const handleOrderAccepted = (payload: any) => {
    if (!payload) return
    // Dispatch a command to InAppToast to clear the "New Order" toast
    // for this order, without showing a redundant notification.
    pushToast({
      id: `clear_${Date.now()}`,
      title: '',
      body: '',
      type: 'CLEAR_ORDER_TOASTS',
      data: payload,
    })
  }

  const handleOrderStatusUpdate = (payload: any) => {
    if (!payload) return
    pushToast({
      id: `status_${Date.now()}`,
      title: payload.title || '📦 Order Update',
      body: payload.body || `Order status changed to ${payload.status?.replace(/_/g, ' ')}`,
      type: 'ORDER_STATUS_UPDATE',
      data: payload,
      createdAt: payload.createdAt || new Date().toISOString(),
    })
  }

  const setupListeners = () => {
    if (!socket.value || listenersAttached.value) return
    listenersAttached.value = true

    // Register the user with the socket server
    if (user.value?._id) {
      socket.value.emit('register', { userId: user.value._id })
    }

    // Listen for all notification events
    socket.value.on('notification:new-order', handleNewOrder)
    socket.value.on('notification:new', handleNotification)
    socket.value.on('notification:order-accepted', handleOrderAccepted)
    socket.value.on('notification:order-status-update', handleOrderStatusUpdate)
  }

  const teardownListeners = () => {
    if (!socket.value || !listenersAttached.value) return
    socket.value.off('notification:new-order', handleNewOrder)
    socket.value.off('notification:new', handleNotification)
    socket.value.off('notification:order-accepted', handleOrderAccepted)
    socket.value.off('notification:order-status-update', handleOrderStatusUpdate)
    listenersAttached.value = false
  }

  onMounted(() => {
    connectSocket()
    // Wait a tick for the socket to connect before setting up listeners
    setTimeout(() => setupListeners(), 500)

    // Also watch for socket reconnection
    if (socket.value) {
      socket.value.on('connect', () => {
        if (user.value?._id) {
          socket.value?.emit('register', { userId: user.value._id })
        }
      })
    }
  })

  onBeforeUnmount(() => {
    teardownListeners()
  })

  return {
    toastQueue,
    setupListeners,
    teardownListeners,
  }
}
