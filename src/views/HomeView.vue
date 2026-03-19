<script setup>
import CheatSheet from '@/components/CheatSheet.vue'
import PrinciplesSolid from '@/views/categories/PrinciplesSolid.vue'
import GraspPatterns from '@/views/categories/GraspPatterns.vue'
import GofPatterns from '@/views/categories/GofPatterns.vue'
import ArchitecturePatterns from '@/views/categories/ArchitecturePatterns.vue'
import ConcurrencyMessaging from '@/views/categories/ConcurrencyMessaging.vue'
import DataPatterns from '@/views/categories/DataPatterns.vue'
import TypeTheoryComplexity from '@/views/categories/TypeTheoryComplexity.vue'
import DistributedSystems from '@/views/categories/DistributedSystems.vue'
import LowLevelPerformance from '@/views/categories/LowLevelPerformance.vue'
import ReliabilityPatterns from '@/views/categories/ReliabilityPatterns.vue'
</script>

<template>
  <div>
    <h1>Software Engineering Concepts</h1>
    <p class="subtitle">Deep dive with examples, trade-offs, and interview cheat sheet</p>

    <CheatSheet />
    <PrinciplesSolid />
    <GraspPatterns />
    <GofPatterns />
    <ArchitecturePatterns />
    <ConcurrencyMessaging />
    <DataPatterns />
    <TypeTheoryComplexity />
    <DistributedSystems />
    <LowLevelPerformance />
    <ReliabilityPatterns />
  </div>
</template>
