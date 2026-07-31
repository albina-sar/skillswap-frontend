import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import styles from './Header.module.css'
import { HeaderProps } from './types'
import clsx from 'clsx'
import { clearUser } from '@/entities/auth/model/authSlice'
import { ROUTES } from '@/shared/lib/constants'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useAppDispatch } from '@/store/hooks'
import { useSearchSuggestions } from '@/features/search/model/useSearchSuggestions'

import { Logo } from '../Logo'
import ChevronDown from '@/shared/assets/icons/ChevronDown.svg';
import { Input } from '../Input'
import { ThemeToggle } from '../theme-toggle'
import { FavoriteButton } from '../favorite-button'
import { NotificationButton } from '../notification-button'
import { Button } from '../button/button'
import { ProfileUIComponent } from '../profile/profile'
import { Popover } from '../Popover'
import { SearchDropdown } from '@/shared/ui/SearchDropdown/SearchDropdown'
import { SearchSuggestion } from '@/features/search/model/types'

export const Header = ({
  isAuth,
  user,
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const debouncedQuery = useDebounce(query, 500)
  const searchResults = useSearchSuggestions(debouncedQuery)
  const containerRef = useRef<HTMLDivElement>(null)

  const onQueryChange = (value: string) => {
    setQuery(value)
  }

  const handleLogout = () => {
    dispatch(clearUser())
    navigate(ROUTES.HOME)
  }

  // Управление открытием дропдауна
  useEffect(() => {
    if (debouncedQuery.trim() && searchResults.length > 0) {
      setIsDropdownOpen(true)
    } else {
      setIsDropdownOpen(false)
    }
  }, [debouncedQuery, searchResults])

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Обработчик выбора
  const handleSelect = useCallback(
    (result: SearchSuggestion) => {
      setIsDropdownOpen(false)
      setQuery('')

      if (result.type === 'skill') {
        navigate(`/skill/${result.id}`)
      } else if (result.type === 'category' || result.type === 'subcategory') {
        navigate(`${ROUTES.HOME}?skills=${result.id}`)
      }
    },
    [navigate],
  )

  // Обработчик нажатия Escape
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false)
      setQuery('')
    }
  }

  // Потеря фокуса с задержкой
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
        setIsDropdownOpen(false)
      }
    }, 100)
  }, [])

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
                    src={ChevronDown}
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
      <div
        className={styles.searchWrapper}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        ref={containerRef}
      >
        <Input
          variant="search"
          value={query}
          onChange={onQueryChange}
          placeholder="Искать навык"
          name="search"
          showClear
        />
        <SearchDropdown results={searchResults} onSelect={handleSelect} isOpen={isDropdownOpen} />
      </div>
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
