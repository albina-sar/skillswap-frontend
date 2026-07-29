import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { fetchSkillById } from '@/api/skills'
import { fetchUsers } from '@/api/users'

import { CATEGORIES_DATA } from '@/shared/lib/constants'
import type { Skill, Subcategory, User } from '@/shared/types'

import { Section } from '@/shared/ui/Section'
import { SkillCard } from '@/shared/ui/SkillCard'
import { UserCard } from '@/shared/ui/UserCard'

import styles from './SkillPage.module.css'
import { SimilarOffers } from '@/components/similar-offers/similar-offers'

const getLearnSkills = (user: User): Subcategory[] =>
  user.wantsToLearn
    .map((id) =>
      CATEGORIES_DATA.flatMap((category) => category.subcategories).find(
        (subcategory) => subcategory.id === id,
      ),
    )
    .filter(Boolean) as Subcategory[]

// Только что созданный навык (например, сразу после регистрации) может прийти
// напрямую через state роутера — тогда не нужно повторно идти в API за ним
interface SkillPageLocationState {
  skill?: Skill
  author?: User
}

export default function SkillPage() {
  const { id } = useParams()
  const location = useLocation()
  const preloaded = location.state as SkillPageLocationState | null
  const preloadedSkillId = preloaded?.skill?.id

  const [skill, setSkill] = useState<Skill | null>(preloaded?.skill ?? null)
  const [users, setUsers] = useState<User[]>(preloaded?.author ? [preloaded.author] : [])

  useEffect(() => {
    if (!id) return
    if (preloadedSkillId === id) return

    const skillId = id

    async function loadData() {
      const [currentSkill, allUsers] = await Promise.all([fetchSkillById(skillId), fetchUsers()])

      if (!currentSkill) return

      setSkill(currentSkill)
      setUsers(allUsers)
    }

    loadData()
  }, [id, preloadedSkillId])

  const currentUser = useMemo(() => {
    if (!skill) return null

    return users.find((user) => user.id === skill.authorId) ?? null
  }, [skill, users])

  const learnSkills = useMemo(() => {
    if (!currentUser) return []

    return getLearnSkills(currentUser)
  }, [currentUser])

  if (!skill || !currentUser) {
    return <p>Загрузка...</p>
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.top}>
          <UserCard
            user={currentUser}
            teachSkill={skill}
            learnSkills={learnSkills}
            variant="skill"
          />

          <SkillCard skill={skill} isFavorite={false} onFavoriteClick={() => {}} />
        </div>

        <Section
          title="Похожие предложения"
          className={styles.section}
          titleClassName={styles.sectionTitle}
        >
          <SimilarOffers />
        </Section>
      </div>
    </main>
  )
}
