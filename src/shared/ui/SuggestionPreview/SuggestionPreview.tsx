import { Button } from '@/shared/ui/button/button'
import { ImageGalleryUI } from '@/shared/ui/imageGallery/imageGallery'
import editIcon from '@/shared/assets/icons/Edit.svg'
import type { SuggestionPreviewProps } from './types'
import styles from './SuggestionPreview.module.css'

export function SuggestionPreview({
  title,
  categoryName,
  subcategoryName,
  description,
  images,
  onEdit,
  onDone,
}: SuggestionPreviewProps) {
  return (
    <div className={styles.preview}>
      <div className={styles.header}>
        <h2 className={styles.modalTitle}>Ваше предложение</h2>
        <p className={styles.modalSubtitle}>
          Пожалуйста, проверьте и подтвердите правильность данных
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.category}>
              {categoryName} / {subcategoryName}
            </p>
          </div>

          <p className={styles.description}>{description}</p>

          <div className={styles.actions}>
            <Button type="button" variant="outline" size="large" image={editIcon} onClick={onEdit}>
              Редактировать
            </Button>

            <Button type="button" variant="primary" size="large" onClick={onDone}>
              Готово
            </Button>
          </div>
        </div>

        <div className={styles.gallery}>
          <ImageGalleryUI images={images} />
        </div>
      </div>
    </div>
  )
}
