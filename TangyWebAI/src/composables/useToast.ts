import { ref } from 'vue'

export interface ToastMessage {
  id: number
  type: 'success' | 'error'
  text: string
}

const toasts = ref<ToastMessage[]>([])
let nextId = 1

function remove(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

function push(type: ToastMessage['type'], text: string) {
  const id = nextId++
  toasts.value.push({ id, type, text })
  setTimeout(() => remove(id), 5000)
}

export function useToast() {
  return {
    toasts,
    remove,
    success: (text: string) => push('success', text),
    error: (text: string) => push('error', text),
  }
}
