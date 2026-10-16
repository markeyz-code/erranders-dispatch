import { io, type Socket } from 'socket.io-client'
import { useStorage } from '@vueuse/core'
import { useUser } from '@/composables/modules/auth/user'

const SOCKET_KEY = 'realtime_socket'
const SOCKET_CONNECTED_KEY = 'realtime_socket_connected'
const SOCKET_CONNECTING_KEY = 'realtime_socket_connecting'

const createSessionId = () => `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

const socket = ref<Socket | null>(null)
const isConnected = ref(false)
const isConnecting = ref(false)

export const useRealtimeSocket = () => {
  const { token } = useUser()
  const guestSessionId = useStorage('chat_guest_session_id', createSessionId())
  const guestId = useStorage('chat_guest_id', '')


  const connectSocket = () => {
    if (!process.client) return
    if (socket.value && (socket.value.connected || isConnecting.value)) return

    let rawUrl = 'https://api.erranders.org'
    try {
      const config = useRuntimeConfig()
      rawUrl = (config.public.wsBase as string) || (config.public.apiBase as string) || rawUrl
    } catch {
      rawUrl = (import.meta.env?.VITE_WS_URL || import.meta.env?.VITE_API_BASE_URL || rawUrl) as string
    }
    let baseUrl = rawUrl.replace(/\/$/, '') // Remove trailing slash
    
    // Ensure protocol for websockets
    if (!baseUrl.startsWith('http')) {
      baseUrl = `https://${baseUrl}` 
    }

    isConnecting.value = true
    console.log(`[Socket] Connecting to ${baseUrl}/realtime...`)

    const authPayload: any = {
      token: token.value || undefined,
      sessionId: guestSessionId.value,
    }
    
    // Pass userId if available to help backend identify the socket
    const { user } = useUser()
    if (user.value?._id) authPayload.userId = user.value._id

    socket.value = io(`${baseUrl}/realtime`, {
      path: '/socket.io/',
      transports: ['polling'], // Force polling since Vercel/serverless environments drop WebSocket upgrades
      reconnectionAttempts: 5,
      timeout: 10000,
      auth: authPayload,
    })

    socket.value.on('connect', () => {
      console.log('[Socket] Connected successfully')
      isConnected.value = true
      isConnecting.value = false
    })

    socket.value.on('disconnect', (reason) => {
      console.warn(`[Socket] Disconnected: ${reason}`)
      isConnected.value = false
      isConnecting.value = false
    })

    socket.value.on('connect_error', (err) => {
      console.error('[Socket] Connection Error:', err.message)
      isConnected.value = false
      isConnecting.value = false
    })

    socket.value.on('guest:registered', (payload: { guestId?: string }) => {
      if (payload?.guestId) {
        guestId.value = payload.guestId
      }
    })
  }

  const disconnectSocket = () => {
    if (!socket.value) return
    socket.value.disconnect()
    socket.value = null
    isConnected.value = false
    isConnecting.value = false
  }

  const emitWithAck = <T = any>(event: string, payload: any): Promise<T> => {
    return new Promise((resolve) => {
      if (!socket.value) {
        resolve(undefined as T)
        return
      }
      socket.value.emit(event, payload, (response: T) => resolve(response))
    })
  }

  watch(token, (newToken, oldToken) => {
    if (!process.client) return
    if (newToken === oldToken) return
    if (!socket.value) return

    socket.value.disconnect()
    socket.value = null
    isConnected.value = false
    isConnecting.value = false

    if (newToken || guestSessionId.value) {
      connectSocket()
    }
  })

  return {
    socket,
    isConnected,
    isConnecting,
    guestSessionId,
    guestId,
    connectSocket,
    disconnectSocket,
    emitWithAck,
  }
}
