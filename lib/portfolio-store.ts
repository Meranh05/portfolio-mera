"use client"

// Store for portfolio data management with realtime sync
import { db } from "@/lib/firebase"
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  writeBatch
} from "firebase/firestore"

export interface Skill {
  id: string
  name: string
  level: number
  category: "language" | "tool" | "soft"
  color: string
  icon?: string
  visible: boolean
}

export interface AboutInfo {
  name: string
  title: string
  subtitle: string
  bio: string
  quote: string
  yearsExperience: number
  avatar: string
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  twitter: string
  socials?: SocialLink[]
  siteName: string
}

export interface SocialLink {
  platform: string
  href: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  created_at: string
  updated_at: string
  visible: boolean
  featured: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  techs: string[]
  github: string
  demo: string
  visible: boolean
  featured: boolean
  status: "published" | "draft" | "archived"
  createdAt: string
  updatedAt: string
}

export interface Experience {
  id: string
  period: string
  location: string
  title: string
  company: string
  icon: "building" | "code" | "paintbrush" | "briefcase" | "rocket"
  current: boolean
  description: string[]
  techs: string[]
  visible: boolean
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export interface DashboardStats {
  totalProjects: number
  publishedProjects: number
  totalViews: number
  totalSkills: number
  githubRepos: number
  totalExperiences: number
  unreadMessages: number
}

const SYNC_EVENT = "portfolio-sync"

export function dispatchSyncEvent(key: string) {
  if (typeof window === "undefined") return

  // Dispatch custom event for the current tab
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key } }))

  // Update a separate sync key to force 'storage' event in other tabs
  // even if the main key's value hasn't changed significantly or same
  localStorage.setItem("portfolio_sync_heartbeat", Date.now().toString())
}

export function subscribeSyncEvent(callback: (key: string) => void): () => void {
  if (typeof window === "undefined") return () => { }

  const handleCustomEvent = (e: CustomEvent) => callback(e.detail.key)
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === "portfolio_sync_heartbeat") {
      callback("sync-all")
    } else if (e.key) {
      callback(e.key)
    }
  }

  window.addEventListener(SYNC_EVENT as any, handleCustomEvent)
  window.addEventListener("storage", handleStorageEvent)

  return () => {
    window.removeEventListener(SYNC_EVENT as any, handleCustomEvent)
    window.removeEventListener("storage", handleStorageEvent)
  }
}

const defaultSkills: Skill[] = []

const defaultAboutInfo: AboutInfo = {
  name: "Mera",
  title: "Full Stack Developer",
  subtitle: "& UI/UX Designer",
  bio: "Chào mừng đến với portfolio của tôi. Hãy thêm thông tin từ trang Admin.",
  quote: "Code là nghệ thuật, và tôi là người nghệ sĩ.",
  yearsExperience: 0,
  avatar: "",
  email: "",
  phone: "",
  location: "",
  github: "",
  linkedin: "",
  twitter: "",
  socials: [],
  siteName: "Mera",
}

const defaultProjects: Project[] = []

const defaultExperiences: Experience[] = []

// LocalStorage keys
const SKILLS_KEY = "portfolio_skills"
const ABOUT_KEY = "portfolio_about"
const PROJECTS_KEY = "portfolio_projects"
const GITHUB_REPOS_KEY = "portfolio_github_repos"
const GITHUB_USERNAME_KEY = "portfolio_github_username"
const VIEWS_KEY = "portfolio_views"
const EXPERIENCES_KEY = "portfolio_experiences"
const MESSAGES_KEY = "portfolio_messages"
const AUTO_SKILLS_KEY = "portfolio_auto_skills"

// Skills functions
// Memory cache for immediate returns
let aboutCache: AboutInfo = defaultAboutInfo
let projectsCache: Project[] = []
let experiencesCache: Experience[] = []
let skillsCache: Skill[] = []
let reposCache: GitHubRepo[] = []
let messagesCache: ContactMessage[] = []

// Initialization flag
let isInitialized = false

