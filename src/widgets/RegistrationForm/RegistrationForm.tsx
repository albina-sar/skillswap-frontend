import { useEffect, useState, type FormEvent } from 'react'
import { getCategoryIdsBySubcategoryIds, getSubcategoryIdsForCategories } from './registrationOptions'
import { Step1Auth } from './Step1Auth'
import { Step2Profile } from './Step2Profile'
import { Step3Skill } from './Step3Skill'
import type { RegistrationFormProps, RegistrationFormValues, RegistrationStep } from './types'
import styles from './RegistrationForm.module.css'
import * as Yup from 'yup';

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

type DataToValidate = {
  title: string;
  categoryId: string;
  subcategoryId: string;
  description: string;
  skillImages: File[];
};

export const step3SkillSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Название должно быть не менее 3 символов')
    .max(50, 'Название не должно превышать 50 символов')
    .required('Обязательное поле'),
  categoryId: Yup.string().required('Обязательное поле'),
  subcategoryId: Yup.string().required('Обязательное поле'),
  description: Yup.string().max(500, 'Описание не должно превышать 500 символов'),
  skillImages: Yup.array().min(1, 'Добавьте хотя бы одно изображение')
    .of(
      Yup.mixed<File>()
        .test('fileSize', 'Файл должен быть не более 2 МБ', (file) => {
          if (!file) return true;
          return file.size <= 2 * 1024 * 1024; // 2 Мб
        })
        .test('fileType', 'Файл должен иметь формат JPEG или PNG', (file) => {
          if (!file) return true;
          return ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
        })
    )
});

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
      let dataToValidate: DataToValidate = {
        title: values.title,
        categoryId: values.categoryId,
        subcategoryId: values.subcategoryId,
        description: values.description,
        skillImages: Array.isArray(values.skillImages) ? values.skillImages : [],
      };

      try {
        step3SkillSchema.validateSync(dataToValidate, { abortEarly: false });
      } catch (err) {
        if (err instanceof Yup.ValidationError && err.inner) {
          err.inner.forEach((validationErr) => {
            let path = validationErr.path;
            if (path && path.startsWith('skillImages[')) {
              path = 'skillImages';
            }
            if (path === 'skillImages') {
              nextErrors.skillImages = validationErr.message;
            } else if (path) {
              nextErrors[path] = validationErr.message;
            }
          });
        }
      }
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
