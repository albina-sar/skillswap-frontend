export type SearchSuggestion =
  | { type: 'category'; id: string; name: string }
  | { type: 'subcategory'; id: string; name: string; categoryId: string }
  | { type: 'skill'; id: string; title: string }