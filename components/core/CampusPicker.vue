<template>
  <Transition name="campus-picker" appear>
    <div
      ref="dialogEl"
      class="fixed inset-0 z-[1500000] flex flex-col overflow-hidden bg-[#FAF8F5]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dispatch-campus-picker-title"
      tabindex="-1"
      @keydown="onKeydown"
    >
      <!-- Decorative brand wash -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -right-24 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#FF5C1A]/10 blur-3xl"></div>
        <div class="absolute -bottom-40 -left-24 h-[30rem] w-[30rem] rounded-full bg-[#FF5C1A]/5 blur-3xl"></div>
      </div>

      <!-- Header row -->
      <header class="relative shrink-0 px-5 pt-6 sm:px-8 sm:pt-8">
        <div class="mx-auto flex w-full max-w-3xl items-center justify-between">
          <img
            src="@/assets/img/logo-light.png"
            alt="Erranders"
            class="h-8 w-auto rounded-lg border border-[#E7E2DA] bg-white px-2 py-1 sm:h-9"
          />
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#9C968E]">
              {{ institutions.length }} Campuses
            </span>
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              @click="emit('close')"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <!-- Main chooser body -->
      <main class="relative flex-1 overflow-y-auto px-5 sm:px-8">
        <div class="mx-auto w-full max-w-3xl pb-6 pt-6 sm:pt-10">
          <h1
            id="dispatch-campus-picker-title"
            class="text-[25px] font-bold leading-tight tracking-tight text-[#171310] sm:text-3xl"
          >
            Select Your Operating Campus 🥷
          </h1>
          <p class="mt-2 text-[14px] leading-relaxed text-[#6B655E]">
            Pick the campus you are currently active on to view available errands, orders, and delivery pools in this zone.
          </p>

          <!-- Search input -->
          <div class="relative mt-6">
            <Search class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9C968E]" aria-hidden="true" />
            <input
              ref="searchInput"
              v-model="query"
              type="search"
              autocomplete="off"
              class="h-12 w-full rounded-xl border border-[#E7E2DA] bg-white pl-11 pr-4 text-[14px] font-medium text-[#171310] placeholder:text-[#9C968E] focus:border-[#FF5C1A]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20"
              placeholder="Search by school, city, or state (e.g. Lagos, Ibadan, UNILAG)"
              aria-label="Search campuses"
            />
          </div>

          <!-- Category filter tabs -->
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              v-for="cat in categoryTabs"
              :key="cat.id"
              type="button"
              class="rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all"
              :class="activeCategory === cat.id
                ? 'bg-[#171310] text-white shadow-sm'
                : 'bg-white border border-[#E7E2DA] text-[#6B655E] hover:border-[#171310]/30 hover:text-[#171310]'"
              @click="activeCategory = cat.id"
            >
              {{ cat.label }}
            </button>
          </div>

          <!-- Count info -->
          <div class="mt-4 flex items-center justify-between text-[12px] text-[#9C968E]">
            <span>Showing {{ filtered.length }} {{ filtered.length === 1 ? 'campus' : 'campuses' }}</span>
            <span v-if="selected" class="font-bold text-[#FF5C1A]">Selected: {{ selected.shortName || selected.name }}</span>
          </div>

          <!-- Campus list grid -->
          <div
            v-if="filtered.length"
            class="mt-4 grid gap-3 sm:grid-cols-2"
            role="radiogroup"
            aria-labelledby="dispatch-campus-picker-title"
          >
            <button
              v-for="campus in filtered"
              :key="campusKey(campus)"
              type="button"
              role="radio"
              :aria-checked="isSelected(campus)"
              class="group relative w-full rounded-2xl border bg-white p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C1A]/40 sm:p-5"
              :class="isSelected(campus)
                ? 'border-[#FF5C1A] shadow-[0_14px_34px_-16px_rgba(255,92,26,0.55)]'
                : 'border-[#E7E2DA] hover:border-[#171310]/25 hover:shadow-[0_14px_34px_-22px_rgba(23,19,16,0.45)]'"
              @click="select(campus)"
            >
              <span
                class="absolute right-3.5 top-3.5 flex h-5 w-5 items-center justify-center rounded-full border transition-all"
                :class="isSelected(campus)
                  ? 'border-[#FF5C1A] bg-[#FF5C1A] text-white'
                  : 'border-[#E7E2DA] text-transparent group-hover:border-[#171310]/25'"
                aria-hidden="true"
              >
                <Check class="h-3 w-3" />
              </span>

              <div class="flex items-start gap-3">
                <span
                  class="flex h-10 min-w-[2.5rem] shrink-0 items-center justify-center rounded-lg px-2 text-[11px] font-bold uppercase tracking-wide text-white transition-colors"
                  :class="isSelected(campus) ? 'bg-[#FF5C1A]' : 'bg-[#171310]'"
                >
                  {{ campus.shortName || campus.slug }}
                </span>

                <div class="min-w-0 flex-1 pr-6">
                  <p class="text-[14px] font-bold leading-snug text-[#171310]">{{ campus.name }}</p>
                  <p v-if="locationLine(campus)" class="mt-1 truncate text-[12px] text-[#9C968E]">
                    {{ locationLine(campus) }}
                  </p>
                </div>
              </div>
            </button>
          </div>

          <!-- Empty search -->
          <div
            v-else
            class="mt-6 rounded-2xl border border-dashed border-[#E7E2DA] bg-white/70 px-6 py-10 text-center"
          >
            <p class="text-[14px] font-bold text-[#171310]">No campus matches your search</p>
            <p class="mt-1.5 text-[12px] text-[#9C968E]">Try searching by city, state, or institution name.</p>
            <button
              type="button"
              class="mt-4 rounded-lg border border-[#E7E2DA] bg-white px-3.5 py-2 text-[12px] font-bold text-[#171310] transition-all hover:bg-[#171310] hover:text-white"
              @click="query = ''"
            >
              Clear search
            </button>
          </div>
        </div>
      </main>

      <!-- Footer action -->
      <footer class="relative shrink-0 border-t border-[#E7E2DA] bg-white/90 backdrop-blur px-5 sm:px-8">
        <div class="mx-auto flex w-full max-w-3xl flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-[12px] text-[#9C968E]">
            <template v-if="selected">
              Ready to operate in
              <span class="font-bold text-[#171310]">{{ selected.shortName || selected.name }}</span>.
            </template>
            <template v-else>Pick a campus to view its orders and errands.</template>
          </p>

          <div class="flex items-center gap-3">
            <button
              type="button"
              class="rounded-xl px-4 py-3 text-[13px] font-bold text-[#9C968E] hover:text-[#171310]"
              :disabled="isSwitching"
              @click="emit('close')"
            >
              Cancel
            </button>
            <button
              type="button"
              class="h-12 flex-1 rounded-xl bg-[#FF5C1A] px-6 text-[14px] font-bold text-white shadow-[0_12px_28px_-14px_rgba(255,92,26,0.8)] transition-all hover:bg-[#F05214] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#EFEAE3] disabled:text-[#9C968E] sm:flex-none"
              :disabled="!selected || isSwitching"
              @click="onContinue"
            >
              {{ isSwitching ? 'Switching…' : 'Switch Zone' }}
            </button>
          </div>
        </div>
      </footer>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { Check, Search, X } from 'lucide-vue-next'
