import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuth, selectIsAuthChecked } from '@/entities/auth/model/authSlice'
import { ROUTES } from '@/shared/lib/constants'

interface PrivateRouteProps {
  children: React.ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuth = useAppSelector(selectIsAuth)
  const isAuthChecked = useAppSelector(selectIsAuthChecked)
  const location = useLocation()

  // Пока идёт проверка авторизации — показываем лоадер, не редиректим
  if (!isAuthChecked) {
    return <div>Загрузка...</div>
  }

  if (!isAuth) {
    // Сохраняем путь, куда пользователь хотел попасть
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
