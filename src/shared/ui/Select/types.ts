export interface SelectOption {
  readonly value: string
  readonly label: string
}

export interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: readonly SelectOption[]
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  name?: string
  className?: string
}
