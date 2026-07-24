import { useEffect, useMemo, useState, type FormEvent } from 'react'
import AppleIcon from '@/shared/assets/icons/Apple.svg'
import GoogleIcon from '@/shared/assets/icons/Google.svg'
import { CATEGORIES_DATA, GENDER_OPTIONS, MOCK_CITIES } from '@/shared/lib/constants'
import { AvatarUI } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button/button'
import { Calendar } from '@/shared/ui/Calendar'
import { Combobox } from '@/shared/ui/Combobox'
import { ImageUpload } from '@/shared/ui/ImageUpload'
import { Input } from '@/shared/ui/Input'
import { CheckboxSelect } from './CheckboxSelect'
import type {
  RegistrationFormProps,
  RegistrationFormValues,
  RegistrationStep,
} from './types'
import styles from './RegistrationForm.module.css'

const INITIAL_VALUES: RegistrationFormValues = {
  email: '',
  password: '',
  name: '',
  dateOfBirth: '',
  gender: '',
  city: '',
  learningCategoryIds: [],
  learningSubcategoryIds: [],
  skillTitle: '',
  teachingCategoryIds: [],
  teachingSubcategoryIds: [],
  skillDescription: '',
  skillImages: [],
}

const categoryOptions = CATEGORIES_DATA.map(({ id, name }) => ({ value: id, label: name }))
const cityOptions = MOCK_CITIES.map(({ id, name }) => ({ value: id, label: name }))
const genderOptions = GENDER_OPTIONS.map(({ value, label }) => ({ value, label }))

