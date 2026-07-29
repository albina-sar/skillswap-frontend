import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import styles from './UserMenu.module.css'
import LogoutIcon from '@/shared/assets/icons/Logout.svg?react'

interface UserMenuProps {
  onLogout: () => void
}

export const UserMenu = ({ onLogout }: UserMenuProps) => {
  return (
    <div className={styles.menu}>
      <Link to={ROUTES.PROFILE} className={styles.link}>
        Личный кабинет
      </Link>

      <button type="button" className={styles.logoutButton} onClick={onLogout}>
        <span className={styles.logoutText}>Выйти из аккаунта</span>
        <LogoutIcon className={styles.icon} />
      </button>
    </div>
  )
}
