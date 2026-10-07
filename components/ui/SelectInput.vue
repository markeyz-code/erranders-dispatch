<template>
    <div class="mb-2">
      <div class="relative input-container" ref="containerRef">
        <!-- Floating Label -->
        <label
          :for="inputId"
          :class="[
            'absolute transition-all duration-300 ease-in-out pointer-events-none z-10',
            isFocused || modelValue ? 'text-sm text-gray-500 left-3 top-2' : 'text-base text-gray-500 left-3 top-1/2 transform -translate-y-1/2'
          ]"
        >
          {{ label }}
        </label>
  
        <!-- Select trigger -->
        <div
          @click="toggleDropdown"
          :class="[
            'w-full py-4 pt-6 px-3 bg-[#1A1A1B09] border-[0.5px] border-transparent flex justify-between items-center cursor-pointer',
            'focus:outline-none focus:ring-1 focus:ring-[#3BAB22] focus:border-[#3BAB22] transition-all duration-300',
            roundedClasses,
            disabled ? 'opacity-50 cursor-not-allowed' : '',
            (hasError || (errorMessage && showError)) ? 'ring-1 ring-red-500 border-red-500' : ''
          ]"
        >
          <span class="text-[#1A1A1B]">
            <!-- Custom selected label slot -->
            <slot 
              v-if="slots['selected-label'] && selectedOption" 
              name="selected-label" 
              :option="selectedOption"
            />
            <!-- Default selected label -->
            <template v-else>
              {{ selectedLabel || placeholder }}
            </template>
          </span>
          <ChevronDown
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'transform rotate-180': showDropdown }"
          />
        </div>
  
        <!-- Dropdown -->
        <div
          v-if="showDropdown"
          class="absolute z-20 mt-1 w-full bg-white shadow-sm border border-gray-50 rounded-md overflow-hidden"
        >
          <!-- Search Input -->
          <div class="p-2 border-b-[0.5px] border-gray-50 sticky top-0 bg-white">
            <div class="relative">
              <Search 
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
              />
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="Search..."
                class="w-full pl-9 pr-3 py-3 border-[0.5px] border-gray-300 rounded-lg focus:border-[0.5px] focus:border-[#3BAB22] outline-none text-base"
                @click.stop
              />
            </div>
          </div>
          
          <!-- Options List -->
          <div class="max-h-48 overflow-y-auto">
            <div
              v-for="(option, index) in filteredOptions"
              :key="index"
              @click="selectOption(option)"
              class="p-3 font-medium hover:bg-gray-25 m-1 rounded-lg cursor-pointer transition-colors text-sm text-[#1A1A1B]"
            >
              <!-- Custom option slot -->
              <slot v-if="slots.default" :option="option" :index="index" />
              <!-- Default option display -->
              <template v-else>
                {{ getLabel(option) }}
              </template>
            </div>
            
            <!-- No results message -->
            <div 
              v-if="filteredOptions.length === 0" 
              class="p-4 text-center text-sm text-gray-500"
            >
              No results found for "{{ searchQuery }}"
            </div>
          </div>
        </div>
      </div>
  
      <!-- Error message -->
      <div v-if="errorMessage && showError" class="mt-2 flex items-center text-red-600 text-sm">
        <AlertCircle class="mr-2 w-4 h-4" />
        {{ errorMessage }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, useId, onMounted, onUnmounted, nextTick } from 'vue'
  import { ChevronDown, Search, AlertCircle } from 'lucide-vue-next'
  
  // Props
  interface Props {
    modelValue?: string | number
    label: string
    options?: Array<string | { label?: string, value?: string, name?: string, code?: string, [key: string]: any }>
    placeholder?: string
    disabled?: boolean
    errorMessage?: string
    showError?: boolean
    hasError?: boolean
    position?: 'top' | 'middle' | 'bottom' | 'standalone'
  }
  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    options: () => [],
    placeholder: '',
    disabled: false,
    errorMessage: '',
    showError: true,
    hasError: false,
    position: 'standalone'
  })
  
  // Slots
  const slots = defineSlots<{
    default?: (props: { option: any, index: number }) => any
    'selected-label'?: (props: { option: any }) => any
  }>()
  
  // Emits
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
  }>()
  
  // Refs
  const showDropdown = ref(false)
  const isFocused = ref(false)
  const containerRef = ref<HTMLElement | null>(null)
  const searchInputRef = ref<HTMLInputElement | null>(null)
  const searchQuery = ref('')
  const inputId = useId()
  
  // Methods
  const toggleDropdown = async () => {
    if (!props.disabled) {
      showDropdown.value = !showDropdown.value
      isFocused.value = true
      
      // Focus search input when dropdown opens
      if (showDropdown.value) {
        await nextTick()
        searchInputRef.value?.focus()
      } else {
        searchQuery.value = ''
      }
    }
  }
  
  const selectOption = (option: any) => {
    // Support multiple formats: string, { value }, { code }, { name }
    let val: string | number
    if (typeof option === 'string') {
      val = option
    } else if (option.value) {
      val = option.value
    } else if (option.code) {
      val = option.code
    } else if (option.name) {
      val = option.name
    } else {
      val = option
    }
    
    emit('update:modelValue', val)
    showDropdown.value = false
    isFocused.value = false
    searchQuery.value = ''
  }
  
  const getLabel = (option: any): string => {
    if (typeof option === 'string') return option
    // Support multiple label formats
    return option.label || option.name || option.value || option.code || String(option)
  }
  
  const getValue = (option: any): string | number => {
    if (typeof option === 'string') return option
    return option.value || option.code || option.name || option
  }
  
  const selectedLabel = computed(() => {
    const found = props.options.find((opt) => {
      const optValue = getValue(opt)
      return optValue === props.modelValue
    })
    return found ? getLabel(found) : ''
  })
  
  const selectedOption = computed(() => {
    return props.options.find((opt) => {
      const optValue = getValue(opt)
      return optValue === props.modelValue
    })
  })
  
  // Filter options based on search query
  const filteredOptions = computed(() => {
    if (!searchQuery.value.trim()) {
      return props.options
    }
    
    const query = searchQuery.value.toLowerCase()
    return props.options.filter((option) => {
      const label = getLabel(option).toLowerCase()
      return label.includes(query)
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
  
  // Click outside handler
  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
      showDropdown.value = false
      isFocused.value = false
      searchQuery.value = ''
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  </script>
  
  <style scoped>
  .input-container {
    position: relative;
  }
  </style>