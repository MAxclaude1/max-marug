import { useState, useEffect } from 'react'

export function useCountUp(target, duration = 650) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const startTime = Date.now()

    function tick() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const next = Math.round(eased * target)
      setValue(next)
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [target, duration])

  return value
}

export function useLocalStorage(key, fallback) {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { partners: parsed, isMock: false, isError: false }
        }
      }
    } catch {
      return { partners: [], isMock: false, isError: true }
    }
    return { partners: fallback, isMock: true, isError: false }
  })

  function refresh() {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setData({ partners: parsed, isMock: false, isError: false })
          return
        }
      }
      setData({ partners: fallback, isMock: true, isError: false })
    } catch {
      setData({ partners: [], isMock: false, isError: true })
    }
  }

  return { ...data, refresh }
}