// Initialize store from Firestore
export async function initStore() {
  if (typeof window === "undefined" || isInitialized) return

  try {
    // Parallel fetch for speed
    const [
      aboutSnap,
      projectsSnap,
      experiencesSnap,
      skillsSnap,
      reposSnap,
      messagesSnap
    ] = await Promise.all([
      getDocs(collection(db, "about")),
      getDocs(collection(db, "projects")),
      getDocs(collection(db, "experiences")),
      getDocs(collection(db, "skills")),
      getDocs(collection(db, "github_repos")),
      getDocs(collection(db, "messages"))
    ])

    // Process About
    if (!aboutSnap.empty) {
      aboutCache = aboutSnap.docs[0].data() as AboutInfo
      localStorage.setItem(ABOUT_KEY, JSON.stringify(aboutCache))
    }

    // Process Skills
    const skills = skillsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Skill))
    skillsCache = skills
    localStorage.setItem(SKILLS_KEY, JSON.stringify(skills))

    // Process Projects
    const projects = projectsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
    projectsCache = projects
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))

    // Process Others
    experiencesCache = experiencesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Experience))
    localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(experiencesCache))

    reposCache = reposSnap.docs.map(d => ({ id: Number(d.id), ...d.data() } as GitHubRepo))
    localStorage.setItem(GITHUB_REPOS_KEY, JSON.stringify(reposCache))

    messagesCache = messagesSnap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage))
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messagesCache))

    isInitialized = true
    dispatchSyncEvent("sync-all")
  } catch (error) {
    console.error("Critical error in initStore:", error)
  }
}

// Trigger initialization on import (client-side only)
if (typeof window !== "undefined") {
  initStore()
}

// Skills functions
export function getSkills(): Skill[] {
  if (typeof window === "undefined") return defaultSkills
  const stored = localStorage.getItem(SKILLS_KEY)
  skillsCache = stored ? JSON.parse(stored) : defaultSkills
  return skillsCache
}

export async function saveSkills(skills: Skill[]): Promise<void> {
  if (typeof window === "undefined") return

  // Save to memory and LS
  skillsCache = skills
  localStorage.setItem(SKILLS_KEY, JSON.stringify(skills))

  // Persist to Firestore
  const batch = writeBatch(db)

  // Note: This replaces all skills. For efficiency in real apps, use targeted updates.
  // But for this portfolio, we align with the previous logic.
  // Actually, let's just loop update since 'skills' is an array.
  try {
    const promises = skills.map(skill =>
      setDoc(doc(db, "skills", skill.id), skill)
    )
    await Promise.all(promises)
  } catch (e) {
    console.error("Error saving skills to FB", e)
  }

  dispatchSyncEvent(SKILLS_KEY)
}

// Helper for single updates
export async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill[]> {
  const skills = [...getSkills()]
  const index = skills.findIndex((s) => s.id === id)
  if (index !== -1) {
    const updatedSkill = { ...skills[index], ...updates }
    skills[index] = updatedSkill
    skillsCache = skills

    // Optimistic update
    localStorage.setItem(SKILLS_KEY, JSON.stringify(skills))

    // Save to Firestore
    await updateDoc(doc(db, "skills", id), updates)

    dispatchSyncEvent(SKILLS_KEY)
  }
  return skills
}

export async function addSkill(skill: Omit<Skill, "id">): Promise<Skill[]> {
  const newSkill: Skill = {
    ...skill,
    id: Math.random().toString(36).substr(2, 9),
  }
  const skills = [...getSkills(), newSkill]
  localStorage.setItem(SKILLS_KEY, JSON.stringify(skills))

  await setDoc(doc(db, "skills", newSkill.id), newSkill)

  skillsCache = skills
  dispatchSyncEvent(SKILLS_KEY)
  return skills
}

export async function deleteSkill(id: string): Promise<Skill[]> {
  const skills = getSkills().filter((s) => s.id !== id)
  skillsCache = skills
  localStorage.setItem(SKILLS_KEY, JSON.stringify(skills))

  await deleteDoc(doc(db, "skills", id))

  dispatchSyncEvent(SKILLS_KEY)
  return skills
}

// About functions
export function getAboutInfo(): AboutInfo {
  if (typeof window === "undefined") return defaultAboutInfo
  const stored = localStorage.getItem(ABOUT_KEY)
  aboutCache = stored ? JSON.parse(stored) : defaultAboutInfo
  return aboutCache
}

