// SHARED: Tipovi za termine i rezervacije
export interface Booking {
  id: number
  service: string
  size: string
  design: string | null
  date: string
  time: string
  customerName: string
  customerPhone: string
  customerEmail: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  name: string
  price: number
  image: string
  type: 'prirodni' | 'umjetni'
}

export interface CustomerInfo {
  name: string
  phone: string
  email: string
}

export interface Customizations {
  size: string
  design: string
  date: string
  time: string
}