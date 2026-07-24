import { Logo } from '@/shared/ui/Logo'
import { Popover } from '@/shared/ui/Popover'
import { CategoryList } from '@/shared/ui/CategoryList'
import { CATEGORIES_DATA } from '@/shared/lib/constants'
import styles from './Footer.module.css'

export function Footer() {
  const handleCategoryClick = () => {}

  const handleSubcategoryClick = () => {}

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

          <Popover
            trigger={
              <button className={styles.link} type="button">
                Все навыки
              </button>
            }
            placement="top-start"
            size="large"
          >
            <CategoryList
              categories={CATEGORIES_DATA}
              onCategoryClick={handleCategoryClick}
              onSubcategoryClick={handleSubcategoryClick}
            />
          </Popover>

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