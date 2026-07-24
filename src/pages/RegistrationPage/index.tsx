import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CloseIcon from '@/shared/assets/icons/CrossBlack.svg'
import BoardImage from '@/shared/assets/images/board.svg'
import LampImage from '@/shared/assets/images/lamp.svg'
import UserInfoImage from '@/shared/assets/images/userInfo.svg'
import { ROUTES } from '@/shared/lib/constants'
import { Card } from '@/shared/ui/Card'
import { HintCard } from '@/shared/ui/HintCard'
import { Logo } from '@/shared/ui/Logo'
import { StepProgress } from '@/shared/ui/StepProgress'
import {
  RegistrationForm,
  type RegistrationFormValues,
  type RegistrationStep,
} from '@/widgets/RegistrationForm'
import styles from './RegistrationPage.module.css'

const getInitialStep = (step?: string): RegistrationStep => {
  const parsedStep = Number(step)
  return parsedStep === 2 || parsedStep === 3 ? parsedStep : 1
}

const hints = {
  1: {
    image: LampImage,
    imageAlt: 'Иллюстрация лампочки',
    title: 'Добро пожаловать в SkillSwap!',
    description: 'Обменивайтесь знаниями и навыками с другими людьми',
  },
  2: {
    image: UserInfoImage,
    imageAlt: 'Иллюстрация пользователя',
    title: 'Расскажите немного о себе',
    description: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  },
  3: {
    image: BoardImage,
    imageAlt: 'Иллюстрация доски с навыком',
    title: 'Укажите, чем вы готовы поделиться',
    description: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
  },
} satisfies Record<
  RegistrationStep,
  { image: string; imageAlt: string; title: string; description: string }
>

export default function RegistrationPage() {
  const { step } = useParams()
  const navigate = useNavigate()
  const initialStep = getInitialStep(step)
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(initialStep)
  const [isComplete, setIsComplete] = useState(false)
  const currentHint = hints[currentStep]

  const handleComplete = (values: RegistrationFormValues) => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        ...values,
        id: crypto.randomUUID(),
        avatar: undefined,
        skillImages: [],
      }),
    )
    setIsComplete(true)
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
          aria-label="Закрыть страницу регистрации"
        >
          <span>Закрыть</span>
          <img src={CloseIcon} alt="" />
        </button>
      </header>

      <div className={styles.progress}>
        <StepProgress currentStep={currentStep} stepsAmount={3} />
      </div>

      <div className={styles.content}>
        <Card className={styles.formCard}>
          {isComplete ? (
            <p className={styles.success}>Регистрация завершена</p>
          ) : (
            <RegistrationForm
              initialStep={initialStep}
              onStepChange={setCurrentStep}
              onComplete={handleComplete}
            />
          )}
        </Card>

        <HintCard
          image={currentHint.image}
          imageAlt={currentHint.imageAlt}
          title={currentHint.title}
          description={currentHint.description}
          className={styles.welcomeCard}
        />
      </div>
    </main>
  )
}
