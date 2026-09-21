<template>
  <div class="platform-closed-overlay">
    <!-- Animated background -->
    <div class="bg-layer"></div>
    <div class="grain-overlay"></div>

    <!-- Floating orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <!-- Content -->
    <div class="content-wrapper">
      <!-- Logo -->
      <div class="logo-container">
        <img src="~/assets/img/logo-light.png" alt="Erranders" class="logo" />
      </div>

      <!-- Status badge -->
      <div class="status-badge">
        <span class="pulse-dot"></span>
        <span class="badge-text">Currently Closed</span>
      </div>

      <!-- Main heading -->
      <h1 class="main-heading">We're on a quick break!</h1>

      <!-- Message -->
      <p class="message-text">
        Our vendors and students aren't available right now, so we've paused all deliveries to avoid delay.
      </p>

      <!-- Divider -->
      <div class="divider">
        <div class="divider-line"></div>
        <div class="divider-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="divider-line"></div>
      </div>

      <!-- CTA -->
      <p class="cta-text">
        Check back soon when we're back in full swing.<br />
        Thanks for your patience!
      </p>

      <!-- Footer -->
      <div class="footer-text">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span>Erranders — Making Campus Life Easier</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.platform-closed-overlay {
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: 'Roobert PRO', 'Inter', system-ui, -apple-system, sans-serif;
}

.bg-layer {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 30%, #16213e 60%, #0a0a0a 100%);
  z-index: 0;
}

.grain-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 1;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 92, 26, 0.15), transparent 70%);
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 92, 26, 0.08), transparent 70%);
  bottom: -50px;
  left: -50px;
  animation-delay: -3s;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.1), transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}

.content-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  max-width: 520px;
  animation: fadeUp 0.8s ease-out;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.logo-container {
  margin-bottom: 2rem;
  animation: fadeUp 0.8s ease-out 0.1s both;
}

.logo {
  height: 48px;
  width: auto;
  filter: drop-shadow(0 0 20px rgba(255, 92, 26, 0.3));
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(255, 92, 26, 0.1);
  border: 1px solid rgba(255, 92, 26, 0.2);
  border-radius: 100px;
  margin-bottom: 1.5rem;
  animation: fadeUp 0.8s ease-out 0.2s both;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #FF5C1A;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255, 92, 26, 0.4); }
  50% { opacity: 0.8; box-shadow: 0 0 0 8px rgba(255, 92, 26, 0); }
}

.badge-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #FF5C1A;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.main-heading {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1rem 0;
  line-height: 1.2;
  animation: fadeUp 0.8s ease-out 0.3s both;
}

.message-text {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 1.5rem 0;
  max-width: 420px;
  animation: fadeUp 0.8s ease-out 0.4s both;
}

.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 280px;
  margin-bottom: 1.5rem;
  animation: fadeUp 0.8s ease-out 0.5s both;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

.divider-icon {
  color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
}

.cta-text {
  font-size: 0.875rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 2.5rem 0;
  animation: fadeUp 0.8s ease-out 0.6s both;
}

.footer-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.05em;
  animation: fadeUp 0.8s ease-out 0.7s both;
}

@media (max-width: 480px) {
  .main-heading { font-size: 1.5rem; }
  .message-text { font-size: 0.875rem; }
  .logo { height: 36px; }
  .orb-1 { width: 250px; height: 250px; }
  .orb-2 { width: 180px; height: 180px; }
  .orb-3 { width: 120px; height: 120px; }
}
</style>
