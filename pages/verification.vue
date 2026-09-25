<template>
  <div class="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto animate-fade-in">
    <!-- Header -->
    <div class="px-4 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
      <div>
        <h1 class="text-xl font-bold text-gray-900 tracking-tight">Verify Your Account</h1>
        <p class="text-xs text-gray-500 mt-1 max-w-sm">A quick identity check to secure your payouts.</p>
      </div>
      <button @click="router.push('/dashboard')" class="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900">
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Progress Steps -->
    <div v-if="!profileLoading && (!errandrProfile || errandrProfile.verificationLevel < 2)" class="px-4 py-4 bg-gray-50 border-b border-gray-100">
      <div class="max-w-md mx-auto flex items-center gap-2">
        <div class="flex-1 h-1.5 rounded-full transition-all" :class="step >= 1 ? 'bg-[#FF5C1A]' : 'bg-gray-200'"></div>
        <div class="flex-1 h-1.5 rounded-full transition-all" :class="step >= 2 ? 'bg-[#FF5C1A]' : 'bg-gray-200'"></div>
        <div class="flex-1 h-1.5 rounded-full transition-all" :class="step >= 3 ? 'bg-[#FF5C1A]' : 'bg-gray-200'"></div>
        <div class="flex-1 h-1.5 rounded-full transition-all" :class="step >= 4 ? 'bg-[#FF5C1A]' : 'bg-gray-200'"></div>
      </div>
    </div>

    <div class="flex-1 flex flex-col justify-center px-4 py-5">
      <div v-if="profileLoading" class="flex items-center justify-center py-20">
        <span class="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#FF5C1A] animate-spin"></span>
      </div>
      <div v-else class="w-full max-w-md mx-auto">
        <template v-if="!errandrProfile || errandrProfile.verificationLevel < 2">
        <!-- Step 1: Student ID Capture -->
        <div v-if="step === 1" class="space-y-6">
          <div class="flex items-center gap-4 text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div class="p-2 bg-white rounded-lg border border-gray-200">
              <CreditCard class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-sm">Step 1: Student ID Card</h3>
              <p class="text-xs text-gray-500 mt-0.5">Take a clear picture of your physical student ID card.</p>
            </div>
          </div>
          
          <div v-if="cameraActiveFor === 'id'" class="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
            <video ref="videoRef" autoplay playsinline class="w-full h-full object-cover"></video>
            <button @click="capturePhoto('idCardImage')" class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 font-bold px-4 py-2 rounded-full shadow-sm border border-gray-100 hover:scale-105 transition-transform">
              📸 Capture
            </button>
            <button @click="stopCamera" class="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
              <span class="text-xs font-bold">Cancel</span>
            </button>
          </div>
          
          <div v-else class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#FF5C1A] transition-colors cursor-pointer relative" @click="startCamera('id', 'environment')">
            <input 
              type="file" 
              ref="idInput" 
              accept="image/*" 
              capture="environment" 
              class="hidden" 
              @change="handleFileUpload($event, 'idCardImage')"
            >
            <div v-if="!form.idCardImage" class="space-y-2">
              <div class="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <Camera class="w-6 h-6" />
              </div>
              <p class="font-bold text-gray-900 text-xs">Tap to open Camera</p>
              <p class="text-[10px] text-gray-400">Must be a live photo of your physical ID card.</p>
              <button @click.stop="$refs.idInput.click()" class="text-[10px] text-[#FF5C1A] font-bold hover:underline mt-1">Or upload a file (Fallback)</button>
            </div>
            <div v-else class="space-y-3">
              <div class="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img :src="form.idCardImage" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gray-900/10 flex items-center justify-center pointer-events-none">
                  <div class="w-8 h-8 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                    <CheckCircle2 class="w-5 h-5" />
                  </div>
                </div>
              </div>
              <p class="font-bold text-gray-900 text-sm">Photo Captured</p>
              <div class="flex items-center justify-center gap-4">
                <button @click.stop="startCamera('id', 'environment')" class="text-[10px] text-[#FF5C1A] font-bold hover:underline">Retake with Camera</button>
                <button @click.stop="$refs.idInput.click()" class="text-[10px] text-gray-500 font-bold hover:underline">Upload instead</button>
              </div>
            </div>
          </div>

          <button 
            @click="step = 2" 
            :disabled="!form.idCardImage" 
            class="w-full py-3 text-sm bg-[#FF5C1A] text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E54D12] transition-all shadow-sm border border-gray-100"
          >
            Continue
          </button>
        </div>

        <!-- Step 2: Live Selfie Capture -->
        <div v-if="step === 2" class="space-y-6 animate-slide-in-right">
          <div class="flex items-center gap-4 text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div class="p-2 bg-white rounded-lg border border-gray-200">
              <UserSquare class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-sm">Step 2: Live Selfie</h3>
              <p class="text-xs text-gray-500 mt-0.5">Take a selfie right now to match with your ID card.</p>
            </div>
          </div>
          
          <div v-if="cameraActiveFor === 'selfie'" class="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
            <video ref="videoRef" autoplay playsinline class="w-full h-full object-cover transform scale-x-[-1]"></video>
            <button @click="capturePhoto('selfieImage')" class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 font-bold px-4 py-2 rounded-full shadow-sm border border-gray-100 hover:scale-105 transition-transform">
              📸 Capture Selfie
            </button>
            <button @click="stopCamera" class="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
              <span class="text-xs font-bold">Cancel</span>
            </button>
          </div>

          <div v-else class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#FF5C1A] transition-colors cursor-pointer relative" @click="startCamera('selfie', 'user')">
            <input 
              type="file" 
              ref="selfieInput" 
              accept="image/*" 
              capture="user" 
              class="hidden" 
              @change="handleFileUpload($event, 'selfieImage')"
            >
            <div v-if="!form.selfieImage" class="space-y-2">
              <div class="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <Camera class="w-6 h-6" />
              </div>
              <p class="font-bold text-gray-900 text-xs">Tap to take Selfie</p>
              <p class="text-[10px] text-gray-400">Please ensure good lighting.</p>
              <button @click.stop="$refs.selfieInput.click()" class="text-[10px] text-[#FF5C1A] font-bold hover:underline mt-1">Or upload a file (Fallback)</button>
            </div>
            <div v-else class="space-y-3">
              <div class="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                <img :src="form.selfieImage" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gray-900/10 flex items-center justify-center pointer-events-none">
                  <div class="w-8 h-8 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                    <CheckCircle2 class="w-5 h-5" />
                  </div>
                </div>
              </div>
              <p class="font-bold text-gray-900 text-sm">Selfie Captured</p>
              <div class="flex items-center justify-center gap-4">
                <button @click.stop="startCamera('selfie', 'user')" class="text-[10px] text-[#FF5C1A] font-bold hover:underline">Retake Selfie</button>
                <button @click.stop="$refs.selfieInput.click()" class="text-[10px] text-gray-500 font-bold hover:underline">Upload instead</button>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button @click="step = 1" class="py-3 px-4 text-sm bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all">Back</button>
            <button 
              @click="step = 3" 
              :disabled="!form.selfieImage" 
              class="flex-1 py-3 text-sm bg-[#FF5C1A] text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E54D12] transition-all shadow-sm border border-gray-100"
            >
              Continue
            </button>
          </div>
        </div>

        <!-- Step 3: NIN Slip Capture -->
        <div v-if="step === 3" class="space-y-6 animate-slide-in-right">
          <div class="flex items-center gap-4 text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div class="p-2 bg-white rounded-lg border border-gray-200">
              <CreditCard class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-sm">Step 3: NIN Verification</h3>
              <p class="text-xs text-gray-500 mt-0.5">Enter your 11-digit NIN or take a picture of your NIN slip.</p>
            </div>
          </div>
          
          <div>
            <div class="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button @click="ninMode = 'number'" :class="ninMode === 'number' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-2 text-xs font-bold rounded-lg transition-all">Enter NIN Number</button>
              <button @click="ninMode = 'slip'" :class="ninMode === 'slip' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-2 text-xs font-bold rounded-lg transition-all">Upload NIN Slip</button>
            </div>
            
            <div v-if="ninMode === 'number'">
              <label class="block text-xs font-bold text-gray-700 mb-2">11-Digit NIN Number</label>
              <input 
                v-model="form.ninNumber" 
                type="text" 
                maxlength="11" 
                placeholder="e.g. 12345678901" 
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-base focus:ring-1 focus:ring-[#FF5C1A] focus:border-[#FF5C1A] outline-none transition-all shadow-sm" 
                @input="form.ninNumber = form.ninNumber.replace(/\D/g, '')"
              />
              <p v-if="form.ninNumber && form.ninNumber.length !== 11" class="text-[10px] text-red-500 mt-1 font-bold">NIN must be exactly 11 digits</p>
              <p v-else-if="form.ninNumber && form.ninNumber.length === 11" class="text-[10px] text-emerald-500 mt-1 font-bold">✓ Valid NIN length</p>
            </div>
          </div>
          
          <div v-if="ninMode === 'slip'">
          <div v-if="cameraActiveFor === 'ninSlip'" class="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
            <video ref="videoRef" autoplay playsinline class="w-full h-full object-cover"></video>
            <button @click="capturePhoto('ninSlipImage')" class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 font-bold px-4 py-2 rounded-full shadow-sm border border-gray-100 hover:scale-105 transition-transform">
              📸 Capture
            </button>
            <button @click="stopCamera" class="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
              <span class="text-xs font-bold">Cancel</span>
            </button>
          </div>
          
          <div v-else class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#FF5C1A] transition-colors cursor-pointer relative" @click="startCamera('ninSlip', 'environment')">
            <input 
              type="file" 
              ref="ninInput" 
              accept="image/*" 
              capture="environment" 
              class="hidden" 
              @change="handleFileUpload($event, 'ninSlipImage')"
            >
            <div v-if="!form.ninSlipImage" class="space-y-2">
              <div class="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <Camera class="w-6 h-6" />
              </div>
              <p class="font-bold text-gray-900 text-xs">Tap to open Camera</p>
              <p class="text-[10px] text-gray-400">Must be a clear photo of your NIN slip.</p>
              <button @click.stop="$refs.ninInput.click()" class="text-[10px] text-[#FF5C1A] font-bold hover:underline mt-1">Or upload a file (Fallback)</button>
            </div>
            <div v-else class="space-y-3">
              <div class="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img :src="form.ninSlipImage" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gray-900/10 flex items-center justify-center pointer-events-none">
                  <div class="w-8 h-8 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                    <CheckCircle2 class="w-5 h-5" />
                  </div>
                </div>
              </div>
              <p class="font-bold text-gray-900 text-sm">Photo Captured</p>
              <div class="flex items-center justify-center gap-4">
                <button @click.stop="startCamera('ninSlip', 'environment')" class="text-[10px] text-[#FF5C1A] font-bold hover:underline">Retake with Camera</button>
                <button @click.stop="$refs.ninInput.click()" class="text-[10px] text-gray-500 font-bold hover:underline">Upload instead</button>
              </div>
            </div>
          </div>
            </div>

          <div class="flex gap-3 mt-8">
            <button @click="step = 2" class="py-3 px-4 text-sm bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all">Back</button>
            <button 
              @click="step = 4" 
              :disabled="ninMode === 'number' ? !(form.ninNumber && form.ninNumber.length === 11) : !form.ninSlipImage" 
              class="flex-1 py-3 text-sm bg-[#FF5C1A] text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E54D12] transition-all shadow-sm border border-gray-100"
            >
              Continue
            </button>
          </div>
        </div>

        <!-- Step 4: Final Details -->
        <div v-if="step === 4" class="space-y-6 animate-slide-in-right">
          <div class="flex items-center gap-4 text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div class="p-2 bg-white rounded-lg border border-gray-200">
              <Smartphone class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-sm">Step 3: Final Details</h3>
              <p class="text-xs text-gray-500 mt-0.5">Provide your school, matric number, and WhatsApp number.</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="relative">
              <label class="block text-xs font-bold text-gray-700 mb-2">School</label>
              <div 
                @click="isSchoolDropdownOpen = !isSchoolDropdownOpen" 
                class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm flex justify-between items-center cursor-pointer hover:border-[#FF5C1A] transition-colors shadow-sm"
              >
                <span :class="form.school ? 'text-gray-900' : 'text-gray-400'">
                  {{ form.school || 'Select your school' }}
                </span>
                <ChevronDown class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isSchoolDropdownOpen }" />
              </div>
              
              <!-- Dropdown Menu -->
              <div v-if="isSchoolDropdownOpen" class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-fade-in">
                <div class="p-2 border-b border-gray-100 sticky top-0 bg-white">
                  <div class="relative">
                    <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      v-model="schoolSearchQuery" 
                      type="text" 
                      placeholder="Search universities..." 
                      class="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded-md text-xs focus:ring-1 focus:ring-[#FF5C1A] outline-none"
                      @click.stop
                    />
                  </div>
                </div>
                <ul class="max-h-60 overflow-y-auto overscroll-contain">
                  <li 
                    v-for="uni in filteredUniversities" 
                    :key="uni"
                    @click="selectSchool(uni)"
                    class="px-4 py-3 text-xs cursor-pointer hover:bg-orange-50 hover:text-[#FF5C1A] transition-colors flex items-center justify-between"
                    :class="{'bg-orange-50 text-[#FF5C1A] font-bold': form.school === uni, 'text-gray-700': form.school !== uni}"
                  >
                    {{ uni }}
                    <Check v-if="form.school === uni" class="w-4 h-4" />
                  </li>
                  <li v-if="filteredUniversities.length === 0" class="px-4 py-4 text-xs text-gray-400 text-center">
                    No universities found
                  </li>
                </ul>
              </div>
              
              <!-- Transparent overlay to click outside -->
              <div v-if="isSchoolDropdownOpen" @click="isSchoolDropdownOpen = false" class="fixed inset-0 z-40"></div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2">Matric Number</label>
              <input v-model="form.matricNumber" type="text" placeholder="e.g. 190801021" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-base focus:ring-1 focus:ring-[#FF5C1A] focus:border-[#FF5C1A] outline-none transition-all shadow-sm">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2">WhatsApp Number</label>
              <input v-model="form.whatsappNumber" type="tel" placeholder="e.g. 08012345678" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-base focus:ring-1 focus:ring-[#FF5C1A] focus:border-[#FF5C1A] outline-none transition-all shadow-sm">
            </div>
          </div>

          <div class="flex gap-3">
            <button @click="step = 3" class="py-3 px-4 text-sm bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all">Back</button>
            <button 
              @click="submitVerification" 
              :disabled="loading || !form.whatsappNumber || !form.school || !form.matricNumber" 
              class="flex-1 py-3 text-sm bg-[#FF5C1A] text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E54D12] transition-all flex justify-center items-center gap-2 shadow-sm border border-gray-100"
            >
              <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ loading ? 'Submitting...' : 'Submit Verification' }}
            </button>
          </div>
        </div>

        <!-- Success View -->
        <div v-if="step === 5" class="text-center py-12 space-y-4 animate-zoom-in">
          <div class="w-16 h-16 bg-gray-50 text-gray-900 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <PartyPopper class="w-8 h-8" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 tracking-tight">Verification Submitted</h2>
          <p class="text-gray-500 text-xs max-w-xs mx-auto">
            Your identity documents have been submitted securely. Reviews typically take less than 24 hours.
          </p>
          <div class="pt-6">
            <NuxtLink to="/dashboard" class="inline-block px-5 py-3 text-sm bg-[#FF5C1A] text-white font-bold rounded-xl hover:bg-[#E54D12] transition-all shadow-sm border border-gray-100">
              Return to Dashboard
            </NuxtLink>
          </div>
        </div>
        </template>
        
        <!-- Tier 3 Form -->
        <template v-else-if="errandrProfile.verificationLevel === 2">
          <div v-if="tier3Step === 1" class="space-y-6 animate-slide-in-right">
            <div class="flex items-center gap-4 text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div class="p-2 bg-white rounded-lg border border-gray-200">
                <Users class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-bold text-sm">Tier 3: Guarantor Details</h3>
                <p class="text-xs text-gray-500 mt-0.5">Provide details of a trusted guarantor.</p>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-2">Guarantor Name</label>
                <input v-model="guarantorForm.name" type="text" placeholder="Full Name" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-base focus:ring-1 focus:ring-[#FF5C1A] focus:border-[#FF5C1A] outline-none transition-all shadow-sm">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-2">Guarantor Phone</label>
                <input v-model="guarantorForm.phone" type="tel" placeholder="Phone Number" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-base focus:ring-1 focus:ring-[#FF5C1A] focus:border-[#FF5C1A] outline-none transition-all shadow-sm">
              </div>
              <div class="relative">
                <label class="block text-xs font-bold text-gray-700 mb-2">Relationship</label>
                <div 
                  @click="isRelationshipDropdownOpen = !isRelationshipDropdownOpen" 
                  class="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm flex justify-between items-center cursor-pointer hover:border-[#FF5C1A] transition-colors shadow-sm"
                >
                  <span :class="guarantorForm.relationship ? 'text-gray-900' : 'text-gray-400'">
                    {{ guarantorForm.relationship || 'Select relationship' }}
                  </span>
                  <ChevronDown class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isRelationshipDropdownOpen }" />
                </div>
                
                <!-- Dropdown Menu -->
                <div v-if="isRelationshipDropdownOpen" class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-fade-in">
                  <ul class="max-h-60 overflow-y-auto overscroll-contain">
                    <li 
                      v-for="rel in relationships" 
                      :key="rel"
                      @click="selectRelationship(rel)"
                      class="px-4 py-3 text-xs cursor-pointer hover:bg-orange-50 hover:text-[#FF5C1A] transition-colors flex items-center justify-between"
                      :class="{'bg-orange-50 text-[#FF5C1A] font-bold': guarantorForm.relationship === rel, 'text-gray-700': guarantorForm.relationship !== rel}"
                    >
                      {{ rel }}
                      <Check v-if="guarantorForm.relationship === rel" class="w-4 h-4" />
                    </li>
                  </ul>
                </div>
                
                <!-- Transparent overlay to click outside -->
                <div v-if="isRelationshipDropdownOpen" @click="isRelationshipDropdownOpen = false" class="fixed inset-0 z-40"></div>
              </div>
            </div>

            <button 
              @click="submitTier3" 
              :disabled="loading || !guarantorForm.name || !guarantorForm.phone || !guarantorForm.relationship" 
              class="w-full py-3 text-sm bg-[#FF5C1A] text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E54D12] transition-all flex justify-center items-center gap-2 shadow-sm border border-gray-100"
            >
              <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ loading ? 'Submitting...' : 'Submit Verification' }}
            </button>
          </div>

          <!-- Success View Tier 3 -->
          <div v-if="tier3Step === 2" class="text-center py-12 space-y-4 animate-zoom-in">
            <div class="w-16 h-16 bg-gray-50 text-gray-900 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <PartyPopper class="w-8 h-8" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">Tier 3 Submitted</h2>
            <p class="text-gray-500 text-xs max-w-xs mx-auto">
              Your guarantor details have been submitted securely. Reviews typically take less than 24 hours.
            </p>
            <div class="pt-6">
              <NuxtLink to="/dashboard" class="inline-block px-5 py-3 text-sm bg-[#FF5C1A] text-white font-bold rounded-xl hover:bg-[#E54D12] transition-all shadow-sm border border-gray-100">
                Return to Dashboard
              </NuxtLink>
            </div>
          </div>
        </template>
        
        <!-- Fully verified view -->
        <template v-else-if="errandrProfile.verificationLevel >= 3">
          <div class="text-center py-12 space-y-4 animate-zoom-in">
            <div class="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 class="w-8 h-8" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">Fully Verified!</h2>
            <p class="text-gray-500 text-xs mt-2 max-w-xs mx-auto">You are a Pro rider (Tier 3) with full access to all deliveries.</p>
            <div class="pt-6">
              <NuxtLink to="/dashboard" class="inline-block px-5 py-3 text-sm bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-sm border border-gray-100">
                Return to Dashboard
              </NuxtLink>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useCustomToast as useToast } from '@/composables/core/useCustomToast'
