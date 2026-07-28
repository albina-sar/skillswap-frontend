import { SkillLikeButton } from '@/features/like'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/button/button'
import styles from './SkillCard.module.css'
import type { SkillCardProps } from './types'

export const SkillCard = ({ skill }: SkillCardProps) => {
  // Находим категорию и подкатегорию для отображения
  const categoryName = skill.categoryId // TODO: заменить на реальное название
  const subcategoryName = skill.subcategoryId // TODO: заменить на реальное название

  return (
    <Card className={styles.card}>
      {/* Верхняя часть: лайк */}
      <div className={styles.actionsRow}>
        <div className={styles.actions}>
          <SkillLikeButton skillId={skill.id} baseLikeCount={skill.likesCount} />
        </div>
      </div>

      {/* Основной контент */}
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.top}>
            <div className={styles.header}>
              <h2 className={styles.title}>{skill.title}</h2>
              <p className={styles.category}>
                {categoryName}
                <span className={styles.separator}>/</span>
                {subcategoryName}
              </p>
            </div>

            <p className={styles.description}>{skill.description}</p>
          </div>

          <Button variant="primary" size="large" className={styles.exchangeButton}>
            Предложить обмен
          </Button>
        </div>

        {/* Галерея (заглушка) */}
        <div className={styles.gallery}>
          {/* TODO: добавить галерею изображений */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              color: '#999',
            }}
          >
            📸 Изображения
          </div>
        </div>
      </div>
    </Card>
  )
}
