import React from 'react'
import clsx from 'clsx'
import styles from './Heading.module.css'
import type { HeadingProps } from './types'

const HEADING_TAGS = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
} as const

const LEVEL_STYLES = {
  1: styles.h1,
  2: styles.h2,
  3: styles.h3,
  4: styles.h4,
} as const

export const Heading: React.FC<HeadingProps> = ({ children, level = 1, className }) => {
  const Tag = HEADING_TAGS[level]

  return <Tag className={clsx(styles.heading, LEVEL_STYLES[level], className)}>{children}</Tag>
}
