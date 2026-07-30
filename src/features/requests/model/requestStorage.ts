import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { Notification, RequestStatus, SwapRequest } from '@/shared/types'

export const REQUESTS_CHANGED_EVENT = 'skillswap:requests-changed'
export const NOTIFICATIONS_CHANGED_EVENT = 'skillswap:notifications-changed'

interface CreateRequestParams {
  skillId: string
  fromUserId: string
  toUserId: string
  senderName: string
  recipientName?: string
}

function readList<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? (value as T[]) : []
  } catch {
    return []
  }
}

function createId(prefix: string): string {
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
  return `${prefix}-${id}`
}

function saveRequests(requests: SwapRequest[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, JSON.stringify(requests))
  window.dispatchEvent(new Event(REQUESTS_CHANGED_EVENT))
}

function addNotification(notification: Notification): void {
  const notifications = readList<Notification>(LOCAL_STORAGE_KEYS.NOTIFICATIONS)
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.NOTIFICATIONS,
    JSON.stringify([...notifications, notification]),
  )
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT))
}

function makeNotification(
  request: SwapRequest,
  userId: string,
  title: string,
  description: string,
  createdAt: string,
): Notification {
  return {
    id: createId('notification'),
    userId,
    requestId: request.id,
    title,
    description,
    isRead: false,
    createdAt,
  }
}

export function getSwapRequests(): SwapRequest[] {
  return readList<SwapRequest>(LOCAL_STORAGE_KEYS.REQUESTS)
}

export function hasRequestForSkill(skillId: string, fromUserId: string): boolean {
  return getSwapRequests().some(
    (request) => request.skillId === skillId && request.fromUserId === fromUserId,
  )
}

export function createSwapRequest(
  {
    skillId,
    fromUserId,
    toUserId,
    senderName,
    recipientName = 'Пользователь',
  }: CreateRequestParams,
  random: () => number = Math.random,
): SwapRequest {
  const requests = getSwapRequests()
  const existingRequest = requests.find(
    (request) => request.skillId === skillId && request.fromUserId === fromUserId,
  )

  if (existingRequest) return existingRequest

  const createdAt = new Date().toISOString()
  const pendingRequest: SwapRequest = {
    id: createId('request'),
    skillId,
    fromUserId,
    toUserId,
    status: 'pending',
    createdAt,
    updatedAt: createdAt,
  }

  saveRequests([...requests, pendingRequest])

  // УВЕДОМЛЕНИЕ ДЛЯ ПОЛУЧАТЕЛЯ
  addNotification(
    makeNotification(
      pendingRequest,
      toUserId,
      `${senderName} предлагает вам обмен`,
      'Примите обмен, чтобы обсудить детали',
      createdAt,
    ),
  )

  // УВЕДОМЛЕНИЕ ДЛЯ ОТПРАВИТЕЛЯ
  addNotification(
    makeNotification(
      pendingRequest,
      fromUserId,
      `Вы предложили обмен ${recipientName}`,
      'Ожидайте ответа от пользователя',
      createdAt,
    ),
  )

  const status: RequestStatus = random() < 0.5 ? 'accepted' : 'rejected'
  const updatedAt = new Date().toISOString()
  const resolvedRequest = { ...pendingRequest, status, updatedAt }

  saveRequests([...requests, resolvedRequest])

  addNotification(
    makeNotification(
      resolvedRequest,
      fromUserId,
      status === 'accepted'
        ? `${recipientName} принял ваш обмен`
        : `${recipientName} отклонил ваш обмен`,
      status === 'accepted'
        ? 'Перейдите в профиль, чтобы обсудить детали'
        : 'Вы можете предложить обмен другому пользователю',
      updatedAt,
    ),
  )

  return resolvedRequest
}
