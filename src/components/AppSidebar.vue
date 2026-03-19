<script setup>
import { categories } from '@/data/concepts.js'

defineProps({
  modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

function onLinkClick() {
  emit('update:modelValue', false)
}
</script>

<template>
  <nav class="sidebar" :class="{ open: modelValue }">
    <h2>
      <router-link to="/" class="sidebar-home" @click="onLinkClick">
        SE Concepts
      </router-link>
    </h2>
    <div v-for="cat in categories" :key="cat.id" class="nav-group">
      <router-link
        :to="`/${cat.slug}`"
        class="nav-group-title"
        @click="onLinkClick"
      >{{ cat.title }}</router-link>
      <div class="nav-links">
        <router-link
          v-for="concept in cat.concepts"
          :key="concept.id"
          :to="{ path: `/${cat.slug}`, hash: `#${concept.id}` }"
          @click="onLinkClick"
        >{{ concept.name }}</router-link>
      </div>
    </div>
  </nav>
</template>
