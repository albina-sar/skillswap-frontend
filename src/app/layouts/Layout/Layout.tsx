import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { getAccountProfile, selectAccountProfile } from '@/entities/account/model/accountSlice'
import { getUserData, selectIsAuth, selectUserData } from '@/entities/auth/model/authSlice'
import { CATEGORIES_DATA } from '@/shared/lib/constants'
import type { User } from '@/shared/types'
import { CategoryList } from '@/shared/ui/CategoryList'
import { Footer } from '@/shared/ui/Footer'
import { Header } from '@/shared/ui/Header'
import { NotificationsContent } from '@/shared/ui/NotificationsContent'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import styles from './Layout.module.css'

// TODO: заменить на реальные данные из слайса уведомлений
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    senderName: 'Татьяна',
    title: 'предлагает вам обмен',
    description: 'Хочет обменяться навыком "Йога" на "Гитара"',
    date: '22 июля',
    isRead: false,
  },
  {
    id: '2',
    senderName: 'Олег',
    title: 'принял ваш обмен',
    description: 'Обмен навыком "Английский язык" подтверждён',
    date: '21 июля',
    isRead: true,
  },
]

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

export function Layout() {
  const dispatch = useAppDispatch()
  const isAuth = useAppSelector(selectIsAuth)
  const authUserData = useAppSelector(selectUserData)
  const profile = useAppSelector(selectAccountProfile)
  const authUserId = isAuth ? authUserData.id : undefined

  useEffect(() => {
    dispatch(getUserData())
  }, [dispatch])

  useEffect(() => {
    if (authUserId) dispatch(getAccountProfile(authUserId))
  }, [authUserId, dispatch])

  const user =
    profile && profile.id === authUserId
      ? profile
      : isAuth
        ? { ...GUEST_USER, id: authUserData.id, name: authUserData.name }
        : GUEST_USER

  // TODO: весь блок ниже — временная заглушка на локальном useState.
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const hasNotifications = notifications.some((item) => !item.isRead)

  const handleReadAll = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
  }

  const handleClearNotifications = () => {
    setNotifications((prev) => prev.filter((item) => !item.isRead))
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
              notifications={notifications}
              onAction={(id) => console.log('action:', id)}
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
