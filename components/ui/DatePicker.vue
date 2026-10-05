<template>
  <div class="relative w-full">
    <VueDatePicker
      v-model="model"
      :enable-time-picker="enableTime"
      :format="format"
      :placeholder="placeholder"
      :range="range"
      :min-date="minDate"
      :max-date="maxDate"
      auto-apply
      :teleport="true"
      class="custom-datepicker"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps({
  modelValue: {
    type: [Date, String, Array],
    default: null
  },
  enableTime: {
    type: Boolean,
    default: false
  },
  format: {
    type: String,
    default: 'dd/MM/yyyy'
  },
  placeholder: {
    type: String,
    default: 'Select Date'
  },
  range: {
    type: Boolean,
    default: false
  },
  minDate: {
    type: [Date, String],
    default: null
  },
  maxDate: {
    type: [Date, String],
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style>
/* We override some default variables for a better fit */
:root {
  --dp-font-family: inherit;
  --dp-border-radius: 8px;
  --dp-border-color: #E5E7EB;
  --dp-border-color-hover: #D1D5DB;
  --dp-primary-color: #FF5C1A;
  --dp-primary-text-color: #fff;
}
.custom-datepicker .dp__input {
  /* Using standard font sizes and padding matching our other inputs */
  padding-left: 2rem;
  padding-right: 0.75rem;
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  font-size: 0.75rem; /* text-xs */
  line-height: 1rem;
  border-width: 1px;
  border-color: #f0f0f0; /* gray-25 or similar */
  border-radius: 0.5rem;
  background-color: #ffffff;
  color: #374151; /* gray-700 */
  font-weight: 500;
  box-shadow: none;
}
.custom-datepicker .dp__input:focus {
  outline: none;
  box-shadow: 0 0 0 1px #D1D5DB;
}
.custom-datepicker .dp__input_icon {
  color: #9CA3AF;
  width: 1rem;
  height: 1rem;
  left: 0.5rem;
}
</style>
