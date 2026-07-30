import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuth, selectIsAuthChecked } from '@/entities/auth/model/authSlice'
import { ROUTES } from '@/shared/lib/constants'

interface OnlyUnAuthProps {
  children: React.ReactNode
}

export function OnlyUnAuth({ children }: OnlyUnAuthProps) {
  const isAuth = useAppSelector(selectIsAuth)
  const isAuthChecked = useAppSelector(selectIsAuthChecked)

  // Пока идёт проверка авторизации - показываем лоадер
  if (!isAuthChecked) {
    return <div>Загрузка...</div>
  }

  // Если пользователь авторизован - редиректим его на главную
  if (isAuth) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <>{children}</>
}
