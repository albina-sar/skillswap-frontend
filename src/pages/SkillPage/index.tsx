import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { fetchSkillById, fetchSkills } from '@/api/skills'
import { fetchUsers } from '@/api/users'

import { CATEGORIES_DATA } from '@/shared/lib/constants'
import type { Skill, Subcategory, User } from '@/shared/types'

import { Section } from '@/shared/ui/Section'
import { SkillCard } from '@/shared/ui/SkillCard'
import { UserCard } from '@/shared/ui/UserCard'

import styles from './SkillPage.module.css'

const getLearnSkills = (user: User): Subcategory[] =>
  user.wantsToLearn
    .map((id) =>
      CATEGORIES_DATA.flatMap((category) => category.subcategories).find(
        (subcategory) => subcategory.id === id,
      ),
    )
    .filter(Boolean) as Subcategory[]

export default function SkillPage() {
  const { id } = useParams()

  const [skill, setSkill] = useState<Skill | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    if (!id) return

    const skillId = id

    async function loadData() {
      const [currentSkill, allSkills, allUsers] = await Promise.all([
        fetchSkillById(skillId),
        fetchSkills(),
        fetchUsers(),
      ])

      if (!currentSkill) return

      setSkill(currentSkill)
      setSkills(allSkills)
      setUsers(allUsers)
    }

    loadData()
  }, [id])

  const currentUser = useMemo(() => {
    if (!skill) return null

    return users.find((user) => user.id === skill.authorId) ?? null
  }, [skill, users])

  const learnSkills = useMemo(() => {
    if (!currentUser) return []

    return getLearnSkills(currentUser)
  }, [currentUser])

  const similarSkills = useMemo(() => {
    if (!skill) return []

    return skills.filter(
      (item) => item.id !== skill.id && item.subcategoryId === skill.subcategoryId,
    )
  }, [skill, skills])

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
          <div className={styles.similarSkills}>
            {similarSkills.map((similarSkill) => {
              const similarUser = users.find((user) => user.id === similarSkill.authorId)

              if (!similarUser) return null

              return (
                <UserCard
                  key={similarSkill.id}
                  user={similarUser}
                  teachSkill={similarSkill}
                  learnSkills={getLearnSkills(similarUser)}
                />
              )
            })}
          </div>
        </Section>
      </div>
    </main>
  )
}
