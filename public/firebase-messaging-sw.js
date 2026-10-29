importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

// Try query string params first (from PWA workbox import), fall back to hardcoded values
const urlParams = new URL(location).searchParams;
const firebaseConfig = {
  apiKey: urlParams.get('apiKey') || 'AIzaSyBzYV1KzAMugqh2N0DvbTP7vr4f96j1Po4',
  projectId: urlParams.get('projectId') || 'erranders-493fe',
  messagingSenderId: urlParams.get('messagingSenderId') || '1022790982621',
  appId: urlParams.get('appId') || '1:1022790982621:web:771af2aab7a6e7a200b434',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  try {
    const data = payload?.data || {};
    const title = payload?.notification?.title || data.title || 'New errand available';
    const body = payload?.notification?.body || data.body || 'You have a new update.';
    const orderId = data.orderId || '';
    const isErrand = data.type === 'NEW_ORDER' || data.type === 'INCOMING_CALL';

    const notificationOptions = {
      body: body,
      icon: '/icon.png',
      badge: '/icon.png',
      // Stays on screen until the rider acts on it, rather than vanishing after a second.
      requireInteraction: true,
      // Audible even when the phone is not on silent, so a backgrounded app still reaches
      // the rider. A browser cannot loop a ringtone from a service worker — that needs a
      // native wrapper — so this is the loudest signal the platform allows here.
      silent: false,
      vibrate: isErrand
        ? [600, 250, 600, 250, 600, 250, 600, 250, 600, 250, 600]
        : [200, 100, 200],
      // The ringing screen, not the delivery page: that page has no audio, so tapping
      // the card would have answered the errand silently.
      data: { ...data, orderId, url: orderId ? `/incoming/${orderId}` : '/' },
      // One card per errand, replaced rather than a stack of identical alerts.
      tag: orderId ? `errand-${orderId}` : `alert-${Date.now()}`,
      renotify: true,
      actions: isErrand
        ? [{ action: 'view', title: 'View errand' }, { action: 'dismiss', title: 'Dismiss' }]
        : [],
    };

    self.registration.showNotification(title, notificationOptions);
  } catch (err) {
    console.error('[firebase-messaging-sw.js] Error showing notification:', err);
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'dismiss') return;

  // Open the errand the notification is about, not the home screen — a rider tapping
  // 'new errand' wants the job, not a menu.
  const target = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        if ('navigate' in clientList[i]) {
          return clientList[i].navigate(target).then(function(c) { return c && c.focus(); });
        }
        if (clientList[i].focused) return clientList[i].focus();
      }
      return clients.openWindow(target);
    })
  );
});
