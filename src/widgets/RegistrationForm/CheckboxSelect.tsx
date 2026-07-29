import { useEffect, useRef, useState } from 'react'
import ChevronDownIcon from '@/shared/assets/icons/ChevronDown.svg'
import { Checkbox } from '@/shared/ui/checkbox'
import type { MultiSelectOption } from './types'
import styles from './RegistrationForm.module.css'

interface CheckboxSelectProps {
  label: string
  placeholder: string
  options: MultiSelectOption[]
  values: string[]
  name: string
  error?: string
  disabled?: boolean
  onChange: (values: string[]) => void
}

export function CheckboxSelect({
  label,
  placeholder,
  options,
  values,
  name,
  error,
  disabled = false,
  onChange,
}: CheckboxSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selectedLabels = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label)

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  const toggleValue = (value: string) => {
    onChange(
      values.includes(value)
        ? values.filter((selectedValue) => selectedValue !== value)
        : [...values, value],
    )
  }

  return (
    <div className={styles.field}>
      <label className={styles.label} id={`${name}-label`}>
        {label}
      </label>
      <div className={styles.checkboxSelect} ref={rootRef}>
        <button
          className={`${styles.selectControl} ${error ? styles.invalidControl : ''}`}
          type="button"
          aria-labelledby={`${name}-label`}
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className={selectedLabels.length ? '' : styles.placeholder}>
            {selectedLabels.length ? selectedLabels.join(', ') : placeholder}
          </span>
          <img
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
            src={ChevronDownIcon}
            alt=""
          />
        </button>

        {isOpen && (
          <ul className={styles.checkboxOptions}>
            {options.map((option) => (
              <li key={option.value}>
                <Checkbox
                  icon="check"
                  label={option.label}
                  value={option.value}
                  isChecked={values.includes(option.value)}
                  onChange={toggleValue}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className={styles.errorSlot} role={error ? 'alert' : undefined}>
        {error || '\u00a0'}
      </p>
    </div>
  )
}
