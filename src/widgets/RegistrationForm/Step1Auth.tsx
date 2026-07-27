import AppleIcon from '@/shared/assets/icons/Apple.svg'
import GoogleIcon from '@/shared/assets/icons/Google.svg'
import { Button } from '@/shared/ui/button/button'
import { Input } from '@/shared/ui/Input'
import type { Step1AuthProps } from './types'
import styles from './RegistrationForm.module.css'

export function Step1Auth({ email, password, errors, onChangeEmail, onChangePassword }: Step1AuthProps) {
  const isPasswordStrong = password.length >= 8

  return (
    <>
      <div className={styles.socialButtons}>
        <Button
          type="button"
          variant="outline_form"
          size="large"
          image={GoogleIcon}
          imagePosition="left"
          onClick={() => onChangeEmail('google@skillswap.ru')}
        >
          Продолжить с Google
        </Button>
        <Button
          type="button"
          variant="outline_form"
          size="large"
          image={AppleIcon}
          imagePosition="left"
          onClick={() => onChangeEmail('apple@skillswap.ru')}
        >
          Продолжить с Apple
        </Button>
      </div>

      <div className={styles.divider}>
        <span>или</span>
      </div>

      <div className={styles.field}>
        <Input
          value={email}
          onChange={onChangeEmail}
          label="Email"
          placeholder="Введите email"
          name="registration-email"
          className={errors.email ? styles.inputError : ''}
        />
        {errors.email && (
          <p className={styles.errorSlot} role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className={`${styles.field} ${styles.passwordField}`}>
        <Input
          variant="password"
          value={password}
          onChange={onChangePassword}
          label="Пароль"
          placeholder="Придумайте надёжный пароль"
          name="registration-password"
          className={errors.password ? styles.inputError : ''}
        />
        <p
          className={`${styles.errorSlot} ${isPasswordStrong ? styles.successMessage : ''}`}
          role={errors.password ? 'alert' : isPasswordStrong ? 'status' : undefined}
        >
          {errors.password || (isPasswordStrong ? 'Надежный' : 'Пароль должен содержать не менее 8 знаков')}
        </p>
      </div>

      <Button className={styles.singleButton} type="submit" size="large">
        Далее
      </Button>
    </>
  )
}
