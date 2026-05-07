export type Repair = {
  id: number
  vehicleLicensePlate: string
  status: string
  mechanicName: string
  description: string
  cost: number
}

export type Vehicle = {
  id: number
  licensePlate: string
  brand: string
  model: string
  year: number
  customerId: number
}

export type Customer = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
}
