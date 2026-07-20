export interface NotificationProps {
  text: string
  senderName?: string
  onAction?: () => void
  onClose?: () => void
  hasNew?: boolean
  count?: number
}
