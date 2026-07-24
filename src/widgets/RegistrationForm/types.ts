export type RegistrationStep = 1 | 2 | 3

export interface RegistrationFormValues {
  email: string
  password: string
  name: string
  dateOfBirth: string
  gender: string
  city: string
  learningCategoryIds: string[]
  learningSubcategoryIds: string[]
  skillTitle: string
  teachingCategoryIds: string[]
  teachingSubcategoryIds: string[]
  skillDescription: string
  avatar?: File
  skillImages: File[]
}

export interface RegistrationFormProps {
  initialStep?: RegistrationStep
  onStepChange?: (step: RegistrationStep) => void
  onComplete?: (values: RegistrationFormValues) => void
}

export interface MultiSelectOption {
  value: string
  label: string
}
