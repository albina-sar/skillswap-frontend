import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { fetchUserById } from '@/api/users'
import { Card } from '@/shared/ui/Card/Card'
import { Button } from '@/shared/ui/button/button'
import { LikeButton } from '../likeButton'
import { ImageGalleryUI } from '@/shared/ui/imageGallery/imageGallery'
import { ModalExchangeSuggestion } from '@/shared/ui/ModalExchangeSuggestion'
import { CATEGORIES_DATA, ROUTES } from '@/shared/lib/constants'
import { getAuthUser } from '@/features/auth/model/authUtils'
import { useSwapRequest } from '@/features/requests'

import type { SkillCardProps } from './types'

import styles from './SkillCard.module.css'

import shareIcon from '@/shared/assets/icons/share.svg'
import moreIcon from '@/shared/assets/icons/more-square.svg'

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
    <>
      <Card className={styles.card}>
        <div className={styles.actionsRow}>
          <div className={styles.actions}>
            <LikeButton
              isLiked={isFavorite}
              likeCount={skill.likesCount}
              onToggle={onFavoriteClick}
            />

            <button type="button" className={styles.iconButton} aria-label="Поделиться">
              <img src={shareIcon} alt="" />
            </button>

            <button type="button" className={styles.iconButton} aria-label="Дополнительное меню">
              <img src={moreIcon} alt="" />
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.info}>
            <div className={styles.top}>
              <div className={styles.header}>
                <div>
                  <h1 className={styles.title}>{skill.title}</h1>

                  <p className={styles.category}>
                    {category?.name}
                    {subcategory && (
                      <>
                        <span className={styles.separator}> / </span>
                        {subcategory.name}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <p className={styles.description}>{skill.description}</p>
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

          <div className={styles.gallery}>
            <ImageGalleryUI images={skill.imageUrl} />
          </div>
        </div>
      </Card>

      <ModalExchangeSuggestion
        isModalOpened={isModalOpened}
        onCloseModal={() => setIsModalOpened(false)}
      />
    </>
  )
}
