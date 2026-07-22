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
  width,
  maxWidth,
  disableAnimation = false,
}: PopoverProps) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false)
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen

  const containerRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (controlledIsOpen === undefined) {
          setUncontrolledIsOpen(false)
        }
        onOpenChange?.(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [controlledIsOpen, onOpenChange])

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

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
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(maxWidth && { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }),
    ...(offset && { marginTop: `${offset}px` }),
  }

  const popupClasses = [
    styles.popup,
    styles[`placement-${placement}`],
    isOpen ? styles.open : styles.closed,
    disableAnimation && styles.noAnimation,
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
          <div className={styles.arrow} />
          <div className={styles.content}>{children}</div>
        </div>
      )}
    </div>
  )
}
