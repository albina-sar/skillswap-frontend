import { FC, memo, useEffect, useRef, useState } from 'react'

import { Avatar } from '@/components/avatar-element'

import { UserMenu } from './UserMenu'
import { ProfileUIProps } from './types'
import styles from './profile.module.css'

export const ProfileUIComponent: FC<ProfileUIProps> = ({ image, name, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button className={styles.container} onClick={toggleMenu} type="button">
        <span className={styles.text}>{name}</span>

        <Avatar image={image} name={name} size="xs" />
      </button>

      {isMenuOpen && <UserMenu onLogout={onLogout} />}
    </div>
  )
}

ProfileUIComponent.displayName = 'ProfileUI'

export const ProfileUI = memo(ProfileUIComponent)
