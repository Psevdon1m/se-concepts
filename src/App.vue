<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import BackToTop from '@/components/BackToTop.vue'
import { useActiveSection } from '@/composables/useActiveSection.js'

const sidebarOpen = ref(false)
const { activeSectionId } = useActiveSection()
</script>

<template>
  <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
    &#9776;
  </button>

  <AppSidebar
    v-model="sidebarOpen"
    :active-section-id="activeSectionId"
  />

  <main>
    <RouterView />
  </main>

  <BackToTop />
</template>
