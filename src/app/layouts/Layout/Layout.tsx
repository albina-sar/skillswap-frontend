import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { getAccountProfile, selectAccountProfile } from '@/entities/account/model/accountSlice'
import { getUserData, selectIsAuth, selectUserData } from '@/entities/auth/model/authSlice'
import { CATEGORIES_DATA, LOCAL_STORAGE_KEYS, ROUTES } from '@/shared/lib/constants'
import type { Notification, User } from '@/shared/types'
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

const handleSearch = () => {}
const handleCategoryClick = () => {}
const handleSubcategoryClick = () => {}

// Функция для чтения уведомлений из localStorage
const getNotificationsFromStorage = (): Notification[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
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

  // Загружаем данные пользователя
  useEffect(() => {
    dispatch(getUserData())
  }, [dispatch])

  // Загружаем профиль, если есть userId
  useEffect(() => {
    if (authUserId) dispatch(getAccountProfile(authUserId))
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
    return () => window.removeEventListener('skillswap:notifications-changed', handleNotificationsChange)
  }, [])

  const user =
    profile && profile.id === authUserId
      ? profile
      : isAuth
        ? { ...GUEST_USER, id: authUserData.id, name: authUserData.name }
        : GUEST_USER

  // Фильтруем уведомления для текущего пользователя
  const userNotifications = notifications
    .filter((n) => n.userId === authUserId)
    .map((n) => ({
      id: n.id,
      senderName: n.title.split(' ')[0] || 'Пользователь', // заглушка
      title: n.title,
      description: n.description,
      date: formatDate(n.createdAt),
      isRead: n.isRead,
    }))

  const hasNotifications = userNotifications.some((item) => !item.isRead)

  // Форматируем дату
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
    }).format(date)
  }

  // Обработчик "Прочитать все"
  const handleReadAll = () => {
    const updated = notifications.map((n) =>
      n.userId === authUserId ? { ...n, isRead: true } : n,
    )
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated))
    setNotifications(updated)
    window.dispatchEvent(new Event('skillswap:notifications-changed'))
  }

  // Обработчик "Очистить" (удаляем просмотренные)
  const handleClearNotifications = () => {
    const updated = notifications.filter(
      (n) => n.userId !== authUserId || !n.isRead,
    )
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated))
    setNotifications(updated)
    window.dispatchEvent(new Event('skillswap:notifications-changed'))
  }

  // Обработчик "Перейти" — переход на страницу навыка
  const handleNotificationAction = (id: string) => {
    // Ищем уведомление по id
    const notification = notifications.find((n) => n.id === id)
    if (notification) {
      // Ищем запрос по requestId, чтобы получить skillId
      const requests = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS) ?? '[]')
      const request = requests.find((r: any) => r.id === notification.requestId)
      if (request) {
        navigate(`${ROUTES.SKILL.replace(':id', request.skillId)}`)
        return
      }
    }
    // fallback — на главную
    navigate(ROUTES.HOME)
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Header
          isAuth={isAuth}
          user={user}
          onSearch={handleSearch}
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

      <Footer />
    </div>
  )
}
