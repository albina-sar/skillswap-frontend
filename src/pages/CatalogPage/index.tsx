import { FilterSection } from '../../shared/ui/filter-section/filter-section'
import { filterGroups } from '../../features/filters/model/filterGroups'
import { Card } from '../../shared/ui/Card'
import { useCatalogFilters } from './hooks/useCatalogFilters'
import { categoriesMap, allSubcategoriesMap } from './lib/maps'
import styles from './CatalogPage.module.css'

export default function CatalogPage() {
  const { filteredSkills, loading, handleFiltersChange } = useCatalogFilters()

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
              const category = categoriesMap.get(skill.categoryId)
              const subcategory = allSubcategoriesMap.get(skill.subcategoryId)
              const skillLearningType = (skill as any).learningType ?? 'any'

              return (
                <Card key={skill.id} className={styles.skillCard}>
                  <h3>{skill.title}</h3>
                  <p>Тип: {skillLearningType === 'learn' ? 'Хочу научиться' : 'Могу научить'}</p>
                  <p>Категория: {category?.name || skill.categoryId}</p>
                  <p>Подкатегория: {subcategory?.name || skill.subcategoryId}</p>
                </Card>
              )
            })
          )}
        </section>
      </div>
    </main>
  )
}
