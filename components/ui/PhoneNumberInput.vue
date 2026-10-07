<template>
  <div class="mb-2 relative">
    <div class="relative input-container">
      <!-- Floating Label -->
      <label 
        :for="inputId"
        :class="[
          'absolute transition-all duration-300 ease-in-out pointer-events-none z-10',
          isFocused || phoneNumber ? 
            'text-sm text-gray-500 left-3 top-2' : 
            'text-base text-gray-500 left-3 top-1/2 transform -translate-y-1/2'
        ]"
      >
        {{ label }}
      </label>
      
      <!-- Main Input Container -->
      <div 
        :class="[
          'w-full py-3 px-3 bg-[#1A1A1B09] border-[0.5px] border-transparent focus-within:outline-none focus-within:ring-1 focus-within:ring-[#3BAB22] focus-within:border-[#3BAB22] transition-all duration-300 flex items-center gap-3',
          roundedClasses,
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          (hasError || errorMessage) ? 'border-[0.5px] ring-red-500 border-red-500' : ''
        ]"
      >
        <!-- Country Code Selector -->
        <div class="relative" ref="dropdownRef">
          <button
            type="button"
            @click="toggleDropdown"
            :disabled="disabled"
            class="flex items-center gap-2  px-2 py-1.5 rounded-lg transition-colors"
            :class="{ 'cursor-not-allowed': disabled }"
          >
            <!-- Circular Flag -->
            <div class="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 flex-shrink-0">
              <span class="text-lg leading-none">{{ selectedCountryFlag }}</span>
            </div>
            <span class="text-base font-medium text-[#1A1A1B]">{{ selectedDialCode }}</span>
            <svg 
              class="w-4 h-4 transition-transform duration-200 text-gray-500" 
              :class="{ 'transform rotate-180': showDropdown }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <!-- Dropdown -->
          <Transition name="slide-fade">
            <div
              v-if="showDropdown"
              class="absolute z-50 mt-2 bg-white shadow-sm border border-gray-50 rounded-2xl border-[0.5px] border-gray-100 overflow-hidden left-0"
            >
              <!-- Search Input -->
              <div class="p-4 border-b-[0.5px] border-gray-100 bg-gray-50">
                <div class="relative">
                  <svg 
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <circle cx="11" cy="11" r="8"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    ref="searchInputRef"
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search"
                    class="w-full pl-10 pr-3 py-2.5 bg-white border-[0.5px] border-gray-200 rounded-lg focus:border-[#3BAB22] focus:ring-1 focus:ring-[#3BAB22] outline-none text-base placeholder-gray-400"
                    @click.stop
                  />
                </div>
              </div>
              
              <!-- Countries List -->
              <div class="max-h-72 overflow-y-auto">
                <button
                  v-for="country in filteredCountries"
                  :key="country.code"
                  type="button"
                  @click="selectCountry(country)"
                  class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                  :class="{ 'bg-green-50': selectedCountryCode === country.dialCode }"
                >
                  <!-- Circular Flag -->
                  <div class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 flex-shrink-0">
                    <span class="text-xl leading-none">{{ getCountryFlag(country.code) }}</span>
                  </div>
                  <div class="flex-1 flex items-center justify-between min-w-0">
                    <!-- <span class="text-base font-medium text-[#1A1A1B] truncate">{{ country.name }}</span> -->
                    <span class="text-base text-gray-500 font-medium ml-2 flex-shrink-0">{{ country.dialCode }}</span>
                  </div>
                </button>
                
                <!-- No results -->
                <div 
                  v-if="filteredCountries.length === 0" 
                  class="p-4 text-center text-base text-gray-500"
                >
                  No countries found for "{{ searchQuery }}"
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Phone Number Input -->
        <input
          :id="inputId"
          ref="phoneInputRef"
          v-model="displayPhoneNumber"
          type="tel"
          :placeholder="isFocused ? formatPlaceholder : ''"
          :disabled="disabled"
          :readonly="readonly"
          class="flex-1 bg-transparent outline-none border-none text-[#1A1A1B] placeholder-gray-400 text-base"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown="handleKeyDown"
        />
      </div>
    </div>
    
    <!-- Error Message -->
    <p v-if="errorMessage" class="mt-1 text-sm text-red-500 flex items-center">
      <span class="mr-1">⚠️</span>{{ errorMessage }}
    </p>

    <!-- Helper Text -->
    <p v-if="helperText && !errorMessage" class="mt-1 text-sm text-gray-500">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick, useId } from 'vue'

interface Country {
  name: string
  code: string
  dialCode: string
}

