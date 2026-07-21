import React from 'react'
import clsx from 'clsx'
import { NotificationIcon } from '../icons'
import styles from './NotificationButton.module.css'
import type { NotificationButtonProps } from './types'

export const NotificationButton: React.FC<NotificationButtonProps> = ({
  hasNotifications = false,
  onClick,
  disabled = false,
  className,
}) => (
  <button
    type="button"
    className={clsx(styles.button, className)}
    onClick={onClick}
    disabled={disabled}
    aria-label="Уведомления"
  >
    <NotificationIcon hasDot={hasNotifications} className={styles.icon} />
  </button>
)
