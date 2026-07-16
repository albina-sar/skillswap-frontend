import { useState } from 'react'
import styles from './Input.module.css'
import type { InputProps } from './types'

export const Input = ({
  variant = 'default',
  value,
  onChange,
  label,
  placeholder = '',
  error,
  disabled = false,
  name,
  required = false,
  className = '',
}: InputProps) => {
  // Состояние для переключения видимости пароля
  const [showPassword, setShowPassword] = useState(false)

  // Есть ли ошибка
  const hasError = !!error

  // Генерируем ID для поля
  const inputId = `input-${name || Math.random().toString(36).substring(2, 9)}`

  // Определяем тип input
  const getInputType = () => {
    if (variant === 'password') {
      return showPassword ? 'text' : 'password'
    }
    if (variant === 'date') {
      return 'date'
    }
    return 'text'
  }

  // Собираем классы для контейнера
  const containerClasses = [
    styles.container,
    variant === 'textarea' && styles.textarea,
    hasError && styles.error,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // РЕНДЕРИМ ИКОНКУ СЛЕВА (ЛУПА ДЛЯ ПОИСКА)
  const renderLeftIcon = () => {
    if (variant === 'search') {
      return (
        <div className={styles.leftIcon}>
          <span style={{ fontSize: '18px' }}>🔍</span>
        </div>
      )
    }
    return null
  }

  // РЕНДЕРИМ ИКОНКУ СПРАВА (ГЛАЗ ДЛЯ ПАРОЛЯ)
  const renderRightIcon = () => {
    if (variant === 'password') {
      return (
        <button
          type="button"
          className={styles.rightIcon}
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        >
          <span style={{ fontSize: '18px' }}>
            {showPassword ? '🙈' : '👁️'}
          </span>
        </button>
      )
    }
    return null
  }

  // РЕНДЕРИМ САМО ПОЛЕ ВВОДА
  const renderInput = () => {
    const commonProps = {
      id: inputId,
      value,
      placeholder,
      disabled,
      required,
      name,
      className: styles.input,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value)
      },
    }

    if (variant === 'textarea') {
      return <textarea {...commonProps} rows={4} />
    }

    return <input {...commonProps} type={getInputType()} />
  }

  // ОСНОВНОЙ РЕНДЕР
  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {renderLeftIcon()}
        {renderInput()}
        {renderRightIcon()}
      </div>

      {hasError && <div className={styles.errorText}>{error}</div>}
    </div>
  )
}
