import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollTop() {
  const visible = ref(false)

  function onScroll() {
    visible.value = window.scrollY > 400
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { visible }
}
