import { ref, onMounted, onUnmounted } from 'vue'

export function useActiveSection() {
  const activeSectionId = ref('')
  let observer = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSectionId.value = entry.target.id
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' },
    )

    document.querySelectorAll('.concept').forEach((el) => {
      observer.observe(el)
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { activeSectionId }
}
