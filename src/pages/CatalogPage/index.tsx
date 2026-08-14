import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { selectUsers } from '@/entities/user/model/usersSlice'
import { selectSkills } from '@/entities/skill/model/skillsSlice'
import { useAppSelector } from '@/store/hooks'
import { CATEGORIES_DATA } from '@/shared/lib/constants'
import type { Skill, Subcategory, User } from '@/shared/types'
import { Section } from '@/shared/ui/Section'
import { UserCard } from '@/shared/ui/UserCard'
import { FilterSection } from '@/shared/ui/filter-section'
import { useCatalogFilters } from './hooks/useCatalogFilters'
import {
  filterGroups,
  getDefaultFilterValues,
} from '@/features/filters/model/filterGroups'
import { allSubcategoriesMap, categoriesMap, citiesMap } from './lib/maps'

import styles from './CatalogPage.module.css'

type ActiveFilter = {
  groupId: string
  value: string
  label: string
  type: 'radio' | 'checkbox'
}

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

  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()
  const selectedSkillId = searchParams.get('skills')

  const { filteredSkills, filters, handleFiltersChange } = useCatalogFilters(
    selectedSkillId ?? undefined,
  )
  const defaultFilters = useMemo(() => getDefaultFilterValues(filterGroups), [])


  useEffect(() => {
    const nextValue = Array.isArray(filters.skills) ? filters.skills[0] : undefined

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (nextValue) {
        next.set('skills', nextValue)
      } else {
        next.delete('skills')
      }
      return next
    }, { replace: true })
  }, [filters.skills, setSearchParams])

const activeFilters = useMemo(() => {
  const result: ActiveFilter[] = []

  filterGroups.forEach((group) => {
    const value = filters[group.id]
    const defaultValue = defaultFilters[group.id]

    if (group.type === 'radio') {
      if (value !== defaultValue) {
        const option = group.options.find((item) => item.id === value)

        result.push({
          groupId: group.id,
          value: value as string,
          label: option?.name ?? String(value),
          type: 'radio',
        })
      }

      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        const category = categoriesMap.get(item)
        const subcategory = allSubcategoriesMap.get(item)
        const city = citiesMap.get(item)

        result.push({
          groupId: group.id,
          value: item,
          label: category?.name ?? subcategory?.name ?? city ?? item,
          type: 'checkbox',
        })
      })
    }
  })

  return result
}, [filters, defaultFilters])
const handleRemoveFilter = (filter: ActiveFilter) => {
  const currentValue = filters[filter.groupId]
  const defaultValue = defaultFilters[filter.groupId]

  if (filter.type === 'radio') {
    handleFiltersChange({
      ...filters,
      [filter.groupId]: defaultValue,
    })

    return
  }

  handleFiltersChange({
    ...filters,
    [filter.groupId]: Array.isArray(currentValue)
      ? currentValue.filter((value) => value !== filter.value)
      : [],
  })
}

const isFiltering = activeFilters.length > 0

  const users = useAppSelector(selectUsers)
  const skills = useAppSelector(selectSkills)

  // Все карточки
  const cardItems = useMemo(
    () =>
      users
        .filter((user) => filteredSkills.some((skill) => skill.authorId === user.id))
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
    [users, skills, filteredSkills],
  )

  // Популярные
  const popularCards = cardItems
    .filter((card) => card.teachSkill.likesCount > 40)
    .sort((a, b) => b.teachSkill.likesCount - a.teachSkill.likesCount)

  const displayedPopularCards = isPopularExpanded ? popularCards : popularCards.slice(0, 3)

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
          new Date(b.teachSkill.createdAt).getTime() - new Date(a.teachSkill.createdAt).getTime(),
      )
  }, [cardItems])

  const displayedNewCards = isNewExpanded ? newCards : newCards.slice(0, 3)

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
          <FilterSection
            groups={filterGroups}
            values={filters}
            onFiltersChange={handleFiltersChange}
          />
        </aside>

        <main className={styles.main}>
  {activeFilters.length > 0 && (
    <div className={styles.activeFilters}>
      {activeFilters.map((filter) => (
        <button
          key={`${filter.groupId}-${filter.value}`}
          type="button"
          className={styles.activeFilter}
          onClick={() => handleRemoveFilter(filter)}
        >
          {filter.label}
          <span className={styles.activeFilterIcon}>×</span>
        </button>
      ))}
    </div>
  )}

  {isFiltering ? (
  <section className={styles.filteredSection}>
    <div className={styles.filteredHeader}>
      <h2 className={styles.filteredTitle}>
        Подходящие предложения: {cardItems.length}
      </h2>
    </div>

    {cardItems.length > 0 ? (
      <div className={styles.cardsGrid}>
        {cardItems.map(({ user, teachSkill, learnSkills }) => (
          <UserCard
            key={user.id}
            user={user}
            teachSkill={teachSkill}
            learnSkills={learnSkills}
            onDetailsClick={() => navigate(`/skill/${teachSkill.id}`)}
          />
        ))}
      </div>
    ) : (
      <p className={styles.empty}>Ничего не найдено</p>
    )}
  </section>
) : (
  <>
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

    {/* Рекомендуем */}
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

      {hasMoreRecommended && (
        <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
          {isLoadingRecommended ? (
            <p className={styles.loadingText}>Загрузка...</p>
          ) : (
            <p className={styles.loadingText}>Загружаем ещё...</p>
          )}
        </div>
      )}

      <div className={styles.counter}>
        Показано {displayedRecommendedCards.length} из {shuffledRecommendedCards.length} рекомендаций
      </div>
    </Section>
  </>
)}
</main>
      </div>
    </div>
  )
}
