<template>
  <div class="mb-2 relative">
    <div class="relative input-container">
      <label 
        :for="inputId"
        :class="[
          'absolute transition-all duration-300 ease-in-out pointer-events-none z-10',
          isFocused || modelValue ? 
            'text-sm text-gray-500 left-3 top-2' : 
            `text-base text-gray-500 left-3 ${type === 'textarea' ? 'top-4' : 'top-1/2 transform -translate-y-1/2'}`
        ]"
      >
        {{ label }}
      </label>
      
      <textarea
        v-if="type === 'textarea'"
        :id="inputId"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :class="[
          'w-full py-4 pt-6 px-3 bg-[#1A1A1B09] border-[0.5px] border-transparent focus:outline-none focus:ring-1 focus:ring-[#033958] focus:border-[#033958] transition-all duration-300 resize-none',
          roundedClasses,
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          (hasError || (errorMessage && showError)) ? 'border-[0.5px] ring-red-500 border-red-500' : ''
        ]"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <input
        v-else
        :id="inputId"
        ref="inputRef"
        :type="computedType" 
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly || type === 'date' || type === 'time' || type === 'datetime-local'"
        :autocomplete="autocomplete"
        :class="[
          'w-full py-4 pt-6 px-3 bg-[#1A1A1B09] border-[0.5px] border-transparent focus:outline-none focus:ring-1 focus:ring-[#033958] focus:border-[#033958] transition-all duration-300',
          roundedClasses,
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          (type === 'date' || type === 'time' || type === 'datetime-local') ? 'cursor-pointer' : '',
          (hasError || (errorMessage && showError)) ? 'border-[0.5px] ring-red-500 border-red-500' : ''
        ]"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @click="handleInputClick"
      />
      
      <button 
        v-if="type === 'password'"
        type="button" 
        @click="togglePasswordVisibility" 
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-20"
      >
        <Eye v-if="showPassword" :size="20" />
        <EyeOff v-else :size="20" />
      </button>
      
      <div 
        v-if="$slots.right && type !== 'password' && type !== 'date' && type !== 'time' && type !== 'datetime-local'" 
        class="absolute right-3 top-1/2 transform -translate-y-1/2 z-20"
      >
        <slot name="right" />
      </div>
    </div>
    
    <Transition name="slide-fade">
      <p v-if="errorMessage && showError" class="text-sm text-red-500 mt-1 ml-3">
        {{ errorMessage }}
      </p>
    </Transition>
  </div>
  
  <Teleport to="body">
    <!-- Date Picker -->
    <Transition name="picker-fade">
      <div 
        v-if="showDatePicker"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        @click="closeDatePicker"
      >
        <div 
          class="bg-white rounded-3xl shadow-sm border border-gray-50 w-full max-w-md overflow-hidden transform"
          @click.stop
        >
          <div class="bg-gradient-to-br from-[#033958] to-[#055a8c] p-4 text-white">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xl font-bold">Select Date</h3>
              <button 
                type="button" 
                @click.stop="closeDatePicker"
                class="p-2 hover:bg-white/20 rounded-full transition-all"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <p class="text-white/80 text-sm">
              {{ selectedDate ? formatDateDisplay(selectedDate) : 'No date selected' }}
            </p>
          </div>
          
          <div class="p-4">
            <div class="flex items-center justify-between mb-6">
              <button 
                type="button" 
                @click.stop="prevMonth" 
                class="p-3 hover:bg-gray-100 rounded-xl transition-all group"
              >
                <ChevronLeft :size="20" stroke-width="2.5" class="group-hover:scale-110 transition-transform" />
              </button>
              
              <div class="flex gap-3">
                <select 
                  v-model="currentMonth" 
                  @click.stop
                  class="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-[#033958] rounded-xl font-bold focus:outline-none focus:border-[#033958] transition-all"
                >
                  <option v-for="(m, i) in months" :key="i" :value="i">{{ m }}</option>
                </select>
                
                <select 
                  v-model="currentYear" 
                  @click.stop
                  class="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-[#033958] rounded-xl font-bold focus:outline-none focus:border-[#033958] transition-all"
                >
                  <option v-for="y in yearRange" :key="y" :value="y">{{ y }}</option>
                </select>
              </div>
              
              <button 
                type="button" 
                @click.stop="nextMonth" 
                class="p-3 hover:bg-gray-100 rounded-xl transition-all group"
              >
                <ChevronRight :size="20" stroke-width="2.5" class="group-hover:scale-110 transition-transform" />
              </button>
            </div>
            
            <div class="grid grid-cols-7 gap-2 mb-3">
              <div v-for="d in weekDays" :key="d" class="text-center text-sm font-bold text-gray-500 py-2">{{ d }}</div>
            </div>
            
            <div class="grid grid-cols-7 gap-2">
              <button 
                v-for="(day, i) in calendarDays" 
                :key="i" 
                type="button" 
                :disabled="!day.isCurrentMonth"
                :class="getDayClass(day)"
                @click.stop="selectDay(day)"
              >
                {{ day.date }}
              </button>
            </div>
          </div>
          
          <div class="px-4 pb-6 pt-2 flex justify-between border-t">
            <button 
              type="button" 
              @click.stop="setToday" 
              class="px-5 py-2.5 text-sm text-[#033958] hover:text-white hover:bg-[#033958] font-bold rounded-xl transition-all border border-[#033958]"
            >
              Today
            </button>
            <button 
              type="button" 
              @click.stop="clearDateValue" 
              class="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-800 font-semibold hover:bg-gray-100 rounded-xl transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- Time Picker -->
    <Transition name="picker-fade">
      <div 
        v-if="showTimePicker"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        @click="closeTimePicker"
      >
        <div 
          class="bg-white rounded-3xl shadow-sm border border-gray-50 w-full max-w-sm overflow-hidden transform"
          @click.stop
        >
          <div class="bg-gradient-to-br from-[#033958] to-[#055a8c] p-4 text-white">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xl font-bold">Select Time</h3>
              <button 
                type="button" 
                @click.stop="closeTimePicker"
                class="p-2 hover:bg-white/20 rounded-full transition-all"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <p class="text-white/80 text-2xl font-mono">
              {{ selectedHour }}:{{ selectedMinute }} {{ selectedPeriod }}
            </p>
          </div>
          
          <div class="p-5">
            <div class="flex items-center justify-center gap-6 mb-8">
              <div class="flex flex-col items-center">
                <button type="button" @click.stop="incHour" class="p-3 hover:bg-gray-100 rounded-xl mb-3 transition-all group">
                  <ChevronUp :size="20" stroke-width="3" class="group-hover:scale-110 transition-transform" />
                </button>
                <input 
                  type="text" 
                  v-model="selectedHour" 
                  @blur="valHour" 
                  @focus="$event.target.select()" 
                  @click.stop 
                  maxlength="2"
                  class="w-20 text-center text-4xl font-bold border border-gray-25 focus:border-[#033958] rounded-2xl py-4 focus:outline-none focus:ring-4 focus:ring-[#033958]/20 transition-all bg-gray-50"
                />
                <button type="button" @click.stop="decHour" class="p-3 hover:bg-gray-100 rounded-xl mt-3 transition-all group">
                  <ChevronDown :size="20" stroke-width="3" class="group-hover:scale-110 transition-transform" />
                </button>
              </div>
              
              <span class="text-5xl font-bold text-gray-300 select-none">:</span>
              
              <div class="flex flex-col items-center">
                <button type="button" @click.stop="incMin" class="p-3 hover:bg-gray-100 rounded-xl mb-3 transition-all group">
                  <ChevronUp :size="20" stroke-width="3" class="group-hover:scale-110 transition-transform" />
                </button>
                <input 
                  type="text" 
                  v-model="selectedMinute" 
                  @blur="valMin" 
                  @focus="$event.target.select()" 
                  @click.stop 
                  maxlength="2"
                  class="w-20 text-center text-4xl font-bold border border-gray-25 focus:border-[#033958] rounded-2xl py-4 focus:outline-none focus:ring-4 focus:ring-[#033958]/20 transition-all bg-gray-50"
                />
                <button type="button" @click.stop="decMin" class="p-3 hover:bg-gray-100 rounded-xl mt-3 transition-all group">
                  <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" class="group-hover:scale-110 transition-transform">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="flex gap-3">
              <button 
                type="button" 
                @click.stop="setPeriod('AM')"
                :class="[
                  'flex-1 px-4 py-4 text-lg font-bold rounded-2xl transition-all transform',
                  selectedPeriod === 'AM' 
                    ? 'bg-[#033958] text-white shadow-sm border border-gray-50 scale-105' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                AM
              </button>
              <button 
                type="button" 
                @click.stop="setPeriod('PM')"
                :class="[
                  'flex-1 px-4 py-4 text-lg font-bold rounded-2xl transition-all transform',
                  selectedPeriod === 'PM' 
                    ? 'bg-[#033958] text-white shadow-sm border border-gray-50 scale-105' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                PM
              </button>
            </div>
          </div>
          
          <div class="px-4 pb-6 flex justify-between border-t pt-4">
            <button 
              type="button" 
              @click.stop="setNow"
              class="px-5 py-2.5 text-sm text-[#033958] hover:text-white hover:bg-[#033958] font-bold rounded-xl transition-all border border-[#033958]"
            >
              Now
            </button>
            <div class="flex gap-3">
              <button 
                type="button" 
                @click.stop="clearTimeValue"
                class="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-800 font-semibold hover:bg-gray-100 rounded-xl transition-all"
              >
                Clear
              </button>
              <button 
                type="button" 
                @click.stop="confirmTimeValue"
                class="px-4 py-2.5 text-sm text-white bg-[#033958] hover:bg-[#022f42] rounded-xl font-bold shadow-sm border border-gray-50 hover:shadow-sm border border-gray-50 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- DateTime Picker - Simplified for brevity, combines date + time -->
    <Transition name="picker-fade">
      <div 
        v-if="showDateTimePicker"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
        @click="closeDateTimePicker"
      >
        <div 
          class="bg-white rounded-3xl shadow-sm border border-gray-50 w-full max-w-4xl my-8 overflow-hidden transform"
          @click.stop
        >
          <div class="bg-gradient-to-br from-[#033958] to-[#055a8c] p-4 text-white">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-2xl font-bold">Select Date & Time</h3>
              <button 
                type="button" 
                @click.stop="closeDateTimePicker"
                class="p-2 hover:bg-white/20 rounded-full transition-all"
              >
                <X :size="22" stroke-width="2.5" />
              </button>
            </div>
            <p class="text-white/80">
              {{ dtSelectedDate ? `${formatDateDisplay(dtSelectedDate)} • ${selectedHour}:${selectedMinute} ${selectedPeriod}` : 'No date & time selected' }}
            </p>
          </div>
          
          <div class="p-4 md:p-5 grid md:grid-cols-2 gap-8">
            <div>
              <h4 class="text-lg font-bold mb-4 flex items-center gap-2">
                <span class="p-2 bg-[#033958]/10 rounded-lg">📅</span> DATE
              </h4>
              
              <div class="flex items-center justify-between mb-4">
                <button type="button" @click.stop="prevMonth" class="p-2 hover:bg-gray-100 rounded-xl">
                  <ChevronLeft :size="18" stroke-width="2.5" />
                </button>
                <div class="flex gap-2">
                  <select v-model="currentMonth" @click.stop class="px-3 py-2 bg-gray-50 border border-transparent hover:border-[#033958] rounded-xl font-bold text-base">
                    <option v-for="(m, i) in months" :key="i" :value="i">{{ m.slice(0,3) }}</option>
                  </select>
                  <select v-model="currentYear" @click.stop class="px-3 py-2 bg-gray-50 border border-transparent hover:border-[#033958] rounded-xl font-bold text-base">
                    <option v-for="y in yearRange" :key="y" :value="y">{{ y }}</option>
                  </select>
                </div>
                <button type="button" @click.stop="nextMonth" class="p-2 hover:bg-gray-100 rounded-xl">
                  <ChevronRight :size="18" stroke-width="2.5" />
                </button>
              </div>
              
              <div class="grid grid-cols-7 gap-1 mb-2">
                <div v-for="d in weekDays" :key="d" class="text-center text-sm font-bold text-gray-500 py-1">{{ d }}</div>
              </div>
              <div class="grid grid-cols-7 gap-1 mb-4">
                <button 
                  v-for="(day, i) in dtCalendarDays" 
                  :key="i" 
                  type="button" 
                  :disabled="!day.isCurrentMonth"
                  :class="getDTDayClass(day)"
                  @click.stop="selectDTDay(day)"
                >
                  {{ day.date }}
                </button>
              </div>
            </div>
            
            <div>
              <h4 class="text-lg font-bold mb-4 flex items-center gap-2">
                <span class="p-2 bg-[#033958]/10 rounded-lg">🕐</span> TIME
              </h4>
              
              <div class="flex items-center justify-center gap-4 mb-6">
                <div class="flex flex-col items-center">
                  <button type="button" @click.stop="incHour" class="p-2 hover:bg-gray-100 rounded-lg mb-2">
                    <ChevronUp :size="16" stroke-width="2.5" />
                  </button>
                  <input 
                    type="text" 
                    v-model="selectedHour" 
                    @blur="valHour" 
                    @focus="$event.target.select()" 
                    @click.stop 
                    maxlength="2"
                    class="w-16 text-center text-3xl font-bold border border-gray-25 focus:border-[#033958] rounded-xl py-3 focus:outline-none bg-gray-50"
                  />
                  <button type="button" @click.stop="decHour" class="p-2 hover:bg-gray-100 rounded-lg mt-2">
                    <ChevronDown :size="16" stroke-width="2.5" />
                  </button>
                </div>
                <span class="text-4xl font-bold text-gray-300">:</span>
                <div class="flex flex-col items-center">
                  <button type="button" @click.stop="incMin" class="p-2 hover:bg-gray-100 rounded-lg mb-2">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path d="M18 15l-6-6-6 6"/>
                    </svg>
                  </button>
                  <input 
                    type="text" 
                    v-model="selectedMinute" 
                    @blur="valMin" 
                    @focus="$event.target.select()" 
                    @click.stop 
                    maxlength="2"
                    class="w-16 text-center text-3xl font-bold border border-gray-25 focus:border-[#033958] rounded-xl py-3 focus:outline-none bg-gray-50"
                  />
                  <button type="button" @click.stop="decMin" class="p-2 hover:bg-gray-100 rounded-lg mt-2">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="flex gap-2">
                <button 
                  type="button" 
                  @click.stop="setPeriod('AM')"
                  :class="['flex-1 px-4 py-3 text-base font-bold rounded-xl transition-all', selectedPeriod === 'AM' ? 'bg-[#033958] text-white shadow-sm border border-gray-50' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
                >
                  AM
                </button>
                <button 
                  type="button" 
                  @click.stop="setPeriod('PM')"
                  :class="['flex-1 px-4 py-3 text-base font-bold rounded-xl transition-all', selectedPeriod === 'PM' ? 'bg-[#033958] text-white shadow-sm border border-gray-50' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
                >
                  PM
                </button>
              </div>
            </div>
          </div>
          
          <div class="px-4 pb-6 flex justify-between border-t pt-4">
            <button 
              type="button" 
              @click.stop="setDTNow"
              class="px-5 py-2.5 text-sm text-[#033958] hover:text-white hover:bg-[#033958] font-bold rounded-xl transition-all border border-[#033958]"
            >
              Now
            </button>
            <div class="flex gap-3">
              <button 
                type="button" 
                @click.stop="clearDTValue"
                class="px-5 py-2.5 text-sm text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-all"
              >
                Clear
              </button>
              <button 
                type="button" 
                @click.stop="confirmDTValue"
                class="px-4 py-2.5 text-sm text-white bg-[#033958] hover:bg-[#022f42] rounded-xl font-bold shadow-sm border border-gray-50 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, useId, watch } from 'vue'
