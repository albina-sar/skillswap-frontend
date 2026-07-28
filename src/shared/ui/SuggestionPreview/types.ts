export interface SuggestionPreviewProps {
  title: string
  categoryName: string
  subcategoryName: string
  description: string
  images: string[]
  onEdit: () => void
  onDone: () => void
}