import React from 'react'
import clsx from 'clsx'

interface FavoriteIconProps {
  className?: string
}

export const FavoriteIcon: React.FC<FavoriteIconProps> = ({ className }) => (
  <svg
    className={clsx(className)}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M10 17.954c-.288 0-.567-.038-.8-.121C5.647 16.614 0 12.288 0 5.898 0 2.642 2.633 0 5.87 0A5.78 5.78 0 0 1 10 1.712 5.78 5.78 0 0 1 14.13 0C17.367 0 20 2.651 20 5.898c0 6.4-5.646 10.716-9.2 11.935-.233.083-.512.12-.8.12M5.87 1.394c-2.465 0-4.475 2.019-4.475 4.503 0 6.353 6.112 9.888 8.26 10.623.168.056.531.056.699 0 2.139-.735 8.26-4.26 8.26-10.623 0-2.484-2.01-4.503-4.475-4.503A4.42 4.42 0 0 0 10.567 3.2c-.26.353-.855.353-1.116 0A4.44 4.44 0 0 0 5.87 1.395"
    />
  </svg>
)
