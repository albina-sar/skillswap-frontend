import React from 'react'
import clsx from 'clsx'
import styles from './Heading.module.css'
import type { HeadingProps } from './types'

const SIZE_STYLES = {
  lg: styles.lg,
  md: styles.md,
} as const

export const Heading: React.FC<HeadingProps> = ({ children, size = 'lg', className }) => {
  return <h2 className={clsx(styles.heading, SIZE_STYLES[size], className)}>{children}</h2>
}
