<script setup>
import { categories } from '@/data/concepts.js'

defineProps({
  modelValue: { type: Boolean, default: false },
  activeSectionId: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

function onLinkClick() {
  emit('update:modelValue', false)
}
</script>

<template>
  <nav class="sidebar" :class="{ open: modelValue }">
    <h2>SE Concepts</h2>
    <div v-for="cat in categories" :key="cat.id" class="nav-group">
      <div class="nav-group-title">{{ cat.title }}</div>
      <div class="nav-links">
        <a
          v-for="concept in cat.concepts"
          :key="concept.id"
          :href="`#${concept.id}`"
          :class="{ active: activeSectionId === concept.id }"
          @click="onLinkClick"
        >{{ concept.name }}</a>
      </div>
    </div>
  </nav>
</template>
