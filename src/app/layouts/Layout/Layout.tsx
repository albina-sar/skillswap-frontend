import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { getAuthUser } from '@/features/auth/model/authUtils'
import { CATEGORIES_DATA } from '@/shared/lib/constants'
import type { User } from '@/shared/types'
import { CategoryList } from '@/shared/ui/CategoryList'
import { Footer } from '@/shared/ui/Footer'
import { Header } from '@/shared/ui/Header'
import { NotificationsContent } from '@/shared/ui/NotificationsContent'
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
  const authUser = getAuthUser()
  const user = authUser
    ? {
        ...GUEST_USER,
        id: authUser.id,
        name: authUser.name,
      }
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
          isAuth={Boolean(authUser)}
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
