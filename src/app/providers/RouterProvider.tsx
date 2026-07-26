import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from '@/shared/lib/constants'
import { Layout } from '@/app/layouts/Layout'

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
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Загрузка...</div>}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegistrationPage />} />
          <Route path={`${ROUTES.REGISTER}/step/:step`} element={<RegistrationPage />} />

          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={<CatalogPage />} />
            <Route path={ROUTES.SKILL} element={<SkillPage />} />
            <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />

            {/* Защищённые маршруты — добавь PrivateRoute обёртку */}
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.CREATE} element={<CreateSkillPage />} />

            <Route path="*" element={<NotFoundPage errorCode={404} />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
