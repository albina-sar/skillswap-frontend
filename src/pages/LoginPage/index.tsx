import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAppDispatch as useDispatch } from '@/store/hooks'
import { loginUser, saveUser } from '@/entities/auth/model/authSlice'
import { ROUTES } from '@/shared/lib/constants'
import { generateId } from '@/shared/lib/helpers'
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

interface LoginFormValues {
  email: string;
  password: string;
}

const loginSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
});

// Единое сообщение об ошибке
const GENERAL_ERROR_MESSAGE =
  'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных';

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [generalError, setGeneralError] = useState('')

  const destination = (location.state as LoginLocationState | null)?.from ?? ROUTES.HOME

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onSubmit',
    defaultValues: { email: '', password: '' },
  })

  const finishLogin = async (loginEmail: string) => {
    const userName = loginEmail.split('@')[0] || 'Пользователь'
    try {
      await dispatch(saveUser({ id: generateId(), name: userName, email: loginEmail })).unwrap();
      navigate(destination, { replace: true });
    } catch {
      setGeneralError(GENERAL_ERROR_MESSAGE);
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    setGeneralError('');
    try {
      await dispatch(loginUser(values)).unwrap();
      navigate(destination, { replace: true });
    } catch {
      setGeneralError(GENERAL_ERROR_MESSAGE);
    }
  };

  // Ошибка валидации: показываем общее сообщение
  const onError = () => {
    setGeneralError(GENERAL_ERROR_MESSAGE);
  };

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
          <form className={styles.form} onSubmit={handleSubmit(onSubmit, onError)}>
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

            <div className={`${styles.fields} ${generalError ? styles.fieldsWithError : ''}`}>
              <Controller
                name="email"
                control={control}
                render={({ field: { ref: _ref, ...field } }) => (
                  <Input
                    {...field}
                    label="Email"
                    placeholder="Введите email"
                    name="email"
                  />
                )}
              />
              
              <Controller
                name="password"
                control={control}
                render={({ field: { ref: _ref, ...field } }) => (
                  <Input
                    {...field}
                    variant="password"
                    label="Пароль"
                    placeholder="Введите ваш пароль"
                    name="password"
                  />
                )}
              />
            </div>

            {generalError && (
              <p className={styles.errorMessage} role="alert">
                {generalError}
              </p>
            )}

            <Button
              className={styles.submitButton}
              type="submit"
              size="large"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Вход...' : 'Войти'}
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