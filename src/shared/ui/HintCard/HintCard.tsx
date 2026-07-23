import clsx from 'clsx'
import { Card } from '@/shared/ui/Card'
import type { HintCardProps } from './types'
import styles from './HintCard.module.css'

export function HintCard({
  image,
  title,
  description,
  imageAlt = '',
  className,
}: HintCardProps) {
  return (
    <Card className={clsx(styles.hintCard, className)}>
      <img className={styles.image} src={image} alt={imageAlt} />

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </Card>
  )
}