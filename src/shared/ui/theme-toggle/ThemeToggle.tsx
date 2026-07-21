import React from 'react'
import clsx from 'clsx'
import { ThemeIcon } from '../icons'
import styles from './ThemeToggle.module.css'
import type { ThemeToggleProps } from './types'

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onClick, className }) => (
  <button
    type="button"
    className={clsx(styles.button, className)}
    onClick={onClick}
    aria-label="Переключить тему"
  >
    <ThemeIcon isDark={isDark} className={styles.icon} />
  </button>
)
