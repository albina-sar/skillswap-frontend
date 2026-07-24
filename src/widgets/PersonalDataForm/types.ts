export interface PersonalDataFormValues {
  email: string
  name: string
  dateOfBirth: string
  gender: string
  city: string
  about: string
  photo: string
}

export interface PersonalDataFormProps {
  initialValues: PersonalDataFormValues
  onSubmit: (values: PersonalDataFormValues) => void
  onChangePassword?: () => void
}
