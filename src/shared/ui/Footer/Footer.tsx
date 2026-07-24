import { Logo } from '@/shared/ui/Logo'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo />

          <span className={styles.copyright}>SkillSwap — 2025</span>
        </div>

        <nav className={styles.nav} aria-label="Навигация в футере">
          <button className={styles.link} type="button">
            О проекте
          </button>

          <button className={styles.link} type="button">
            Все навыки
          </button>

          <button className={styles.link} type="button">
            Контакты
          </button>

          <button className={styles.link} type="button">
            Блог
          </button>

          <button className={styles.link} type="button">
            Политика конфиденциальности
          </button>

          <button className={styles.link} type="button">
            Пользовательское соглашение
          </button>
        </nav>
      </div>
    </footer>
  )
}