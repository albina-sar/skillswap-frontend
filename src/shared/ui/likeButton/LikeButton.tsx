import React from 'react'
import clsx from 'clsx'
import styles from './LikeButton.module.css'
import type { LikeButtonProps } from './types'

export const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  likeCount,
  onToggle,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      className={clsx(styles.button, {
        [styles.liked]: isLiked,
      })}
      onClick={onToggle}
      disabled={disabled}
      aria-label={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
    >
      <span className={styles.count}>{likeCount}</span>
      <span className={styles.iconWrapper}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 22 20"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.icon}
        >
          <path
            d="M6.5 1A5.5 5.5 0 0 0 1 6.5C1 12 7.5 17 11 18.163 14.5 17 21 12 21 6.5a5.5 5.5 0 0 0-10-3.163A5.5 5.5 0 0 0 6.5 1"
            fill={isLiked ? 'currentColor' : 'none'}
            stroke={isLiked ? 'none' : 'currentColor'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  )
}
