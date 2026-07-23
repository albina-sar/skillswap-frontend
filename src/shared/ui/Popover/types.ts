import { ReactNode } from 'react'

export type PopoverPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'

export type PopoverSize = 'small' | 'medium' | 'large'

export interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  placement?: PopoverPlacement
  className?: string
  size?: PopoverSize
}
