<script setup lang="ts">
import { FunnelIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { useUserStore } from '../stores/userStore';
import { onMounted, ref, watch } from 'vue';
import {  storeToRefs } from 'pinia';
import { FilterProps } from '@/types/Filter';
import debounce from 'lodash/debounce';

const userStore = useUserStore();
const {users} = storeToRefs(userStore);

onMounted(() => {
    userStore.fetchUsers();
});

const selectUser = (id: string) => {
    userStore.fetchUserById(id);
}

const handleCreateNewUser = () => {
    userStore.initializeUser();
}

const activateFilter = ref<boolean>(false);

const filters = ref<FilterProps>({
    firstName: '',
    lastName: '',
    plan: 'All Plans'
});

const handleReset= () => {
    filters.value = {
        firstName: '',
        lastName: '',
        plan: 'All Plans'
    }
    userStore.fetchUsers();
    activateFilter.value = false;
}

const debounceFilter = debounce((filterInput: FilterProps) => {
    userStore.fetchUsersByFilter(filterInput);  
},300);

watch(
    () => filters.value,
    (newFilters) => {
        debounceFilter(newFilters);
    },
    { deep: true }
)

</script>

<template>
  <div class="w-1/4 h-screen flex flex-col ">
    <div class="gap-1 flex flex-col md:gap-2 p-4">
        <button class="text-sm md:text-base xl:text-lg bg-blue-500 hover:bg-blue-700 text-white font-light  py-1 px-2 md:py-2 md:px-4 rounded flex items-center gap-1 md:gap-2 w-full"
        @click="activateFilter = !activateFilter"
        >
            <FunnelIcon class="h-3 w-3 md:h-5 md:w-5 text-white " />
            Filter Users
        </button>
        <div  v-if="activateFilter" >
            <div class="flex flex-col gap-2 p-2 w-[80%]">   
                <div class="bg-gray-200 flex flex-col w-full p-2 md:p-3 xl:p-4 rounded gap-2">
                    <label class="text-sm xl:text-base" placeholder="First Name">    
                        First Name:
                    </label>
                    <input type="text" class="p-2 text-sm xl:text-base rounded-md" v-model="filters.firstName" placeholder="First Name" >
                </div>
                <div class="bg-gray-200 flex flex-col w-full p-2 md:p-3 xl:p-4  rounded gap-2">
                    <label class="text-sm xl:text-base" > 
                        Last Name:
                    </label>
                    <input type="text" class="p-2 text-sm xl:text-base rounded-md"  v-model="filters.lastName" placeholder="Last Name">
                </div>
                <div class="bg-gray-200 flex flex-col w-full p-2 md:p-3 xl:p-4 gap-2">
                    <label class=" text-sm xl:text-base" >
                        Plan: 
                    </label>
                    <select class="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm xl:text-base"  
                    v-model="filters.plan"
                    >
                        <option value="All Plans">All Plans</option>
                        <option value="Free Plan">Free</option>
                        <option value="Pro Plan">Pro</option>
                        <option value="Trial">Trial</option>
                    </select>
                </div>
            </div>
            <div class="flex flex-col md:flex-row justify-between p-2">
                <button @click="handleReset" class="text-gray-400">Reset</button>  
            </div>
        </div> 
    </div>

    <div class="flex-grow overflow-hidden overflow-y-auto flex flex-col ">
        <ul class="bg-white flex flex-col w-full items-center">
            <li v-for="user in users" 
            :key="user.id" 
            class="text-sm md:text-base xl:text-lg bg-white hover:bg-blue-50 hover:rounded-full text-black hover:text-blue-600 font-normal py-2  w-4/5 cursor-pointer"
            @click="selectUser(user.id.toString())"
            >
                {{ user.first_name }} {{ user.last_name .charAt(0) }}
            </li>
        </ul>
    </div>
    

    <div class="bg-gray-200 flex items-center justify-center h-60 w-full">
        <button 
            type="button"
            class="text-sm md:text-base xl:text-lg bg-blue-500 hover:bg-blue-700 text-white font-light py-1 px-2 rounded flex items-center gap-2"
            @click="handleCreateNewUser()"
        >
            <PlusIcon class="h-3 w-3 md:h-5 md:w-5 text-white" />
            Create New User
        </button>
    </div>
  </div>
  
</template>