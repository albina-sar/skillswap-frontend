import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { Notification, RequestStatus, SwapRequest } from '@/shared/types'

export const REQUESTS_CHANGED_EVENT = 'skillswap:requests-changed'

interface CreateRequestParams {
  skillId: string
  fromUserId: string
  toUserId: string
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
}

function makeNotification(
  request: SwapRequest,
  userId: string,
  text: string,
  createdAt: string,
): Notification {
  return {
    id: createId('notification'),
    userId,
    requestId: request.id,
    text,
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
  { skillId, fromUserId, toUserId, recipientName = 'Пользователь' }: CreateRequestParams,
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
  addNotification(
    makeNotification(pendingRequest, toUserId, 'Вам предложили обмен навыками', createdAt),
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
      updatedAt,
    ),
  )

  return resolvedRequest
}
