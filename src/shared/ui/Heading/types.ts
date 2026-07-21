import type { ReactNode } from 'react'

// Уровень заголовка: задаёт тег <h1>…<h4> и парные ему стили из UI-кита
export type HeadingLevel = 1 | 2 | 3 | 4

export interface HeadingProps {
  children: ReactNode
  level?: HeadingLevel
  className?: string
}
