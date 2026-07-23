import { useState, useRef, useEffect, cloneElement, isValidElement, ReactElement } from 'react'
import styles from './Popover.module.css'
import type { PopoverProps } from './types'

export const Popover = ({
  trigger,
  children,
  isOpen: controlledIsOpen,
  onOpenChange,
  placement = 'bottom-start',
  offset = 8,
  className = '',
  disableAnimation = false,
  size = 'default',
}: PopoverProps) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false)
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen

  const containerRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const isMouseDownOnPopup = useRef(false)

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node
      const isOnPopup = popupRef.current?.contains(target) || false
      const isOnContainer = containerRef.current?.contains(target) || false

      if (isOnPopup || isOnContainer) {
        isMouseDownOnPopup.current = true
      } else {
        isMouseDownOnPopup.current = false
      }
    }

    const handleMouseUp = (event: MouseEvent) => {
      if (isMouseDownOnPopup.current) {
        isMouseDownOnPopup.current = false
        return
      }

      const target = event.target as Node
      const isOnPopup = popupRef.current?.contains(target) || false
      const isOnContainer = containerRef.current?.contains(target) || false

      if (isOnPopup || isOnContainer) {
        return
      }

      if (controlledIsOpen === undefined) {
        setUncontrolledIsOpen(false)
      }
      onOpenChange?.(false)
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleMouseDown)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousedown', handleMouseDown)
        document.removeEventListener('mouseup', handleMouseUp)
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

  const popupStyle = {
    ...(offset && { marginTop: `${offset}px` }),
  }

  const popupClasses = [
    styles.popup,
    styles[`placement-${placement}`],
    isOpen ? styles.open : styles.closed,
    disableAnimation && styles.noAnimation,
    size !== 'default' && styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.triggerWrapper}>{triggerWithClick}</div>

      {isOpen && (
        <div
          className={popupClasses}
          ref={popupRef}
          style={popupStyle}
        >
          <div className={styles.content}>{children}</div>
        </div>
      )}
    </div>
  )
}
