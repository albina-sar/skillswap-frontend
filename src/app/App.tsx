import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { getUserData } from '@/entities/auth/model/authSlice'
import { StoreProvider } from './providers/StoreProvider'
import { AppRouter } from './providers/RouterProvider'
import './styles/global.css'
import '../shared/assets/fonts.css'

// Выносим логику с хуками в отдельный компонент
function AppContent() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getUserData())
  }, [dispatch])

  return <AppRouter />
}

// Компонент App теперь только создаёт границу контекста (Provider)
export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  )
}
