<script setup lang="ts">
import { defineProps, defineEmits, computed} from "vue";
interface PhoneInputWithLabelProps {
  label: string;
  modelValue: string;
  error?: string;
  placeholder?: string;
}

// Define props with TypeScript interface
const props = defineProps<PhoneInputWithLabelProps>();

// Define emits for v-model functionality
const emit = defineEmits(['update:modelValue']);

// Format inputted phone number
const formatPhoneNumber = (phone: string): string => {
    // Strip all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
  
    // Get the first 10 digits, eventhough the limit was implemented in the form
    const numbers = cleaned.substring(0, 10);
  
    // If empty, return empty string
    if (!numbers) return '';
  
    // Format according to length, to be (XXX) XXX-XXXX
    if (numbers.length < 4) return numbers;
    if (numbers.length < 7) {
        return `(${numbers.substring(0, 3)}) ${numbers.substring(3)}`;
    }
    return `(${numbers.substring(0, 3)}) ${numbers.substring(3, 6)}-${numbers.substring(6, 10)}`;
};

// Computed property for formatted display
const formattedPhone = computed(() => {
    return formatPhoneNumber(props.modelValue);
});

// Handle input changes and clean it up
const handlePhoneInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/\D/g, '').substring(0, 10);
    emit('update:modelValue', cleaned);
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
            :value="formattedPhone"
            @input="handlePhoneInput"
            :placeholder="placeholder"
            type="text"
            class="w-full px-2"
            maxLength="14"
            >
        </div>
        <div
            class="pl-7 text-sm text-red-500 block min-h-20"
        >
            {{ error ? error : '\u00A0' }}
        </div>
    </div>
        
</template>