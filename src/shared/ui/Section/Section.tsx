import React from 'react'
import clsx from 'clsx'
import styles from './Section.module.css'
import type { SectionProps } from './types'
import { Button } from '../button/button'
import ArrowIcon from '@/shared/assets/icons/VectorRight.svg?react'

export const Section: React.FC<SectionProps> = ({
  title,
  showAllButton = false,
  onSeeAll,
  children,
}) => {
  return (
    <section className={clsx(styles.section)}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {showAllButton && (
          <Button variant="white" onClick={onSeeAll} image={<ArrowIcon />} imagePosition="right">
            Смотреть все
          </Button>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </section>
  )
}
