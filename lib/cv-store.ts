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

export function setCVData(data: CVData): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(data))
}

export function clearCVData(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CV_STORAGE_KEY)
}
