import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"

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

// Initialize from Firestore
export async function initCVStore() {
  if (typeof window === "undefined") return
  try {
    const docRef = doc(db, "cv", "current")
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data() as CVData
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

  try {
    await setDoc(doc(db, "cv", "current"), data)
  } catch (e) {
    console.error("Error saving CV to FB", e)
  }
}

export async function clearCVData(): Promise<void> {
  if (typeof window === "undefined") return
  localStorage.removeItem(CV_STORAGE_KEY)
  try {
    await deleteDoc(doc(db, "cv", "current"))
  } catch (e) { console.error(e) }
}
