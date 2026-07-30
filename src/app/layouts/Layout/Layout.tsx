import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { getAccountProfile, selectAccountProfile } from '@/entities/account/model/accountSlice'
import { getUserData, selectIsAuth, selectUserData } from '@/entities/auth/model/authSlice'
import { CATEGORIES_DATA, LOCAL_STORAGE_KEYS, ROUTES } from '@/shared/lib/constants'
import type { Category, Notification, Subcategory, SwapRequest, User } from '@/shared/types'
import { CategoryList } from '@/shared/ui/CategoryList'
import { Footer } from '@/shared/ui/Footer'
import { Header } from '@/shared/ui/Header'
import { NotificationsContent } from '@/shared/ui/NotificationsContent'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import styles from './Layout.module.css'

const GUEST_USER: User = {
  id: '',
  name: '',
  city: '',
  gender: '',
  dateOfBirth: '',
  photo: '',
  about: '',
  skills: [],
  wantsToLearn: [],
}

// Функция для чтения уведомлений из localStorage
const getNotificationsFromStorage = (): Notification[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// ФУНКЦИЯ ФОРМАТИРОВАНИЯ ДАТЫ С "СЕГОДНЯ"/"ВЧЕРА"/"ЗАВТРА"
const formatNotificationDate = (dateString: string): string => {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const targetDate = new Date(date)
  targetDate.setHours(0, 0, 0, 0)

  if (targetDate.getTime() === today.getTime()) {
    return 'Сегодня'
  }

  if (targetDate.getTime() === yesterday.getTime()) {
    return 'Вчера'
  }

  if (targetDate.getTime() === tomorrow.getTime()) {
    return 'Завтра'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date)
}

export function Layout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const isAuth = useAppSelector(selectIsAuth)
  const authUserData = useAppSelector(selectUserData)
  const profile = useAppSelector(selectAccountProfile)

  const authUserId = isAuth ? authUserData.id : undefined

  // Состояние для уведомлений
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    getNotificationsFromStorage(),
  )

  // Управление меню навыков для Header и Footer
  const [isHeaderSkillsOpen, setIsHeaderSkillsOpen] = useState(false)
  const [isFooterSkillsOpen, setIsFooterSkillsOpen] = useState(false)

  useEffect(() => {
    dispatch(getUserData())
  }, [dispatch])

  useEffect(() => {
    if (authUserId) {
      dispatch(getAccountProfile(authUserId))
    }
  }, [authUserId, dispatch])

  // Отслеживаем изменения в localStorage (другие вкладки)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCAL_STORAGE_KEYS.NOTIFICATIONS) {
        setNotifications(getNotificationsFromStorage())
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Отслеживаем изменения в этой же вкладке (событие от requestStorage)
  useEffect(() => {
    const handleNotificationsChange = () => {
      setNotifications(getNotificationsFromStorage())
    }

    window.addEventListener('skillswap:notifications-changed', handleNotificationsChange)
    return () =>
      window.removeEventListener('skillswap:notifications-changed', handleNotificationsChange)
  }, [])

  const user =
    profile && profile.id === authUserId
      ? profile
      : isAuth
        ? { ...GUEST_USER, id: authUserData.id, name: authUserData.name }
        : GUEST_USER

  // ФОРМИРУЕМ УВЕДОМЛЕНИЯ ДЛЯ ПОЛЬЗОВАТЕЛЯ
  const userNotifications = notifications
    .filter((n) => n.userId === authUserId)
    .map((n) => ({
      id: n.id,
      senderName: n.title.split(' ')[0] || 'Пользователь',
      title: n.title,
      description: n.description,
      date: formatNotificationDate(n.createdAt),
      isRead: n.isRead,
    }))

  const hasNotifications = userNotifications.some((item) => !item.isRead)

  // Обработчик "Прочитать все"
  const handleReadAll = () => {
    const updated = notifications.map((n) => (n.userId === authUserId ? { ...n, isRead: true } : n))
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated))
    setNotifications(updated)
    window.dispatchEvent(new Event('skillswap:notifications-changed'))
  }

  // Обработчик "Очистить" (удаляем просмотренные)
  const handleClearNotifications = () => {
    const updated = notifications.filter((n) => n.userId !== authUserId || !n.isRead)
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated))
    setNotifications(updated)
    window.dispatchEvent(new Event('skillswap:notifications-changed'))
  }

  // ОБРАБОТЧИК "ПЕРЕЙТИ" (с типизированными запросами)
  const handleNotificationAction = (id: string) => {
    const notification = notifications.find((n) => n.id === id)

    if (!notification) {
      navigate(ROUTES.HOME)
      return
    }

    // Получаем все запросы из localStorage
    const requestsData = localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS) ?? '[]'
    const requests: SwapRequest[] = JSON.parse(requestsData)

    // Находим запрос по requestId
    const request = requests.find((r: SwapRequest) => r.id === notification.requestId)

    if (request) {
      navigate(`${ROUTES.SKILL.replace(':id', request.skillId)}`)
      return
    }

    navigate(ROUTES.HOME)
  }

  const navigateToCatalog = (skillId: string) => {
    const params = new URLSearchParams({
      skills: skillId,
    })

    navigate({
      pathname: '/',
      search: params.toString(),
    })
  }

  const handleCategoryClick = (category: Category) => {
    navigateToCatalog(category.id)

    setIsHeaderSkillsOpen(false)
    setIsFooterSkillsOpen(false)
  }

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    navigateToCatalog(subcategory.id)

    setIsHeaderSkillsOpen(false)
    setIsFooterSkillsOpen(false)
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Header
          isAuth={isAuth}
          user={user}
          isSkillsOpen={isHeaderSkillsOpen}
          onSkillsOpenChange={setIsHeaderSkillsOpen}
          categories={
            <CategoryList
              categories={CATEGORIES_DATA}
              onCategoryClick={handleCategoryClick}
              onSubcategoryClick={handleSubcategoryClick}
            />
          }
          hasNotifications={hasNotifications}
          notify={
            <NotificationsContent
              notifications={userNotifications}
              onAction={handleNotificationAction}
              onReadAll={handleReadAll}
              onClear={handleClearNotifications}
            />
          }
        />
      </header>

      <div className={styles.main}>
        <Outlet />
      </div>

      <Footer
        isSkillsOpen={isFooterSkillsOpen}
        onSkillsOpenChange={setIsFooterSkillsOpen}
        categories={
          <CategoryList
            categories={CATEGORIES_DATA}
            onCategoryClick={handleCategoryClick}
            onSubcategoryClick={handleSubcategoryClick}
          />
        }
      />
    </div>
  )
}
