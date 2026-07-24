import React from 'react'
import clsx from 'clsx'

interface NotificationIconProps {
  className?: string
  hasDot?: boolean
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ className, hasDot }) => (
  <svg
    className={clsx(className)}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
      <path d="M.779 12.243c-.192 1.255.664 2.125 1.712 2.559 4.016 1.665 9.606 1.665 13.622 0 1.048-.434 1.904-1.305 1.712-2.559-.117-.771-.7-1.413-1.13-2.04-.565-.832-.62-1.738-.621-2.703 0-3.728-3.03-6.75-6.772-6.75-3.741 0-6.773 3.022-6.773 6.75 0 .965-.055 1.872-.62 2.703-.43.627-1.012 1.269-1.13 2.04" />
      <path d="M5.701 16.05c.412 1.553 1.869 2.7 3.6 2.7 1.733 0 3.187-1.147 3.6-2.7" />
    </g>
    {hasDot && (
      <circle cx="15" cy="6 " r="6" fill="var(--alarm)" stroke="white" strokeWidth="1.5" />
    )}
  </svg>
)