export async function saveAboutInfo(info: AboutInfo): Promise<void> {
  if (typeof window === "undefined") return

  aboutCache = info
  localStorage.setItem(ABOUT_KEY, JSON.stringify(info))

  await setDoc(doc(db, "about", "data"), info)

  dispatchSyncEvent(ABOUT_KEY)
}

// Projects functions
export function getProjects(): Project[] {
  if (typeof window === "undefined") return defaultProjects
  const stored = localStorage.getItem(PROJECTS_KEY)
  projectsCache = stored ? JSON.parse(stored) : defaultProjects
  return projectsCache
}

export async function saveProjects(projects: Project[]): Promise<void> {
  if (typeof window === "undefined") return

  projectsCache = projects
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))

  // Persist all
  try {
    const promises = projects.map(p => setDoc(doc(db, "projects", p.id), p))
    await Promise.all(promises)
  } catch (e) { console.error(e) }

  dispatchSyncEvent(PROJECTS_KEY)
  calculateAndSaveAutoSkills()
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project[]> {
  const projects = [...getProjects()]
  const index = projects.findIndex((p) => p.id === id)
  if (index !== -1) {
    const updatedProject = { ...projects[index], ...updates, updatedAt: new Date().toISOString().split("T")[0] }
    projects[index] = updatedProject
    projectsCache = projects

    // Optimistic LS update
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))

    await updateDoc(doc(db, "projects", id), updatedProject)

    calculateAndSaveAutoSkills()
    dispatchSyncEvent(PROJECTS_KEY)
  }
  return projects
}

export async function addProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project[]> {
  const now = new Date().toISOString().split("T")[0]
  const newProject = {
    ...project,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
  }

  const projects = [newProject as Project, ...getProjects()]
  projectsCache = projects

  // Optimistic
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))

  await setDoc(doc(db, "projects", newProject.id), newProject)

  dispatchSyncEvent(PROJECTS_KEY)
  calculateAndSaveAutoSkills()
  return projects
}

export async function deleteProject(id: string): Promise<Project[]> {
  const projects = getProjects().filter((p) => p.id !== id)
  projectsCache = projects
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))

  await deleteDoc(doc(db, "projects", id))

  calculateAndSaveAutoSkills()
  dispatchSyncEvent(PROJECTS_KEY)
  return projects
}

export function getExperiences(): Experience[] {
  if (typeof window === "undefined") return defaultExperiences
  const stored = localStorage.getItem(EXPERIENCES_KEY)
  experiencesCache = stored ? JSON.parse(stored) : defaultExperiences
  return experiencesCache
}

export async function saveExperiences(experiences: Experience[]): Promise<void> {
  if (typeof window === "undefined") return

  experiencesCache = experiences
  localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(experiences))

  try {
    const promises = experiences.map(e => setDoc(doc(db, "experiences", e.id), e))
    await Promise.all(promises)
  } catch (err) { console.error(err) }

  dispatchSyncEvent(EXPERIENCES_KEY)
  calculateAndSaveAutoSkills()
}

export async function updateExperience(id: string, updates: Partial<Experience>): Promise<Experience[]> {
  const experiences = [...getExperiences()]
  const index = experiences.findIndex((e) => e.id === id)
  if (index !== -1) {
    const updatedExp = { ...experiences[index], ...updates }
    experiences[index] = updatedExp
    experiencesCache = experiences

    // Optimistic
    localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(experiences))

    await updateDoc(doc(db, "experiences", id), updatedExp)

    dispatchSyncEvent(EXPERIENCES_KEY)
  }
  return experiences
}

export async function addExperience(experience: Omit<Experience, "id">): Promise<Experience[]> {
  const newExperience = { ...experience, id: Date.now().toString() }
  const experiences = [newExperience as Experience, ...getExperiences()]
  experiencesCache = experiences

  // Optimistic
  localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(experiences))

  await setDoc(doc(db, "experiences", newExperience.id), newExperience)

  dispatchSyncEvent(EXPERIENCES_KEY)
  calculateAndSaveAutoSkills()
  return experiences
}

