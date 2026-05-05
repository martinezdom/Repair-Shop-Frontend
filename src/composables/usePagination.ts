import { ref } from 'vue'

export function usePagination(fetchDataCallback: () => void) {
  const currentPage = ref(0)
  const totalPages = ref(1)

  function nextPage() {
    currentPage.value++
    fetchDataCallback()
  }

  function previousPage() {
    currentPage.value--
    fetchDataCallback()
  }

  return {
    currentPage,
    totalPages,
    nextPage,
    previousPage,
  }
}
