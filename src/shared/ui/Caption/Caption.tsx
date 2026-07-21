import React from 'react'
import clsx from 'clsx'
import styles from './Caption.module.css'
import type { CaptionProps } from './types'

const COLOR_STYLES = {
  primary: styles.colorPrimary,
  caption: styles.colorCaption,
} as const

export const Caption: React.FC<CaptionProps> = ({
  children,
  tag = 'span',
  color = 'primary',
  className,
}) => {
  const Tag = tag
  return <Tag className={clsx(styles.caption, COLOR_STYLES[color], className)}>{children}</Tag>
}