export async function deleteExperience(id: string): Promise<Experience[]> {
  const experiences = getExperiences().filter((e) => e.id !== id)
  experiencesCache = experiences
  localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(experiences))

  await deleteDoc(doc(db, "experiences", id))

  dispatchSyncEvent(EXPERIENCES_KEY)
  return experiences
}

export function getMessages(): ContactMessage[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(MESSAGES_KEY)
  messagesCache = stored ? JSON.parse(stored) : []
  return messagesCache
}

export async function saveMessages(messages: ContactMessage[]): Promise<void> {
  if (typeof window === "undefined") return
  messagesCache = messages
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  dispatchSyncEvent(MESSAGES_KEY)
}

export async function addMessage(message: Omit<ContactMessage, "id" | "read" | "createdAt">): Promise<ContactMessage[]> {
  const newMessage: ContactMessage = {
    ...message,
    id: Date.now().toString(),
    read: false,
    createdAt: new Date().toISOString()
  }

  await setDoc(doc(db, "messages", newMessage.id), newMessage)

  const messages = [newMessage, ...getMessages()]
  messagesCache = messages
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))

  dispatchSyncEvent(MESSAGES_KEY)
  return messages
}

export async function markMessageAsRead(id: string): Promise<ContactMessage[]> {
  const messages = [...getMessages()]
  const index = messages.findIndex((m) => m.id === id)
  if (index !== -1) {
    messages[index] = { ...messages[index], read: true }
    messagesCache = messages
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))

    await updateDoc(doc(db, "messages", id), { read: true })

    dispatchSyncEvent(MESSAGES_KEY)
  }
  return messages
}

export async function deleteMessage(id: string): Promise<ContactMessage[]> {
  const messages = getMessages().filter((m) => m.id !== id)
  messagesCache = messages
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))

  await deleteDoc(doc(db, "messages", id))

  dispatchSyncEvent(MESSAGES_KEY)
  return messages
}

// GitHub functions
export function getGitHubUsername(): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem(GITHUB_USERNAME_KEY) || ""
}

export function saveGitHubUsername(username: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(GITHUB_USERNAME_KEY, username)
}

export function getGitHubRepos(): GitHubRepo[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(GITHUB_REPOS_KEY)
  reposCache = stored ? JSON.parse(stored) : []
  return reposCache
}

export async function saveGitHubRepos(repos: GitHubRepo[]): Promise<void> {
  if (typeof window === "undefined") return
  reposCache = repos
  localStorage.setItem(GITHUB_REPOS_KEY, JSON.stringify(repos))

  try {
    const promises = repos.map(r => setDoc(doc(db, "github_repos", r.id.toString()), r))
    await Promise.all(promises)
  } catch (e) { console.error(e) }

  dispatchSyncEvent(GITHUB_REPOS_KEY)
  calculateAndSaveAutoSkills()
}

export async function updateRepoVisibility(id: number, visible: boolean, featured = false): Promise<GitHubRepo[]> {
  const repos = [...getGitHubRepos()]
  const index = repos.findIndex((r) => r.id === id)
  if (index !== -1) {
    const updatedRepo = { ...repos[index], visible, featured }
    repos[index] = updatedRepo
    reposCache = repos
    localStorage.setItem(GITHUB_REPOS_KEY, JSON.stringify(repos))

    await updateDoc(doc(db, "github_repos", id.toString()), { visible, featured })

    dispatchSyncEvent(GITHUB_REPOS_KEY)
  }
  return repos
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
    if (!response.ok) throw new Error("Failed to fetch repos")

    const data = await response.json()
    const existingRepos = getGitHubRepos()

    const repos: GitHubRepo[] = data.map((repo: any) => {
      const existing = existingRepos.find((r) => r.id === repo.id)
      return {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        topics: repo.topics || [],
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        visible: existing?.visible ?? false,
        featured: existing?.featured ?? false,
      }
    })

    saveGitHubRepos(repos)
    saveGitHubUsername(username)
    return repos
  } catch (error) {
    console.error("Error fetching GitHub repos:", error)
    throw error
  }
}

