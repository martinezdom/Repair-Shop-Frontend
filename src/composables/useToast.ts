import { ref } from 'vue'

type MessageType = 'success' | 'error'

type Toast = {
  id: number
  message: string
  type: MessageType
}

// Estado fuera de la función → singleton compartido entre todos los que llamen a useToast()
const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
  function addToast(message: string, type: MessageType, duration = 3000) {
    const id = nextId++
    toasts.value.push({ id, message, type })

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  function removeToast(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function success(message: string) {
    addToast(message, 'success')
  }

  function error(message: string) {
    addToast(message, 'error')
  }

  return {
    toasts,
    success,
    error,
    removeToast,
  }
}