import type { Institution } from '@/api_factory/modules/institutions'
import { useInstitution } from '@/composables/useInstitution'

const emit = defineEmits<{ (e: 'close'): void }>()

const { institution, institutions, switchInstitution } = useInstitution()

const dialogEl = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)

const query = ref('')
const selected = ref<Institution | null>(null)
const isSwitching = ref(false)

const activeCategory = ref('all')
const categoryTabs = [
  { id: 'all', label: 'All Institutions' },
  { id: 'university', label: 'Universities' },
  { id: 'health_sciences', label: 'Health & Medical' },
  { id: 'polytechnic', label: 'Polytechnics' },
  { id: 'college_of_education', label: 'Colleges of Ed' },
]

const campusKey = (campus: Institution): string => campus._id || campus.slug

const isSelected = (campus: Institution): boolean =>
  !!selected.value && campusKey(selected.value) === campusKey(campus)

const locationLine = (campus: Institution): string =>
  [campus.city, campus.state].filter(Boolean).join(', ') || campus.country || ''

const filtered = computed(() => {
  let list = institutions.value

  if (activeCategory.value !== 'all') {
    list = list.filter((campus: any) => campus.category === activeCategory.value)
  }

  const term = query.value.trim().toLowerCase()
  if (!term) return list

  return list.filter((campus) =>
    [campus.name, campus.shortName, campus.city, campus.state]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(term))
  )
})

const select = (campus: Institution): void => {
  selected.value = campus
}

const onContinue = async (): Promise<void> => {
  const campus = selected.value
  if (!campus || isSwitching.value) return

  isSwitching.value = true
  try {
    await switchInstitution(campus)
  } finally {
    isSwitching.value = false
    emit('close')
  }
}

const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && !isSwitching.value) {
    emit('close')
  }
}

onMounted(() => {
  if (institution.value) selected.value = institution.value
  nextTick(() => searchInput.value?.focus())
})
</script>

<style scoped>
.campus-picker-enter-active,
.campus-picker-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.campus-picker-enter-from,
.campus-picker-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.99);
}
</style>
