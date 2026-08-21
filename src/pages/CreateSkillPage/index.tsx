// src/pages/CreateSkillPage/index.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { CATEGORIES_DATA, ROUTES } from '@/shared/lib/constants'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { Button } from '@/shared/ui/button/button'
import { Card } from '@/shared/ui/Card/Card'

import styles from './CreateSkillPage.module.css'

// ===== СХЕМА ВАЛИДАЦИИ =====
const skillSchema = yup.object({
  title: yup
    .string()
    .required('Название обязательно')
    .min(3, 'Название должно быть не менее 3 символов')
    .max(50, 'Название не должно превышать 50 символов'),
  categoryId: yup.string().required('Выберите категорию'),
  subcategoryId: yup.string().required('Выберите подкатегорию'),
  description: yup
    .string()
    .required('Описание обязательно')
    .min(10, 'Описание должно быть не менее 10 символов')
    .max(500, 'Описание не должно превышать 500 символов'),
  tags: yup
    .string()
    .max(100, 'Теги не должны превышать 100 символов')
    .optional(),
  learningType: yup
    .string()
    .oneOf(['learn', 'teach', 'any'], 'Выберите тип обучения')
    .required('Выберите тип обучения'),
})

type SkillFormData = yup.InferType<typeof skillSchema>

export default function CreateSkillPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageError, setImageError] = useState<string>('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: yupResolver(skillSchema),
    defaultValues: {
      title: '',
      categoryId: '',
      subcategoryId: '',
      description: '',
      tags: '',
      learningType: 'teach',
    },
  })

  const selectedCategoryId = watch('categoryId')

  const selectedCategory = CATEGORIES_DATA.find((c) => c.id === selectedCategoryId)
  const subcategoryOptions = selectedCategory
    ? selectedCategory.subcategories.map((sub) => ({
        value: sub.id,
        label: sub.name,
      }))
    : []

  const categoryOptions = CATEGORIES_DATA.map((category) => ({
    value: category.id,
    label: category.name,
  }))

  const learningTypeOptions = [
    { value: 'teach', label: 'Я учу' },
    { value: 'learn', label: 'Я учусь' },
    { value: 'any', label: 'Я учу и учусь' },
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setImageError('Размер файла не должен превышать 2 МБ')
      return
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setImageError('Допустимые форматы: JPEG, PNG')
      return
    }

    setImageError('')
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const onSubmit = (data: SkillFormData) => {
    setIsSubmitting(true)

    try {
      const newSkill = {
        id: `skill_${Date.now()}`,
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
        imageUrl: previewImage ? [previewImage] : [],
        authorId: '1',
        createdAt: new Date().toISOString(),
        likesCount: 0,
        learningType: data.learningType as 'learn' | 'teach' | 'any',
      }

      const savedSkills = JSON.parse(localStorage.getItem('skillswap_created_skills') ?? '[]')
      localStorage.setItem('skillswap_created_skills', JSON.stringify([...savedSkills, newSkill]))

      navigate(`/skill/${newSkill.id}`)
    } catch (error) {
      console.error('Ошибка при создании навыка:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Создание навыка</h1>
        <p className={styles.subtitle}>Шаг 3 из 3</p>

        <Card className={styles.formCard}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {/* Название навыка */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  label="Название навыка"
                  placeholder="Введите название вашего навыка"
                  value={field.value || ''}
                  onChange={field.onChange}
                  error={errors.title?.message}
                  required
                />
              )}
            />

            {/* Тип обучения */}
            <Controller
              name="learningType"
              control={control}
              render={({ field }) => (
                <Select
                  label="Я хочу"
                  placeholder="Выберите тип"
                  options={learningTypeOptions}
                  value={field.value || ''}
                  onChange={field.onChange}
                  error={errors.learningType?.message}
                  required
                />
              )}
            />

            {/* Категория */}
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Категория навыка"
                  placeholder="Выберите категорию"
                  options={categoryOptions}
                  value={field.value || ''}
                  onChange={(value) => {
                    field.onChange(value)
                    setValue('subcategoryId', '')
                  }}
                  error={errors.categoryId?.message}
                  required
                />
              )}
            />

            {/* Подкатегория */}
            <Controller
              name="subcategoryId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Подкатегория навыка"
                  placeholder="Выберите подкатегорию"
                  options={subcategoryOptions}
                  value={field.value || ''}
                  onChange={field.onChange}
                  error={errors.subcategoryId?.message}
                  required
                  disabled={!selectedCategoryId}
                />
              )}
            />

            {/* Описание */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input
                  variant="textarea"
                  label="Описание"
                  placeholder="Коротко опишите, чему можете научить"
                  value={field.value || ''}
                  onChange={field.onChange}
                  error={errors.description?.message}
                  required
                />
              )}
            />

            {/* Теги */}
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Input
                  label="Теги (через запятую)"
                  placeholder="Например: JavaScript, React, TypeScript"
                  value={field.value || ''}
                  onChange={field.onChange}
                  error={errors.tags?.message}
                />
              )}
            />

            {/* Загрузка изображения */}
            <div className={styles.imageUpload}>
              <label className={styles.imageLabel}>Изображение навыка</label>
              <div className={styles.imageDropZone}>
                {previewImage ? (
                  <div className={styles.previewContainer}>
                    <img src={previewImage} alt="Preview" className={styles.preview} />
                    <button
                      type="button"
                      className={styles.removeImage}
                      onClick={() => {
                        setPreviewImage(null)
                        setImageError('')
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <p className={styles.imagePlaceholder}>Перетащите или выберите изображение</p>
                    <p className={styles.imageHint}>JPEG, PNG (макс. 2 МБ)</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageUpload}
                  className={styles.imageInput}
                />
              </div>
              {imageError && <p className={styles.imageError}>{imageError}</p>}
            </div>

            {/* Кнопки */}
            <div className={styles.actions}>
              <Button
                variant="outline"
                size="large"
                type="button"
                onClick={() => navigate(ROUTES.HOME)}
              >
                Назад
              </Button>
              <Button
                variant="primary"
                size="large"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Создание...' : 'Продолжить'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  )
}