const toIsoDate = (date: Date) => {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

const fromIsoDate = (value: string) => (value ? new Date(`${value}T00:00:00`) : null)

export function RegistrationForm({
  initialStep = 1,
  onStepChange,
  onComplete,
}: RegistrationFormProps) {
  const [step, setStep] = useState<RegistrationStep>(initialStep)
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [avatarPreview, setAvatarPreview] = useState('')
  const isPasswordStrong = values.password.length >= 8

  useEffect(() => {
    onStepChange?.(step)
  }, [onStepChange, step])

  useEffect(
    () => () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    },
    [avatarPreview],
  )

  const learningSubcategoryOptions = useMemo(
    () =>
      CATEGORIES_DATA.filter(
        ({ id }) =>
          !values.learningCategoryIds.length || values.learningCategoryIds.includes(id),
      ).flatMap(({ subcategories }) =>
        subcategories.map(({ id, name }) => ({ value: id, label: name })),
      ),
    [values.learningCategoryIds],
  )

  const teachingSubcategoryOptions = useMemo(
    () =>
      CATEGORIES_DATA.filter(
        ({ id }) =>
          !values.teachingCategoryIds.length || values.teachingCategoryIds.includes(id),
      ).flatMap(({ subcategories }) =>
        subcategories.map(({ id, name }) => ({ value: id, label: name })),
      ),
    [values.teachingCategoryIds],
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
      if (!values.learningCategoryIds.length) nextErrors.learningCategoryIds = 'Выберите категорию'
      if (!values.learningSubcategoryIds.length) {
        nextErrors.learningSubcategoryIds = 'Выберите подкатегорию'
      }
    }

    if (step === 3) {
      if (!values.skillTitle.trim()) nextErrors.skillTitle = 'Введите название навыка'
      if (!values.teachingCategoryIds.length) nextErrors.teachingCategoryIds = 'Выберите категорию'
      if (!values.teachingSubcategoryIds.length) {
        nextErrors.teachingSubcategoryIds = 'Выберите подкатегорию'
      }
      if (!values.skillDescription.trim()) nextErrors.skillDescription = 'Добавьте описание'
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

    onComplete?.(values)
  }

  const selectAvatar = (file?: File) => {
    if (!file) return
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarPreview(URL.createObjectURL(file))
    updateValue('avatar', file)
  }

  const handleLearningCategories = (categoryIds: string[]) => {
    const allowedSubcategoryIds = CATEGORIES_DATA.filter(({ id }) => categoryIds.includes(id))
      .flatMap(({ subcategories }) => subcategories)
      .map(({ id }) => id)

    updateValue('learningCategoryIds', categoryIds)
    updateValue(
      'learningSubcategoryIds',
      values.learningSubcategoryIds.filter((id) => allowedSubcategoryIds.includes(id)),
    )
  }

  const handleTeachingCategories = (categoryIds: string[]) => {
    const allowedSubcategoryIds = CATEGORIES_DATA.filter(({ id }) => categoryIds.includes(id))
      .flatMap(({ subcategories }) => subcategories)
      .map(({ id }) => id)

    updateValue('teachingCategoryIds', categoryIds)
    updateValue(
      'teachingSubcategoryIds',
      values.teachingSubcategoryIds.filter((id) => allowedSubcategoryIds.includes(id)),
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {step === 1 && (
        <>
          <div className={styles.socialButtons}>
            <Button
              type="button"
              variant="outline_form"
              size="large"
              image={GoogleIcon}
              imagePosition="left"
              onClick={() => updateValue('email', 'google@skillswap.ru')}
            >
              Продолжить с Google
            </Button>
            <Button
              type="button"
              variant="outline_form"
              size="large"
              image={AppleIcon}
              imagePosition="left"
              onClick={() => updateValue('email', 'apple@skillswap.ru')}
            >
              Продолжить с Apple
            </Button>
          </div>

          <div className={styles.divider}>
            <span>или</span>
          </div>

          <div className={styles.field}>
            <Input
              value={values.email}
              onChange={(value) => updateValue('email', value)}
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
              value={values.password}
              onChange={(value) => updateValue('password', value)}
              label="Пароль"
              placeholder="Придумайте надёжный пароль"
              name="registration-password"
              className={errors.password ? styles.inputError : ''}
            />
            <p
              className={`${styles.errorSlot} ${isPasswordStrong ? styles.successMessage : ''}`}
              role={errors.password ? 'alert' : isPasswordStrong ? 'status' : undefined}
            >
              {errors.password ||
                (isPasswordStrong ? 'Надежный' : 'Пароль должен содержать не менее 8 знаков')}
            </p>
          </div>

          <Button className={styles.singleButton} type="submit" size="large">
            Далее
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <label className={styles.avatarUpload}>
            <AvatarUI image={avatarPreview} name={values.name || 'Новый пользователь'} size="sm" iconType="add" />
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(event) => selectAvatar(event.target.files?.[0])}
            />
          </label>

          <div className={styles.field}>
            <Input
              value={values.name}
              onChange={(value) => updateValue('name', value)}
              label="Имя"
              placeholder="Введите ваше имя"
              name="registration-name"
              className={errors.name ? styles.inputError : ''}
            />
            <p className={styles.errorSlot} role={errors.name ? 'alert' : undefined}>
              {errors.name || '\u00a0'}
            </p>
          </div>

          <div className={styles.twoColumns}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="registration-birthday">
                Дата рождения
              </label>
              <div className={errors.dateOfBirth ? styles.calendarError : ''}>
                <Calendar
                  id="registration-birthday"
                  value={fromIsoDate(values.dateOfBirth)}
                  onSubmit={(date) => updateValue('dateOfBirth', toIsoDate(date))}
                />
              </div>
              <p className={styles.errorSlot} role={errors.dateOfBirth ? 'alert' : undefined}>
                {errors.dateOfBirth || '\u00a0'}
              </p>
            </div>

            <div className={styles.field}>
              <Combobox
                value={values.gender}
                options={genderOptions}
                label="Пол"
                name="registration-gender"
                onChange={(value) => updateValue('gender', value)}
              />
              <p className={styles.errorSlot}>{'\u00a0'}</p>
            </div>
          </div>

          <div className={`${styles.field} ${errors.city ? styles.comboboxError : ''}`}>
            <Combobox
              value={values.city}
              options={cityOptions}
              label="Город"
              name="registration-city"
              searchable
              onChange={(value) => updateValue('city', value)}
            />
            <p className={styles.errorSlot} role={errors.city ? 'alert' : undefined}>
              {errors.city || '\u00a0'}
            </p>
          </div>

          <CheckboxSelect
            label="Категория навыка, которому хотите научиться"
            placeholder="Выберите категорию"
            options={categoryOptions}
            values={values.learningCategoryIds}
            name="learning-categories"
            error={errors.learningCategoryIds}
            onChange={handleLearningCategories}
          />
          <CheckboxSelect
            label="Подкатегория навыка, которому хотите научиться"
            placeholder="Выберите подкатегорию"
            options={learningSubcategoryOptions}
            values={values.learningSubcategoryIds}
            name="learning-subcategories"
            error={errors.learningSubcategoryIds}
            onChange={(selected) => updateValue('learningSubcategoryIds', selected)}
          />

          <div className={styles.actions}>
            <Button type="button" variant="outline" size="large" onClick={() => setStep(1)}>
              Назад
            </Button>
            <Button type="submit" size="large">
              Продолжить
            </Button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className={styles.field}>
            <Input
              value={values.skillTitle}
              onChange={(value) => updateValue('skillTitle', value)}
              label="Название навыка"
              placeholder="Введите название вашего навыка"
              name="registration-skill-title"
              className={errors.skillTitle ? styles.inputError : ''}
            />
            <p className={styles.errorSlot} role={errors.skillTitle ? 'alert' : undefined}>
              {errors.skillTitle || '\u00a0'}
            </p>
          </div>

          <CheckboxSelect
            label="Категория навыка"
            placeholder="Выберите категорию навыка"
            options={categoryOptions}
            values={values.teachingCategoryIds}
            name="teaching-categories"
            error={errors.teachingCategoryIds}
            onChange={handleTeachingCategories}
          />
          <CheckboxSelect
            label="Подкатегория навыка"
            placeholder="Выберите подкатегорию навыка"
            options={teachingSubcategoryOptions}
            values={values.teachingSubcategoryIds}
            name="teaching-subcategories"
            error={errors.teachingSubcategoryIds}
            onChange={(selected) => updateValue('teachingSubcategoryIds', selected)}
          />

          <div className={styles.field}>
            <Input
              variant="textarea"
              value={values.skillDescription}
              onChange={(value) => updateValue('skillDescription', value)}
              label="Описание"
              placeholder="Коротко опишите, чему можете научить"
              name="registration-description"
              className={errors.skillDescription ? styles.inputError : ''}
            />
            <p className={styles.errorSlot} role={errors.skillDescription ? 'alert' : undefined}>
              {errors.skillDescription || '\u00a0'}
            </p>
          </div>

          <ImageUpload
            className={styles.imageUpload}
            onChange={(files) => updateValue('skillImages', files)}
            accept="image/jpeg,image/png"
          />

          <div className={styles.actions}>
            <Button type="button" variant="outline" size="large" onClick={() => setStep(2)}>
              Назад
            </Button>
            <Button type="submit" size="large">
              Продолжить
            </Button>
          </div>
        </>
      )}
    </form>
  )
}