import { Eye, EyeOff, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, X } from 'lucide-vue-next'

interface Props {
  modelValue?: string | number
  label: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number' | 'date' | 'time' | 'datetime-local' | 'textarea'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  autocomplete?: string
  errorMessage?: string
  showError?: boolean
  position?: 'top' | 'middle' | 'bottom' | 'standalone'
  hasError?: boolean
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  autocomplete: 'off',
  errorMessage: '',
  showError: true,
  position: 'standalone',
  hasError: false,
  rows: 4
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

const isFocused = ref(false)
const showPassword = ref(false)
const showDatePicker = ref(false)
const showTimePicker = ref(false)
const showDateTimePicker = ref(false)
const inputId = useId()
const inputRef = ref<HTMLInputElement | null>(null)

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const selectedDate = ref<Date | null>(null)
const dtSelectedDate = ref<Date | null>(null)

const selectedHour = ref('12')
const selectedMinute = ref('00')
const selectedPeriod = ref<'AM' | 'PM'>('PM')

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const computedType = computed(() => {
  if (props.type === 'password') return showPassword.value ? 'text' : 'password'
  if (props.type === 'date' || props.type === 'time' || props.type === 'datetime-local') return 'text'
  return props.type
})

const displayValue = computed(() => {
  if (props.type === 'date' && props.modelValue) return formatDateDisplay(new Date(props.modelValue as string))
  if (props.type === 'time' && props.modelValue) return props.modelValue
  if (props.type === 'datetime-local' && props.modelValue) {
    const parsed = parseDTString(props.modelValue as string)
    return parsed ? `${formatDateDisplay(parsed.date)} • ${parsed.hour}:${parsed.minute} ${parsed.period}` : props.modelValue
  }
  return props.modelValue
})

const roundedClasses = computed(() => {
  switch (props.position) {
    case 'top': return 'rounded-t-xl rounded-b-sm'
    case 'middle': return 'rounded-sm'
    case 'bottom': return 'rounded-b-xl rounded-t-sm'
    default: return 'rounded-xl'
  }
})

const yearRange = computed(() => {
  const current = new Date().getFullYear()
  return Array.from({ length: 111 }, (_, i) => current - 100 + i)
})

interface CalendarDay {
  date: number
  fullDate: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
}

const calendarDays = computed<CalendarDay[]>(() => {
  return generateCalendar(selectedDate.value)
})

const dtCalendarDays = computed<CalendarDay[]>(() => {
  return generateCalendar(dtSelectedDate.value)
})

function generateCalendar(compareDate: Date | null): CalendarDay[] {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const prevLastDay = new Date(currentYear.value, currentMonth.value, 0)
  const firstDayOfWeek = firstDay.getDay()
  const days: CalendarDay[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = prevLastDay.getDate() - i
    const fullDate = new Date(currentYear.value, currentMonth.value - 1, date)
    fullDate.setHours(0, 0, 0, 0)
    days.push({
      date,
      fullDate,
      isCurrentMonth: false,
      isToday: fullDate.getTime() === today.getTime(),
      isSelected: compareDate ? fullDate.getTime() === compareDate.getTime() : false
    })
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const fullDate = new Date(currentYear.value, currentMonth.value, i)
    fullDate.setHours(0, 0, 0, 0)
    days.push({
      date: i,
      fullDate,
      isCurrentMonth: true,
      isToday: fullDate.getTime() === today.getTime(),
      isSelected: compareDate ? fullDate.getTime() === compareDate.getTime() : false
    })
  }
  
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const fullDate = new Date(currentYear.value, currentMonth.value + 1, i)
    fullDate.setHours(0, 0, 0, 0)
    days.push({
      date: i,
      fullDate,
      isCurrentMonth: false,
      isToday: fullDate.getTime() === today.getTime(),
      isSelected: compareDate ? fullDate.getTime() === compareDate.getTime() : false
    })
  }
  
