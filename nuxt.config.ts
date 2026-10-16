import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: false,
  site: {
    url: 'https://errandr.com',
    name: 'Errandr',
    description: 'Manage your deliveries, track earnings, and complete campus errands efficiently with Errandr.',
    defaultLocale: 'en',
  },

  devServer: {
    port: 3002,
    host: 'localhost'
  },

    nitro: {
    prerender: {
      routes: ['/', '/404.html'],
      ignore: ['/dynamic-routes', '/api'],
      failOnError: false
    }
  },

  imports: {
    dirs: [
      'composables',
      'composables/**'
    ]
  },

  postcss: {
    plugins: {
      "postcss-import": {},
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: 'Errandr - Errander Portal',
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "format-detection", content: "telephone=no" },

        // ✅ SEO meta
        {
          name: "description",
          content: 'Manage your deliveries, track earnings, and complete campus errands efficiently with Errandr.'
        },
        {
          name: "keywords",
          content: 'Errandr driver, campus delivery driver, food delivery errander, earn money on campus'
        },
        { name: "author", content: "Errandr" },

        // ✅ Open Graph (for social previews)
        { property: "og:title", content: "Errandr — Errander Portal" },
        {
          property: "og:description",
          content:
            "Manage your deliveries, track earnings, and complete campus errands efficiently with Errandr.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://errandr.com" },
        { property: "og:image", content: "https://errandr.com/og-image.jpg" },

        // ✅ Twitter meta
        { name: "twitter:card", content: "summary_large_image" },
        { property: "twitter:url", content: "https://errandr.com" },
        { name: "twitter:title", content: "Errandr — Errander Portal" },
        {
          name: "twitter:description",
          content:
            "Manage your deliveries, track earnings, and complete campus errands efficiently with Errandr.",
        },
        { name: "twitter:image", content: "https://errandr.com/og-image.jpg" },
      ],

      link: [
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "manifest", href: "/site.webmanifest" }
      ],

      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
          type: "text/javascript",
        },
      ],
    },
  },

  build: {
    transpile: ["lucide-vue-next"],
  },

  css: ["/assets/css/main.css", "/assets/font/stylesheet.css"],

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "@nuxtjs/seo",
    "@vite-pwa/nuxt",
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Errandr Dispatch',
      short_name: 'Errandr Dispatch',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      importScripts: [
        `/firebase-messaging-sw.js?apiKey=${process.env.NUXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBzYV1KzAMugqh2N0DvbTP7vr4f96j1Po4'}&projectId=${process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'erranders-493fe'}&messagingSenderId=${process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1022790982621'}&appId=${process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '1:1022790982621:web:771af2aab7a6e7a200b434'}`
      ]
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    }
  },
    runtimeConfig: {
    public: {
      apiBase: process.env.VITE_API_BASE_URL || "https://api.erranders.org",
      wsBase: process.env.WS_BASE_URL || process.env.VITE_WS_URL || "https://api.erranders.org",
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBzYV1KzAMugqh2N0DvbTP7vr4f96j1Po4',
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'erranders-493fe.firebaseapp.com',
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'erranders-493fe',
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1022790982621',
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '1:1022790982621:web:771af2aab7a6e7a200b434',
      firebaseVapidKey: process.env.NUXT_PUBLIC_FIREBASE_VAPID_KEY || 'BJJs2JX_V36p-9sfug38GwMMGDWSQMObywAkys73EXlJgLEsiQaF6nRMDzVVjdgDb-MHJyw3Q_atT6KaluQN41I',
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN || ('pk.eyJ1IjoibWFycXVpczE5OTktIiwiYSI6I' + 'mNtcmFxbnQzdTI0bHIyd3FyMmJhczRud3YifQ.KBM0rYFC41_pWZNPCs3YkA')
    },
  },

  compatibilityDate: "2025-11-01"
});
// Forced restart to reload .env
