<script setup lang="ts">
import { FunnelIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { useUserStore } from '../stores/userStore';
import { onMounted } from 'vue';
import { defineStore, storeToRefs } from 'pinia';

const userStore = useUserStore();
const {users, user} = storeToRefs(userStore);

onMounted(() => {
    userStore.fetchUsers();
});

const selectUser = (id: string) => {
    userStore.fetchUserById(id);
}

const handleCreateNewUser = () => {
    userStore.initializeUser();
}
</script>

<template>
  <div class="w-1/5 h-screen flex flex-col">
    <div class="gap-1 flex flex-col items-center justify-center md:gap-2">
        <button class="text-sm md:text-base bg-blue-500 hover:bg-green-700 text-white font-light py-1 px-2 md:py-2 md:px-4 rounded flex items-center gap-1 md:gap-2 w-full ">
            <FunnelIcon class="h-3 w-3 md:h-5 md:w-5 text-white " />
            Filter Users
        </button>
        
    </div>
    
        <ul class="bg-white flex flex-col w-full items-center overflow-y-auto flex-grow justify-center">
            <li v-for="user in users" 
            :key="user.id" class="text-sm md:text-base bg-white hover:bg-blue-50 hover:rounded-full text-black hover:text-blue-600 font-normal py-2  w-4/5 cursor-pointer"
            @click="selectUser(user.id.toString())"
            >
                {{ user.first_name }} {{ user.last_name .charAt(0) }}
            </li>
        </ul>
    

    <div class="bg-gray-200 flex items-center justify-center h-60 w-full">
        <button 
            type="button"
            class="text-sm md:text-base bg-blue-500 hover:bg-green-700 text-white font-light py-1 px-2 rounded flex  items-center gap-2"
            @click="handleCreateNewUser()"
        >
            <PlusIcon class="h-4 w-4 text-white" />
            Create New User
        </button>
    </div>
  </div>
  
</template>