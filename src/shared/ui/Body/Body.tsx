import React from 'react'
import clsx from 'clsx'
import styles from './Body.module.css'
import type { BodyProps } from './types'

export const Body: React.FC<BodyProps> = ({ children, className }) => {
  return <p className={clsx(styles.body, className)}>{children}</p>
}
