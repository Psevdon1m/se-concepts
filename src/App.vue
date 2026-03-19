<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import BackToTop from '@/components/BackToTop.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
    &#9776;
  </button>

  <AppSidebar v-model="sidebarOpen" />

  <main>
    <RouterView />
  </main>

  <BackToTop />
</template>
