<script setup>
import { useScrollTop } from '@/composables/useScrollTop.js'

const { visible } = useScrollTop()

function scrollToTop() {
  window.scrollTo({ top: 0 })
}
</script>

<template>
  <button class="top-btn" :class="{ visible }" @click="scrollToTop">
    &uarr;
  </button>
</template>
