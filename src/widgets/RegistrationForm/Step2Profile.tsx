import { useMemo } from 'react'
import { AvatarUI } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button/button'
import { Calendar } from '@/shared/ui/Calendar'
import { Combobox } from '@/shared/ui/Combobox'
import { Input } from '@/shared/ui/Input'
import { CheckboxSelect } from './CheckboxSelect'
import { categoryOptions, cityOptions, genderOptions, getSubcategoryOptions } from './registrationOptions'
import type { Step2ProfileProps } from './types'
import styles from './RegistrationForm.module.css'

const toIsoDate = (date: Date) => {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

const fromIsoDate = (value: string) => (value ? new Date(`${value}T00:00:00`) : null)

export function Step2Profile({
  name,
  dateOfBirth,
  gender,
  city,
  wantsToLearn,
  learningCategoryIds,
  avatarPreview,
  errors,
  onChangeName,
  onChangeDateOfBirth,
  onChangeGender,
  onChangeCity,
  onSelectAvatar,
  onChangeLearningCategories,
  onChangeLearningSubcategories,
  onBack,
}: Step2ProfileProps) {
  const learningSubcategoryOptions = useMemo(
    () => getSubcategoryOptions(learningCategoryIds),
    [learningCategoryIds],
  )

  return (
    <>
      <label className={styles.avatarUpload}>
        <AvatarUI image={avatarPreview} name={name || 'Новый пользователь'} size="sm" iconType="add" />
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(event) => onSelectAvatar(event.target.files?.[0])}
        />
      </label>

      <div className={styles.field}>
        <Input
          value={name}
          onChange={onChangeName}
          label="Имя"
          placeholder="Введите ваше имя"
          name="registration-name"
          className={errors.name ? styles.inputError : ''}
        />
        <p className={styles.errorSlot} role={errors.name ? 'alert' : undefined}>
          {errors.name || ' '}
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
              value={fromIsoDate(dateOfBirth)}
              onSubmit={(date) => onChangeDateOfBirth(toIsoDate(date))}
            />
          </div>
          <p className={styles.errorSlot} role={errors.dateOfBirth ? 'alert' : undefined}>
            {errors.dateOfBirth || ' '}
          </p>
        </div>

        <div className={styles.field}>
          <Combobox value={gender} options={genderOptions} label="Пол" name="registration-gender" onChange={onChangeGender} />
          <p className={styles.errorSlot}>{' '}</p>
        </div>
      </div>

      <div className={`${styles.field} ${errors.city ? styles.comboboxError : ''}`}>
        <Combobox
          value={city}
          options={cityOptions}
          label="Город"
          name="registration-city"
          searchable
          onChange={onChangeCity}
        />
        <p className={styles.errorSlot} role={errors.city ? 'alert' : undefined}>
          {errors.city || ' '}
        </p>
      </div>

      <CheckboxSelect
        label="Категория навыка, которому хотите научиться"
        placeholder="Выберите категорию"
        options={categoryOptions}
        values={learningCategoryIds}
        name="learning-categories"
        error={errors.learningCategoryIds}
        onChange={onChangeLearningCategories}
      />
      <CheckboxSelect
        label="Подкатегория навыка, которому хотите научиться"
        placeholder="Выберите подкатегорию"
        options={learningSubcategoryOptions}
        values={wantsToLearn}
        name="learning-subcategories"
        error={errors.wantsToLearn}
        onChange={onChangeLearningSubcategories}
      />

      <div className={styles.actions}>
        <Button type="button" variant="outline" size="large" onClick={onBack}>
          Назад
        </Button>
        <Button type="submit" size="large">
          Продолжить
        </Button>
      </div>
    </>
  )
}
