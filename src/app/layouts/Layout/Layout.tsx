import { Outlet } from 'react-router-dom'
import { getAuthUser } from '@/features/auth/model/authUtils'
import { CATEGORIES_DATA } from '@/shared/lib/constants'
import type { User } from '@/shared/types'
import { CategoryList } from '@/shared/ui/CategoryList'
import { Footer } from '@/shared/ui/Footer'
import { Header } from '@/shared/ui/Header'
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

export function Layout() {
  const authUser = getAuthUser()
  const user = authUser
    ? {
        ...GUEST_USER,
        id: authUser.id,
        name: authUser.name,
      }
    : GUEST_USER

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
          notify={null}
        />
      </header>

      <div className={styles.main}>
        <Outlet />
      </div>

      <Footer />
    </div>
  )
}
