import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage } from 'firebase/messaging';
import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey || 'AIzaSyBzYV1KzAMugqh2N0DvbTP7vr4f96j1Po4',
    authDomain: config.public.firebaseAuthDomain || 'erranders-493fe.firebaseapp.com',
    projectId: config.public.firebaseProjectId || 'erranders-493fe',
    messagingSenderId: config.public.firebaseMessagingSenderId || '1022790982621',
    appId: config.public.firebaseAppId || '1:1022790982621:web:771af2aab7a6e7a200b434',
  };

  const app = initializeApp(firebaseConfig);

  // Messaging is only available in the browser
  if (process.client) {
    try {
      const messaging = getMessaging(app);
      
      // We also set up the onMessage listener here globally so we can emit custom events
      onMessage(messaging, (payload) => {
        console.log('[Firebase Plugin] Received foreground message:', payload);
        // You could emit an event here if you had an event bus, but returning messaging is enough
      });

      return {
        provide: {
          messaging
        }
      };
    } catch (e) {
      console.error('Firebase messaging initialization error', e);
    }
  }

  return {
    provide: {
      messaging: null
    }
  };
});