import { useUser } from '@/composables/modules/auth/user'
import { 
  CreditCard, 
  Camera, 
  CheckCircle2, 
  UserSquare, 
  Smartphone, 
  PartyPopper,
  Users,
  X,
  ChevronDown,
  Search,
  Check
} from 'lucide-vue-next'
import { erranders_api } from '@/api_factory/modules/erranders'

definePageMeta({ layout: 'errander' })
useHead({ title: 'Account Verification - Errandr' })

const step = ref(1)
const ninMode = ref('number')
const loading = ref(false)
const router = useRouter()

const { showToast } = useToast()


const isRelationshipDropdownOpen = ref(false)
const relationships = [
  "Parent",
  "Sibling",
  "Spouse",
  "Uncle/Aunt",
  "Cousin",
  "Friend",
  "Colleague",
  "Other"
]

const selectRelationship = (rel: string) => {
  guarantorForm.relationship = rel
  isRelationshipDropdownOpen.value = false
}

const isSchoolDropdownOpen = ref(false)
const schoolSearchQuery = ref('')

const universities = [
  "UNILAG (University of Lagos)",
  "CMUL (College of Medicine, University of Lagos)",
  "YABATECH (Yaba College of Technology)",
  "LASU (Lagos State University)",
  "LASUSTECH (Lagos State University of Science and Technology)",
  "LASUED (Lagos State University of Education)",
  "UI (University of Ibadan)",
  "OAU (Obafemi Awolowo University)",
  "UNILORIN (University of Ilorin)",
  "UNIBEN (University of Benin)",
  "UNN (University of Nigeria, Nsukka)",
  "ABU (Ahmadu Bello University)",
  "FUTA (Federal University of Technology, Akure)",
  "FUTO (Federal University of Technology, Owerri)",
  "FUNAAB (Federal University of Agriculture, Abeokuta)",
  "COVENANT (Covenant University)",
  "BABCOCK (Babcock University)",
  "BOWEN (Bowen University)",
  "PAU (Pan-Atlantic University)",
  "REDEEMERS (Redeemer's University)",
  "Other"
]

