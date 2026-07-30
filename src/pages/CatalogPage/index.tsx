import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
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

const CARDS_PER_PAGE = 20
const RECOMMENDED_INITIAL_COUNT = 3

const getSubcategoriesByIds = (ids: string[]): Subcategory[] => {
  const subcategories = CATEGORIES_DATA.flatMap((category) => category.subcategories)

  return ids
    .map((id) => subcategories.find((subcategory) => subcategory.id === id))
    .filter((subcategory): subcategory is Subcategory => Boolean(subcategory))
}

const getUserTeachSkill = (user: User, skills: Skill[]) =>
  skills.find((skill) => skill.id === user.skills[0])

const MS_IN_7_DAYS = 7 * 24 * 60 * 60 * 1000

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function CatalogPage() {
  const [isPopularExpanded, setIsPopularExpanded] = useState(false)
  const [isNewExpanded, setIsNewExpanded] = useState(false)

  // ПАГИНАЦИЯ ДЛЯ РЕКОМЕНДАЦИЙ (БЕСКОНЕЧНЫЙ СКРОЛЛ)
  const [visibleRecommendedCount, setVisibleRecommendedCount] = useState(RECOMMENDED_INITIAL_COUNT)
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const users = useAppSelector(selectUsers)
  const skills = useAppSelector(selectSkills)

  useEffect(() => {
    dispatch(fetchUsersThunk())
    dispatch(loadSkills())
  }, [dispatch])

  // Все карточки
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

  // Популярные
  const popularCards = cardItems
    .filter((card) => card.teachSkill.likesCount > 40)
    .sort((a, b) => b.teachSkill.likesCount - a.teachSkill.likesCount)

  const displayedPopularCards = isPopularExpanded
    ? popularCards
    : popularCards.slice(0, 3)

  // Новые
  const newCards = useMemo(() => {
    const latestDate = Math.max(
      ...cardItems.map((item) => new Date(item.teachSkill.createdAt).getTime()),
    )
    const threshold = new Date(latestDate - MS_IN_7_DAYS)

    return [...cardItems]
      .filter((item) => new Date(item.teachSkill.createdAt) >= threshold)
      .sort(
        (a, b) =>
          new Date(b.teachSkill.createdAt).getTime() -
          new Date(a.teachSkill.createdAt).getTime(),
      )
  }, [cardItems])

  const displayedNewCards = isNewExpanded
    ? newCards
    : newCards.slice(0, 3)

  // Рекомендуемые (с бесконечным скроллом)
  const shuffledRecommendedCards = useMemo(() => shuffleArray(cardItems), [cardItems])
  const displayedRecommendedCards = shuffledRecommendedCards.slice(0, visibleRecommendedCount)
  const hasMoreRecommended = visibleRecommendedCount < shuffledRecommendedCards.length

  // Функция загрузки следующих карточек
  const loadMoreRecommended = useCallback(() => {
    if (isLoadingRecommended || !hasMoreRecommended) return

    setIsLoadingRecommended(true)

    setTimeout(() => {
      const nextCount = Math.min(
        visibleRecommendedCount + CARDS_PER_PAGE,
        shuffledRecommendedCards.length,
      )
      setVisibleRecommendedCount(nextCount)
      setIsLoadingRecommended(false)
    }, 300)
  }, [isLoadingRecommended, hasMoreRecommended, visibleRecommendedCount, shuffledRecommendedCards.length])

  // Intersection Observer — отслеживает появление элемента-триггера
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    if (!loadMoreRef.current || !hasMoreRecommended) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isLoadingRecommended) {
          loadMoreRecommended()
        }
      },
      {
        rootMargin: '0px 0px 200px 0px', // срабатывает за 200px до появления
      },
    )

    observerRef.current.observe(loadMoreRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMoreRecommended, hasMoreRecommended, isLoadingRecommended])

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <FilterSection groups={filterGroups} onFiltersChange={() => {}} />
        </aside>

        <main className={styles.main}>
          {/* Популярное */}
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

          {/* Новое */}
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

          {/* Рекомендуем (с бесконечным скроллом) */}
          <Section title="Рекомендуем">
            <div className={styles.cardsGrid}>
              {displayedRecommendedCards.map(({ user, teachSkill, learnSkills }) => (
                <UserCard
                  key={user.id}
                  user={user}
                  teachSkill={teachSkill}
                  learnSkills={learnSkills}
                  onDetailsClick={() => navigate(`/skill/${teachSkill.id}`)}
                />
              ))}
            </div>

            {/* Элемент-триггер для Intersection Observer */}
            {hasMoreRecommended && (
              <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
                {isLoadingRecommended ? (
                  <p className={styles.loadingText}>Загрузка...</p>
                ) : (
                  <p className={styles.loadingText}>Загружаем ещё...</p>
                )}
              </div>
            )}

            {/* Счётчик */}
            <div className={styles.counter}>
              Показано {displayedRecommendedCards.length} из {shuffledRecommendedCards.length} рекомендаций
            </div>
          </Section>
        </main>
      </div>
    </div>
  )
}
