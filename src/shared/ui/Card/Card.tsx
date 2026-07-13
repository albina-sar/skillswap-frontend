import { type HTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Card.module.css'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={clsx(styles.card, className)} {...props}>
      {children}
    </div>
  )
}