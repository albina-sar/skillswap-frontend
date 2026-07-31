import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuth, selectIsAuthChecked } from '@/entities/auth/model/authSlice'
import { ROUTES } from '@/shared/lib/constants'

interface OnlyUnAuthProps {
  children: React.ReactNode
}

export function OnlyUnAuth({ children }: OnlyUnAuthProps) {
  const isAuth = useAppSelector(selectIsAuth)
  const isAuthChecked = useAppSelector(selectIsAuthChecked)
  const location = useLocation();

  // Пока идёт проверка авторизации - показываем лоадер
  if (!isAuthChecked) {
    return <div>Загрузка...</div>
  }

  // Если пользователь авторизован - редиректим его на главную
  if (isAuth) {
    const from = location.state?.from || { pathname: ROUTES.HOME };
    return <Navigate replace to={from} />;
  }

  return <>{children}</>
}
