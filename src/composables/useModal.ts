import { ref } from 'vue'

export function useModal() {
  const isModalOpen = ref(false)
  const editingId = ref<number | null>(null)

  function openModal() {
    editingId.value = null
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
    editingId.value = null
  }

  function openEditModal(id: number) {
    editingId.value = id
    isModalOpen.value = true
  }

  return {
    isModalOpen,
    editingId,
    openModal,
    closeModal,
    openEditModal,
  }
}
