import { beforeEach, describe, expect, it } from 'vitest'

import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { Notification, SwapRequest } from '@/shared/types'

import {
  createSwapRequest,
  getSwapRequests,
  hasRequestForSkill,
} from './requestStorage'

describe('requestStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it.each([
    [0.1, 'accepted', 'принял'],
    [0.9, 'rejected', 'отклонил'],
  ] as const)('creates and automatically resolves a request', (random, status, text) => {
    const request = createSwapRequest(
      {
        skillId: 'skill-1',
        fromUserId: 'user-1',
        toUserId: 'user-2',
        senderName: 'Анна',
        recipientName: 'Олег',
      },
      () => random,
    )
    const notifications = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS) ?? '[]',
    ) as Notification[]

    expect(request.status).toBe(status)
    expect(getSwapRequests()).toEqual([request])
    expect(notifications).toHaveLength(2)
    expect(notifications.every((notification) => notification.isRead === false)).toBe(true)
    expect(notifications[0]).toMatchObject({
      title: 'Анна предлагает вам обмен',
      description: 'Примите обмен, чтобы обсудить детали',
    })
    expect(notifications[1].title).toContain(text)
    expect(notifications[1].description).toBe(
      status === 'accepted'
        ? 'Перейдите в профиль, чтобы обсудить детали'
        : 'Вы можете предложить обмен другому пользователю',
    )
  })

  it('does not create a duplicate request for the same skill and user', () => {
    const params = {
      skillId: 'skill-1',
      fromUserId: 'user-1',
      toUserId: 'user-2',
      senderName: 'Анна',
    }

    const firstRequest = createSwapRequest(params, () => 0.1)
    const secondRequest = createSwapRequest(params, () => 0.9)
    const requests = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS) ?? '[]',
    ) as SwapRequest[]

    expect(secondRequest).toEqual(firstRequest)
    expect(requests).toHaveLength(1)
    expect(hasRequestForSkill('skill-1', 'user-1')).toBe(true)
  })
})
