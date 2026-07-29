import { CATEGORIES_DATA, MOCK_CITIES } from '../../../shared/lib/constants'
import type { Subcategory } from '../../../shared/types'

export const categoriesMap = new Map(CATEGORIES_DATA.map((cat) => [cat.id, cat]))

export const citiesMap = new Map(MOCK_CITIES.map((city) => [city.id, city.name]))

export const allSubcategoriesMap = new Map<string, Subcategory & { categoryId: string }>()
CATEGORIES_DATA.forEach((category) => {
  category.subcategories.forEach((subcat) => {
    allSubcategoriesMap.set(subcat.id, { ...subcat, categoryId: category.id })
  })
})
