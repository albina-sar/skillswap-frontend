import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { ROUTES } from '@/shared/lib/constants'
import { Layout } from '@/app/layouts/Layout'
import { useAppDispatch } from '@/store/hooks'
import { fetchUsersThunk } from '@/entities/user/model/usersSlice'
import { loadSkills } from '@/entities/skill/model/skillsSlice'
import { PrivateRoute } from './PrivateRoute'
import { OnlyUnAuth } from './OnlyUnAuth'


// Lazy-загрузка страниц — каждая страница грузится только при переходе на неё
const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const SkillPage = lazy(() => import('@/pages/SkillPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const CreateSkillPage = lazy(() => import('@/pages/CreateSkillPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegistrationPage = lazy(() => import('@/pages/RegistrationPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export function AppRouter() {

  const dispatch = useAppDispatch();

  useEffect(() => {
      dispatch(fetchUsersThunk())
      dispatch(loadSkills())
    }, [dispatch])

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Загрузка...</div>}>
        <Routes>
          {/* Публичные роуты, доступные неавторизованным пользователям */}
          <Route
            path={ROUTES.LOGIN}
            element={
              <OnlyUnAuth>
                <LoginPage />
              </OnlyUnAuth>
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <OnlyUnAuth>
                <RegistrationPage />
              </OnlyUnAuth>
            }
          />
          <Route
            path={`${ROUTES.REGISTER}/step/:step`}
            element={
              <OnlyUnAuth>
                <RegistrationPage />
              </OnlyUnAuth>
            }
          />

          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={<CatalogPage />} />
            <Route path={ROUTES.SKILL} element={<SkillPage />} />

            {/* Защищённые маршруты */}
            <Route
              path={ROUTES.FAVORITES}
              element={
                <PrivateRoute>
                  <FavoritesPage />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTES.PROFILE}
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTES.CREATE}
              element={
                <PrivateRoute>
                  <CreateSkillPage />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFoundPage errorCode={404} />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
