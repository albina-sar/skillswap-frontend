import styles from './NotificationsContent.module.css'
import LampIcon from '@/shared/assets/icons/VectorLamp.svg'

interface NotificationItem {
  id: string
  senderName: string
  title: string
  description: string
  date: string
  type: 'new' | 'viewed'
}

interface NotificationsContentProps {
  notifications: {
    new: NotificationItem[]
    viewed: NotificationItem[]
  }
  onAction?: (id: string) => void
  onReadAll?: () => void
  onClear?: () => void
}

export const NotificationsContent = ({
  notifications,
  onAction,
  onReadAll,
  onClear,
}: NotificationsContentProps) => {
  return (
    <div className={styles.container}>
      {/* Заголовок: Новые уведомления */}
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Новые уведомления</h2>
        <button className={styles.readAllButton} onClick={onReadAll}>
          Прочитать все
        </button>
      </div>

      {/* Список новых уведомлений */}
      <div className={styles.newSection}>
        {notifications.new.map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            onAction={onAction}
          />
        ))}
      </div>

      {/* Просмотренные */}
      {notifications.viewed.length > 0 && (
        <div className={styles.viewedSection}>
          <div className={styles.viewedHeader}>
            <h3 className={styles.viewedTitle}>Просмотренные</h3>
            <button className={styles.clearButton} onClick={onClear}>
              Очистить
            </button>
          </div>

          <div className={styles.viewedList}>
            {notifications.viewed.map((item) => (
              <NotificationCard
                key={item.id}
                item={item}
                onAction={onAction}
                isViewed
              />
            ))}
          </div>
        </div>
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
            <span className={styles.cardTitle}>
              {item.senderName} {item.title}
            </span>
            <span className={styles.cardDate}>{item.date}</span>
          </div>
          <p className={styles.cardDescription}>{item.description}</p>
          {!isViewed && (
            <button className={styles.actionButton} onClick={() => onAction?.(item.id)}>
              Перейти
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
