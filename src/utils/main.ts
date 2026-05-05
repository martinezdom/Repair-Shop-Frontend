export function formatStatus(text: string) {
  if (!text) {
    return ''
  }
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatCost(cost: number | null) {
  if (cost === null || cost === undefined) return 'Pendiente'

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(cost)
}
