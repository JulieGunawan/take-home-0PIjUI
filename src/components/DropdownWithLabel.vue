<script setup lang="ts">
import { defineProps, defineEmits} from "vue";
interface DropdownWithLabelProps {
  label: string;
  optionValues: string[];
  modelValue: string;
  error?: string;
  placeholder?: string;
}

defineProps<DropdownWithLabelProps>();
// Define emits for v-model functionality
const emit = defineEmits(['update:modelValue']);


// Handle input changes
const handleInput = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};

</script>

<template>
     <div class="flex flex-col gap-1 bg-gray-200 pt-7 pb-2 px-2">
        <div class="flex flex-col md:flex-row w-full rounded gap-2">
            <label
            class="pr-2 md:px-2 whitespace-nowrap"
            placeholder="Company Name"
            > 
                <span
                    v-if="error"
                    class="text-red-500"
                >*</span> 
                {{ label }}:
            </label>
            <!-- Due to the data available, these options don't seem to be applied  -->
            <select
            :value="modelValue" 
            @input="handleInput"
            class="w-full px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            :placeholder="placeholder"
            >
                <option v-for="(option, index) in optionValues" :key="`option - ${index}`"  :value="option">
                    {{ option.split(' ')[0] }}
                </option>
            </select> 
        </div>
        <div
            class="text-sm text-red-500 pl-2 "
        >
            {{ error ? error : '\u00A0' }} 
        </div>
    </div>
</template>