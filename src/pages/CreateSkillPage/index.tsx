import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { fetchSkillById } from '@/api/skills'
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

  useEffect(() => {
    if (!id) return

    const skillId = id

    async function loadData() {
      const [currentSkill, allUsers] = await Promise.all([fetchSkillById(skillId), fetchUsers()])

      if (!currentSkill) return

      setSkill(currentSkill)
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

          <SkillCard skill={skill} />
        </div>

        <Section
          title="Похожие предложения"
          className={styles.section}
          titleClassName={styles.sectionTitle}
        >
          <div className={styles.similarSkills} />
        </Section>
      </div>
    </main>
  )
}