export function calculateSkillsFromGitHub(repos: GitHubRepo[]): { language: string; percentage: number }[] {
  const languageCount: Record<string, number> = {}
  let total = 0

  repos.forEach((repo) => {
    if (repo.language && repo.visible) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1
      total++
    }
  })

  return Object.entries(languageCount)
    .map(([language, count]) => ({
      language,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 6)
}

export interface AutoCalculatedSkill {
  name: string
  count: number
  percentage: number
  sources: string[]
  color: string
}

const techColorMap: Record<string, string> = {
  // Languages
  JavaScript: "bg-yellow-500",
  TypeScript: "bg-blue-500",
  Python: "bg-green-500",
  Java: "bg-red-500",
  PHP: "bg-purple-500",
  Ruby: "bg-red-400",
  Go: "bg-cyan-500",
  Rust: "bg-orange-500",
  "C++": "bg-blue-600",
  "C#": "bg-purple-600",
  Swift: "bg-orange-400",
  Kotlin: "bg-purple-400",
  HTML: "bg-orange-500",
  CSS: "bg-blue-400",
  SQL: "bg-blue-300",

  // Frameworks
  React: "bg-cyan-400",
  "React.js": "bg-cyan-400",
  "Next.js": "bg-gray-500",
  "Vue.js": "bg-green-400",
  Vue: "bg-green-400",
  Angular: "bg-red-500",
  "Node.js": "bg-green-600",
  Express: "bg-gray-400",
  Django: "bg-green-700",
  Flask: "bg-gray-500",
  Laravel: "bg-red-400",
  Spring: "bg-green-500",
  TailwindCSS: "bg-teal-400",
  Tailwind: "bg-teal-400",
  Bootstrap: "bg-purple-500",
  SCSS: "bg-pink-400",
  GSAP: "bg-green-400",
  "HTML/CSS": "bg-orange-600",
  "C": "bg-blue-700",

  // Databases
  MongoDB: "bg-green-500",
  PostgreSQL: "bg-blue-500",
  MySQL: "bg-blue-400",
  Redis: "bg-red-500",
  Firebase: "bg-yellow-500",
  Supabase: "bg-green-400",

  // Tools
  Docker: "bg-blue-400",
  AWS: "bg-orange-400",
  Git: "bg-red-400",
  GitHub: "bg-gray-500",
  Figma: "bg-purple-400",
  TensorFlow: "bg-orange-500",
  Stripe: "bg-purple-500",
  jQuery: "bg-blue-500",
}

function getTechColor(tech: string): string {
  return techColorMap[tech] || "bg-primary"
}

export function calculateAutoSkills(): AutoCalculatedSkill[] {
  const projects = getProjects().filter((p) => p.visible)
  const experiences = getExperiences().filter((e) => e.visible)
  const repos = getGitHubRepos().filter((r) => r.visible)

  const skillCount: Record<string, { count: number; sources: Set<string> }> = {}

  // Helper to normalize tech names
  const normalizeTech = (name: string | null) => {
    if (!name) return ""
    const trimmed = name.trim()
    const standardName = Object.keys(techColorMap).find(
      (k) => k.toLowerCase() === trimmed.toLowerCase()
    )
    return standardName || trimmed
  }

  // Count techs from projects
  projects.forEach((project) => {
    // Dedup techs within same project
    const uniqueTechs = new Set(project.techs.map(t => normalizeTech(t)).filter(t => !!t))
    uniqueTechs.forEach((tech) => {
      if (!skillCount[tech]) {
        skillCount[tech] = { count: 0, sources: new Set() }
      }
      skillCount[tech].count++
      skillCount[tech].sources.add(`project:${project.title}`)
    })
  })

  // Count techs from experiences
  experiences.forEach((exp) => {
    // Dedup techs within same experience
    const uniqueTechs = new Set(exp.techs.map(t => normalizeTech(t)).filter(t => !!t))
    uniqueTechs.forEach((tech) => {
      if (!skillCount[tech]) {
        skillCount[tech] = { count: 0, sources: new Set() }
      }
      skillCount[tech].count++
      skillCount[tech].sources.add(`experience:${exp.company}`)
    })
  })

  // Count languages from GitHub repos
  repos.forEach((repo) => {
    if (repo.language) {
      const normalized = normalizeTech(repo.language)
      if (normalized) {
        if (!skillCount[normalized]) {
          skillCount[normalized] = { count: 0, sources: new Set() }
        }
        skillCount[normalized].count++
        skillCount[normalized].sources.add(`github:${repo.name}`)
      }
    }
  })

  // Denominator: Total weighted usage instances
  // We use max usage of any skill to determine relative scale for a better portfolio look
  const usageCounts = Object.values(skillCount).map(s => s.count)
  const maxUsage = usageCounts.length > 0 ? Math.max(...usageCounts) : 0

  const skills = Object.entries(skillCount)
    .map(([name, { count, sources }]) => {
      // Logic: the most used skill is 100%, others are relative to it
      let percentage = maxUsage > 0
        ? Math.round((count / maxUsage) * 100)
        : 0

      // Ensure reasonable display
      if (percentage > 100) percentage = 100
      // If used at least once, show at least 15% to make the bar visible
      if (percentage < 15 && count > 0) percentage = 15

      return {
        name,
        count,
        percentage,
        sources: Array.from(sources),
        color: getTechColor(name),
      }
    })
    .filter(s => s.count > 0)
    .sort((a, b) => b.count - a.count)

  return skills
}

export function getAutoSkills(): AutoCalculatedSkill[] {
  if (typeof window === "undefined") return []
  // Always recalculate to ensure fresh formula and data
  const skills = calculateAutoSkills()
  // Quietly update storage
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTO_SKILLS_KEY, JSON.stringify(skills))
  }
  return skills
}

