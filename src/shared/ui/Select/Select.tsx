import type { SelectProps } from './types'
import styles from './Select.module.css'
import ChevronDownIcon from '@/shared/assets/icons/ChevronDown.svg'

export const Select = ({
  value,
  onChange,
  options,
  label,
  placeholder = 'Выберите вариант',
  error,
  disabled = false,
  required = false,
  name,
  className = '',
}: SelectProps) => {
  const hasError = !!error
  const selectId = `select-${name || Math.random().toString(36).substring(2, 9)}`

  const containerClasses = [
    styles.container,
    hasError && styles.error,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.selectWrapper}>
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          name={name}
          className={styles.select}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Стрелка */}
        <img
          src={ChevronDownIcon}
          alt=""
          className={styles.chevronIcon}
          width={12}
          height={12}
        />
      </div>

      {hasError && <div className={styles.errorText}>{error}</div>}
    </div>
  )
}