  return days
}

function getDayClass(day: CalendarDay) {
  return [
    'aspect-square p-2 text-sm font-semibold rounded-xl transition-all relative',
    day.isCurrentMonth ? 'hover:bg-gray-100 hover:scale-105 cursor-pointer' : 'text-gray-300 opacity-40 cursor-not-allowed',
    day.isToday && !day.isSelected ? 'bg-blue-50 text-[#033958] ring-2 ring-[#033958] ring-inset font-bold' : '',
    day.isSelected ? 'bg-[#033958] text-white shadow-sm border border-gray-50 scale-105' : ''
  ]
}

function getDTDayClass(day: CalendarDay) {
  return [
    'aspect-square p-2 text-sm font-medium rounded-lg transition-all',
    day.isCurrentMonth ? 'hover:bg-gray-100 cursor-pointer' : 'text-gray-300 opacity-30 cursor-not-allowed',
    day.isToday && !day.isSelected ? 'border border-[#033958] text-[#033958] font-bold' : '',
    day.isSelected ? 'bg-[#033958] text-white shadow-sm border border-gray-50' : ''
  ]
}

const handleInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

const handleFocus = (e: FocusEvent) => {
  isFocused.value = true
  emit('focus', e)
}

const handleBlur = (e: FocusEvent) => {
  isFocused.value = false
  emit('blur', e)
}

