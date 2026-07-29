import { useState, useEffect } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import styles from './Header.module.css'
import { HeaderProps } from './types'
import clsx from 'clsx'
import { clearUser } from '@/entities/auth/model/authSlice'
import { ROUTES } from '@/shared/lib/constants'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useAppDispatch } from '@/store/hooks'

import { Logo } from '../Logo'
import { Input } from '../Input'
import { ThemeToggle } from '../theme-toggle'
import { FavoriteButton } from '../favorite-button'
import { NotificationButton } from '../notification-button'
import { Button } from '../button/button'
import { ProfileUIComponent } from '../profile/profile'
import { Popover } from '../Popover'

export const Header = ({
  isAuth,
  user,
  onSearch,
  categories,
  notify,
  hasNotifications = false,
  isSkillsOpen,
  onSkillsOpenChange,
}: HeaderProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [query, setQuery] = useState<string>('')
  const [isNotifyOpen, setIsNotifyOpen] = useState<boolean>(false)
  const debouncedQuery = useDebounce(query, 500)

  const onQueryChange = (value: string) => {
    setQuery(value)
  }

  const handleLogout = () => {
    dispatch(clearUser())
    navigate(ROUTES.HOME)
  }

  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  return (
    <section className={styles.headerContainer}>
      <NavLink to={ROUTES.HOME} className={styles.logoLink}>
        <Logo />
      </NavLink>
      <nav>
        <ul className={styles.navigation}>
          <li>
            <button className={styles.navButton}>О проекте</button>
          </li>
          <li>
            <Popover
              trigger={
                <button className={styles.navButton}>
                  Все навыки
                  <img
                    src="src/shared/assets/icons/ChevronDown.svg"
                    alt="Стрелка вниз"
                    width={24}
                    height={24}
                  />
                </button>
              }
              isOpen={isSkillsOpen}
              onOpenChange={onSkillsOpenChange}
              size="large"
              anchorToContainer={true}
            >
              {categories}
            </Popover>
          </li>
        </ul>
      </nav>
      <Input
        variant="search"
        value={query}
        onChange={onQueryChange}
        placeholder="Искать навык"
        name="search"
        showClear
      />
      <div className={clsx(styles.authBar, isAuth ? styles.auth : styles.unAuth)}>
        <ThemeToggle isDark={false} onClick={() => {}} />
        {isAuth ? (
          <div className={styles.authTrue}>
            <div className={styles.quickActions}>
              <Popover
                trigger={<NotificationButton hasNotifications={hasNotifications} />}
                isOpen={isNotifyOpen}
                onOpenChange={setIsNotifyOpen}
                placement="bottom-end"
                anchorToContainer={true}
              >
                {notify}
              </Popover>

              <FavoriteButton onClick={() => navigate(ROUTES.FAVORITES)} />
            </div>
            <ProfileUIComponent image={user.photo} name={user.name} onLogout={handleLogout} />
          </div>
        ) : (
          <div className={styles.authFalse}>
            <Button variant="outline" onClick={() => navigate(ROUTES.LOGIN)}>
              Войти
            </Button>
            <Button onClick={() => navigate(ROUTES.REGISTER)}>Зарегистрироваться</Button>
          </div>
        )}
      </div>
    </section>
  )
}
