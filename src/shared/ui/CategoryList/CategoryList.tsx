import styles from './CategoryList.module.css'

import type { Category, CategoryIcon, Subcategory } from '@/shared/types'

import BriefcaseIcon from '@/shared/assets/icons/briefcase.svg?react'
import PaletteIcon from '@/shared/assets/icons/palette.svg?react'
import GlobalIcon from '@/shared/assets/icons/global.svg?react'
import BookIcon from '@/shared/assets/icons/book.svg?react'
import HomeIcon from '@/shared/assets/icons/home.svg?react'
import LifestyleIcon from '@/shared/assets/icons/lifestyle.svg?react'

export interface CategoryListProps {
  categories: Category[]
  onCategoryClick: (category: Category) => void
  onSubcategoryClick: (subcategory: Subcategory) => void
}

const iconMap: Record<CategoryIcon, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  business: BriefcaseIcon,
  art: PaletteIcon,
  languages: GlobalIcon,
  education: BookIcon,
  home: HomeIcon,
  health: LifestyleIcon,
}

const iconBackgroundMap: Record<CategoryIcon, string> = {
  business: styles.business,
  art: styles.art,
  languages: styles.languages,
  education: styles.education,
  home: styles.home,
  health: styles.health,
}

export function CategoryList({
  categories,
  onCategoryClick,
  onSubcategoryClick,
}: CategoryListProps) {
  return (
    <div className={styles.categoryList}>
      {categories.map((category) => {
        const Icon = iconMap[category.icon]
        const iconBackgroundClass = iconBackgroundMap[category.icon]

        return (
          <section key={category.id} className={styles.category}>
            <div className={`${styles.iconWrapper} ${iconBackgroundClass}`}>
              <Icon className={styles.categoryIcon} />
            </div>

            <div className={styles.categoryContent}>
              <button
                type="button"
                className={styles.categoryTitle}
                onClick={() => onCategoryClick(category)}
              >
                {category.name}
              </button>

              <div className={styles.subcategoryList}>
                {category.subcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    type="button"
                    className={styles.subcategoryButton}
                    onClick={() => onSubcategoryClick(subcategory)}
                  >
                    {subcategory.name}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
