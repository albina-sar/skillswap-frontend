import { useEffect, useMemo } from 'react'
import { Button } from '@/shared/ui/button/button'
import { Combobox } from '@/shared/ui/Combobox'
import { ImageUpload } from '@/shared/ui/ImageUpload'
import { Input } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { ModalSuccessSuggestion } from '@/shared/ui/ModalSuccessSuggestion'
import { categoryOptions, getSubcategoryOptions } from './registrationOptions'
import type { Step3SkillProps } from './types'
import styles from './RegistrationForm.module.css'

export function Step3Skill({
  title,
  categoryId,
  subcategoryId,
  description,
  errors,
  isCompleteModalOpen,
  isSuccessModalOpen,
  onChangeTitle,
  onChangeCategory,
  onChangeSubcategory,
  onChangeDescription,
  onChangeImages,
  onCloseCompleteModal,
  onOpenSuccessModal,
  onCloseSuccessModal,
  onBack,
}: Step3SkillProps) {
  const teachingSubcategoryOptions = useMemo(
    () => getSubcategoryOptions(categoryId ? [categoryId] : []),
    [categoryId],
  )

  return (
    <>
      <div className={styles.field}>
        <Input
          value={title}
          onChange={onChangeTitle}
          label="Название навыка"
          placeholder="Введите название вашего навыка"
          name="registration-skill-title"
          className={errors.title ? styles.inputError : ''}
        />
        <p className={styles.errorSlot} role={errors.title ? 'alert' : undefined}>
          {errors.title || ' '}
        </p>
      </div>

      <div className={styles.field}>
        <Combobox
          value={categoryId}
          options={categoryOptions}
          label="Категория навыка"
          name="teaching-category"
          onChange={onChangeCategory}
          error={errors.categoryId}
        />
        <p className={styles.errorSlot} role={errors.categoryId ? 'alert' : undefined}>
          {errors.categoryId || ' '}
        </p>
      </div>

      <div  className={styles.field}>
        <Combobox
          value={subcategoryId}
          options={teachingSubcategoryOptions}
          label="Подкатегория навыка"
          name="teaching-subcategory"
          onChange={onChangeSubcategory}
          error={errors.subcategoryId}
        />
        <p className={styles.errorSlot} role={errors.subcategoryId ? 'alert' : undefined}>
          {errors.subcategoryId || ' '}
        </p>
      </div>

      <div className={styles.field}>
        <Input
          variant="textarea"
          value={description}
          onChange={onChangeDescription}
          label="Описание"
          placeholder="Коротко опишите, чему можете научить"
          name="registration-description"
          className={errors.description ? styles.inputError : ''} 
        />
        <p className={styles.errorSlot} role={errors.description ? 'alert' : undefined}>
          {errors.description || ' '}
        </p>
      </div>

      <ImageUpload className={styles.imageUpload} onChange={onChangeImages} accept="image/jpeg,image/png" />
      <p className={styles.errorSlot} role={errors.description ? 'alert' : undefined}>
          {errors.skillImages || ' '}
      </p>

      <div className={styles.actions}>
        <Button type="button" variant="outline" size="large" onClick={onBack}>
          Назад
        </Button>
        <Button type="submit" size="large">
          Готово
        </Button>
      </div>

      <Modal isOpen={isCompleteModalOpen} onClose={onCloseCompleteModal}>
        {/* TODO: содержимое модалки ещё не готово — заменить на финальный дизайн */}
        <p>Регистрация завершена</p>
        <Button type="button" variant="primary" size="large" onClick={onOpenSuccessModal} disabled={Object.keys(errors).length > 0}>
          Готово
        </Button>
      </Modal>

      <ModalSuccessSuggestion isModalOpened={isSuccessModalOpen} onCloseModal={onCloseSuccessModal} />
    </>
  )
}