const filteredUniversities = computed(() => {
  if (!schoolSearchQuery.value) return universities
  return universities.filter(u => u.toLowerCase().includes(schoolSearchQuery.value.toLowerCase()))
})

const selectSchool = (school: string) => {
  form.school = school
  isSchoolDropdownOpen.value = false
  schoolSearchQuery.value = ''
}

const profileLoading = ref(true)
const errandrProfile = ref<any>(null)
const tier3Step = ref(1)
const guarantorForm = reactive({
  name: '',
  phone: '',
  relationship: ''
})

const form = reactive({
  idCardImage: '',
  selfieImage: '',
  ninSlipImage: '',
  ninNumber: '',
  whatsappNumber: '',
  school: '',
  matricNumber: ''
})

onMounted(async () => {
  try {
    const res = await erranders_api.getProfile()
    if (res && res.data) {
      errandrProfile.value = res.data
    }
  } catch (e) {
  } finally {
    profileLoading.value = false
  }

  const savedState = localStorage.getItem('verification_state')
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState)
      if (parsed.step && parsed.step < 5) step.value = parsed.step
      if (parsed.form) {
        form.idCardImage = parsed.form.idCardImage || ''
        form.selfieImage = parsed.form.selfieImage || ''
        form.ninSlipImage = parsed.form.ninSlipImage || ''
        form.ninNumber = parsed.form.ninNumber || ''
        form.whatsappNumber = parsed.form.whatsappNumber || ''
        form.school = parsed.form.school || ''
        form.matricNumber = parsed.form.matricNumber || ''
      }
    } catch (e) {}
  }
})

