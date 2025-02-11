<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
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
        formData.first_name = '';
        formData.last_name = '';
        formData.company = '';
        formData.email = '';
        formData.plan = '';
        formData.phone_number = '';
        loading.value = false;
        isCreate.value = true;
    }
}, {immediate: true});

const validateForm = () => {
  errors.first_name = !formData.first_name ? 'First name is required' : '';
  errors.last_name = !formData.last_name ? 'Last name is required' : '';
  errors.plan = !formData.plan ? 'Plan is required' : '';
  errors.company = !formData.company ? 'Company is required' : '';
  errors.email = !formData.email ? 'Email is required' : '';
  errors.phone_number = !formData.phone_number ? 'Phone is required' : '';
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  errors.email = !formData.email 
    ? 'Email is required' 
    : !emailRegex.test(formData.email) 
    ? 'Invalid email format'
    : '';

  // Phone validation (simple format: (XXX) XXX-XXXX)
  const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
  errors.phone_number = !formData.phone_number 
    ? 'Phone is required' 
    : !phoneRegex.test(formData.phone_number) 
    ? 'Invalid phone format (XXX) XXX-XXXX'
    : '';
};
  
const handleSubmit = async () => {
  validateForm();
  
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
    } else {
        console.log("Please enter some data");  
    }
  } else {
    console.log('Form has errors', errors);
  }
};
</script>

<template>
  <div class="w-3/4 h-screen bg-gray-300 flex flex-col p-4">
    <div class="bg-white flex flex-col">
        <form  class="flex flex-col gap-3" >
            <div class="bg-white flex flex-col md:flex-row h-[80%] overflow-hidden p-4 rounded items-center md:items-start text-sm md:text-base xl:text-lg">
                <div class="w-full md:w-1/4 md:h-full bg-blue-200 overflow-y-auto" v-if="!isCreate">
                    <img
                    src="https://api.dicebear.com/9.x/adventurer/svg?seed=Jude"
                    alt="avatar"
                    class="object-fit w-1/2 md:w-full mx-auto md:mx-0" 
                    />
                </div>
                <div class="w-full md:w-3/4 bg-blue-50 overflow-y-auto ">
                    <div class="flex flex-col gap-1 md:gap-2 p-4 lg:p-6">                     
                        <h2 class=" text-black font-bold  py-1 px-4 align-left w-full" v-if="!isCreate">
                            {{ formData.first_name }} {{ formData.last_name.charAt(0) }}
                        </h2>
                        <h2 class=" text-black font-bold  py-1 px-4 align-left w-full" v-if="isCreate">
                            Creating New User
                        </h2>
                        <h3 class="text-gray-500 font-normal py-1 px-4 align-left w-full" >
                            {{ isCreate ? "- ": "Product Manager"  }}
                        </h3>
                        <h4 class="text-black font-normal py-2 px-4 align-left w-full">
                            User Details
                        </h4>
                        <div class="bg-gray-200 flex flex-col md:flex-row w-full p-3 lg:p-5 rounded gap-2">
                            <label class="px-2 whitespace-nowrap" placeholder="First Name">
                                <span v-if="errors.first_name" class="text-red-500">*</span>
                                First Name:
                            </label>
                            <input v-model="formData.first_name" type="text" class="w-full px-2" />
                        </div>
                        <div class="bg-gray-200 flex flex-col md:flex-row w-full p-3 lg:p-5 rounded gap-2">
                            <label class="px-2 whitespace-nowrap" placeholder="Last Name"> 
                                <span v-if="errors.last_name" class="text-red-500">*</span> 
                                Last Name:
                            </label>
                            <input type="text" class="w-full px-2" v-model="formData.last_name">
                        </div>
                        <div class="bg-gray-200 flex flex-col md:flex-row w-full p-3 lg:p-5 rounded gap-2">
                            <label class="px-2 whitespace-nowrap">
                                <span v-if="errors.plan" class="text-red-500">*</span>
                                Plan: 
                            </label>
                            <select class="w-full px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                            placeholder="Select Plan" 
                            v-model="formData.plan">
                              <!-- Due to the data available, these options  are missing some values  -->
                                <option value="Free Plan">Free</option>
                                <option value="Pro Plan">Pro</option>
                                <option value="Trial">Trial</option>
                            </select>
                        </div>
                        <div class="bg-gray-200 flex flex-col md:flex-row w-full p-3 lg:p-5 rounded gap-2">
                            <label class="px-2 whitespace-nowrap" placeholder="Company Name"> 
                                <span v-if="errors.company" class="text-red-500">*</span> 
                                Company:
                            </label>
                            <!-- Due to the data available, these options don't seem to be applied  -->
                            <select class="w-full px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                            placeholder="Select Company"
                            v-model="formData.company"
                            >
                                <option value="Axiomworx">Axiomworx</option>
                                <option value="Equinox Engineering">Equinox Engineering</option>
                                <option value="Apple">Apple</option>
                            </select> 
                        </div>
                        <div class="bg-gray-200 flex flex-col md:flex-row w-full p-3 lg:p-5 rounded gap-2">
                            <label class="px-2 whitespace-nowrap">
                                <span v-if="errors.email" class="text-red-500">*</span>
                                Email:
                            </label>
                            <input type="text" class="w-full px-2" v-model="formData.email"/>
                        </div>
                        <div class="flex flex-col gap-1">
                            <div class="bg-gray-200 flex flex-col md:flex-row w-full p-3 lg:p-5 rounded gap-2">
                                <label class="px-2 whitespace-nowrap">
                                    <span v-if="errors.phone_number" class="text-red-500">*</span>
                                    Phone:
                                </label>
                                <input type="text" class="w-full px-2" v-model="formData.phone_number"/>
                            </div>
                            <div v-if="errors.phone_number" class="pl-7 text-sm text-red-500">
                                {{ errors.phone_number }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div class="h-[20%] bg-white ">
                <div class="flex justify-end px-7 py-4 w-full">
                    <button type="button"
                    @click="handleSubmit" 
                    class="bg-blue-500 hover:bg-blue-700 text-white font-light text-sm md:text-base xl:text-lg py-2 px-4 rounded flex flex-row gap-2 items-center justify-center w-1/3 xl:w-1/2"
                    >
                        <BookmarkSquareIcon v-if="!isCreate" class="h-4 w-4 text-white" />
                        {{isCreate ? 'Create' : 'Save'}} 
                    </button>
                </div> 
            </div>
        </form>
    </div>
  </div>
</template>