import { useEffect, useState, type FormEvent } from 'react'
import { getCategoryIdsBySubcategoryIds, getSubcategoryIdsForCategories } from './registrationOptions'
import { Step1Auth } from './Step1Auth'
import { Step2Profile } from './Step2Profile'
import { Step3Skill } from './Step3Skill'
import type { RegistrationFormProps, RegistrationFormValues, RegistrationStep } from './types'
import styles from './RegistrationForm.module.css'

const INITIAL_VALUES: RegistrationFormValues = {
  email: '',
  password: '',
  name: '',
  dateOfBirth: '',
  gender: '',
  city: '',
  wantsToLearn: [],
  title: '',
  categoryId: '',
  subcategoryId: '',
  description: '',
  skillImages: [],
}

export function RegistrationForm({
  initialStep = 1,
  onStepChange,
  onComplete,
  onSuccessModalClose,
}: RegistrationFormProps) {
  const [step, setStep] = useState<RegistrationStep>(initialStep)
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [avatarPreview, setAvatarPreview] = useState('')
  const [learningCategoryIds, setLearningCategoryIds] = useState<string[]>([])
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  useEffect(() => {
    onStepChange?.(step)
  }, [onStepChange, step])

  useEffect(
    () => () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    },
    [avatarPreview],
  )

  const updateValue = <Key extends keyof RegistrationFormValues>(
    key: Key,
    value: RegistrationFormValues[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  const validateStep = () => {
    const nextErrors: Record<string, string> = {}

    if (step === 1) {
      if (!/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = 'Введите корректный email'
      if (values.password.length < 8) nextErrors.password = 'Пароль должен содержать не менее 8 знаков'
    }

    if (step === 2) {
      if (!values.name.trim()) nextErrors.name = 'Введите имя'
      if (!values.dateOfBirth) nextErrors.dateOfBirth = 'Укажите дату рождения'
      if (!values.city) nextErrors.city = 'Выберите город'
      if (!learningCategoryIds.length) nextErrors.learningCategoryIds = 'Выберите категорию'
      if (!values.wantsToLearn.length) nextErrors.wantsToLearn = 'Выберите подкатегорию'
    }

    if (step === 3) {
      if (!values.title.trim()) nextErrors.title = 'Введите название навыка'
      if (!values.categoryId) nextErrors.categoryId = 'Выберите категорию'
      if (!values.subcategoryId) nextErrors.subcategoryId = 'Выберите подкатегорию'
      if (!values.description.trim()) nextErrors.description = 'Добавьте описание'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateStep()) return

    if (step < 3) {
      setStep((step + 1) as RegistrationStep)
      return
    }

    setIsCompleteModalOpen(true)
    onComplete?.(values)
  }

  const selectAvatar = (file?: File) => {
    if (!file) return
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarPreview(URL.createObjectURL(file))
    updateValue('avatar', file)
  }

  const handleLearningCategories = (categoryIds: string[]) => {
    const allowedSubcategoryIds = getSubcategoryIdsForCategories(categoryIds)

    setLearningCategoryIds(categoryIds)
    updateValue(
      'wantsToLearn',
      values.wantsToLearn.filter((id) => allowedSubcategoryIds.includes(id)),
    )
  }

  const handleLearningSubcategories = (subcategoryIds: string[]) => {
    updateValue('wantsToLearn', subcategoryIds)
    if (subcategoryIds.length) {
      const derivedCategoryIds = getCategoryIdsBySubcategoryIds(subcategoryIds)
      setLearningCategoryIds((current) => Array.from(new Set([...current, ...derivedCategoryIds])))
    }
  }

  const handleTeachingCategory = (categoryId: string) => {
    const allowedSubcategoryIds = getSubcategoryIdsForCategories(categoryId ? [categoryId] : [])

    updateValue('categoryId', categoryId)
    if (!allowedSubcategoryIds.includes(values.subcategoryId)) {
      updateValue('subcategoryId', '')
    }
  }

  const handleTeachingSubcategory = (subcategoryId: string) => {
    updateValue('subcategoryId', subcategoryId)
    if (subcategoryId) {
      const [parentId] = getCategoryIdsBySubcategoryIds([subcategoryId])
      if (parentId) updateValue('categoryId', parentId)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {step === 1 && (
        <Step1Auth
          email={values.email}
          password={values.password}
          errors={errors}
          onChangeEmail={(value) => updateValue('email', value)}
          onChangePassword={(value) => updateValue('password', value)}
        />
      )}

      {step === 2 && (
        <Step2Profile
          name={values.name}
          dateOfBirth={values.dateOfBirth}
          gender={values.gender}
          city={values.city}
          wantsToLearn={values.wantsToLearn}
          learningCategoryIds={learningCategoryIds}
          avatarPreview={avatarPreview}
          errors={errors}
          onChangeName={(value) => updateValue('name', value)}
          onChangeDateOfBirth={(value) => updateValue('dateOfBirth', value)}
          onChangeGender={(value) => updateValue('gender', value)}
          onChangeCity={(value) => updateValue('city', value)}
          onSelectAvatar={selectAvatar}
          onChangeLearningCategories={handleLearningCategories}
          onChangeLearningSubcategories={handleLearningSubcategories}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <Step3Skill
          title={values.title}
          categoryId={values.categoryId}
          subcategoryId={values.subcategoryId}
          description={values.description}
          errors={errors}
          isCompleteModalOpen={isCompleteModalOpen}
          isSuccessModalOpen={isSuccessModalOpen}
          onChangeTitle={(value) => updateValue('title', value)}
          onChangeCategory={handleTeachingCategory}
          skillImages={values.skillImages}
          onChangeSubcategory={handleTeachingSubcategory}
          onChangeDescription={(value) => updateValue('description', value)}
          onChangeImages={(files) => updateValue('skillImages', files)}
          onCloseCompleteModal={() => setIsCompleteModalOpen(false)}
          onOpenSuccessModal={() => {
            setIsCompleteModalOpen(false)
            setIsSuccessModalOpen(true)
          }}
          onCloseSuccessModal={() => {
            setIsSuccessModalOpen(false)
            onSuccessModalClose?.()
          }}
          onBack={() => setStep(2)}
        />
      )}
    </form>
  )
}
