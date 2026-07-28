import { useRef, useState } from 'react'
import { generatePath, Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import CloseIcon from '@/shared/assets/icons/CrossBlack.svg'
import BoardImage from '@/shared/assets/images/board.svg'
import LampImage from '@/shared/assets/images/lamp.svg'
import UserInfoImage from '@/shared/assets/images/userInfo.svg'
import { registerAccount, updateAccountProfile } from '@/entities/account/model/accountSlice'
import { saveUser } from '@/entities/auth/model/authSlice'
import { createSkill } from '@/entities/skill/model/skillsSlice'
import { fileToDataUrl, generateId } from '@/shared/lib/helpers'
import { ROUTES } from '@/shared/lib/constants'
import type { Skill, User, UserAccount } from '@/shared/types'
import { Card } from '@/shared/ui/Card'
import { HintCard } from '@/shared/ui/HintCard'
import { Logo } from '@/shared/ui/Logo'
import { StepProgress } from '@/shared/ui/StepProgress'
import { useAppDispatch } from '@/store/hooks'
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

interface RegistrationLocationState {
  from?: string
}

export default function RegistrationPage() {
  const { step } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as RegistrationLocationState | null)?.from
  const dispatch = useAppDispatch()
  const initialStep = getInitialStep(step)
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(initialStep)
  const currentHint = hints[currentStep]

  const createdSkillRef = useRef<{ skill: Skill; author: User } | null>(null)

  const handleComplete = async (values: RegistrationFormValues) => {
    try {
      const id = generateId()

      const account: UserAccount = {
        id,
        name: values.name,
        city: values.city,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
        photo: values.avatar ? await fileToDataUrl(values.avatar) : '',
        about: '',
        skills: [],
        wantsToLearn: values.wantsToLearn,
        email: values.email,
        password: values.password,
      }

      const profile = await dispatch(registerAccount(account)).unwrap()
      await dispatch(saveUser({ id: profile.id, name: profile.name, email: profile.email })).unwrap()

      const skillImageUrls = await Promise.all(values.skillImages.map(fileToDataUrl))
      const skill = await dispatch(
        createSkill({
          title: values.title,
          description: values.description,
          categoryId: values.categoryId,
          subcategoryId: values.subcategoryId,
          tags: [],
          imageUrl: skillImageUrls,
          authorId: profile.id,
          learningType: 'teach',
        }),
      ).unwrap()

      const author = await dispatch(
        updateAccountProfile({ id: profile.id, updates: { skills: [skill.id] } }),
      ).unwrap()

      createdSkillRef.current = { skill, author }
    } catch {
      // TODO: показать пользователю ошибку регистрации
    }
  }

  const handleSuccessModalClose = () => {
    if (from) {
      navigate(from, { replace: true })
      return
    }

    if (!createdSkillRef.current) return

    const { skill, author } = createdSkillRef.current
    navigate(generatePath(ROUTES.SKILL, { id: skill.id }), { state: { skill, author } })
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
          <RegistrationForm
            initialStep={initialStep}
            onStepChange={setCurrentStep}
            onComplete={handleComplete}
            onSuccessModalClose={handleSuccessModalClose}
          />
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
