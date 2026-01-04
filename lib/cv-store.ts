// Simple client-side store for CV - In production, use database

export type CVData = {
  fileName: string
  fileUrl: string
  uploadedAt: string
  fileSize: string
}

const CV_STORAGE_KEY = "portfolio_cv_data"

// Default CV data
const defaultCV: CVData = {
  fileName: "CV-Nguyen-Van-A-FullStack-Developer.pdf",
  fileUrl: "/cv-default.pdf",
  uploadedAt: new Date().toISOString(),
  fileSize: "245 KB",
}

// Initialize from API
export async function initCVStore() {
  if (typeof window === "undefined") return
  try {
    const res = await fetch("/api/cv")
    const data = await res.json()
    if (data && !data.error) {
      localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(data))
    }
  } catch (error) {
    console.error("Failed to init CV store:", error)
  }
}

if (typeof window !== "undefined") {
  initCVStore()
}

export function getCVData(): CVData {
  if (typeof window === "undefined") return defaultCV

  const stored = localStorage.getItem(CV_STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultCV
    }
  }
  return defaultCV
}

export async function setCVData(data: CVData): Promise<void> {
  if (typeof window === "undefined") return

  // Optimistic
  localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(data))

  await fetch("/api/cv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
}

export async function clearCVData(): Promise<void> {
  if (typeof window === "undefined") return
  localStorage.removeItem(CV_STORAGE_KEY)
  await fetch("/api/cv", { method: "DELETE" })
}
