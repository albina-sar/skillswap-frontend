import type { Skill, UserAccount } from '@/shared/types'

export type RegistrationStep = 1 | 2 | 3

export interface RegistrationFormValues
  extends Pick<
      UserAccount,
      'email' | 'password' | 'name' | 'dateOfBirth' | 'gender' | 'city' | 'wantsToLearn'
    >,
    Pick<Skill, 'title' | 'description' | 'categoryId' | 'subcategoryId'> {
  avatar?: File
  skillImages: File[]
}

export interface RegistrationFormProps {
  initialStep?: RegistrationStep
  onStepChange?: (step: RegistrationStep) => void
  onComplete?: (values: RegistrationFormValues) => void
  onSuccessModalClose?: () => void
}

export interface MultiSelectOption {
  value: string
  label: string
}

export interface Step1AuthProps {
  email: string
  password: string
  errors: { email?: string; password?: string }
  onChangeEmail: (value: string) => void
  onChangePassword: (value: string) => void
}

export interface Step2ProfileProps {
  name: string
  dateOfBirth: string
  gender: string
  city: string
  wantsToLearn: string[]
  learningCategoryIds: string[]
  avatarPreview: string
  errors: Record<string, string>
  onChangeName: (value: string) => void
  onChangeDateOfBirth: (value: string) => void
  onChangeGender: (value: string) => void
  onChangeCity: (value: string) => void
  onSelectAvatar: (file?: File) => void
  onChangeLearningCategories: (categoryIds: string[]) => void
  onChangeLearningSubcategories: (subcategoryIds: string[]) => void
  onBack: () => void
}

export interface Step3SkillProps {
  title: string
  categoryId: string
  subcategoryId: string
  description: string
  errors: Record<string, string>
  isCompleteModalOpen: boolean
  isSuccessModalOpen: boolean
  skillImages: File[]
  onChangeTitle: (value: string) => void
  onChangeCategory: (categoryId: string) => void
  onChangeSubcategory: (subcategoryId: string) => void
  onChangeDescription: (value: string) => void
  onChangeImages: (files: File[]) => void
  onCloseCompleteModal: () => void
  onOpenSuccessModal: () => void
  onCloseSuccessModal: () => void
  onBack: () => void
}
