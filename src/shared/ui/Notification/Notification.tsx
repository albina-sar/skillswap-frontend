// src/shared/ui/Notification/Notification.tsx

import { useState } from 'react'
import styles from './Notification.module.css'
import type { NotificationProps } from './types'

import BellIcon from '@/shared/assets/icons/NotificationBell.svg'
import BellNewIcon from '@/shared/assets/icons/StateNewBell.svg'
import CrossIcon from '@/shared/assets/icons/NotificationCross.svg'
import LampIcon from '@/shared/assets/icons/VectorLamp.svg'

export const Notification = ({
  text,
  senderName = 'Олег',
  onAction,
  onClose,
  hasNew = true,
}: NotificationProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className={styles.container}>
      <button className={styles.bellButton} aria-label="Уведомления">
        <img
          src={hasNew ? BellNewIcon : BellIcon}
          alt="Уведомления"
          width={24}
          height={24}
          className={styles.bellIcon}
        />
        {hasNew && <span className={styles.badge} />}
      </button>

      <div
        className={styles.popup}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button className={styles.closeButton} onClick={onClose}>
          <img src={CrossIcon} alt="Закрыть" width={12} height={12} />
        </button>

        {/* ===== ВЕСЬ КОНТЕНТ В ОДНОЙ ОБЁРТКЕ ===== */}
        <div className={styles.contentWrapper}>
          <img
            src={LampIcon}
            alt=""
            width={24}
            height={24}
            className={styles.lampIcon}
          />
          <span className={styles.text}>
            {senderName} предлагает вам {text}
          </span>
        </div>

        {isHovered && (
          <button className={styles.actionButton} onClick={onAction}>
            Перейти
          </button>
        )}
      </div>
    </div>
  )
}
