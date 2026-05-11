import { ref } from 'vue'
import { api } from '@/services/api'
import type { Customer } from '@/types'
import { usePagination } from '@/composables/usePagination'
import { useModal } from './useModal'

export function useCustomers() {
  const { currentPage, totalPages, nextPage, previousPage } = usePagination(fetchCustomers)
  const { isModalOpen, editingId, openModal, closeModal, openEditModal: openBaseModal } = useModal()

  const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  const customers = ref<Customer[]>([])
  const errorMessage = ref('')
  const isSaving = ref(false)

  async function fetchCustomers() {
    try {
      const response = await api(`/customers?page=${currentPage.value}`)
      customers.value = response.content || response
      totalPages.value = response.totalPages || 1
    } catch (error) {
      errorMessage.value = 'Error al cargar los clientes'
      console.error(error)
    }
  }

  async function submitCustomer() {
    isSaving.value = true
    try {
      if (editingId.value) {
        const updatePayload = {
          email: form.value.email,
          phone: form.value.phone,
        }
        await api('/customers/' + editingId.value, 'PUT', updatePayload)
      } else {
        const createPayload = {
          firstName: form.value.firstName,
          lastName: form.value.lastName,
          email: form.value.email,
          phone: form.value.phone,
        }
        await api('/customers', 'POST', createPayload)
      }
      closeModal()
      form.value = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      }
      await fetchCustomers()
    } catch (error) {
      if (editingId.value) {
        errorMessage.value = 'Error al modificar el cliente. Revisa los datos.'
      } else {
        errorMessage.value = 'Error al crear el cliente. Revisa los datos.'
      }
      console.error('Error enviando formulario:', error)
    } finally {
      isSaving.value = false
    }
  }

  async function deleteCustomer(id: number) {
    try {
      if (confirm('¿Estás seguro que quieres borrar este cliente?')) {
        await api(`/customers/${id}`, 'DELETE')
        await fetchCustomers()
      }
    } catch (error) {
      errorMessage.value = 'Error al eliminar el cliente'
      console.error(error)
    }
  }

  function resetForm() {
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    }
  }

  function getCustomerFullName(customerId: number | null): string {
    const customer = customers.value.find((c) => String(c.id) === String(customerId))
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Desconocido'
  }

  function openEditModal(customer: Customer) {
    openBaseModal(customer.id)
    form.value.firstName = customer.firstName
    form.value.lastName = customer.lastName
    form.value.email = customer.email
    form.value.phone = customer.phone
  }

  return {
    customers,
    form,
    errorMessage,
    currentPage,
    totalPages,
    editingId,
    isModalOpen,
    fetchCustomers,
    submitCustomer,
    deleteCustomer,
    resetForm,
    getCustomerFullName,
    openEditModal,
    nextPage,
    previousPage,
    openModal,
    closeModal,
    isSaving
  }
}
