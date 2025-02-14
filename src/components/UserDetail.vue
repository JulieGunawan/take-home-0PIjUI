<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { BasicFormData, FormErrors } from '@/types/Form';
import {  BookmarkSquareIcon } from '@heroicons/vue/24/outline';

const userStore = useUserStore();
const {user} = storeToRefs(userStore);
const loading = ref<boolean>(true);
const isCreate = ref<boolean>(false);
const errors = reactive<FormErrors>({});

const formData = reactive<BasicFormData>({
    first_name: '',
    last_name: '',
    company: '',
    email: '',
    plan: '',
    phone_number: ''
})

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
  return formatPhoneNumber(formData.phone_number);
});

// Handle input changes
const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const cleaned = input.value.replace(/\D/g, '').substring(0, 10);
  formData.phone_number = cleaned;
};

const validateForm = () => {
  errors.first_name = !formData.first_name ? 'First name is required' : '';
  errors.last_name = !formData.last_name ? 'Last name is required' : '';
  errors.plan = !formData.plan ? 'Plan is required' : '';
  errors.company = !formData.company ? 'Company is required' : '';
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  errors.email = !formData.email 
    ? 'Email is required' 
    : !emailRegex.test(formData.email) 
    ? 'Invalid email format'
    : '';
  
  // Phone number validation
  const formattedPhoneNumber = formData.phone_number.replace(/\D/g, '');
  errors.phone_number = !formData.phone_number 
    ? 'Phone is required' 
    : formattedPhoneNumber.length < 10 
    ? 'Phone number must be 10 digits'
    : '';
};
  
const isFormValid = computed(() => {
  return Object.values(errors).every((error) => !error);
});

//watch the selected user from the left hand side list
watch(() => user.value, (selectedUser) => {
    if (selectedUser && selectedUser.id!==0) {
        formData.first_name = selectedUser.first_name;
        formData.last_name = selectedUser.last_name;
        formData.company = selectedUser.company;
        formData.email = selectedUser.email;
        formData.plan = selectedUser.plan;
        formData.phone_number = selectedUser.phone_number;
        loading.value = false;
        isCreate.value = false;
    } else {
      formData.first_name = "";
        formData.last_name = "";
        formData.company = "";
        formData.email = "";
        formData.plan = "";
        formData.phone_number = "";
        loading.value = false;
        isCreate.value = true;
    }
    // validateForm();
}, {immediate: true});

// Watch for changes in form data
watch(formData, () => {
  validateForm();
}, { deep: true });

const handleSubmit = async () => {
  validateForm();
  
  // Check if the form doesn't have any errors
  if (Object.values(errors).every(error => !error)) {
    // Check if any user was selected or user value was initialized
    if (user.value) { 
        if (user.value.id) {
            userStore.updateUser(user.value.id, formData);
        } 
        else { 
            //capture the created User then update the state with created user
            const createdUser = await userStore.createNewUser(formData);
            await userStore.fetchUserById(createdUser.id.toString());
        }
    } 
  } 
};
</script>

