export interface BasicFormData {
  first_name: string
  last_name: string
  plan: string
  company: string
  email:string
  phone_number:string
}

export interface FormErrors {
  first_name?: string
  last_name?: string
  plan?: string
  company?: string
  email?: string
  phone_number?:string
}
