import styles from './UserMenu.module.css'
import LogoutIcon from '@/shared/assets/icons/Logout.svg?react'

export const UserMenu = () => {
  return (
    <div className={styles.menu}>
      <a href="#" className={styles.link}>
        Личный кабинет
      </a>

      <button type="button" className={styles.logoutButton}>
        <span className={styles.logoutText}>Выйти из аккаунта</span>
        <LogoutIcon className={styles.icon} />
      </button>
    </div>
  )
}
