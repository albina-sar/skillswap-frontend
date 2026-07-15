import React from 'react'
import clsx from 'clsx'
import styles from './Tag.module.css'
import type { TagProps } from './types'

export const Tag: React.FC<TagProps> = ({ label, backgroundColor, textColor = '#ffffff' }) => {
  return (
    <span
      className={clsx(styles.tag)}
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {label}
    </span>
  )
}
