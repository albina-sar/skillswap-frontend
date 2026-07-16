export type InputVariant = 'default' | 'search' | 'password' | 'textarea' | 'date'

export interface InputProps {
  variant?: InputVariant
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  name?: string
  required?: boolean
  className?: string
}
