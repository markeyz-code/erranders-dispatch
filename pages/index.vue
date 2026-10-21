<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth selection:bg-parentPrimary selection:text-white">
    <!-- <ExamPromoBanner /> -->
    <!-- Hero Section with Background Carousel & Continuous Marquee -->
    <section class="relative pt-24 lg:pt-32 pb-20 overflow-hidden bg-gradient-to-b from-orange-50/40 via-white to-slate-50/50 border-b border-slate-100">
      <!-- Soft Ambient Backdrop Glow -->
      <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-orange-300/20 via-amber-200/20 to-orange-400/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <!-- Soft Minimalist Grid Dot Overlay -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-60 z-0 pointer-events-none"></div>

      <!-- ═══ DESKTOP-ONLY FLOATING ORGANIC HERO IMAGE (Strictly hidden on Mobile) ═══ -->
      <div class="hidden lg:block absolute top-12 right-6 xl:right-16 z-20 group cursor-pointer transition-all duration-500 hover:scale-105">
        <div class="relative w-40 h-40 xl:w-48 xl:h-48 drop-shadow-2xl">
          <div class="w-full h-full overflow-hidden rounded-[2.2rem] border-4 border-white shadow-xl bg-slate-100">
            <img
              src="/img/hero_ninja_runner.jpg"
              alt="Campus Errand Ninja runner"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
            />
          </div>
          <!-- Cute Top Badge -->
          <div class="absolute -top-3 -right-2 px-2.5 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black shadow-md flex items-center gap-1">
            <span>🏃‍♂️</span> Active Runner
          </div>
          <!-- Micro Caption Pill -->
          <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-md text-xs font-black text-slate-800 flex items-center gap-1.5 transition-transform group-hover:scale-105">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>🛵 Cash Out On Campus</span>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <!-- Campus & Language Selector Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-slate-700 text-xs font-bold shadow-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Sparkles class="w-3.5 h-3.5 text-parentPrimary" />
            <span>Active Campus Ninjas at UNILAG, LASU, YABATECH & FUTA</span>
          </div>

          <!-- Language Selector Tabs -->
          <div class="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-full border border-slate-200 shadow-inner">
            <button
              v-for="lang in ninjaLanguages"
              :key="lang.id"
              @click="selectNinjaLanguage(lang.id)"
              class="px-3 py-1 rounded-full text-xs font-black transition-all flex items-center gap-1"
              :class="activeNinjaLang === lang.id ? 'bg-white text-slate-900 shadow-xs scale-102' : 'text-slate-600 hover:text-slate-900'"
            >
              <span>{{ lang.flag }}</span>
              <span>{{ lang.label }}</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          <!-- Left Column: Energetic Multilingual Pitch -->
          <div class="lg:col-span-7 text-left flex flex-col items-start space-y-6">
            <!-- Active Dynamic Language & Feature Badge -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-black bg-parentPrimary/10 text-parentPrimary border border-parentPrimary/20 flex items-center gap-1.5">
                <span>{{ currentNinjaPhrase.langFlag }}</span>
                <span>{{ currentNinjaPhrase.langLabel }}</span>
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white flex items-center gap-1.5 shadow-xs">
                <span>{{ currentNinjaPhrase.featureIcon }}</span>
                <span>{{ currentNinjaPhrase.feature }}</span>
              </span>
            </div>

            <!-- Student Relatable Question Hook -->
            <div class="inline-flex items-center gap-2 text-slate-700 font-extrabold text-sm sm:text-base bg-amber-50/80 px-4 py-2 rounded-2xl border border-amber-200/60">
              <Flame class="w-4 h-4 text-parentPrimary" />
              <span>"{{ currentNinjaPhrase.hook }}"</span>
            </div>

            <!-- Main Heading with Typewriter -->
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-slate-900 min-h-[140px] sm:min-h-[130px] lg:min-h-[150px]">
              <span>No dey trek for free. </span>
              <span class="text-parentPrimary">{{ typedNinjaText }}</span>
              <span class="inline-block w-1 h-8 sm:h-10 bg-parentPrimary ml-1 animate-pulse align-middle"></span>
            </h1>

            <!-- Explanatory Subtext -->
            <p class="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
              {{ currentNinjaPhrase.subtext }}
            </p>

            <!-- Ninja Core Feature Badges -->
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <div class="px-3 py-1 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-900 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <span>⚡</span> Instant Daily Bank Cashout
              </div>
              <div class="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <span>🤝</span> Custom Errand Bargaining
              </div>
              <div class="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <span>🍱</span> Meal Desk Batch Deliveries
              </div>
              <div class="px-3 py-1 rounded-xl bg-purple-50 border border-purple-200/80 text-purple-900 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <span>⏰</span> 100% Flexible Lectures Schedule
              </div>
              <div class="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <span>🚶</span> Trek, Skate, or Bike Friendly
              </div>
              <div class="px-3 py-1 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-900 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <span>🎁</span> Keep 100% of Student Tips
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <NuxtLink :to="isLoggedIn ? '/dashboard' : '/auth/register'" class="px-6 py-3.5 bg-parentPrimary hover:bg-[#E54D12] text-white rounded-full font-black text-sm shadow-md shadow-parentPrimary/25 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
                {{ isLoggedIn ? 'Enter Ninja Dashboard' : 'Start Earning as a Ninja' }}
                <Rocket class="w-4 h-4 text-white" />
              </NuxtLink>
              <a href="#features" class="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-full font-bold text-sm border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2">
                <span>How Ninja Hustle Works</span>
                <ArrowRight class="w-4 h-4 text-slate-500" />
              </a>
            </div>
          </div>

          <!-- Right Column: Interactive Live Ninja Console -->
          <div class="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
            <!-- Glow behind console -->
            <div class="absolute inset-0 bg-gradient-to-tr from-parentPrimary/20 via-amber-300/20 to-emerald-400/10 rounded-[3rem] blur-2xl -z-10"></div>

            <div class="w-full max-w-[400px] bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-[2.5rem] p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] relative">
              <!-- Console Header -->
              <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-orange-500/20 shadow-xs relative bg-slate-100">
                    <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=200" class="w-full h-full object-cover" alt="Student Ninja Emeka" />
                  </div>
                  <div>
                    <div class="flex items-center gap-1.5">
                      <h3 class="text-sm font-black text-slate-900">Emeka O.</h3>
                      <span class="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black">Verified Ninja</span>
                    </div>
                    <p class="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>● Online & Taking Runs (UNILAG)</span>
                    </p>
                  </div>
                </div>
                <div class="w-9 h-9 rounded-2xl bg-orange-50 border border-orange-200/50 flex items-center justify-center text-parentPrimary shadow-xs">
                  <Bike class="w-4 h-4" />
                </div>
              </div>

              <!-- Today's Wallet Earnings Card -->
              <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-5 border border-slate-700/60 shadow-md space-y-2 mb-4 relative overflow-hidden">
                <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-parentPrimary/20 rounded-full blur-xl pointer-events-none"></div>
                <div class="flex justify-between items-center text-slate-300 text-[11px] font-bold uppercase tracking-wider">
                  <span class="flex items-center gap-1.5">
                    <Wallet class="w-3.5 h-3.5 text-amber-400" />
                    <span>Today's Ninja Wallet</span>
                  </span>
                  <span class="text-emerald-400 font-extrabold flex items-center gap-0.5 text-xs bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <TrendingUp class="w-3 h-3" /> 16 Trips
                  </span>
                </div>
                <div class="flex items-baseline justify-between pt-1">
                  <h4 class="text-3xl font-black text-white tracking-tight">₦14,800</h4>
                  <span class="text-[10px] text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">+₦2,100 tips</span>
                </div>
                <div class="pt-2 flex items-center justify-between text-[11px] border-t border-slate-700/60 text-slate-300">
                  <span class="flex items-center gap-1">
                    <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" /> Instant Bank Cashout
                  </span>
                  <span class="text-orange-400 font-bold">Paid to Kuda / Opay</span>
                </div>
              </div>

              <!-- Live Requests Feed -->
              <div class="space-y-2.5">
                <!-- Request 1 (Interactive Pending Drop) -->
                <div class="p-3.5 bg-orange-50/70 hover:bg-orange-50 rounded-2xl border border-orange-200/80 transition-all">
                  <div class="flex items-center justify-between mb-1.5">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded-md bg-parentPrimary text-white text-[10px] font-black tracking-wide">NEW RUN</span>
                      <span class="text-[11px] font-extrabold text-slate-800">Normal Errand</span>
                    </div>
                    <span class="text-xs font-black text-parentPrimary">₦1,200 + ₦300 Tip</span>
                  </div>
                  <p class="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                    <span>🍱 Chicken Republic → 📍 Makama Hall (3rd Floor)</span>
                  </p>
                  <div class="mt-2.5 flex items-center justify-between">
                    <span class="text-[10px] text-slate-500">"Why come downstairs? Errand it!"</span>
                    <button class="px-3 py-1 bg-parentPrimary hover:bg-[#E54D12] text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-xs transition-all active:scale-95">
                      Accept Run ⚡
                    </button>
                  </div>
                </div>

                <!-- Request 2 (In Transit) -->
                <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold text-sm">🛵</div>
                    <div>
                      <p class="text-xs font-black text-slate-900">Custom Errand (Bargain)</p>
                      <p class="text-[10px] text-slate-500">Library Book Return → Moremi Hall</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-black text-emerald-600">₦1,500</span>
                    <p class="text-[9px] text-slate-400 font-bold">In Progress</p>
                  </div>
                </div>
              </div>

              <!-- Decorative Floating Badges -->
              <div class="absolute -top-3 -right-3 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-md flex items-center gap-2">
                <span class="text-amber-500 text-sm">⭐</span>
                <div>
                  <p class="text-xs font-black text-slate-900">4.9 Rating</p>
                  <p class="text-[9px] font-bold text-slate-400">210+ Student Reviews</p>
                </div>
              </div>

              <div class="absolute -bottom-3 -left-3 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-md flex items-center gap-2">
                <span class="text-emerald-500 text-sm">⚡</span>
                <div>
                  <p class="text-xs font-black text-slate-900">0% Commission Delay</p>
                  <p class="text-[9px] font-bold text-slate-400">Withdrawal in Seconds</p>
                </div>
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

onUnmounted(() => {
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
