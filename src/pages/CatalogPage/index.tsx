import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchUsersThunk, selectUsers } from '@/entities/user/model/usersSlice'
import { loadSkills, selectSkills } from '@/entities/skill/model/skillsSlice'
import { filterGroups } from '@/features/filters/model/filterGroups'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { CATEGORIES_DATA } from '@/shared/lib/constants'
import type { Skill, Subcategory, User } from '@/shared/types'
import { FilterSection } from '@/shared/ui/filter-section'
import { Section } from '@/shared/ui/Section'
import { UserCard } from '@/shared/ui/UserCard'

import styles from './CatalogPage.module.css'

// Получает массив ID подкатегорий. Возвращает полноценные объекты Subcategory с их данными — но только те, что реально существуют, и в том же порядке, в котором были переданы ID
const getSubcategoriesByIds = (ids: string[]): Subcategory[] => {
  // Собираем один общий список всех подкатегорий
  const subcategories = CATEGORIES_DATA.flatMap((category) => category.subcategories)

  return ids
    .map((id) => subcategories.find((subcategory) => subcategory.id === id))
    .filter((subcategory): subcategory is Subcategory => Boolean(subcategory))
}

const getUserTeachSkill = (user: User, skills: Skill[]) =>
  skills.find((skill) => skill.id === user.skills[0])

const MS_IN_7_DAYS = 7 * 24 * 60 * 60 * 1000

// Функция для перемешивания массива всех карточек перед выдачек в секцию рекомендаций
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array] // не мутируем оригинальный массив
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  
  return result
}

export default function CatalogPage() {
  const [isPopularExpanded, setIsPopularExpanded] = useState(false)
  const [isNewExpanded, setIsNewExpanded] = useState(false)
  // Стейт для изменения количества рекомендованных карточек. При скролле сеттер меняет значение с шагом "3"
  const [visibleRecommendedCount, setVisibleRecommendedCount] = useState(3)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const users = useAppSelector(selectUsers)
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

  const popularCards = cardItems
    .filter((card) => card.teachSkill.likesCount > 40)
    .sort((a, b) => b.teachSkill.likesCount - a.teachSkill.likesCount);

  const displayedPopularCards = isPopularExpanded
    ? popularCards
    : popularCards.slice(0, 3);

  /*  Логика для выбора новых карточек, созданных за последний месяц. В случае с текущими моковыми данными выведутся все карточки, поэтому до подключения бэкэнда используется логика ниже

  const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1) */

  const newCards = useMemo(() => {
    const latestDate = Math.max(
      ...cardItems.map((item) => new Date(item.teachSkill.createdAt).getTime())
    )
    // Порог отбора для новых карточек - 7 дней от последней даты из моковых данных
    const threshold = new Date(latestDate - MS_IN_7_DAYS)

    return [...cardItems]
      .filter((item) => new Date(item.teachSkill.createdAt) >= threshold)
      .sort((a, b) => new Date(b.teachSkill.createdAt).getTime() - new Date(a.teachSkill.createdAt).getTime())
  }, [cardItems])

  const displayedNewCards = isNewExpanded
    ? newCards
    : newCards.slice(0, 3);

  // Карточки для рекомендаций выбираются случайным образом, т.к. бэкэнд не подключен
  const shuffledRecommendedCards = useMemo(
    () => shuffleArray(cardItems),
    [cardItems]
  )
  const recommendedCards = shuffledRecommendedCards.slice(0, visibleRecommendedCount)


  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <FilterSection groups={filterGroups} onFiltersChange={() => {}} />
        </aside>

        <main className={styles.main}>
          <Section
            title="Популярное" 
            showAllButton 
            onSeeAll={() => setIsPopularExpanded(!isPopularExpanded)}
            isExpanded={isPopularExpanded}
          >
            <div className={styles.cardsGrid}>
              {displayedPopularCards.map(({ user, teachSkill, learnSkills }) => (
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

          <Section
            title="Новое"
            showAllButton
            onSeeAll={() => setIsNewExpanded(!isNewExpanded)}
            isExpanded={isNewExpanded}
          >
            <div className={styles.cardsGrid}>
              {displayedNewCards.map(({ user, teachSkill, learnSkills }) => (
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