const handleInputClick = () => {
  if (props.type === 'date') showDatePicker.value = true
  else if (props.type === 'time') showTimePicker.value = true
  else if (props.type === 'datetime-local') showDateTimePicker.value = true
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const selectDay = (day: CalendarDay) => {
  if (!day.isCurrentMonth) return
  selectedDate.value = day.fullDate
  emit('update:modelValue', formatDateModel(day.fullDate))
  setTimeout(() => {
    showDatePicker.value = false
  }, 150)
}

const selectDTDay = (day: CalendarDay) => {
  if (!day.isCurrentMonth) return
  dtSelectedDate.value = day.fullDate
}

const setToday = () => {
  const today = new Date()
  emit('update:modelValue', formatDateModel(today))
  showDatePicker.value = false
}

const clearDateValue = () => {
  emit('update:modelValue', '')
  selectedDate.value = null
  showDatePicker.value = false
}

const closeDatePicker = () => {
  showDatePicker.value = false
}

const incHour = () => {
  let h = parseInt(selectedHour.value)
  h = h === 12 ? 1 : h + 1
  selectedHour.value = String(h).padStart(2, '0')
}

const decHour = () => {
  let h = parseInt(selectedHour.value)
  h = h === 1 ? 12 : h - 1
  selectedHour.value = String(h).padStart(2, '0')
}

const incMin = () => {
  let m = parseInt(selectedMinute.value)
  m = (m + 1) % 60
  selectedMinute.value = String(m).padStart(2, '0')
}

const decMin = () => {
  let m = parseInt(selectedMinute.value)
  m = m === 0 ? 59 : m - 1
  selectedMinute.value = String(m).padStart(2, '0')
}

const valHour = () => {
  let h = parseInt(selectedHour.value)
  if (isNaN(h) || h < 1 || h > 12) h = 12
  selectedHour.value = String(h).padStart(2, '0')
}

const valMin = () => {
  let m = parseInt(selectedMinute.value)
  if (isNaN(m) || m < 0 || m > 59) m = 0
  selectedMinute.value = String(m).padStart(2, '0')
}

const setPeriod = (p: 'AM' | 'PM') => {
  selectedPeriod.value = p
}

const setNow = () => {
  const now = new Date()
  let h = now.getHours()
  selectedPeriod.value = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  selectedHour.value = String(h).padStart(2, '0')
  selectedMinute.value = String(now.getMinutes()).padStart(2, '0')
}

const clearTimeValue = () => {
  emit('update:modelValue', '')
  showTimePicker.value = false
}

const confirmTimeValue = () => {
  const timeStr = `${selectedHour.value}:${selectedMinute.value} ${selectedPeriod.value}`
  emit('update:modelValue', timeStr)
  showTimePicker.value = false
}

const closeTimePicker = () => {
  showTimePicker.value = false
}

const setDTNow = () => {
  const now = new Date()
  dtSelectedDate.value = now
  currentMonth.value = now.getMonth()
  currentYear.value = now.getFullYear()
  let h = now.getHours()
  selectedPeriod.value = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  selectedHour.value = String(h).padStart(2, '0')
  selectedMinute.value = String(now.getMinutes()).padStart(2, '0')
}

const clearDTValue = () => {
  emit('update:modelValue', '')
  dtSelectedDate.value = null
  showDateTimePicker.value = false
}

const confirmDTValue = () => {
  if (!dtSelectedDate.value) dtSelectedDate.value = new Date()
  const dateStr = formatDateDisplay(dtSelectedDate.value)
  const dtStr = `${dateStr}, ${selectedHour.value}:${selectedMinute.value} ${selectedPeriod.value}`
  emit('update:modelValue', dtStr)
  showDateTimePicker.value = false
}

const closeDateTimePicker = () => {
  showDateTimePicker.value = false
}

const formatDateDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatDateModel = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const parseDTString = (dtStr: string) => {
  const parts = dtStr.split(',').map(p => p.trim())
  if (parts.length >= 3) {
    const datePart = `${parts[0]}, ${parts[1]}, ${parts[2]}`
    const date = new Date(datePart)
    const timePart = parts[3] || '12:00 PM'
    const match = timePart.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    if (match && !isNaN(date.getTime())) {
      return {
        date,
        hour: match[1].padStart(2, '0'),
        minute: match[2],
        period: match[3].toUpperCase() as 'AM' | 'PM'
      }
    }
  }
  return null
}

watch(() => props.modelValue, (val) => {
  if (props.type === 'date' && val) {
    selectedDate.value = new Date(val as string)
  } else if (props.type === 'time' && val) {
    const match = (val as string).match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    if (match) {
      selectedHour.value = match[1].padStart(2, '0')
      selectedMinute.value = match[2]
      selectedPeriod.value = match[3].toUpperCase() as 'AM' | 'PM'
    }
  } else if (props.type === 'datetime-local' && val) {
    const parsed = parseDTString(val as string)
    if (parsed) {
      dtSelectedDate.value = parsed.date
      selectedHour.value = parsed.hour
      selectedMinute.value = parsed.minute
      selectedPeriod.value = parsed.period
    }
  }
}, { immediate: true })

watch(showDatePicker, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
    if (props.modelValue) {
      const date = new Date(props.modelValue as string)
      currentMonth.value = date.getMonth()
      currentYear.value = date.getFullYear()
    }
  } else {
    document.body.style.overflow = ''
  }
})

watch(showTimePicker, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

watch(showDateTimePicker, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-4px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-2px);
  opacity: 0;
}

.picker-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.picker-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.picker-fade-enter-from {
  opacity: 0;
}

.picker-fade-enter-from > div {
  transform: scale(0.95) translateY(20px);
}

.picker-fade-leave-to {
  opacity: 0;
}

.picker-fade-leave-to > div {
  transform: scale(0.98) translateY(-10px);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
}

input[type="text"]::-webkit-inner-spin-button,
input[type="text"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

select {
  cursor: pointer;
}

select::-ms-expand {
  display: none;
}
</style>