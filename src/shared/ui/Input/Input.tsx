import { useState } from 'react'
import styles from './Input.module.css'
import type { InputProps } from './types'
import SearchIcon from '@/shared/assets/icons/Search.svg'
import EyeOpenIcon from '@/shared/assets/icons/Eye.svg'
import EyeClosedIcon from '@/shared/assets/icons/EyeSlash.svg'
import EditIcon from '@/shared/assets/icons/Edit.svg'
import CrossIcon from '@/shared/assets/icons/CrossBlack.svg'

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
  showClear = false,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const hasError = !!error
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

  // ===== ЛУПА (поиск) =====
  const renderLeftIcon = () => {
    if (variant === 'search') {
      return (
        <div className={styles.leftIcon}>
          <img src={SearchIcon} alt="Поиск" width={20} height={20} />
        </div>
      )
    }
    return null
  }

  // ===== ГЛАЗ (пароль) =====
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
          <img
            src={showPassword ? EyeClosedIcon : EyeOpenIcon}
            alt={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            width={20}
            height={20}
          />
        </button>
      )
    }
    return null
  }

  // ===== КАРАНДАШ (редактирование) =====
  const renderEditIcon = () => {
    if (variant === 'edit') {
      return (
        <div className={styles.rightIcon}>
          <img src={EditIcon} alt="Редактировать" width={20} height={20} />
        </div>
      )
    }
    return null
  }

  // ===== КРЕСТИК (очистка) =====
  const renderClearButton = () => {
    if (showClear && value.length > 0 && !disabled) {
      return (
        <button
          type="button"
          className={styles.clearButton}
          onClick={() => onChange('')}
          aria-label="Очистить поле"
        >
          <img src={CrossIcon} alt="Очистить" width={24} height={24} />
        </button>
      )
    }
    return null
  }

  // ===== ПОЛЕ ВВОДА =====
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

  // ===== РЕНДЕР =====
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
        {renderClearButton()}
        {renderEditIcon()}
        {renderRightIcon()}
      </div>

      {hasError && <div className={styles.errorText}>{error}</div>}
    </div>
  )
}
