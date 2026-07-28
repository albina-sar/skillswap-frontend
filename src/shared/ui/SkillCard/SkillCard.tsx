import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { fetchUserById } from '@/api/users'
import { getAuthUser } from '@/features/auth/model/authUtils'
import { useSwapRequest } from '@/features/requests'
import { CATEGORIES_DATA, ROUTES } from '@/shared/lib/constants'
import { Button } from '@/shared/ui/button/button'
import { Card } from '@/shared/ui/Card/Card'
import { LikeButton } from '../likeButton'

import type { SkillCardProps } from './types'

import styles from './SkillCard.module.css'

export function SkillCard({ skill, isFavorite, onFavoriteClick }: SkillCardProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [recipientName, setRecipientName] = useState('Пользователь')
  const [isRecipientLoading, setIsRecipientLoading] = useState(true)
  const authUser = getAuthUser()
  const { isProposed, proposeExchange } = useSwapRequest({
    skillId: skill.id,
    fromUserId: authUser?.id ?? '',
    toUserId: skill.authorId,
    senderName: authUser?.name ?? 'Пользователь',
    recipientName,
  })

  useEffect(() => {
    let isActive = true

    void fetchUserById(skill.authorId)
      .then((user) => {
        if (isActive && user) setRecipientName(user.name)
      })
      .catch(() => undefined)
      .finally(() => {
        if (isActive) setIsRecipientLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [skill.authorId])

  const category = useMemo(
    () => CATEGORIES_DATA.find((item) => item.id === skill.categoryId),
    [skill.categoryId],
  )

  const subcategory = useMemo(
    () => category?.subcategories.find((item) => item.id === skill.subcategoryId),
    [category, skill.subcategoryId],
  )

  return (
    <Card className={styles.card}>
      {/* Верхняя часть: лайк */}
      <div className={styles.actionsRow}>
        <div className={styles.actions}>
          <LikeButton
            skillId={skill.id}
            isFavorite={isFavorite}
            onFavoriteClick={onFavoriteClick}
          />
        </div>
      </div>

      {/* Основной контент */}
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.top}>
            <div className={styles.header}>
              <h2 className={styles.title}>{skill.title}</h2>
              <p className={styles.category}>
                {category?.name}
                <span className={styles.separator}>/</span>
                {subcategory?.name}
              </p>
            </div>

            <Button
              variant="primary"
              size="large"
              disabled={isProposed || isRecipientLoading}
              onClick={() => {
                if (!authUser) {
                  navigate(ROUTES.LOGIN, {
                    state: { from: `${location.pathname}${location.search}` },
                  })
                  return
                }

                proposeExchange()
                setIsModalOpened(true)
              }}
              className={styles.exchangeButton}
            >
              {isProposed ? 'Обмен предложен' : 'Предложить обмен'}
            </Button>
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
