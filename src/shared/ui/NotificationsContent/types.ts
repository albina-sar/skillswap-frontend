export interface NotificationItem {
  id: string
  senderName: string
  title: string
  description: string
  date: string
  isRead: boolean
}

export interface NotificationsContentProps {
  notifications: NotificationItem[]
  onAction?: (id: string) => void
  onReadAll?: () => void
  onClear?: () => void
}
