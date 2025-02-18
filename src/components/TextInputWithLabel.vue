<script setup lang="ts">
import { defineProps, defineEmits} from "vue";
interface InputTextWithLabelProps {
  label: string;
  modelValue: string;
  error?: string;
  placeholder?: string;
}

// Define props with TypeScript interface
defineProps<InputTextWithLabelProps>();

// Define emits for v-model functionality
const emit = defineEmits(['update:modelValue']);

// Handle input changes
const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="flex flex-col gap-1 bg-gray-200 pt-7 pb-2 px-2">
    <div class="flex flex-col md:flex-row w-full rounded gap-2">
      <label class="pr-2 md:px-2 whitespace-nowrap">
        <span
          v-if="error"
          class="text-red-500"
        >*</span>
        {{ label }}:
      </label>
         <input
        :value="modelValue"
        @input="handleInput"
        type="text"
        class="w-full px-2"
        :placeholder="placeholder"
       />
    </div>
    <div class="text-sm text-red-500 pl-2">
      {{ error ? error : '\u00A0' }}
    </div>
  </div>
</template>