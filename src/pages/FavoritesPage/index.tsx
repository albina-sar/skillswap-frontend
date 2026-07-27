import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { selectSkills } from '@/entities/skill/model/skillsSlice'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { UserCard } from '@/shared/ui/UserCard'
import { ROUTES } from '@/shared/lib/constants'
import { Skill } from '@/shared/types'
import { User } from '@/shared/types'
import styles from './FavoritesPage.module.css'

const LIKED_SKILLS_STORAGE_KEY = 'likedSkills'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const allSkills = useAppSelector(selectSkills)
  const [likedSkillsIds] = useLocalStorage<string[]>(LIKED_SKILLS_STORAGE_KEY, [])
  const [favoriteSkills, setFavoriteSkills] = useState<Skill[]>([])
  const [users, setUsers] = useState<User[]>([])


  useEffect(() => {

    import('@/api/users').then(({ fetchUsers }) => {
      fetchUsers().then(setUsers)
    })
  }, [])

  // Обновляем список избранных навыков при изменении allSkills или likedSkillsIds
  useEffect(() => {
    const favorites = allSkills.filter((skill) => likedSkillsIds.includes(skill.id))
    setFavoriteSkills(favorites)
  }, [allSkills, likedSkillsIds])

  // Если избранных навыков нет — показываем пустое состояние
  if (favoriteSkills.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2 className={styles.emptyTitle}>У вас пока нет избранных навыков</h2>
        <p className={styles.emptyText}>Добавьте навыки в избранное, чтобы они появились здесь</p>
        <button
          className={styles.backButton}
          onClick={() => navigate(ROUTES.HOME)}
        >
          Вернуться в каталог
        </button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Избранное</h1>
        <span className={styles.count}>{favoriteSkills.length} навыков</span>
      </header>

      <div className={styles.grid}>
        {favoriteSkills.map((skill) => {
          // Находим автора навыка
          const author = users.find((user) => user.id === skill.authorId)

          if (!author) return null

          // Формируем навыки, которые автор хочет изучить (для карточки)
          const learnSkills = author.wantsToLearn.map((id) => ({
            id,
            name: id, // Заглушка
          }))

          return (
            <UserCard
              key={skill.id}
              user={author}
              teachSkill={skill}
              learnSkills={learnSkills}
              variant="catalog"
              onDetailsClick={() => navigate(`${ROUTES.SKILL.replace(':id', skill.id)}`)}
            />
          )
        })}
      </div>
    </div>
  )
}
