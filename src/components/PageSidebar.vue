<script setup lang="ts">
 import { FunnelIcon } from '@heroicons/vue/24/solid';
</script>

<template>
    <div class="flex flex-col">
        <button class="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"> <FunnelIcon class="h-5 w-5 text-white" /> Filter User </button>
        <Sidebar />
        <UserDetail />

    </div>
</template>