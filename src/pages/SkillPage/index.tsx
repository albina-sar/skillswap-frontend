import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { loadSkills, selectSkills } from '@/entities/skill/model/skillsSlice'
import { fetchUsersThunk, selectUsers } from '@/entities/user/model/usersSlice'
import { selectAccountProfile } from '@/entities/account/model/accountSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { CATEGORIES_DATA } from '@/shared/lib/constants'
import type { Subcategory, User } from '@/shared/types'

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

export default function SkillPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()

  const skills = useAppSelector(selectSkills)
  const users = useAppSelector(selectUsers)
  const accountProfile = useAppSelector(selectAccountProfile)

  useEffect(() => {
    dispatch(loadSkills())
    dispatch(fetchUsersThunk())
  }, [dispatch])

  const skill = useMemo(() => skills.find((item) => item.id === id) ?? null, [skills, id])

  const currentUser = useMemo(() => {
    if (!skill) return null

    // Автор только что созданного навыка может ещё не попасть в общий список
    // пользователей (`usersSlice` читает только статический users.json) —
    // тогда берём его из собственного профиля в accountSlice
    return (
      users.find((user) => user.id === skill.authorId) ??
      (accountProfile?.id === skill.authorId ? accountProfile : null)
    )
  }, [skill, users, accountProfile])

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

          {/* Убрала isFavorite и onFavoriteClick */}
          <SkillCard skill={skill} />
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
