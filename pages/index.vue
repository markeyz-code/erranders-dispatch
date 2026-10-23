<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth selection:bg-parentPrimary selection:text-white">
    <!-- <ExamPromoBanner /> -->
    <!-- Hero Section: Clean, Centered Simplicity (Matching Erranders for Business) -->
    <section class="relative border-b border-slate-100 min-h-[calc(100dvh-5rem)] flex flex-col justify-center items-center py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-orange-50/30 via-white to-white">
      <!-- Soft dot background grid (seeding pattern) -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 pointer-events-none"></div>
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-[#FF5C1A]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto relative w-full my-auto">

        <!-- Center Column Content -->
        <div class="max-w-3xl mx-auto text-center mt-16 relative z-20 space-y-6 pt-4">
          <!-- Launch Pill -->
          <div>
            <NuxtLink
              :to="isLoggedIn ? '/dashboard' : '/auth/register'"
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/70 text-[#FF5C1A] text-xs font-bold hover:bg-orange-100/70 transition-colors shadow-2xs group"
            >
              <span class="w-2 h-2 rounded-full bg-[#FF5C1A] animate-pulse"></span>
              <span>Active at UNILAG, LASU, YABATECH & FUTA</span>
              <ArrowUpRight class="w-3.5 h-3.5 text-[#FF5C1A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </NuxtLink>
          </div>

          <!-- Main Bold Heading with Rotating Carousel Tagline -->
          <div class="space-y-3">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
              Erranders for Campus Ninjas
            </h1>

            <!-- Rotating Headline Micro-Carousel -->
            <div class="relative h-10 sm:h-12 overflow-hidden flex items-center justify-center">
              <TransitionGroup name="hero-slide" tag="div" class="w-full">
                <p
                  :key="currentHeadingIndex"
                  class="absolute inset-0 flex items-center justify-center text-lg sm:text-2xl font-black tracking-tight text-[#FF5C1A]"
                >
                  <span>{{ heroHeadings[currentHeadingIndex] }}</span>
                </p>
              </TransitionGroup>
            </div>
          </div>

          <!-- Subtitle -->
          <p class="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            Why trek across campus empty-handed? Deliver food packages and urgent items for students along your normal path. Flexible schedule, zero boss, and instant 24/7 bank payouts.
          </p>

          <!-- Cute Pill Action Buttons (DevFest style with arrow badge circles) -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <NuxtLink
              :to="isLoggedIn ? '/dashboard' : '/auth/register'"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-[#FF5C1A] text-white text-sm font-bold shadow-md shadow-[#FF5C1A]/25 hover:bg-[#E54D12] active:scale-[0.98] transition-all group"
            >
              <span>{{ isLoggedIn ? 'Enter Ninja Dashboard' : 'Start Earning as a Ninja' }}</span>
              <span class="w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
                <ArrowUpRight class="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </NuxtLink>

            <a
              href="#features"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-slate-950 text-white text-sm font-bold shadow-md shadow-slate-950/20 hover:bg-slate-800 active:scale-[0.98] transition-all group"
            >
              <span>How Ninja Hustle Works</span>
              <span class="w-6 h-6 rounded-full bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition-colors">
                <ArrowUpRight class="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </a>
          </div>

          <!-- Trust points -->
          <div class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500 pt-2">
            <span class="flex items-center gap-1.5"><CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" /> Walk, skate, or ride</span>
            <span class="flex items-center gap-1.5"><CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" /> 100% Student tips are yours</span>
            <span class="flex items-center gap-1.5"><CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" /> Instant 24/7 bank cashouts</span>
          </div>
        </div>

        <!-- ═══ DESKTOP-ONLY FLOATING ORGANIC HERO IMAGES (Strictly hidden on Mobile) ═══ -->
        <!-- Card 1: Top Right (Ninja Photo with Active Runner Pill) -->
        <div class="hidden lg:block absolute top-4 right-4 xl:right-12 z-10 group cursor-pointer transition-all duration-500 hover:scale-105">
          <div class="relative w-44 h-44 xl:w-52 xl:h-52 drop-shadow-xl">
            <div class="w-full h-full overflow-hidden rounded-[2.5rem] border-4 border-white shadow-xl bg-slate-100">
              <img
                src="/img/hero_ninja_runner.jpg"
                alt="Campus Errand Ninja runner"
                class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
              />
            </div>
            <!-- Micro Caption Pill -->
            <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-md text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>🏃‍♂️ Active Campus Ninja</span>
            </div>
          </div>
        </div>

        <!-- Card 2: Bottom Left (Instant Settlement Badge) -->
        <div class="hidden lg:block absolute bottom-4 left-4 xl:left-12 z-10 group cursor-pointer transition-all duration-500 hover:scale-105">
          <div class="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl space-y-1">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span class="text-xs font-black text-slate-900">₦12k - ₦25k Daily</span>
            </div>
            <p class="text-[11px] text-slate-500 font-medium">Work Between Classes</p>
            <div class="pt-1 flex items-center gap-1.5 text-xs font-black text-emerald-600">
              <CheckCircle2 class="w-3.5 h-3.5" /> Instant Bank Alert
            </div>
          </div>
        </div>


        </div>

        <!-- 4-Column Ninja Trust Strip -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-slate-200/70">
          <div class="bg-white/80 p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-parentPrimary text-lg">💰</div>
            <div>
              <div class="text-sm font-black text-slate-900">₦10k - ₦25k+ Daily</div>
              <div class="text-xs text-slate-500">Real Campus Hustle</div>
            </div>
          </div>
          <div class="bg-white/80 p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-lg">🤝</div>
            <div>
              <div class="text-sm font-black text-slate-900">Custom Errands</div>
              <div class="text-xs text-slate-500">Bargain price on your terms</div>
            </div>
          </div>
          <div class="bg-white/80 p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-lg">🚶</div>
            <div>
              <div class="text-sm font-black text-slate-900">No Bike Needed</div>
              <div class="text-xs text-slate-500">Walk & deliver between halls</div>
            </div>
          </div>
          <div class="bg-white/80 p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 text-lg">⚡</div>
            <div>
              <div class="text-sm font-black text-slate-900">Instant Cashout</div>
              <div class="text-xs text-slate-500">To any Nigerian bank 24/7</div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { 
  ArrowRight, Twitter, Instagram, Facebook,
  LogIn, Store, TrendingUp, Zap, Rocket, Activity, ClipboardList, PieChart, Star,
  PlayCircle, Quote, Utensils, Bike, Sparkles, ShieldCheck, Clock, Footprints, Banknote,
  CheckCircle2, Wallet, Flame
} from 'lucide-vue-next'

const router = useRouter()
const scrolled = ref(false)

/**
 * Rotating hero headline.
 *
 * These two refs were deleted in the hero rewrite while the template kept using them, so
 * every visit crashed on `heroHeadings[currentHeadingIndex]` — undefined indexed by
 * undefined.
 */
const heroHeadings = [
  'Deliver food, groceries and parcels',
  'Pick up from any campus vendor',
  'Earn on your own schedule',
  'Cash out straight to your bank',
]
const currentHeadingIndex = ref(0)
let heroHeadingTimer: ReturnType<typeof setInterval> | null = null

definePageMeta({
  layout: 'landing'
})

const { isLoggedIn } = useUser()

useHead({
  title: 'Errand Ninja by Erranders | Turn Campus Walks into Cash',
  meta: [
    { name: 'description', content: 'Earn ₦10,000 - ₦25,000 daily delivering food and running errands for fellow students. Ultra-flexible, safe, and instant daily bank withdrawals.' }
  ]
})

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

interface NinjaPhrase {
  lang: 'pidgin' | 'yoruba' | 'igbo' | 'hausa'
  langLabel: string
  langFlag: string
  feature: string
  featureIcon: string
  hook: string
  text: string
  subtext: string
}

const ninjaPhrases: NinjaPhrase[] = [
  // PIDGIN
  {
    lang: 'pidgin',
    langLabel: 'Pidgin Vibe',
    langFlag: '🇳🇬',
    feature: 'Normal Errands',
    featureIcon: '🛵',
    hook: 'Why trek go hostel empty-handed?',
    text: 'Carry food or package as you dey waka go hall, cash out clean ₦12k daily sharp sharp!',
    subtext: 'No boss, no Wahala. You dey waka that route anyway — turn your normal steps to steady credit alerts!'
  },
  {
    lang: 'pidgin',
    langLabel: 'Pidgin Vibe',
    langFlag: '🇳🇬',
    feature: 'Custom Errands',
    featureIcon: '🤝',
    hook: 'Student get urgent custom errand?',
    text: 'Bargain price directly with students, run the special run, and keep 100% of your tips!',
    subtext: 'Buy handouts, pick laundry, or queue for power bank — your campus hustle, your terms, your rules.'
  },
  {
    lang: 'pidgin',
    langLabel: 'Pidgin Vibe',
    langFlag: '🇳🇬',
    feature: 'Meal Desk & Schedule',
    featureIcon: '🍱',
    hook: 'Group food drop at 1:00 PM lunch?',
    text: 'Pick 10 hostel lunch packs at once from vendor desk, earn bulk delivery bonus in 15 mins!',
    subtext: 'Batch deliveries mean faster drops, less back-and-forth movement, and sweet bulk earnings.'
  },
  {
    lang: 'pidgin',
    langLabel: 'Pidgin Vibe',
    langFlag: '🇳🇬',
    feature: 'Daily Wallet',
    featureIcon: '💰',
    hook: 'Sun dey fight everybody outside? 😭☀️',
    text: 'Help cozy roommates pick their orders from gate, withdraw your cash straight to your bank!',
    subtext: 'Withdraw anytime with zero delay. Money drop sharp sharp before your next lecture begins.'
  },

  // YORUBA
  {
    lang: 'yoruba',
    langLabel: 'Èdè Yorùbá',
    langFlag: '🟢',
    feature: 'Isẹ́ Oúnjẹ & Ẹrù',
    featureIcon: '🛵',
    hook: 'Kilode tí o fi ń rìn lásán lórí campus?',
    text: 'Gbé oúnjẹ tàbí ẹrù lọ sí hostel kí o gba owó lẹ́sẹ̀kẹsẹ̀ — ma fi àkókò rẹ ṣòfò!',
    subtext: 'Láàárín kíláàsì méjì, rí ₦8,000 sí ₦15,000 lójúmọ́ láì sí wàhálà rárá.'
  },
  {
    lang: 'yoruba',
    langLabel: 'Èdè Yorùbá',
    langFlag: '🟢',
    feature: 'Custom Errands & Bargain',
    featureIcon: '🤝',
    hook: 'Akẹ́kọ̀ọ́ fẹ́ ríránṣẹ́ pàtàkì?',
    text: 'Ṣe àdéhùn owó tààrà pẹ̀lú ọmọ ilé-ìwé, parí isẹ́ kíá, gbogbo èbùn (tips) jẹ́ tìrẹ 100%!',
    subtext: 'Rà ìwé handouts, gba aṣọ ifọ, tàbí gbé ẹrù — gba èrè lórí gbogbo ìrìn tí o bá rìn.'
  },
  {
    lang: 'yoruba',
    langLabel: 'Èdè Yorùbá',
    langFlag: '🟢',
    feature: 'Meal Desk & Payout',
    featureIcon: '🍱',
    hook: 'O fẹ́ owó lójúmọ́ fún ìtọ́jú ara rẹ?',
    text: 'Wọlé gẹ́gẹ́ bí Errand Ninja — gba oúnjẹ púpọ̀ lẹ́ẹ̀kan, owó rẹ sì wọ àpamọ́wọ́ kíá!',
    subtext: 'Fàyè gba ara rẹ láti ṣe owó ní àkókò tí o bá fẹ́, kọ́ ẹ̀kọ́ rẹ pẹ̀lú àlàáfíà.'
  },

  // IGBO
  {
    lang: 'igbo',
    langLabel: 'Asụsụ Igbo',
    langFlag: '🟡',
    feature: 'Ozi Nri & Ngwongwo',
    featureIcon: '🛵',
    hook: 'Gịnị mere ị ga-eji na-agagharị n’efu na campus?',
    text: 'Buru nri na ngwongwo gaa hostel, nweta ego dị mma ozugbo n’akpa gị!',
    subtext: 'Jiri oge ezumike n’etiti nkuzi mee ego — nweta ₦10,000+ kwa ụbọchị n’enweghị nsogbu.'
  },
  {
    lang: 'igbo',
    langLabel: 'Asụsụ Igbo',
    langFlag: '🟡',
    feature: 'Custom Errands & Tips',
    featureIcon: '🤝',
    hook: 'Onye chọrọ ka agbara ya ozi pụrụ iche?',
    text: 'Kpaa nkata ọnụahịa ozugbo n’onwe gị, gbaa ọsọ ọrụ ọma ahụ, ma debe ego ndụmọdụ niile!',
    subtext: 'Buru akwụkwọ ma ọ bụ gaa n’ahịa campus — bụrụ onye isi nke aka gị dịka Ninja.'
  },
  {
    lang: 'igbo',
    langLabel: 'Asụsụ Igbo',
    langFlag: '🟡',
    feature: 'Meal Schedule Batch',
    featureIcon: '🍱',
    hook: 'Chọrọ nkwụghachi ngwa ngwa na akaụntụ gị?',
    text: 'Gbakọta ozi nri Meal Desk ọnụ n’otu oge, gbaa ọsọ n’ime nkeji 15, ego abata ozugbo!',
    subtext: 'Wepụ ego na akaụntụ akụ gị n’enweghị nkwụsị ọ bụla — nwee onwe gị n’ụlọ akwụkwọ.'
  },

  // HAUSA
  {
    lang: 'hausa',
    langLabel: 'Harshen Hausa',
    langFlag: '🔵',
    feature: 'Aikin Kawo Kaya',
    featureIcon: '🛵',
    hook: 'Don me zaka yi tafiya a banza a harabar makaranta?',
    text: 'Dauki abinci ko sako zuwa dakin dalibai, kuma ka sami kudi mai kyau a kowace rana!',
    subtext: 'Yi aiki a lokacin hutun karatu — juya lokacin ka zuwa kudi na gaske a cikin asusunka.'
  },
  {
    lang: 'hausa',
    langLabel: 'Harshen Hausa',
    langFlag: '🔵',
    feature: 'Custom Errands',
    featureIcon: '🤝',
    hook: 'Dalibi yana bukatar aikin gaggawa?',
    text: 'Yi ciniki kai tsaye da dalibai, gudanar da aikin a saukake, kuma dukkan kyaututtuka naka ne!',
    subtext: 'Sayi litattafai ko karbi kaya — babu wahala, kai ne mai sarrafa lokacin ka.'
  },
  {
    lang: 'hausa',
    langLabel: 'Harshen Hausa',
    langFlag: '🔵',
    feature: 'Meal Desk & Payout',
    featureIcon: '🍱',
    hook: 'Kuna son cire kudi nan da nan?',
    text: 'Dauki abincin Meal Desk a dunkule, rarraba wa dalibai a saukake, sannan ka karbi kudin ka nan take!',
    subtext: 'Cire kudin ka zuwa asusun banki a kowane lokaci ba tare da wani jinkiri ba.'
  }
]

const ninjaLanguages = [
  { id: 'all', label: 'All Vibes', flag: '🔥' },
  { id: 'pidgin', label: 'Pidgin', flag: '🇳🇬' },
  { id: 'yoruba', label: 'Yorùbá', flag: '🟢' },
  { id: 'igbo', label: 'Igbo', flag: '🟡' },
  { id: 'hausa', label: 'Hausa', flag: '🔵' },
]

const activeNinjaLang = ref('all')
const currentNinjaPhraseIndex = ref(0)
const typedNinjaText = ref('')
const isNinjaDeleting = ref(false)
let ninjaTypewriterTimeout: any = null

const activeNinjaPhrases = computed(() => {
  if (activeNinjaLang.value === 'all') return ninjaPhrases
  return ninjaPhrases.filter(p => p.lang === activeNinjaLang.value)
})

const currentNinjaPhrase = computed<NinjaPhrase>(() => {
  const list = activeNinjaPhrases.value
  return list[currentNinjaPhraseIndex.value % list.length] || ninjaPhrases[0]
})

const selectNinjaLanguage = (langId: string) => {
  activeNinjaLang.value = langId
  currentNinjaPhraseIndex.value = 0
  typedNinjaText.value = ''
  isNinjaDeleting.value = false
  if (ninjaTypewriterTimeout) clearTimeout(ninjaTypewriterTimeout)
  runNinjaTypewriter()
}

const runNinjaTypewriter = () => {
  const phrase = currentNinjaPhrase.value.text
  const currentLen = typedNinjaText.value.length

  if (!isNinjaDeleting.value) {
    if (currentLen < phrase.length) {
      typedNinjaText.value = phrase.slice(0, currentLen + 1)
      ninjaTypewriterTimeout = setTimeout(runNinjaTypewriter, 28)
    } else {
      ninjaTypewriterTimeout = setTimeout(() => {
        isNinjaDeleting.value = true
        runNinjaTypewriter()
      }, 2600)
    }
  } else {
    if (currentLen > 0) {
      typedNinjaText.value = phrase.slice(0, currentLen - 1)
      ninjaTypewriterTimeout = setTimeout(runNinjaTypewriter, 16)
    } else {
      isNinjaDeleting.value = false
      currentNinjaPhraseIndex.value = (currentNinjaPhraseIndex.value + 1) % activeNinjaPhrases.value.length
      ninjaTypewriterTimeout = setTimeout(runNinjaTypewriter, 350)
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  runNinjaTypewriter()
})

onMounted(() => {
  heroHeadingTimer = setInterval(() => {
    currentHeadingIndex.value = (currentHeadingIndex.value + 1) % heroHeadings.length
  }, 3200)
})

onUnmounted(() => {
  if (heroHeadingTimer) clearInterval(heroHeadingTimer)
  window.removeEventListener('scroll', handleScroll)
  if (ninjaTypewriterTimeout) clearTimeout(ninjaTypewriterTimeout)
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
