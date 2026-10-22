<template>
    <main>
      <FullScreenLoader />
      <NuxtPage />
      <!-- Mounted at the layout so a call reaches the user wherever they are. -->
      <CallOverlay />
      <CoreWhatsAppWidget />
    </main>
</template>
