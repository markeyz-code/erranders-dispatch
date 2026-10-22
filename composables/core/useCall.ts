import { io, type Socket } from 'socket.io-client';
import { useUser } from '@/composables/modules/auth/user';

/**
 * In-app voice and video calls.
 *
 * The server only brokers the WebRTC handshake (see the calls gateway); audio and video
 * flow directly between the two people, so a call costs no bandwidth on our API.
 *
 * Shared by the customer, vendor and dispatch apps: the difference between them is who
 * they are on the order, which the backend already checks, not how the call works.
 */

export type CallState = 'idle' | 'ringing' | 'incoming' | 'active' | 'ended';
export type CallKind = 'voice' | 'video';

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

// One call at a time for the whole tab: two simultaneous calls would grab the microphone
// from each other and neither would be intelligible.
const state = ref<CallState>('idle');
const kind = ref<CallKind>('voice');
const callId = ref('');
const orderId = ref('');
const peerUserId = ref('');
const peerName = ref('');
const localStream = ref<MediaStream | null>(null);
const remoteStream = ref<MediaStream | null>(null);
const muted = ref(false);
const cameraOff = ref(false);
const error = ref('');
const startedAt = ref<number | null>(null);
const elapsed = ref(0);

let socket: Socket | null = null;
let peer: RTCPeerConnection | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
let pendingCandidates: RTCIceCandidateInit[] = [];

export const useCall = () => {
  const { token } = useUser();

  const reset = () => {
    if (timer) { clearInterval(timer); timer = null; }
    peer?.close();
    peer = null;
    localStream.value?.getTracks().forEach((track) => track.stop());
    localStream.value = null;
    remoteStream.value = null;
    pendingCandidates = [];
    callId.value = '';
    peerUserId.value = '';
    peerName.value = '';
    muted.value = false;
    cameraOff.value = false;
    startedAt.value = null;
    elapsed.value = 0;
    timer = null;
    state.value = 'idle';
  };

  const wsBase = () => {
    let raw = 'https://api.erranders.org';
    try {
      const config = useRuntimeConfig();
      raw = (config.public.wsBase as string) || raw;
    } catch {
      raw = (import.meta.env?.VITE_WS_URL || raw) as string;
    }
    return raw.endsWith('/') ? raw.slice(0, -1) : raw;
  };

  const connect = () => {
    if (!import.meta.client) return null;
    if (socket?.connected) return socket;

    socket = io(`${wsBase()}/calls`, {
      path: '/socket.io/',
      transports: ['polling', 'websocket'],
      auth: { token: token.value },
    });

    socket.on('call:incoming', (payload: any) => {
      // Already on a call: tell the caller we cannot pick up rather than dropping them
      // into silence.
      if (state.value !== 'idle') {
        socket?.emit('call:decline', { callId: payload.callId });
        return;
      }
      callId.value = payload.callId;
      orderId.value = payload.orderId;
      peerUserId.value = payload.callerId;
      kind.value = payload.type;
      state.value = 'incoming';
    });

    socket.on('call:accepted', async () => {
      state.value = 'active';
      startedAt.value = Date.now();
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        elapsed.value = Math.floor((Date.now() - (startedAt.value || Date.now())) / 1000);
      }, 1000);

      // The caller is the one that creates the offer, once the callee has answered.
      if (peer) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket?.emit('call:signal', {
          callId: callId.value,
          data: { description: peer.localDescription },
        });
      }
    });

    socket.on('call:declined', () => { error.value = 'Call declined.'; reset(); });
    socket.on('call:ended', () => { reset(); });
    socket.on('call:error', (payload: any) => { error.value = payload?.message || 'Call failed.'; reset(); });

    socket.on('call:signal', async (payload: any) => {
      if (!peer) return;
      try {
        if (payload.data?.description) {
          await peer.setRemoteDescription(new RTCSessionDescription(payload.data.description));

          // Candidates that arrived while we had no remote description yet.
          for (const candidate of pendingCandidates) {
            await peer.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
          }
          pendingCandidates = [];

          if (payload.data.description.type === 'offer') {
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            socket?.emit('call:signal', {
              callId: callId.value,
              data: { description: peer.localDescription },
            });
          }
        } else if (payload.data?.candidate) {
          if (peer.remoteDescription) {
            await peer.addIceCandidate(new RTCIceCandidate(payload.data.candidate)).catch(() => {});
          } else {
            pendingCandidates.push(payload.data.candidate);
          }
        }
      } catch (err: any) {
        error.value = 'The connection dropped. Try calling again.';
      }
    });

    return socket;
  };

  const buildPeer = (video: boolean) => {
    peer?.close();
    peer = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('call:signal', { callId: callId.value, data: { candidate: event.candidate } });
      }
    };

    peer.ontrack = (event) => {
      remoteStream.value = event.streams[0] || new MediaStream([event.track]);
    };

    peer.onconnectionstatechange = () => {
      if (peer?.connectionState === 'failed') {
        error.value = 'The call could not connect. Check your network and try again.';
        hangUp();
      }
    };

    localStream.value?.getTracks().forEach((track) => peer!.addTrack(track, localStream.value!));
    void video;
  };

  const getMedia = async (video: boolean) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: video ? { facingMode: 'user' } : false,
    });
    localStream.value = stream;
  };

  const startCall = async (options: { orderId: string; toUserId: string; type: CallKind; name?: string }) => {
    error.value = '';
    connect();
    if (state.value !== 'idle') return;

    try {
      kind.value = options.type;
      orderId.value = options.orderId;
      peerUserId.value = options.toUserId;
      peerName.value = options.name || '';

      await getMedia(options.type === 'video');
      buildPeer(options.type === 'video');

      state.value = 'ringing';
      socket?.emit('call:start', {
        orderId: options.orderId,
        toUserId: options.toUserId,
        type: options.type,
      });
    } catch (err: any) {
      error.value =
        err?.name === 'NotAllowedError'
          ? 'Allow microphone and camera access to make calls.'
          : 'Could not start the call.';
      reset();
    }
  };

  const acceptCall = async () => {
    if (state.value !== 'incoming') return;
    try {
      await getMedia(kind.value === 'video');
      buildPeer(kind.value === 'video');
      state.value = 'active';
      startedAt.value = Date.now();
      timer = setInterval(() => {
        elapsed.value = Math.floor((Date.now() - (startedAt.value || Date.now())) / 1000);
      }, 1000);
      socket?.emit('call:accept', { callId: callId.value });
    } catch (err: any) {
      error.value = 'Allow microphone and camera access to answer calls.';
      declineCall();
    }
  };

  const declineCall = () => {
    if (callId.value) socket?.emit('call:decline', { callId: callId.value });
    reset();
  };

  const hangUp = () => {
    if (callId.value) socket?.emit('call:end', { callId: callId.value });
    reset();
  };

  const toggleMute = () => {
    muted.value = !muted.value;
    localStream.value?.getAudioTracks().forEach((track) => { track.enabled = !muted.value; });
  };

  const toggleCamera = () => {
    cameraOff.value = !cameraOff.value;
    localStream.value?.getVideoTracks().forEach((track) => { track.enabled = !cameraOff.value; });
  };

  return {
    state, kind, callId, orderId, peerUserId, peerName,
    localStream, remoteStream, muted, cameraOff, error, elapsed,
    connect, startCall, acceptCall, declineCall, hangUp, toggleMute, toggleCamera,
  };
};
