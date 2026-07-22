import { ReactNode } from 'react'

export type PopoverPlacement =
  | 'bottom-left'
  | 'bottom-right'
  | 'top-left'
  | 'top-right'
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'

export type PopoverSize = 'default' | 'userMenu' | 'largePopover'

export interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  placement?: PopoverPlacement
  offset?: number
  className?: string
  width?: string | number
  maxWidth?: string | number
  disableAnimation?: boolean
  size?: PopoverSize
}
