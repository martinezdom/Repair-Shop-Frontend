import { computed } from 'vue'

export function useAuth() {
  // Función pura para leer y decodificar el rol en el momento
  function getUserRole(): string | null {
    const token = localStorage.getItem('token')
    if (!token) return null

    try {
      const payloadBase64 = token.split('.')[1]
      if (!payloadBase64) {
        return null
      }
      const decodedPayload = JSON.parse(atob(payloadBase64))

      return decodedPayload.role
    } catch (error) {
      console.error('Error al decodificar el token:', error)
      return null
    }
  }

  const isAdmin = computed(() => getUserRole() === 'ADMIN')

  function logout() {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return {
    isAdmin,
    getUserRole,
    logout,
  }
}
