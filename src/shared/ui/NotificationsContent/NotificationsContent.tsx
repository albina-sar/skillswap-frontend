import clsx from 'clsx'
import { Button } from '@/shared/ui/button/button'
import styles from './NotificationsContent.module.css'
import type { NotificationsContentProps, NotificationItem } from './types'
import LampIcon from '@/shared/assets/icons/VectorLamp.svg'

export const NotificationsContent = ({
  notifications,
  onAction,
  onReadAll,
  onClear,
}: NotificationsContentProps) => {
  // Фильтруем уведомления по isRead
  const newNotifications = notifications.filter((n) => !n.isRead)
  const viewedNotifications = notifications.filter((n) => n.isRead)

  return (
    <div className={styles.container}>
      {/* Заголовок: Новые уведомления */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Новые уведомления</h2>
        <button className={styles.linkButton} onClick={onReadAll}>
          Прочитать все
        </button>
      </div>

      {/* Список новых уведомлений */}
      {newNotifications.length > 0 ? (
        <div className={styles.notificationList}>
          {newNotifications.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              onAction={onAction}
            />
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>Новых уведомлений нет</p>
      )}

      {/* Просмотренные */}
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Просмотренные</h3>
        <button className={styles.linkButton} onClick={onClear}>
          Очистить
        </button>
      </div>

      {viewedNotifications.length > 0 ? (
        <div className={styles.notificationList}>
          {viewedNotifications.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              onAction={onAction}
              isViewed
            />
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>Просмотренных уведомлений нет</p>
      )}
    </div>
  )
}

// Карточка уведомления
interface NotificationCardProps {
  item: NotificationItem
  onAction?: (id: string) => void
  isViewed?: boolean
}

const NotificationCard = ({ item, onAction, isViewed = false }: NotificationCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <img src={LampIcon} alt="" className={styles.cardIcon} width={40} height={40} />
        <div className={styles.cardTextWrapper}>
          <div className={styles.cardHeader}>
            <span className={clsx(styles.cardText, styles.cardTitle)}>
              {item.senderName} {item.title}
            </span>
            <span className={clsx(styles.cardText, styles.cardDate)}>{item.date}</span>
          </div>
          <p className={clsx(styles.cardText, styles.cardDescription)}>{item.description}</p>
        </div>
      </div>
      {!isViewed && (
        <Button
          variant="primary"
          className={styles.actionButton}
          onClick={() => onAction?.(item.id)}
        >
          Перейти
        </Button>
      )}
    </div>
  )
}
