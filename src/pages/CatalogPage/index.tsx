import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchUsersThunk } from '@/entities/user/model/usersSlice'
import { loadSkills, selectSkills } from '@/entities/skill/model/skillsSlice'
import { filterGroups } from '@/features/filters/model/filterGroups'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { CATEGORIES_DATA } from '@/shared/lib/constants'
import type { Skill, Subcategory, User } from '@/shared/types'
import { FilterSection } from '@/shared/ui/filter-section'
import { Section } from '@/shared/ui/Section'
import { UserCard } from '@/shared/ui/UserCard'

import styles from './CatalogPage.module.css'

const getSubcategoriesByIds = (ids: string[]): Subcategory[] => {
  const subcategories = CATEGORIES_DATA.flatMap((category) => category.subcategories)

  return ids
    .map((id) => subcategories.find((subcategory) => subcategory.id === id))
    .filter((subcategory): subcategory is Subcategory => Boolean(subcategory))
}

const getUserTeachSkill = (user: User, skills: Skill[]) =>
  skills.find((skill) => skill.id === user.skills[0])

export default function CatalogPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const users = useAppSelector((state) => state.users.users)
  const skills = useAppSelector(selectSkills)

  useEffect(() => {
    dispatch(fetchUsersThunk())
    dispatch(loadSkills())
  }, [dispatch])

  const cardItems = useMemo(
    () =>
      users
        .map((user) => {
          const teachSkill = getUserTeachSkill(user, skills)

          if (!teachSkill) {
            return null
          }

          return {
            user,
            teachSkill,
            learnSkills: getSubcategoriesByIds(user.wantsToLearn),
          }
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [users, skills],
  )

  const popularCards = cardItems.slice(0, 3)
  const newCards = cardItems.slice(3, 6)
  const recommendedCards = cardItems.slice(6, 9)


  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <FilterSection groups={filterGroups} onFiltersChange={() => {}} />
        </aside>

        <main className={styles.main}>
          <Section title="Популярное" showAllButton onSeeAll={() => {}}>
            <div className={styles.cardsGrid}>
              {popularCards.map(({ user, teachSkill, learnSkills }) => (
                <UserCard
                  key={user.id}
                  user={user}
                  teachSkill={teachSkill}
                  learnSkills={learnSkills}
                  onDetailsClick={() => navigate(`/skill/${teachSkill.id}`)}
                />
              ))}
            </div>
          </Section>

          <Section title="Новое" showAllButton onSeeAll={() => {}}>
            <div className={styles.cardsGrid}>
              {newCards.map(({ user, teachSkill, learnSkills }) => (
                <UserCard
                  key={user.id}
                  user={user}
                  teachSkill={teachSkill}
                  learnSkills={learnSkills}
                  onDetailsClick={() => navigate(`/skill/${teachSkill.id}`)}
                />
              ))}
            </div>
          </Section>

          <Section title="Рекомендуем">
            <div className={styles.cardsGrid}>
              {recommendedCards.map(({ user, teachSkill, learnSkills }) => (
                <UserCard
                  key={user.id}
                  user={user}
                  teachSkill={teachSkill}
                  learnSkills={learnSkills}
                  onDetailsClick={() => navigate(`/skill/${teachSkill.id}`)}
                />
              ))}
            </div>
          </Section>
        </main>
      </div>
    </div>

  )
}