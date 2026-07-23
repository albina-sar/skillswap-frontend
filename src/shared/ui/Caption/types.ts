import type { ReactNode } from 'react'

// Выбор тега для компонента
export type CaptionTag = 'span' | 'p'

// Два цвета из палитры по макету: основной текст и приглушённый
export type CaptionColor = 'primary' | 'caption'

export interface CaptionProps {
  children: ReactNode
  tag?: CaptionTag
  color?: CaptionColor
  className?: string
}
