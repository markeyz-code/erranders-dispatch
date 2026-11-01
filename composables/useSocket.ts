import { io, Socket } from 'socket.io-client';
import { useUser } from '@/composables/modules/auth/user';
import { ref, computed } from 'vue';

// Global singleton sockets per namespace — NEVER recreated
const sockets: Record<string, Socket> = {};

export const useSocket = (namespace: string) => {
  const config = useRuntimeConfig();
  const { user } = useUser();

  const connect = () => {
    if (sockets[namespace]?.connected) return sockets[namespace];

    // If socket exists but disconnected, reconnect
    if (sockets[namespace]) {
      sockets[namespace].connect();
      return sockets[namespace];
    }

    const connectionId = user.value?._id;

    let authToken = '';
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(^| )errandr_dispatch_token=([^;]+)/) || document.cookie.match(/(^| )errandr_token=([^;]+)/);
      if (match) {
        authToken = match[2];
      } else if (typeof localStorage !== 'undefined') {
        authToken = localStorage.getItem('errandr_dispatch_token') || localStorage.getItem('token') || '';
      }
    }

    const s = io(`${config.public.wsBase}/${namespace}`, {
      query: {
        userId: connectionId,
      },
      auth: { token: authToken },
      transports: ['polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    s.on('connect', () => {
      console.log(`[useSocket] Connected to ${namespace} namespace, socketId=${s.id}`);
    });

    s.on('disconnect', (reason) => {
      console.log(`[useSocket] Disconnected from ${namespace}: ${reason}`);
    });

    sockets[namespace] = s;
    return s;
  };

  const disconnect = () => {
    // Intentionally NO-OP. We never kill the global socket.
  };

  const getSocket = (): Socket | null => {
    return sockets[namespace] || null;
  };

  const emit = (event: string, data: any) => {
    if (!sockets[namespace]) connect();
    sockets[namespace]?.emit(event, data);
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    if (!sockets[namespace]) connect();
    sockets[namespace]?.on(event, callback);
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (callback) {
      sockets[namespace]?.off(event, callback);
    } else {
      sockets[namespace]?.off(event);
    }
  };

  return { connect, disconnect, emit, on, off, getSocket, socket: computed(() => sockets[namespace] || null) };
};