watch(
  () => ({ step: step.value, form }),
  (state) => {
    if (state.step < 5) {
      localStorage.setItem('verification_state', JSON.stringify(state))
    }
  },
  { deep: true }
)

const idInput = ref<HTMLInputElement | null>(null)
const selfieInput = ref<HTMLInputElement | null>(null)
const ninInput = ref<HTMLInputElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const cameraActiveFor = ref<'id' | 'selfie' | 'ninSlip' | null>(null)
let stream: MediaStream | null = null

const startCamera = async (stepId: 'id' | 'selfie' | 'ninSlip', facingMode: 'environment' | 'user') => {
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      })
      cameraActiveFor.value = stepId
      // Wait for the next tick for the video element to be rendered
      setTimeout(() => {
        if (videoRef.value) {
          videoRef.value.srcObject = stream
        }
      }, 50)
    } else {
      throw new Error('Camera API not supported')
    }
  } catch (err) {
    console.warn('Could not open camera, falling back to file input', err)
    if (stepId === 'id' && idInput.value) idInput.value.click()
    if (stepId === 'selfie' && selfieInput.value) selfieInput.value.click()
    if (stepId === 'ninSlip' && ninInput.value) ninInput.value.click()
  }
}

const capturePhoto = (field: 'idCardImage' | 'selfieImage' | 'ninSlipImage') => {
  if (!videoRef.value) return
  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  const ctx = canvas.getContext('2d')
  if (ctx) {
    if (field === 'selfieImage') {
      // Flip the canvas horizontally for selfies before drawing to match the mirror view
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height)
    form[field] = canvas.toDataURL('image/jpeg', 0.8)
    
    showToast({
      title: 'Success',
      message: `${field === 'idCardImage' ? 'ID Card' : field === 'selfieImage' ? 'Selfie' : 'NIN Slip'} captured securely.`,
      toastType: 'success'
    })
    stopCamera()
  }
}

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(t => t.stop())
    stream = null
  }
  cameraActiveFor.value = null
}

