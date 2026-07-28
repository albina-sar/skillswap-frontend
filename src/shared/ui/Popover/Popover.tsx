import { useState, useRef, useEffect, cloneElement, isValidElement, ReactElement } from 'react'
import styles from './Popover.module.css'
import type { PopoverProps } from './types'

export const Popover = ({
  trigger,
  children,
  isOpen: controlledIsOpen,
  onOpenChange,
  placement = 'bottom-start',
  className = '',
  size = 'medium',
  anchorToContainer = false,
}: PopoverProps) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false)
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen

  const containerRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node
      const isOnPopup = popupRef.current?.contains(target) || false
      const isOnContainer = containerRef.current?.contains(target) || false

      if (isOnPopup || isOnContainer) return

      if (controlledIsOpen === undefined) {
        setUncontrolledIsOpen(false)
      }
      onOpenChange?.(false)
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleMouseDown)
      return () => {
        document.removeEventListener('mousedown', handleMouseDown)
      }
    }
  }, [isOpen, controlledIsOpen, onOpenChange])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        if (controlledIsOpen === undefined) {
          setUncontrolledIsOpen(false)
        }
        onOpenChange?.(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, controlledIsOpen, onOpenChange])

  const toggle = () => {
    const newState = !isOpen
    if (controlledIsOpen === undefined) {
      setUncontrolledIsOpen(newState)
    }
    onOpenChange?.(newState)
  }

  const handleTriggerClick = (e: React.MouseEvent) => {
    toggle()
    if (isValidElement(trigger)) {
      const triggerProps = trigger.props as { onClick?: (e: React.MouseEvent) => void }
      triggerProps.onClick?.(e)
    }
  }

  const triggerWithClick = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement, {
        onClick: handleTriggerClick,
        className: `${styles.trigger} ${trigger.props.className || ''}`,
      })
    : trigger

  const popupClasses = [
    styles.popup,
    styles[`placement-${placement}`],
    styles[size],
    isOpen && styles.open,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={anchorToContainer ? styles.containerAnchored : styles.container}
      ref={containerRef}
    >
      {triggerWithClick}

      {isOpen && (
        <div className={popupClasses} ref={popupRef}>
          <div className={styles.content}>{children}</div>
        </div>
      )}
    </div>
  )
}


