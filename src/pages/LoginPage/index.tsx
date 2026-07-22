import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { saveAuthUser } from '@/features/auth/model/authUtils'
import { ROUTES } from '@/shared/lib/constants'
import AppleIcon from '@/shared/assets/icons/Apple.svg'
import CloseIcon from '@/shared/assets/icons/CrossBlack.svg'
import GoogleIcon from '@/shared/assets/icons/Google.svg'
import LampImage from '@/shared/assets/images/lamp.svg'
import { Button } from '@/shared/ui/button/button'
import { Card } from '@/shared/ui/Card'
import { HintCard } from '@/shared/ui/HintCard'
import { Input } from '@/shared/ui/Input'
import { Logo } from '@/shared/ui/Logo'
import styles from './LoginPage.module.css'

type LoginLocationState = {
  from?: string
}

type RegisteredUser = {
  id: string
  name: string
  email: string
  password: string
}

function loginWithCredentials(email: string, password: string) {
  const rawUser = localStorage.getItem('user')

  if (!rawUser) {
    throw new Error('Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных')
  }

  let registeredUser: RegisteredUser

  try {
    registeredUser = JSON.parse(rawUser) as RegisteredUser
  } catch {
    throw new Error('Не удалось прочитать данные пользователя')
  }

  if (registeredUser.email !== email || registeredUser.password !== password) {
    throw new Error('Email или пароль введены неверно')
  }

  saveAuthUser({
    id: registeredUser.id,
    name: registeredUser.name,
    email: registeredUser.email,
  })
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const destination = (location.state as LoginLocationState | null)?.from ?? ROUTES.HOME

  const finishLogin = (loginEmail: string) => {
    const userName = loginEmail.split('@')[0] || 'Пользователь'

    saveAuthUser({
      id: crypto.randomUUID(),
      name: userName,
      email: loginEmail,
    })
    navigate(destination, { replace: true })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await Promise.resolve()
      loginWithCredentials(email, password)
      navigate(destination, { replace: true })
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Ошибка входа')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    setError('')
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setError('')
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link to={ROUTES.HOME} aria-label="Перейти на главную страницу">
          <Logo />
        </Link>

        <button
          className={styles.closeButton}
          type="button"
          onClick={() => navigate(ROUTES.HOME)}
          aria-label="Закрыть страницу входа"
        >
          <span>Закрыть</span>
          <img src={CloseIcon} alt="Закрыть страницу" aria-hidden="true" />
        </button>
      </header>

      <h1 className={styles.title}>Вход</h1>

      <div className={styles.content}>
        <Card className={styles.formCard}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.socialButtons}>
              <Button
                type="button"
                variant="outline_form"
                size="large"
                image={GoogleIcon}
                imagePosition="left"
                onClick={() => finishLogin('google@skillswap.ru')}
              >
                Продолжить с Google
              </Button>
              <Button
                type="button"
                variant="outline_form"
                size="large"
                image={AppleIcon}
                imagePosition="left"
                onClick={() => finishLogin('apple@skillswap.ru')}
              >
                Продолжить с Apple
              </Button>
            </div>

            <div className={styles.divider}>
              <span>или</span>
            </div>

            <div className={`${styles.fields} ${error ? styles.fieldsWithError : ''}`}>
              <Input
                value={email}
                onChange={handleEmailChange}
                label="Email"
                placeholder="Введите email"
                name="email"
                required
              />
              <Input
                variant="password"
                value={password}
                onChange={handlePasswordChange}
                label="Пароль"
                placeholder="Введите ваш пароль"
                name="password"
                required
              />
            </div>

            {error && (
              <p className={styles.errorMessage} role="alert">
                {error}
              </p>
            )}

            <Button className={styles.submitButton} type="submit" size="large" disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>

            <Link className={styles.registerLink} to={ROUTES.REGISTER}>
              Зарегистрироваться
            </Link>
          </form>
        </Card>

        <HintCard
          image={LampImage}
          imageAlt="Иллюстрация лампочки"
          title="С возвращением в SkillSwap!"
          description="Обменивайтесь знаниями и навыками с другими людьми"
          className={styles.welcomeCard}
        />
      </div>
    </main>
  )
}
