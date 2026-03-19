<script setup>
import { categories } from '@/data/concepts.js'
</script>

<template>
  <section class="cheat-sheet">
    <h2>Interview Cheat Sheet</h2>
    <table class="cheat-table">
      <thead>
        <tr><th>Concept</th><th>One-Liner</th></tr>
      </thead>
      <tbody>
        <template v-for="cat in categories" :key="cat.id">
          <tr v-for="concept in cat.concepts" :key="concept.id">
            <td class="concept-name">{{ concept.name }}</td>
            <td>{{ concept.oneLiner }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </section>
</template>
