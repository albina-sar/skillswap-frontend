import type { SelectProps } from './types'
import styles from './Select.module.css'

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
  // Есть ли ошибка
  const hasError = !!error

  // Генерируем ID для поля
  const selectId = `select-${name || Math.random().toString(36).substring(2, 9)}`

  // Собираем классы для контейнера
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
      {/* LABEL (подпись над полем) */}
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {/* САМ SELECT */}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        name={name}
        className={styles.select}
      >
        {/* Первый пункт — плейсхолдер (не выбирается) */}
        <option value="" disabled>
          {placeholder}
        </option>

        {/* Опции из массива */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* ТЕКСТ ОШИБКИ */}
      {hasError && <div className={styles.errorText}>{error}</div>}
    </div>
  )
}
