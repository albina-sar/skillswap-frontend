import { Profile } from "@/shared/types"

export interface PersonalDataFormProps {
  initialValues: Profile
  onSubmit: (values: Profile) => void
  onChangePassword?: () => void
}
