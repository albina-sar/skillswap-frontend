import { useState, useMemo, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import {
  selectSkills,
  selectSkillsLoading,
  loadSkills,
} from '../../entities/skill/model/skillsSlice'
import { selectUsers, fetchUsersThunk } from '../../entities/user/model/usersSlice'
import { FilterSection } from '../../shared/ui/filter-section/filter-section'
import {
  filterGroups,
  FiltersState,
  getDefaultFilterValues,
} from '../../features/filters/model/filterGroups'
import { Card } from '../../shared/ui/Card'
import { CATEGORIES_DATA, MOCK_CITIES } from '../../shared/lib/constants'
import styles from './CatalogPage.module.css'

const categoriesMap = new Map(CATEGORIES_DATA.map((cat) => [cat.id, cat]))
const citiesMap = new Map(MOCK_CITIES.map((city) => [city.id, city.name]))

export default function CatalogPage() {
  const dispatch = useAppDispatch()
  const skills = useAppSelector(selectSkills)
  const users = useAppSelector(selectUsers)
  const loading = useAppSelector(selectSkillsLoading)

  useEffect(() => {
    dispatch(loadSkills())
    dispatch(fetchUsersThunk())
  }, [dispatch])

  const usersMap = useMemo(() => {
    const map = new Map()
    users.forEach((user) => map.set(user.id, user))
    return map
  }, [users])

  const [filters, setFilters] = useState<FiltersState>(getDefaultFilterValues(filterGroups))

  const handleFiltersChange = (newFilters: FiltersState) => {
    setFilters(newFilters)
  }

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const author = usersMap.get(skill.authorId)
      const skillLearningType = (skill as any).learningType ?? 'any'

      // Фильтр по типу
      if (filters.learningType !== 'any' && skillLearningType !== filters.learningType) return false

      // Фильтр по категориям/подкатегориям
      if (Array.isArray(filters.skills) && filters.skills.length > 0) {
        const hasMatchingCategory =
          filters.skills.includes(skill.categoryId) || filters.skills.includes(skill.subcategoryId)
        if (!hasMatchingCategory) return false
      }

      // Фильтр по полу автора
      const normalizedGender =
        author?.gender === 'мужской' ? 'male' : author?.gender === 'женский' ? 'female' : 'any'

      if (filters.gender !== 'any' && normalizedGender !== filters.gender) return false

      // Фильтр по городу (сравниваем названия городов)
      if (Array.isArray(filters.city) && filters.city.length > 0) {
        const authorCityName = author?.city
        const hasMatchingCity = filters.city.some(
          (cityId) => citiesMap.get(cityId) === authorCityName,
        )
        if (!hasMatchingCity) return false
      }

      return true
    })
  }, [skills, usersMap, filters])

  if (loading) {
    return (
      <main className={styles.container}>
        <h1 className={styles.title}>Загрузка...</h1>
      </main>
    )
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Каталог навыков</h1>

      <div className={styles.layout}>
        <aside className={styles.filtersSidebar}>
          <FilterSection groups={filterGroups} onFiltersChange={handleFiltersChange} />
        </aside>

        <section className={styles.skillsList}>
          {filteredSkills.length === 0 ? (
            <div className={styles.emptyState}>
              <p>По вашим фильтрам ничего не найдено.</p>
              <p>Попробуйте сбросить фильтры или изменить параметры поиска.</p>
            </div>
          ) : (
            filteredSkills.map((skill) => {
              const author = usersMap.get(skill.authorId)
              const category = categoriesMap.get(skill.categoryId)
              const skillLearningType = (skill as any).learningType ?? 'any'

              return (
                <Card key={skill.id} className={styles.skillCard}>
                  <h3>{skill.title}</h3>
                  <p>Тип: {skillLearningType === 'learn' ? 'Хочу научиться' : 'Могу научить'}</p>
                  <p>Категория: {category?.name || skill.categoryId}</p>
                  <p>
                    Автор:{' '}
                    {author?.gender === 'male'
                      ? 'Мужчина'
                      : author?.gender === 'female'
                        ? 'Женщина'
                        : 'Не указан'}
                    , {author?.city || 'Город не указан'}
                  </p>
                </Card>
              )
            })
          )}
        </section>
      </div>
    </main>
  )
}
