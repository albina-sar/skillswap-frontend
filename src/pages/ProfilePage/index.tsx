import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectAccountProfile, updateAccountProfile } from '@/entities/account/model/accountSlice'
import { ProfileSidebar } from '@/shared/ui/ProfileSidebar'
import { PersonalDataForm } from '@/widgets/PersonalDataForm'
import { Body } from '@/shared/ui/Body'
import type { Profile } from '@/shared/types'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const profile = useAppSelector(selectAccountProfile)

  const handleSubmit = (values: Profile) => {
    const { id, ...updates } = values
    dispatch(updateAccountProfile({ id, updates }))
  }

  const handleChangePassword = () => {
    // TODO: Реализовать смену пароля, логика changePassword уже есть
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <ProfileSidebar />
      </aside>
      <section className={styles.content}>
        {profile ? (
          <PersonalDataForm
            initialValues={profile}
            onSubmit={handleSubmit}
            onChangePassword={handleChangePassword}
          />
        ) : (
          <Body>Авторизуйтесь для отображения личных данных</Body>
        )}
      </section>
    </div>
  )
}