<template>
  <div class="w-3/4 h-screen bg-gray-300 flex flex-col p-4">
    <div class="bg-white flex flex-col">
      <form class="flex flex-col gap-3">
        <div class="bg-white flex flex-col md:flex-row h-[80%] overflow-hidden p-4 rounded items-center md:items-start text-sm md:text-base xl:text-lg">
          <div
            v-if="!isCreate"
            class="w-full md:w-1/4 md:h-full bg-blue-200 overflow-y-auto"
          >
            <img
              :src="`https://api.dicebear.com/9.x/adventurer/svg?seed=${ formData.first_name }`"
              alt="avatar"
              class="object-fit w-1/2 md:w-full mx-auto md:mx-0" 
            >
          </div>
          <div class="w-full md:w-3/4 bg-blue-50 overflow-y-auto ">
            <div class="flex flex-col gap-1 md:gap-2 p-4 lg:p-6">                     
              <h2
                v-if="!isCreate"
                class=" text-black font-bold  py-1 px-4 align-left w-full"
              >
                {{ formData.first_name }} {{ formData.last_name.charAt(0) }}
              </h2>
              <h2
                v-if="isCreate"
                class=" text-black font-bold  py-1 px-4 align-left w-full"
              >
                Creating New User
              </h2>
              <h3 class="text-gray-500 font-normal py-1 px-4 align-left w-full">
                {{ isCreate ? "- ": "Product Manager" }}
              </h3>
              <h4 class="text-black font-normal py-2 px-4 align-left w-full">
                User Details
              </h4>
              <div class="flex flex-col gap-1 bg-gray-200 pt-7 pb-2 px-2">
                <div class="flex flex-col md:flex-row w-full rounded gap-2">
                  <label
                    class="pr-2 md:px-2 whitespace-nowrap"
                    placeholder="First Name"
                  >
                    <span
                      v-if="errors.first_name"
                      class="text-red-500"
                    >*</span>
                    First Name:
                  </label>
                  <input
                    v-model="formData.first_name"
                    type="text"
                    class="w-full px-2"
                  >
                </div>
                <div
                  class="text-sm text-red-500 pl-2 "
                >
                  {{ errors.first_name ? errors.first_name : '\u00A0' }} 
                </div>
              </div>
              <div class="flex flex-col gap-1 bg-gray-200 pt-7 pb-2 px-2">
                <div class="flex flex-col md:flex-row w-full rounded gap-2">
                  <label
                    class="pr-2 md:px-2 whitespace-nowrap"
                    placeholder="Last Name"
                  > 
                    <span
                      v-if="errors.last_name"
                      class="text-red-500"
                    >*</span> 
                    Last Name:
                  </label>
                  <input
                    v-model="formData.last_name"
                    type="text"
                    class="w-full px-2"
                  >
                </div>
                <div
                  class="text-sm text-red-500 pl-2 "
                >
                  {{ errors.last_name ? errors.last_name : '\u00A0' }} 
                </div>
              </div>
              <div class="flex flex-col gap-1 bg-gray-200 pt-7 pb-2 px-2">
                <div class=" flex flex-col md:flex-row w-full rounded gap-2">
                  <label class="pr-2 md:px-2 whitespace-nowrap">
                    <span
                      v-if="errors.plan"
                      class="text-red-500"
                    >*</span>
                    Plan: 
                  </label>
                  <select
                    v-model="formData.plan" 
                    class="w-full px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                    placeholder="Select Plan"
                  >
                    <!-- Due to the data available, these options  are missing some values  -->
                    <option value="Free Plan">
                      Free
                    </option>
                    <option value="Pro Plan">
                      Pro
                    </option>
                    <option value="Trial">
                      Trial
                    </option>
                  </select>
                </div>
                <div
                  class="text-sm text-red-500 pl-2 "
                >
                  {{ errors.plan ? errors.plan : '\u00A0' }} 
                </div>
              </div>
              <div class="flex flex-col gap-1 bg-gray-200 pt-7 pb-2 px-2">
                <div class="flex flex-col md:flex-row w-full rounded gap-2">
                  <label
                    class="pr-2 md:px-2 whitespace-nowrap"
                    placeholder="Company Name"
                  > 
                    <span
                      v-if="errors.company"
                      class="text-red-500"
                    >*</span> 
                    Company:
                  </label>
                  <!-- Due to the data available, these options don't seem to be applied  -->
                  <select
                    v-model="formData.company" 
                    class="w-full px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Select Company"
                  >
                    <option value="Axiomworx">
                      Axiomworx
                    </option>
                    <option value="Equinox Engineering">
                      Equinox Engineering
                    </option>
                    <option value="Apple">
                      Apple
                    </option>
                  </select> 
                </div>
                <div
                  class="text-sm text-red-500 pl-2 "
                >
                  {{ errors.company ? errors.company : '\u00A0' }} 
                </div>
              </div>
            
              <div class="flex flex-col gap-1 bg-gray-200 pt-7 pb-2 px-2">
                <div class="flex flex-col md:flex-row w-full rounded gap-2">
                  <label class="pr-2 md:px-2 whitespace-nowrap">
                    <span
                      v-if="errors.email"
                      class="text-red-500"
                    >*</span>
                    Email:
                  </label>
                  <input
                    v-model="formData.email"
                    type="text"
                    class="w-full px-2"
                  >
                </div>
                <div
                  class="text-sm text-red-500 pl-2 "
                >
                  {{ errors.email ? errors.email : '\u00A0' }} 
                </div>
              </div>
              
              <div class="flex flex-col gap-1 bg-gray-200 pt-7 pb-2 px-2">
                <div class="flex flex-col md:flex-row w-full rounded gap-2">
                  <label class="pr-2 md:px-2 whitespace-nowrap">
                    <span
                      v-if="errors.phone_number"
                      class="text-red-500"
                    >*</span>
                    Phone:
                  </label>
                  <input  
                    :value="formattedPhone"
                    @input="handlePhoneInput"
                    type="text"
                    class="w-full px-2"
                    maxLength="14"
                  >
                </div>
                <div
                  class="pl-7 text-sm text-red-500 block min-h-20"
                >
                  {{ errors.phone_number ? errors.phone_number : '\u00A0' }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div class="h-[20%] bg-white ">
          <div class="flex justify-end px-7 py-4 w-full">
            <button
              type="button"
              class="bg-blue-500 hover:bg-blue-700 text-white font-light text-sm md:text-base xl:text-lg py-2 px-4 rounded flex flex-row gap-2 items-center justify-center w-1/3 xl:w-1/2" 
              :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
              :disabled="!isFormValid"
              @click="handleSubmit"
            >
              <BookmarkSquareIcon
                v-if="!isCreate"
                class="h-4 w-4 text-white"
              />
              {{ isCreate ? 'Create' : 'Save' }} 
            </button>
          </div> 
        </div>
      </form>
    </div>
  </div>
</template>