export function calculateAndSaveAutoSkills(): AutoCalculatedSkill[] {
  const skills = calculateAutoSkills()
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTO_SKILLS_KEY, JSON.stringify(skills))
    dispatchSyncEvent(AUTO_SKILLS_KEY)
  }
  return skills
}

// Views tracking
export function getViews(): number {
  if (typeof window === "undefined") return 0
  const stored = localStorage.getItem(VIEWS_KEY)
  return stored ? Number.parseInt(stored, 10) : 0
}

export async function incrementViews(): Promise<number> {
  if (typeof window === "undefined") return 0

  const res = await fetch("/api/stats", { method: "POST" })
  const { views } = await res.json()

  localStorage.setItem(VIEWS_KEY, views.toString())
  return views
}

// Dashboard stats
export function getDashboardStats(): DashboardStats {
  const skills = getSkills()
  const autoSkills = getAutoSkills()
  const repos = getGitHubRepos()
  const projects = getProjects()
  const experiences = getExperiences()
  const messages = getMessages()
  const visibleProjects = projects.filter((p) => p.visible && p.status === "published")

  return {
    totalProjects: visibleProjects.length + repos.filter((r) => r.visible).length,
    publishedProjects: visibleProjects.filter((p) => p.featured).length + repos.filter((r) => r.featured).length,
    totalViews: getViews(),
    totalSkills: skills.filter((s) => s.visible).length + autoSkills.length,
    githubRepos: repos.length,
    totalExperiences: experiences.filter((e) => e.visible).length,
    unreadMessages: messages.filter((m) => !m.read).length,
  }
}

// Data Migration Utility
export async function migrateDataToDatabase() {
  if (typeof window === "undefined") return { success: false, message: "Only available in browser" }

  try {
    const about = getAboutInfo()
    const projects = getProjects()
    const experiences = getExperiences()
    const skills = getSkills()
    const repos = getGitHubRepos()

    // Push each to DB
    await saveAboutInfo(about)
    await saveProjects(projects)
    await saveExperiences(experiences)
    await saveSkills(skills)
    await saveGitHubRepos(repos)

    return { success: true, message: "Đã di chuyển dữ liệu thành công!" }
  } catch (error) {
    console.error("Migration failed:", error)
    return { success: false, message: "Lỗi di chuyển dữ liệu" }
  }
}

// Reset everything
export async function resetAllData() {
  if (typeof window === "undefined") return
  localStorage.removeItem(VIEWS_KEY)
  dispatchSyncEvent("reset-all")
}
