export type Repair = {
  id: bigint
  vehicleLicensePlate: string
  status: string
  mechanicName: string
  description: string
  cost: number
}

export type Vehicle = {
  id: bigint
  licensePlate: string
  brand: string
  model: string
  year: number
  customerId: string
}
