"use client"

import { useEffect } from "react"
import { incrementViews } from "@/lib/portfolio-store"

export function ViewTracker() {
  useEffect(() => {
    // Only track once per session
    const hasTracked = sessionStorage.getItem("portfolio_view_tracked")
    if (!hasTracked) {
      incrementViews()
      sessionStorage.setItem("portfolio_view_tracked", "true")
    }
  }, [])

  return null
}