// Simulated file upload for now, ideally this would upload to Cloudinary or similar via an endpoint
const handleFileUpload = async (event: any, field: 'idCardImage' | 'selfieImage' | 'ninSlipImage') => {
  const file = event.target.files[0]
  if (!file) return

  // In a real implementation, you would upload this file to your backend or Cloudinary
  // and get a URL back. For now, we will create an object URL to simulate it.
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    form[field] = reader.result as string
    showToast({
      title: 'Success',
      message: `${field === 'idCardImage' ? 'ID Card' : field === 'selfieImage' ? 'Selfie' : 'NIN Slip'} captured securely.`,
      toastType: 'success'
    })
  }
}

const submitVerification = async () => {
  loading.value = true
  try {
    const res = await api.post('/erranders/verify/submit-tier-2', form)
    if (res.status === 200 || res.status === 201) {
      step.value = 5
      localStorage.removeItem('verification_state')
      await erranders_api.getProfile() // refresh user data
    }
  } catch (error: any) {
    showToast({
      title: 'Verification Failed',
      message: error.response?.data?.message || 'Something went wrong while submitting your verification.',
      toastType: 'error'
    })
  } finally {
    loading.value = false
  }
}

const submitTier3 = async () => {
  loading.value = true
  try {
    const res = await api.post('/erranders/verify/submit-tier-3', { guarantorDetails: guarantorForm })
    if (res.status === 200 || res.status === 201) {
      tier3Step.value = 2
      // refresh user data
      await erranders_api.getProfile()
    }
  } catch (error: any) {
    showToast({
      title: 'Verification Failed',
      message: error.response?.data?.message || 'Something went wrong while submitting your verification.',
      toastType: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-slide-in-right {
  animation: slideInRight 0.4s ease-out forwards;
}
.animate-zoom-in {
  animation: zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
