import { useMemo } from 'react'
import { Button } from '@/shared/ui/button/button'
import { Combobox } from '@/shared/ui/Combobox'
import { ImageUpload } from '@/shared/ui/ImageUpload'
import { Input } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { ModalSuccessSuggestion } from '@/shared/ui/ModalSuccessSuggestion'
import { categoryOptions, getSubcategoryOptions } from './registrationOptions'
import type { Step3SkillProps } from './types'
import styles from './RegistrationForm.module.css'
import { SuggestionPreview } from '@/shared/ui/SuggestionPreview'
import { CATEGORIES_DATA } from '@/shared/lib/constants'

export function Step3Skill({
  title,
  categoryId,
  subcategoryId,
  description,
  errors,
  isCompleteModalOpen,
  isSuccessModalOpen,
  skillImages,
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
  const selectedCategory = CATEGORIES_DATA.find((category) => category.id === categoryId)

const selectedSubcategory = selectedCategory?.subcategories.find(
  (subcategory) => subcategory.id === subcategoryId,
)

const previewImages = useMemo(
  () => skillImages.map((file) => URL.createObjectURL(file)),
  [skillImages],
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
      <p className={styles.errorSlot} role={errors.skillImages ? 'alert' : undefined}>
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
  <SuggestionPreview
    title={title}
    categoryName={selectedCategory?.name ?? ''}
    subcategoryName={selectedSubcategory?.name ?? ''}
    description={description}
    images={previewImages}
    onEdit={onCloseCompleteModal}
    onDone={onOpenSuccessModal}
  />
</Modal>


      <ModalSuccessSuggestion isModalOpened={isSuccessModalOpen} onCloseModal={onCloseSuccessModal} />
    </>
  )
}
