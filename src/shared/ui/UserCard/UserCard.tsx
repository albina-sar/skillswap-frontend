import { Card } from '@/shared/ui/Card'
import { AvatarUI } from '@/shared/ui/avatar'
import { Button } from '../button/button'
import { Tag } from '@/shared/ui/Tag'
import { LikeButton } from '@/shared/ui/likeButton'
import type { Skill, User } from '@/shared/types'
import { OverflowTags } from '@/shared/ui/OverflowTags'

import styles from './UserCard.module.css'

interface UserCardProps {
  user: User
  teachSkill: Skill
  learnSkills: Skill[]
  variant?: 'catalog' | 'skill'
  likesCount?: number
  isLiked?: boolean
  onLikeToggle?: () => void
  onDetailsClick?: () => void
}

const tagBackgroundMap: Record<string, string> = {
  '1': 'var(--tag-business)',
  '2': 'var(--tag-creative)',
  '3': 'var(--tag-languages)',
  '4': 'var(--tag-education)',
  '5': 'var(--tag-home)',
  '6': 'var(--tag-health)',
}

const getTagBackground = (subcategoryId: string) =>
  tagBackgroundMap[subcategoryId[0]] ?? 'var(--tag-new)'

const getAge = (dateOfBirth: string) => {
  const birth = new Date(dateOfBirth)
  const today = new Date()

  let age = today.getFullYear() - birth.getFullYear()

  const month = today.getMonth() - birth.getMonth()

  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

const getAgeLabel = (age: number) => {
  const lastDigit = age % 10
  const lastTwoDigits = age % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'лет'
  }

  if (lastDigit === 1) {
    return 'год'
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'года'
  }

  return 'лет'
}

export function UserCard({
  user,
  teachSkill,
  learnSkills,
  variant = 'catalog',
  likesCount = 0,
  isLiked = false,
  onLikeToggle = () => {},
  onDetailsClick,
}: UserCardProps) {
  const age = getAge(user.dateOfBirth)

  return (
    <Card className={styles.userCard}>
      <header className={styles.header}>
        <div className={styles.user}>
          <AvatarUI image={user.photo} name={user.name} size="md" />

          <div className={styles.info}>
            <h2 className={variant === 'catalog' ? styles.nameCatalog : styles.nameSkill}>
              {user.name}
            </h2>

            <p className={styles.meta}>
              {user.city}, {age} {getAgeLabel(age)}
            </p>
          </div>
        </div>

        {variant === 'catalog' && (
          <div className={styles.like}>
            <LikeButton isLiked={isLiked} likeCount={likesCount} onToggle={onLikeToggle} />
          </div>
        )}
      </header>

      <div className={styles.content}>
        {variant === 'skill' && <p className={styles.about}>{user.about}</p>}

        <div className={styles.sections}>
          <section className={styles.section}>
            <h4 className={styles.title}>Может научить</h4>

            <div className={styles.tags}>
              <Tag
                label={teachSkill.title}
                backgroundColor={getTagBackground(teachSkill.subcategoryId)}
                textColor="var(--text-primary)"
              />
            </div>
          </section>

          <section className={styles.section}>
            <h4 className={styles.title}>Хочет научиться</h4>

            <OverflowTags
              skills={learnSkills}
              getBackgroundColor={(skill) => getTagBackground(skill.subcategoryId)}
            />
          </section>
        </div>

        {variant === 'catalog' && (
          <Button className={styles.button} variant="primary" size="large" onClick={onDetailsClick}>
            Подробнее
          </Button>
        )}
      </div>
    </Card>
  )
}