interface Props {
  modelValue?: string
  countryCode?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  validateOnBlur?: boolean
  required?: boolean
  position?: 'top' | 'middle' | 'bottom' | 'standalone'
  hasError?: boolean
  countries?: Country[]
  helperText?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:countryCode', value: string): void
  (e: 'blur'): void
  (e: 'focus', event: FocusEvent): void
  (e: 'validation-error', error: string | null): void
  (e: 'phone-complete', data: { phoneNumber: string, countryCode: string, dialCode: string, fullNumber: string }): void
  (e: 'update:fullNumber', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  countryCode: '+234',
  label: '',
  placeholder: '(000) 000 0000',
  disabled: false,
  readonly: false,
  validateOnBlur: true,
  required: true,
  position: 'standalone',
  hasError: false,
  helperText: ''
})

const emit = defineEmits<Emits>()

// State
const phoneNumber = ref(props.modelValue)
const selectedCountryCode = ref(props.countryCode)
const showDropdown = ref(false)
const isFocused = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')
const inputId = useId()
const phoneInputRef = ref<HTMLInputElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)

// Default countries list
const defaultCountries: Country[] = [
  { name: 'Nigeria', code: 'NG', dialCode: '+234' },
  { name: 'United States', code: 'US', dialCode: '+1' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44' },
  { name: 'Canada', code: 'CA', dialCode: '+1' },
  { name: 'Ghana', code: 'GH', dialCode: '+233' },
  { name: 'Kenya', code: 'KE', dialCode: '+254' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27' },
  { name: 'India', code: 'IN', dialCode: '+91' },
  { name: 'Australia', code: 'AU', dialCode: '+61' },
  { name: 'Germany', code: 'DE', dialCode: '+49' },
  { name: 'France', code: 'FR', dialCode: '+33' },
  { name: 'China', code: 'CN', dialCode: '+86' },
  { name: 'Japan', code: 'JP', dialCode: '+81' },
  { name: 'Brazil', code: 'BR', dialCode: '+55' },
  { name: 'Mexico', code: 'MX', dialCode: '+52' },
]

const countriesList = computed(() => props.countries || defaultCountries)

// Helper function to get country flag emoji
const getCountryFlag = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return '🌍'
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

// Format phone number for display based on country
const formatPhoneNumberForDisplay = (value: string, dialCode: string): string => {
  if (!value) return ''
  
  // Remove all non-numeric characters
  const cleaned = value.replace(/\D/g, '')
  
  // Format based on country
  switch (dialCode) {
    case '+234': // Nigeria: (803) 456 7890
      if (cleaned.length <= 3) return `(${cleaned}`
      if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`
    
    case '+1': // US/Canada: (123) 456-7890
      if (cleaned.length <= 3) return `(${cleaned}`
      if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
    
    case '+44': // UK: 7911 123456
      if (cleaned.length <= 4) return cleaned
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 10)}`
    
    case '+91': // India: 98765 43210
      if (cleaned.length <= 5) return cleaned
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`
    
    default: // Generic format: (123) 456 7890
      if (cleaned.length <= 3) return `(${cleaned}`
      if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`
  }
}

// Parse formatted phone number back to raw digits
const parsePhoneNumber = (formatted: string): string => {
  return formatted.replace(/\D/g, '')
}

// Computed
const selectedCountry = computed(() => {
  return countriesList.value.find(c => c.dialCode === selectedCountryCode.value) || 
         countriesList.value.find(c => c.code === 'NG')!
})

const selectedCountryFlag = computed(() => {
  return getCountryFlag(selectedCountry.value.code)
})

const selectedDialCode = computed(() => {
  return selectedCountry.value.dialCode
})

const displayPhoneNumber = computed({
  get: () => formatPhoneNumberForDisplay(phoneNumber.value, selectedCountryCode.value),
  set: (value: string) => {
    phoneNumber.value = parsePhoneNumber(value)
  }
})

const formatPlaceholder = computed(() => {
  switch (selectedCountryCode.value) {
    case '+234': return '(803) 456 7890'
    case '+1': return '(123) 456-7890'
    case '+44': return '7911 123456'
    case '+91': return '98765 43210'
    default: return '(000) 000 0000'
  }
})

const filteredCountries = computed(() => {
  if (!searchQuery.value.trim()) {
    // Sort to put Nigeria first
    return [...countriesList.value].sort((a, b) => {
      if (a.code === 'NG') return -1
      if (b.code === 'NG') return 1
      return a.name.localeCompare(b.name)
    })
  }
  
  const query = searchQuery.value.toLowerCase()
  return countriesList.value.filter(country => {
    return (
      country.name.toLowerCase().includes(query) ||
      country.code.toLowerCase().includes(query) ||
      country.dialCode.includes(query)
    )
  })
})

const roundedClasses = computed(() => {
  switch (props.position) {
    case 'top':
      return 'rounded-t-xl rounded-b-sm'
    case 'middle':
      return 'rounded-sm'
    case 'bottom':
      return 'rounded-b-xl rounded-t-sm'
    case 'standalone':
    default:
      return 'rounded-xl'
  }
})

// Phone validation rules by country
const phoneValidationRules: Record<string, { minLength: number, maxLength: number }> = {
  '+234': { minLength: 10, maxLength: 11 },
  '+1': { minLength: 10, maxLength: 10 },
  '+44': { minLength: 10, maxLength: 11 },
  '+233': { minLength: 9, maxLength: 10 },
  '+254': { minLength: 9, maxLength: 10 },
  '+27': { minLength: 9, maxLength: 10 },
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  phoneNumber.value = newValue
})

watch(() => props.countryCode, (newValue) => {
  selectedCountryCode.value = newValue
})

// Emit changes
watch(phoneNumber, (newValue) => {
  emit('update:modelValue', newValue)
  if (newValue) {
    validatePhoneNumber()
  }
})

watch(selectedCountryCode, (newValue) => {
  emit('update:countryCode', newValue)
  if (phoneNumber.value) {
    validatePhoneNumber()
  }
})

// Methods
const toggleDropdown = async () => {
  if (props.disabled) return
  showDropdown.value = !showDropdown.value
  
  if (showDropdown.value) {
    await nextTick()
    searchInputRef.value?.focus()
  } else {
    searchQuery.value = ''
  }
}

const selectCountry = (country: Country) => {
  selectedCountryCode.value = country.dialCode
  showDropdown.value = false
  searchQuery.value = ''
  phoneInputRef.value?.focus()
  if (phoneNumber.value) {
    validatePhoneNumber()
  }
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = () => {
  isFocused.value = false
  if (props.validateOnBlur) {
    validatePhoneNumber()
  }
  emit('blur')
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const cursorPosition = target.selectionStart || 0
  const oldValue = displayPhoneNumber.value
  const newValue = target.value
  
  // Parse to get raw digits
  const rawDigits = parsePhoneNumber(newValue)
  phoneNumber.value = rawDigits
  
  // Clear error on input
  if (errorMessage.value) {
    errorMessage.value = ''
    emit('validation-error', null)
  }
  
  // Restore cursor position after formatting
  nextTick(() => {
    if (target === document.activeElement) {
      const formatted = formatPhoneNumberForDisplay(rawDigits, selectedCountryCode.value)
      let newCursorPos = cursorPosition
      
      // Adjust cursor position if formatting changed
      if (formatted.length > oldValue.length) {
        newCursorPos = cursorPosition + (formatted.length - oldValue.length)
      }
      
      target.setSelectionRange(newCursorPos, newCursorPos)
    }
  })
}

const handleKeyDown = (event: KeyboardEvent) => {
  // Allow: backspace, delete, tab, escape, enter, arrows
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
  
  if (allowedKeys.includes(event.key)) return
  
  // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
  if (event.ctrlKey || event.metaKey) return
  
  // Prevent non-numeric input
  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
  }
}

const validatePhoneNumber = (): boolean => {
  const value = phoneNumber.value.trim()
  
  if (props.required && !value) {
    errorMessage.value = 'Phone number is required'
    emit('validation-error', 'Phone number is required')
    return false
  }
  
  if (!value) {
    errorMessage.value = ''
    emit('validation-error', null)
    return true
  }
  
  const rules = phoneValidationRules[selectedCountryCode.value]
  
  if (rules) {
    const cleanNumber = value.replace(/\s+/g, '')
    
    if (cleanNumber.length < rules.minLength) {
      errorMessage.value = `Phone number must be at least ${rules.minLength} digits`
      emit('validation-error', errorMessage.value)
      return false
    }
    
    if (cleanNumber.length > rules.maxLength) {
      errorMessage.value = `Phone number must not exceed ${rules.maxLength} digits`
      emit('validation-error', errorMessage.value)
      return false
    }
  } else {
    const cleanNumber = value.replace(/\s+/g, '')
    if (cleanNumber.length < 7 || cleanNumber.length > 15) {
      errorMessage.value = 'Invalid phone number length'
      emit('validation-error', errorMessage.value)
      return false
    }
  }
  
  errorMessage.value = ''
  emit('validation-error', null)
  
  const fullNumber = `${selectedCountryCode.value}${value}`
  emit('update:fullNumber', fullNumber)
  emit('phone-complete', {
    phoneNumber: value,
    countryCode: selectedCountry.value.code,
    dialCode: selectedCountryCode.value,
    fullNumber: fullNumber
  })
  
  return true
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false
    searchQuery.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Expose methods
defineExpose({
  validate: validatePhoneNumber,
  clearError: () => {
    errorMessage.value = ''
    emit('validation-error', null)
  },
  focus: () => {
    phoneInputRef.value?.focus()
  },
  blur: () => {
    phoneInputRef.value?.blur()
  }
})
</script>

<style scoped>
input:focus {
  outline: none;
}

.input-container {
  position: relative;
}

.input-container label {
  background: transparent;
  padding: 0 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dropdown transitions */
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-5px);
  opacity: 0;
}

/* Custom scrollbar */
.max-h-72::-webkit-scrollbar {
  width: 6px;
}

.max-h-72::-webkit-scrollbar-track {
  background: #f9fafb;
  border-radius: 10px;
}

.max-h-72::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.max-h-72::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>