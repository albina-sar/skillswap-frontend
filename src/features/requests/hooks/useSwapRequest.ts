import { useCallback, useEffect, useState } from 'react'

import {
  createSwapRequest,
  hasRequestForSkill,
  REQUESTS_CHANGED_EVENT,
} from '../model/requestStorage'

interface UseSwapRequestParams {
  skillId: string
  fromUserId: string
  toUserId: string
  recipientName?: string
}

export function useSwapRequest(params: UseSwapRequestParams) {
  const { skillId, fromUserId } = params
  const [isProposed, setIsProposed] = useState(() =>
    hasRequestForSkill(skillId, fromUserId),
  )

  useEffect(() => {
    const updateState = () => setIsProposed(hasRequestForSkill(skillId, fromUserId))

    window.addEventListener(REQUESTS_CHANGED_EVENT, updateState)
    window.addEventListener('storage', updateState)

    return () => {
      window.removeEventListener(REQUESTS_CHANGED_EVENT, updateState)
      window.removeEventListener('storage', updateState)
    }
  }, [fromUserId, skillId])

  const proposeExchange = useCallback(() => {
    createSwapRequest(params)
    setIsProposed(true)
  }, [params])

  return { isProposed, proposeExchange }
}
