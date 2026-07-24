import { useEffect, useRef, useState } from 'react'
import ChevronDownIcon from '@/shared/assets/icons/ChevronDown.svg'
import CrossIcon from '@/shared/assets/icons/CrossBlack.svg'
import styles from './Combobox.module.css'
import type { ComboboxProps } from './types'

export function Combobox({
  value,
  options,
  label,
  name,
  searchable = false,
  onChange,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find((option) => option.value === value)
  const visibleOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase()),
  )

  const close = () => {
    setIsOpen(false)
    setQuery('')
  }

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className={styles.container} ref={rootRef}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>

      <div className={styles.selectWrapper}>
        <div className={`${styles.control} ${isOpen ? styles.controlOpen : ''}`}>
          <input
            id={name}
            className={styles.searchInput}
            value={isOpen && searchable ? query : (selected?.label ?? '')}
            placeholder="Не указан"
            readOnly={!searchable}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={`${name}-options`}
            autoComplete="off"
            onClick={() => setIsOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value)
              setIsOpen(true)
            }}
          />

          <button
            className={styles.iconButton}
            type="button"
            aria-label={isOpen && query ? 'Очистить поиск' : 'Открыть список'}
            onClick={() => (isOpen && query ? setQuery('') : setIsOpen((open) => !open))}
          >
            <img
              className={`${styles.chevron} ${isOpen && !query ? styles.chevronOpen : ''}`}
              src={isOpen && query ? CrossIcon : ChevronDownIcon}
              alt=""
            />
          </button>
        </div>

        {isOpen && (
          <ul id={`${name}-options`} className={styles.options} role="listbox">
            {visibleOptions.map((option) => (
              <li key={option.value}>
                <button
                  className={`${styles.option} ${option.value === value ? styles.optionSelected : ''}`}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onChange(option.value)
                    close()
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
            {!visibleOptions.length && <li className={styles.emptyOption}>Ничего не найдено</li>}
          </ul>
        )}
      </div>
    </div>
  )
}
