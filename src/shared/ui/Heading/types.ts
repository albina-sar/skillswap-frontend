import type { ReactNode } from 'react'

export type HeadingSize = 'lg' | 'md'

export interface HeadingProps {
  children: ReactNode
  size?: HeadingSize
  className?: string
}
