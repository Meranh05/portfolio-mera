"use client"

import { useEffect, useState } from "react"

export function useCounter(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0)
  const [shouldStart, setShouldStart] = useState(!startOnView)

  useEffect(() => {
    if (!shouldStart) return

    let startTime: number
    let animationId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [end, duration, shouldStart])

  return { count, start: () => setShouldStart(true) }
}
