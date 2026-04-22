const BASE_URL = 'http://localhost:8080/api'

export async function api(endpoint: string, method: string = 'GET', body?: any) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  const token = localStorage.getItem('token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config: RequestInit = {
    method: method,
    headers: headers,
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    throw new Error(`Error en la API: ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}
