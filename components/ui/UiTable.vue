<template>
 <div class="bg-white rounded-[2rem] overflow-hidden flex flex-col min-h-[400px] border border-gray-100">
 <!-- Table Body -->
 <div class="overflow-x-auto hide-scrollbar">
 <table class="w-full text-left border-collapse">
 <thead class="bg-gray-50/30 sticky top-0 z-10">
 <tr class="border-b border-gray-50/50">
 <th 
 v-for="col in columns" 
 :key="col.key" 
 class="px-5 py-5 text-[9px] font-medium text-gray-400 tracking-widest whitespace-nowrap"
 :class="col.class"
 >
 {{ col.label }}
 </th>
 <th v-if="hasActions" class="px-5 py-5 text-[9px] font-medium text-gray-400 tracking-widest text-right">Actions</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-gray-50">
 <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
 <td v-for="col in (hasActions ? columns.length + 1 : columns.length)" :key="col" class="px-5 py-4">
 <div class="h-4 bg-gray-50 rounded-lg w-full"></div>
 </td>
 </tr>
 
 <tr v-else-if="items.length === 0">
 <td :colspan="hasActions ? columns.length + 1 : columns.length" class="px-5 py-32 text-center">
 <div class="flex flex-col items-center justify-center max-w-xs mx-auto text-center">
 <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
 <component :is="emptyIcon || 'Inbox'" class="w-8 h-8 text-gray-200" />
 </div>
 <h4 class="font-medium text-gray-900 text-lg tracking-tight ">{{ emptyTitle || 'No items found' }}</h4>
 <p class="text-gray-400 text-[11px] mt-2 font-bold tracking-widest leading-relaxed">{{ emptySubtitle || 'Wait for data or try adjusting your filters.' }}</p>
 </div>
 </td>
 </tr>

 <tr 
 v-else 
 v-for="(item, idx) in items" 
 :key="item._id || idx" 
 class="hover:bg-gray-50/80 transition-all group border-b border-gray-50/30 last:border-0 cursor-pointer"
 @click="$emit('rowClick', item)"
 >
 <td 
 v-for="col in columns" 
 :key="col.key" 
 class="px-5 py-4 text-sm font-medium text-gray-700 whitespace-nowrap"
 :class="col.class"
 >
 <slot :name="col.key" :item="item" :index="idx">
 {{ item[col.key] }}
 </slot>
 </td>
 <td v-if="hasActions" class="px-5 py-4 text-right whitespace-nowrap">
 <slot name="actions" :item="item" :index="idx"></slot>
 </td>
 </tr>
 </tbody>
 </table>
 </div>

 <!-- Optional Footer -->
 <div v-if="showFooter" class="p-5 border-t border-gray-50/50 bg-gray-50/20 flex items-center justify-between">
 <slot name="footer"></slot>
 </div>
 </div>
</template>

<script setup lang="ts">
import { Inbox } from 'lucide-vue-next';

interface Column {
 key: string;
 label: string;
 class?: string;
}

defineProps<{
 columns: Column[];
 items: any[];
 loading?: boolean;
 hasActions?: boolean;
 showFooter?: boolean;
 emptyTitle?: string;
 emptySubtitle?: string;
 emptyIcon?: any;
}>();

defineEmits(['rowClick']);
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
 display: none;
}
.hide-scrollbar {
 -ms-overflow-style: none;
 scrollbar-width: none;
}
</style>
