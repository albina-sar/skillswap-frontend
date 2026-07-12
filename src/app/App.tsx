import { StoreProvider } from './providers/StoreProvider'
import { AppRouter } from './providers/RouterProvider'
import './styles/global.css'
import '../shared/assets/fonts.css'

export function App() {
  return (
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  )
}
