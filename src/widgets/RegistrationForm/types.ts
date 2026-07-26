import type { AuthUser, Skill, User } from '@/shared/types'

export type RegistrationStep = 1 | 2 | 3

type RegistrationProfileFields = Pick<User, 'name' | 'dateOfBirth' | 'gender' | 'city'>
type RegistrationAuthFields = Pick<AuthUser, 'email'> & {
  password: string
}

export type RegistrationFormValues = RegistrationProfileFields &
  RegistrationAuthFields & {
    learningCategoryIds: Skill['categoryId'][]
    learningSubcategoryIds: User['wantsToLearn']
    skillTitle: Skill['title']
    teachingCategoryIds: Skill['categoryId'][]
    teachingSubcategoryIds: Skill['subcategoryId'][]
    skillDescription: Skill['description']
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
