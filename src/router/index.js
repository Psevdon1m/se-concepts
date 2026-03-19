import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/principles',
      name: 'principles',
      component: () => import('@/views/categories/PrinciplesSolid.vue'),
    },
    {
      path: '/grasp',
      name: 'grasp',
      component: () => import('@/views/categories/GraspPatterns.vue'),
    },
    {
      path: '/gof',
      name: 'gof',
      component: () => import('@/views/categories/GofPatterns.vue'),
    },
    {
      path: '/architecture',
      name: 'architecture',
      component: () => import('@/views/categories/ArchitecturePatterns.vue'),
    },
    {
      path: '/concurrency',
      name: 'concurrency',
      component: () => import('@/views/categories/ConcurrencyMessaging.vue'),
    },
    {
      path: '/data',
      name: 'data',
      component: () => import('@/views/categories/DataPatterns.vue'),
    },
    {
      path: '/theory',
      name: 'theory',
      component: () => import('@/views/categories/TypeTheoryComplexity.vue'),
    },
    {
      path: '/distributed',
      name: 'distributed',
      component: () => import('@/views/categories/DistributedSystems.vue'),
    },
    {
      path: '/low-level',
      name: 'low-level',
      component: () => import('@/views/categories/LowLevelPerformance.vue'),
    },
    {
      path: '/reliability',
      name: 'reliability',
      component: () => import('@/views/categories/ReliabilityPatterns.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

export default router
