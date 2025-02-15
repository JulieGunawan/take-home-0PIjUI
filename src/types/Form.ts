export interface BasicFormData {
  plan: string
  email: string
  company: string
  first_name: string
  last_name: string
  phone_number: string
}

export interface FormErrors {
  first_name?: string
  last_name?: string
  company?: string
  email?: string
  plan?: string
  phone_number?: string
}
