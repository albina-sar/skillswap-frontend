import { useCallback, useEffect, useRef, useState } from 'react'

const LOCAL_STORAGE_CHANGED_EVENT = 'skillswap:local-storage-changed'

function readValue<T>(key: string, initialValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : initialValue
  } catch {
    return initialValue
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  // храним initialValue в ref, чтобы не пересоздавать код ниже каждый раз
  const initialValueRef = useRef(initialValue)
  initialValueRef.current = initialValue

  const [value, setValue] = useState<T>(() => readValue(key, initialValueRef.current))

  // если данные поменялись в другом месте — обновляем и у себя
  useEffect(() => {
    const handleChange = () => setValue(readValue(key, initialValueRef.current))

    window.addEventListener(LOCAL_STORAGE_CHANGED_EVENT, handleChange)
    window.addEventListener('storage', handleChange)

    return () => {
      window.removeEventListener(LOCAL_STORAGE_CHANGED_EVENT, handleChange)
      window.removeEventListener('storage', handleChange)
    }
  }, [key])

  const setStoredValue = useCallback(
    (update: T | ((prev: T) => T)) => {
      // берём свежие данные из localStorage, а не старые из этого хука
      const current = readValue(key, initialValueRef.current)
      const next = typeof update === 'function' ? (update as (prev: T) => T)(current) : update

      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch {
        console.error(`Failed to save to localStorage: ${key}`)
      }

      // говорим остальным компонентам, что данные обновились
      window.dispatchEvent(new Event(LOCAL_STORAGE_CHANGED_EVENT))
    },
    [key],
  )

  return [value, setStoredValue] as const
}
