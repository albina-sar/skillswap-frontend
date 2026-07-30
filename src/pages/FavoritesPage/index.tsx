import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { selectSkills } from '@/entities/skill/model/skillsSlice'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { UserCard } from '@/shared/ui/UserCard'
import { Button } from '@/shared/ui/button/button'
import { ROUTES, CATEGORIES_DATA } from '@/shared/lib/constants'
import { Skill, Subcategory } from '@/shared/types'
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

  useEffect(() => {
    const favorites = allSkills.filter((skill) => likedSkillsIds.includes(skill.id))
    setFavoriteSkills(favorites)
  }, [allSkills, likedSkillsIds])

  // Функция для преобразования wantsToLearn в Subcategory[]
  const getLearnSkills = (wantsToLearn: string[]): Subcategory[] => {
    const result: Subcategory[] = []
    for (const id of wantsToLearn) {
      for (const category of CATEGORIES_DATA) {
        const found = category.subcategories.find((sub) => sub.id === id)
        if (found) {
          result.push(found)
          break
        }
      }
    }
    return result
  }

  if (favoriteSkills.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2 className={styles.emptyTitle}>У вас пока нет избранных навыков</h2>
        <p className={styles.emptyText}>Добавьте навыки в избранное, чтобы они появились здесь</p>
        <Button variant="primary" onClick={() => navigate(ROUTES.HOME)}>
          Вернуться в каталог
        </Button>
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
          const author = users.find((user) => user.id === skill.authorId)
          if (!author) return null

          const learnSkills = getLearnSkills(author.wantsToLearn)

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
