<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth selection:bg-parentPrimary selection:text-white">
    <!-- <ExamPromoBanner /> -->
    <!-- Hero Section with Background Carousel & Continuous Marquee -->
    <section class="relative pt-24 lg:pt-32 pb-24 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-100">
      <!-- Soft Minimalist Grid Dot Overlay -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-10 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <!-- Left Column: Elegant, Balanced Content -->
          <div class="lg:col-span-7 text-left flex flex-col items-start space-y-6">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-sm font-bold tracking-wide shadow-sm">
              <Sparkles class="w-3.5 h-3.5 text-parentPrimary" />
              Active at UNILAG, LASU & YABATECH
            </div>
            
            <h1 class="text-4xl sm:text-5xl lg:text-[4.5rem] font-medium tracking-tight leading-[1.05] text-slate-900">
              Make Money <span class="text-parentPrimary">on Campus,</span><br />
              Sharp Sharp!
            </h1>
            
            <p class="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
              Turn your free time between classes into real cash. Pick up food and items from vendors, drop them off at hostels or lecture halls, and get your money instantly. Easy peasy!
            </p>
            
            <div class="flex flex-row items-center gap-4 w-full sm:w-auto">
              <NuxtLink :to="isLoggedIn ? '/dashboard' : '/auth/register'" class="px-4 py-3 bg-parentPrimary hover:bg-[#E54D12] text-white rounded-full font-extrabold text-sm shadow-sm border border-gray-50 shadow-parentPrimary/10 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
                {{ isLoggedIn ? 'Enter Dashboard' : 'Start Earning Now' }}
                <Rocket class="w-4 h-4 text-white" />
              </NuxtLink>
            </div>
          </div>

          <!-- Right Column: Minimalist Light Live Rider Simulator -->
          <div class="lg:col-span-5 relative w-full flex justify-center lg:justify-end mt-10 lg:mt-0">
            <!-- The Main Light Glass Console -->
            <div class="w-full max-w-[380px] bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden">
              <!-- Mockup Header -->
              <div class="flex items-center justify-between border-b border-slate-100 pb-5 mb-5">
                <div class="flex items-center gap-3">
                  <!-- Live Profile Avatar -->
                  <div class="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative bg-slate-50">
                    <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=150" class="w-full h-full object-cover" alt="Student Rider" />
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-slate-900">Emeka (Rider)</h3>
                    <p class="text-[11px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live & Ready
                    </p>
                  </div>
                </div>
                <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Bike class="w-4 h-4" />
                </div>
              </div>

              <!-- Total Earnings Widget -->
              <div class="bg-slate-50/60 rounded-3xl p-5 border border-slate-100 space-y-1 mb-5">
                <div class="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <span>Today's Earnings</span>
                  <span class="text-emerald-600 font-medium flex items-center gap-0.5 text-[11px]">
                    <TrendingUp class="w-3 h-3" /> 14 Trips
                  </span>
                </div>
                <h4 class="text-3xl font-medium text-slate-950 tracking-tight">₦9,800</h4>
                <p class="text-[10px] text-slate-400 font-medium">Available for instant withdrawal</p>
              </div>

              <!-- Live Order Queue (Clean Light rows) -->
              <div class="space-y-3">
                <div class="p-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-sm">📍</div>
                    <div>
                      <p class="text-sm font-extrabold text-slate-900">New Request</p>
                      <p class="text-[11px] text-slate-500">Pizza Hub → Jaja Hall</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 bg-parentPrimary/10 text-parentPrimary border border-parentPrimary/10 rounded-md text-[9px] font-extrabold uppercase">ACCEPT</span>
                </div>

                <div class="p-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-green-50 text-emerald-500 flex items-center justify-center font-bold text-sm">🛵</div>
                    <div>
                      <p class="text-sm font-extrabold text-slate-900">In Transit</p>
                      <p class="text-[11px] text-slate-500">Smoothie Daddy → Moremi</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[9px] font-extrabold uppercase">0.5km</span>
                </div>
              </div>

              <!-- Decorative Floating Widgets -->
              <div class="absolute -top-4 -right-4 bg-white border border-slate-100 rounded-2xl p-2.5 shadow-sm border border-gray-50 flex items-center gap-2 animate-bounce [animation-duration:4s]">
                <div class="w-7 h-7 rounded-lg bg-yellow-50 text-yellow-500 flex items-center justify-center font-medium text-sm">⭐</div>
                <div>
                  <p class="text-[11px] font-medium text-slate-900">Top Rated</p>
                  <p class="text-[9px] font-bold text-slate-400">4.9 Star Average</p>
                </div>
              </div>

              <div class="absolute -bottom-4 -left-4 bg-white border border-slate-100 rounded-2xl p-2.5 shadow-sm border border-gray-50 flex items-center gap-2.5 animate-bounce [animation-duration:5s]">
                <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center font-medium text-sm">⚡</div>
                <div>
                  <p class="text-[11px] font-medium text-slate-900">Instant Cash</p>
                  <p class="text-[9px] font-bold text-slate-400">Payout settled instantly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Marquee Row 1 -->
      <div class="mt-24 relative bg-slate-900 overflow-hidden py-3 transform -rotate-1 shadow-sm border border-gray-50 border-y border-slate-800 z-10">
        <div class="flex animate-marquee-fast w-max items-center">
          <div class="flex items-center gap-12 px-4" v-for="i in 6" :key="i">
            <span class="text-2xl font-medium text-white tracking-tight">Flexible Hours</span>
            <Star class="w-6 h-6 text-yellow-300 fill-current" />
            <span class="text-2xl font-medium text-white tracking-tight outline-text">Work Between Classes</span>
            <Zap class="w-6 h-6 text-yellow-300 fill-current" />
            <span class="text-2xl font-medium text-white tracking-tight">Zero Commission</span>
            <TrendingUp class="w-6 h-6 text-yellow-300 stroke-[3]" />
          </div>
        </div>
      </div>

      <!-- Marquee Row 2 -->
      <div class="relative bg-white overflow-hidden py-2 transform rotate-1 shadow-sm -mt-3 border-y border-slate-100 z-10">
        <div class="flex animate-marquee-reverse w-max items-center">
          <div class="flex items-center gap-12 px-4" v-for="i in 6" :key="`rev-${i}`">
            <span class="text-base font-bold text-slate-700">Instant Withdrawals</span>
            <Banknote class="w-5 h-5 text-emerald-500" />
            <span class="text-base font-bold text-slate-700">Safe Campus Deliveries</span>
            <ShieldCheck class="w-5 h-5 text-parentPrimary" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-32 bg-gray-50/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-10">
        <div class="text-center mb-20 max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100/50 text-emerald-600 text-sm font-medium  mb-6">
            <Zap class="w-4 h-4" /> The Rider Toolkit
          </div>
          <h2 class="text-4xl lg:text-5xl font-medium text-gray-900 tracking-tighter leading-tight mb-6">
            Everything you need to <br/><span class="text-parentPrimary">earn on the go.</span>
          </h2>
          <p class="text-gray-500 font-bold text-lg leading-relaxed">
            We built Errander to fit perfectly into your student life. Work when you want, how you want, wherever you are.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(feature, idx) in toolkitFeatures" :key="idx" 
               class="group bg-white p-5 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-parentPrimary/30 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden flex flex-col items-start">
            <div class="absolute -right-6 -top-6 w-32 h-32 bg-slate-50 rounded-full blur-2xl group-hover:bg-parentPrimary/5 transition-all duration-500"></div>
            <div class="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-700 mb-6 group-hover:scale-110 group-hover:bg-parentPrimary group-hover:text-white group-hover:border-parentPrimary transition-all duration-300 relative z-10">
              <component :is="feature.icon" class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-extrabold text-slate-900 tracking-tight mb-2 relative z-10">{{ feature.title }}</h3>
            <p class="text-slate-500 font-medium leading-relaxed text-sm relative z-10">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Carousel: Success Stories / Testimonials -->
    <section id="success" class="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden border-y border-slate-100 relative">
      <!-- Soft Minimalist Grid Dot Overlay -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-10 relative z-10 mb-12 text-center">
        <h2 class="text-3xl lg:text-4xl font-medium text-slate-900 tracking-tighter">Loved by student riders.</h2>
        <p class="text-slate-500 font-medium mt-3 text-sm">Hear from students who are funding their campus life with Errander.</p>
      </div>
      
      <!-- Continuously Scrolling Testimonials -->
      <div class="relative w-full overflow-hidden pb-6 flex">
        <!-- Mask for fading edges -->
        <div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-20"></div>
        <div class="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-20"></div>

        <div class="flex animate-marquee-slow w-max hover:[animation-play-state:paused] transition-all cursor-grab active:cursor-grabbing">
          <!-- Repeat the cards twice for seamless looping -->
          <div class="flex gap-6 px-4" v-for="loop in 2" :key="`loop-${loop}`">
            <div v-for="(story, idx) in successStories" :key="`${loop}-${idx}`" 
                 class="w-[340px] flex-shrink-0 bg-white/80 backdrop-blur-xl p-4 rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-parentPrimary/30 transition-all duration-500 flex flex-col justify-between">
              <div>
                <Quote class="w-7 h-7 text-parentPrimary/20 mb-4" />
                <p class="text-sm sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">"{{ story.quote }}"</p>
              </div>
              <div class="flex items-center gap-3 mt-auto">
                <img :src="story.image" class="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm" alt="Student Rider" />
                <div>
                  <h4 class="text-sm font-extrabold text-slate-900">{{ story.name }}</h4>
                  <p class="text-[11px] font-bold text-parentPrimary mt-0.5 flex items-center gap-1">
                    <Footprints class="w-3.5 h-3.5" /> {{ story.level }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Banner -->
    <section class="py-24 bg-gradient-to-b from-white to-slate-50/50 overflow-hidden relative border-b border-slate-100">
      <!-- Soft Minimalist Grid Dot Overlay -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none"></div>

      <div class="absolute inset-0 z-0 flex whitespace-nowrap opacity-[0.03] font-medium text-[12rem] leading-none text-slate-950 overflow-hidden items-center pointer-events-none gap-8 select-none tracking-tight">
        Start Earning • Start Earning • Start Earning
      </div>
      <div class="max-w-4xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
        <h2 class="text-4xl md:text-6xl font-medium text-slate-950 tracking-tighter mb-8 leading-tight">
          Ready to turn your <br/> commute into cash?
        </h2>
        <p class="text-slate-500 font-medium text-lg mb-10 max-w-xl">
          Join thousands of successful student riders on Errander today.
        </p>
        <NuxtLink to="/auth/register" class="inline-flex items-center justify-center gap-2 px-4 py-3 bg-parentPrimary hover:bg-[#E54D12] text-white rounded-full font-bold shadow-sm border border-gray-50 shadow-parentPrimary/10 transition-all text-sm group cursor-pointer active:scale-95">
          Join the Fleet <ArrowRight class="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform"/>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { 
  ArrowRight, Twitter, Instagram, Facebook,
  LogIn, Store, TrendingUp, Zap, Rocket, Activity, ClipboardList, PieChart, Star,
  PlayCircle, Quote, Utensils, Bike, Sparkles, ShieldCheck, Clock, Footprints, Banknote
} from 'lucide-vue-next'

const router = useRouter()
const scrolled = ref(false)

definePageMeta({
  layout: 'landing'
})

const { isLoggedIn } = useUser()

useHead({
  title: 'Errander for Riders | Earn Money on Campus',
  meta: [
    { name: 'description', content: 'Deliver food to fellow students and earn money on your own schedule. Join Errandr as a campus rider today.' }
  ]
})

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Data for Features Grid
const toolkitFeatures = [
  {
    title: 'Ultra-Flexible Hours',
    description: 'No shifts, no bosses. Turn on the app between classes to accept deliveries and turn it off when you need to study.',
    icon: Clock
  },
  {
    title: 'Instant Withdrawals',
    description: 'Get paid for every delivery instantly. Withdraw your earnings straight to your bank account with zero waiting period.',
    icon: Banknote
  },
  {
    title: 'Zero Vehicle Required',
    description: 'Most deliveries are within campus boundaries. Walk, skate, or cycle—deliver food using the method that suits your rhythm.',
    icon: Footprints
  },
  {
    title: 'Protected & Safe',
    description: 'Only authorized students are part of our ecosystem, making deliveries safe and trustworthy across the campus.',
    icon: ShieldCheck
  }
]

// Data for Testimonials
const successStories = [
  { id: 1, quote: 'I make an extra 15k every week just by delivering food on my way back to the hostel from evening classes.', name: 'Daniel', level: '400L Engineering', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop' },
  { id: 2, quote: 'The instant withdrawal is the real deal. I can easily sort out my data subscriptions and handouts without calling home.', name: 'Tobi', level: '200L Mass Comm', image: 'https://images.unsplash.com/photo-1506803682983-c38eb8c236e4?w=150&h=150&fit=crop' },
  { id: 3, quote: 'It fits perfectly with my schedule. I just toggle my status to online whenever I am free and want to make quick cash.', name: 'Chidera', level: '300L Accounting', image: 'https://images.unsplash.com/photo-1544168190-79c15427015f?w=150&h=150&fit=crop' },
  { id: 4, quote: 'Very safe because I am only delivering to my fellow students inside the campus. Plus, I don\'t even need a bike to start.', name: 'Fatima', level: '100L BioChem', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop' },
]
</script>

<style scoped>
.outline-text {
  -webkit-text-stroke: 1px white;
  color: transparent;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
