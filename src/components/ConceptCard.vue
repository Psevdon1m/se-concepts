<script setup>
import { ref } from 'vue'

defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  badgeType: { type: String, required: true },
  badgeLabel: { type: String, required: true },
})

const open = ref(false)
</script>

<template>
  <div :id="id" class="concept" :class="{ open }">
    <div class="concept-header" @click="open = !open">
      <h3>{{ title }}</h3>
      <div>
        <span class="badge" :class="`badge-${badgeType}`">{{ badgeLabel }}</span>
        <span class="chevron">&blacktriangledown;</span>
      </div>
    </div>
    <div class="concept-body">
      <slot />
    </div>
  </div>
</template>
