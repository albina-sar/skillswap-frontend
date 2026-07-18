import React from 'react'
import clsx from 'clsx'
import { FavoriteIcon } from '../icons'
import styles from './FavoriteButton.module.css'
import type { FavoriteButtonProps } from './types'

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  onClick,
  disabled = false,
  className,
}) => (
  <button
    type="button"
    className={clsx(styles.button, className)}
    onClick={onClick}
    disabled={disabled}
    aria-label="Избранное"
  >
    <FavoriteIcon className={styles.icon} />
  </button>
)
