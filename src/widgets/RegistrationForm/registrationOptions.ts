import { CATEGORIES_DATA, GENDER_OPTIONS, MOCK_CITIES } from '@/shared/lib/constants'

export const categoryOptions = CATEGORIES_DATA.map(({ id, name }) => ({ value: id, label: name }))
export const cityOptions = MOCK_CITIES.map(({ name }) => ({ value: name, label: name }))
export const genderOptions = GENDER_OPTIONS.map(({ value, label }) => ({ value, label }))

export const getCategoryIdsBySubcategoryIds = (subcategoryIds: string[]) =>
  CATEGORIES_DATA.filter(({ subcategories }) =>
    subcategories.some(({ id }) => subcategoryIds.includes(id)),
  ).map(({ id }) => id)

export const getSubcategoryOptions = (categoryIds: string[]) =>
  CATEGORIES_DATA.filter(({ id }) => !categoryIds.length || categoryIds.includes(id)).flatMap(
    ({ subcategories }) => subcategories.map(({ id, name }) => ({ value: id, label: name })),
  )

export const getSubcategoryIdsForCategories = (categoryIds: string[]) =>
  CATEGORIES_DATA.filter(({ id }) => categoryIds.includes(id))
    .flatMap(({ subcategories }) => subcategories)
    .map(({ id }) => id)
