import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { MOCK_CITIES, GENDER_OPTIONS } from '@/shared/lib/constants'
import { fileToDataUrl } from '@/shared/lib/helpers'
import { AvatarUI } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button/button'
import { Input } from '@/shared/ui/Input'
import { Combobox } from '@/shared/ui/Combobox'
import { Calendar } from '@/shared/ui/Calendar'
import EditIcon from '@/shared/assets/icons/Edit.svg'
import styles from './PersonalDataForm.module.css'
import type { PersonalDataFormProps} from './types'
import type { Profile } from '@/shared/types'

const cityOptions = [
  { value: '', label: 'Не указан' },
  ...MOCK_CITIES.map(({ name }) => ({ value: name, label: name })),
]
const genderOptions = GENDER_OPTIONS

const parseDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return year && month && day ? new Date(year, month - 1, day) : null
}

const formatDate = (date: Date) =>
  [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part, index) => String(part).padStart(index ? 2 : 4, '0'))
    .join('-')

export function PersonalDataForm({
  initialValues,
  onSubmit,
  onChangePassword,
}: PersonalDataFormProps) {
  const [values, setValues] = useState<Profile>(initialValues)
  const [photoPreview, setPhotoPreview] = useState(initialValues.photo)

  useEffect(() => {
    setValues(initialValues)
    setPhotoPreview(initialValues.photo)
  }, [initialValues])

  const isChanged = useMemo(
    () =>
      Object.keys(values).some(
        (key) =>
          values[key as keyof Profile] !==
          initialValues[key as keyof Profile],
      ),
    [initialValues, values],
  )
  const birthDate = useMemo(() => parseDate(values.dateOfBirth), [values.dateOfBirth])

  const updateField = (field: keyof Profile) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
  }

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const nextPhoto = await fileToDataUrl(file)
    setPhotoPreview(nextPhoto)
    updateField('photo')(nextPhoto)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fields}>
        <Input
          variant="edit"
          name="email"
          label="Почта"
          value={values.email}
          onChange={updateField('email')}
        />

        <button className={styles.passwordButton} type="button" onClick={onChangePassword}>
          Изменить пароль
        </button>

        <Input
          variant="edit"
          name="name"
          label="Имя"
          value={values.name}
          onChange={updateField('name')}
        />

        <div className={styles.row}>
          <div className={styles.calendarField}>
            <label htmlFor="dateOfBirth">Дата рождения</label>
            <Calendar
              id="dateOfBirth"
              value={birthDate}
              onSubmit={(date) => updateField('dateOfBirth')(formatDate(date))}
            />
          </div>
          <Combobox
            name="gender"
            label="Пол"
            value={values.gender}
            options={genderOptions}
            onChange={updateField('gender')}
          />
        </div>

        <Combobox
          name="city"
          label="Город"
          searchable
          value={values.city}
          options={cityOptions}
          onChange={updateField('city')}
        />

        <div className={styles.aboutField}>
          <Input
            variant="textarea"
            name="about"
            label="О себе"
            value={values.about}
            onChange={updateField('about')}
          />
          <img className={styles.aboutEditIcon} src={EditIcon} alt="" aria-hidden="true" />
        </div>

        <Button className={styles.submitButton} type="submit" size="large" disabled={!isChanged}>
          Сохранить
        </Button>
      </div>

      <label className={styles.avatarControl} aria-label="Изменить фотографию профиля">
        <AvatarUI image={photoPreview} name={values.name} size="lg" iconType="edit" />
        <input type="file" accept="image/jpeg,image/png" onChange={handlePhotoChange} />
      </label>
    </form>
  )
}
