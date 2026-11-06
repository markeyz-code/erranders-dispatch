export default defineNuxtPlugin((nuxtApp) => {
  // 1. Listen for Vite chunk preload errors (chunk hash mismatch after new deployments)
  if (typeof window !== 'undefined') {
    window.addEventListener('vite:preloadError', (event) => {
      event.preventDefault();
      console.warn('[CacheBuster] Vite chunk preload error detected. Hard refreshing to load latest app bundle...');
      const reloadKey = 'vite_chunk_reload_ts';
      const lastReload = Number(sessionStorage.getItem(reloadKey) || 0);
      const now = Date.now();
      if (now - lastReload > 8000) {
        sessionStorage.setItem(reloadKey, String(now));
        window.location.reload();
      }
    });
  }

  // 2. Nuxt global error hook for dynamic import / chunk failures
  nuxtApp.hook('app:error', (error: any) => {
    const msg = error?.message || '';
    if (
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Importing a module script failed') ||
      msg.includes('error loading dynamically imported module') ||
      msg.includes('Unable to preload CSS')
    ) {
      console.warn('[CacheBuster] Dynamic import failure detected:', msg);
      const reloadKey = 'chunk_reload_ts';
      const lastReload = Number(sessionStorage.getItem(reloadKey) || 0);
      const now = Date.now();
      if (now - lastReload > 8000) {
        sessionStorage.setItem(reloadKey, String(now));
        window.location.reload();
      }
    }
  });

  // 3. Router error hook for navigation chunk failures
  const router = useRouter();
  if (router) {
    router.onError((error: any) => {
      const msg = error?.message || '';
      if (
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('Importing a module script failed') ||
        msg.includes('error loading dynamically imported module')
      ) {
        console.warn('[CacheBuster] Router module fetch failure:', msg);
        const reloadKey = 'router_reload_ts';
        const lastReload = Number(sessionStorage.getItem(reloadKey) || 0);
        const now = Date.now();
        if (now - lastReload > 8000) {
          sessionStorage.setItem(reloadKey, String(now));
          window.location.reload();
        }
      }
    });
  }

  // 4. Aggressive Service Worker update handling & auto-activation
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      console.log('[CacheBuster] New service worker activated. Refreshing application...');
      window.location.reload();
    });

    const checkForSwUpdates = () => {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.update().catch(() => {});
        }
      }).catch(() => {});
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkForSwUpdates();
      }
    });

    setTimeout(checkForSwUpdates, 3000);
  }

  // 5. Proactively purge obsolete cache buckets
  if (typeof window !== 'undefined' && 'caches' in window) {
    caches.keys().then((keys) => {
      for (const key of keys) {
        if (!key.includes('v3') && !key.includes('workbox-precache')) {
          console.log('[CacheBuster] Purged stale browser cache:', key);
          caches.delete(key).catch(() => {});
        }
      }
    }).catch(() => {});
  }
});

