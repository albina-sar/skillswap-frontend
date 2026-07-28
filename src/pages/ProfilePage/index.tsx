import { ProfileSidebar } from '@/shared/ui/ProfileSidebar'
import { PersonalDataForm } from '@/widgets/PersonalDataForm'
import type { PersonalDataFormValues } from '@/widgets/PersonalDataForm'
import styles from './ProfilePage.module.css'

// ВРЕМЕННЫЙ мок данных профиля. Реальные придут из авторизации (ветка feature/auth),
// когда она будет смержена в develop. Тип вынесен в аннотацию — при переходе на Profile
// TypeScript подсветит все места, которые нужно поправить.
const mockProfile: PersonalDataFormValues = {
  email: 'Mariia@gmail.com',
  name: 'Мария',
  dateOfBirth: '1995-10-28',
  gender: 'female',
  city: 'Москва',
  about:
    'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем-то интересным!',
  photo: '',
}

export default function ProfilePage() {
  const handleSubmit = (values: PersonalDataFormValues) => {
    // TODO: сохранение профиля появится вместе с auth
    console.log('Профиль сохранён:', values)
  }

  const handleChangePassword = () => {
    // TODO: смена пароля появится вместе с auth
    console.log('Смена пароля')
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <ProfileSidebar />
      </aside>
      <section className={styles.content}>
        <PersonalDataForm
          initialValues={mockProfile}
          onSubmit={handleSubmit}
          onChangePassword={handleChangePassword}
        />
      </section>
    </div>
  )
}
