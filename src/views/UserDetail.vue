<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { BasicFormData, FormErrors } from '@/types/Form';
import {  BookmarkSquareIcon } from '@heroicons/vue/24/outline';
import TextInputWithLabel from '../components/TextInputWithLabel.vue';
import PhoneInputWithLabel from '@/components/PhoneInputWithLabel.vue';
import DropdownWithLabel from '@/components/DropdownWithLabel.vue';

const userStore = useUserStore();
const {user} = storeToRefs(userStore);
const loading = ref<boolean>(true);
const isCreate = ref<boolean>(false);
const errors = reactive<FormErrors>({});

const companies = [
    "Axiomworx",
    "Equinox Engineering",
    "Apple",
]

const plans = [
    "Free Plan",
    "Pro Plan",
    "Trial"
]

const formData = reactive<BasicFormData>({
    first_name: user.value?.first_name || "",
    last_name: user.value?.last_name || "",
    plan: user.value?.plan || "",
    company: user.value?.company || "",
    email: user.value?.email || "",
    phone_number: user.value?.phone_number || ""
})

const validateForm = () => {
    errors.first_name = !formData.first_name ? 'First name is required' : '';
    errors.last_name = !formData.last_name ? 'Last name is required' : '';
    errors.company = !formData.company ? 'Company is required' : '';
    errors.plan = !formData.plan ? 'Plan is required' : '';
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
}

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
        formData.phone_number = selectedUser.phone_number;
        loading.value = false;
        isCreate.value = false;
    } else {
        formData.first_name = "";
        formData.last_name = "";
        formData.company = "";
        formData.email = "";
        formData.phone_number = "";
        loading.value = false;
        isCreate.value = true;
    }
}, {
    immediate: true,
});

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
        } 
        //the second watch, that watches formData, didn't assign the value back to user.value, thus updating the form will result in user.value to be null 
        else { 
            //capture the created User then update the state with created user
            const createdUser = await userStore.createNewUser(formData);
            await userStore.fetchUserById(createdUser.id.toString());
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
              <TextInputWithLabel 
              label="First Name" 
              placeholder="First Name" 
              v-model="formData.first_name" 
              :error=errors.first_name
              />
              <TextInputWithLabel 
              label="Last Name" 
              placeholder="Last Name"
              v-model="formData.last_name"
              :error=errors.last_name
              />     
              <DropdownWithLabel 
              label="Plan" 
              :optionValues="plans"
              placeholder="Select Plan"
              v-model="formData.plan"
              :error=errors.plan
              />      
              <DropdownWithLabel 
              label="Company" 
              :optionValues="companies"
              placeholder="Select Company"
              v-model="formData.company"
              :error=errors.company
              />          
              <TextInputWithLabel 
              label="Email" 
              placeholder="Email"
              v-model="formData.email"
              :error=errors.email
              />
              <PhoneInputWithLabel 
              label="Phone #"
              placeholder="Phone Number"
              v-model="formData.phone_number"
              :error=errors.phone_number
              />          
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