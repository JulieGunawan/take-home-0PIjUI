<script setup lang="ts">
import PageSidebar from '@/views/PageSidebar.vue';
import UserDetail from '@/views/UserDetail.vue';
</script>

<template>
  <main class="w-full h-full flex justify-center items-center">
    <div class="flex flex-row w-full h-full">
      <PageSidebar />
      <UserDetail />
    </div>
  </main>
</template>