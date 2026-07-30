export interface ComboboxOption {
  readonly value: string
  readonly label: string
}

export interface ComboboxProps {
  value: string
  options: readonly ComboboxOption[]
  label: string
  name: string
  searchable?: boolean
  onChange: (value: string) => void
  error?: string
}
