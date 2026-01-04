"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getSkills,
  getAboutInfo,
  getProjects,
  getGitHubRepos,
  getAutoSkills,
  getExperiences,
  subscribeSyncEvent,
  type Skill,
  type AboutInfo,
  type Project,
  type GitHubRepo,
  type AutoCalculatedSkill,
  type Experience,
} from "@/lib/portfolio-store"

export function useSkillsSync() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(() => {
    setSkills(getSkills())
  }, [])

  useEffect(() => {
    refresh()
    setIsLoading(false)

    const unsubscribe = subscribeSyncEvent((key) => {
      if (key === "portfolio_skills" || key === "reset-all") {
        refresh()
      }
    })

    return unsubscribe
  }, [refresh])

  return { skills, isLoading, refresh }
}

export function useAutoSkillsSync() {
  const [autoSkills, setAutoSkills] = useState<AutoCalculatedSkill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(() => {
    setAutoSkills(getAutoSkills())
  }, [])

  useEffect(() => {
    refresh()
    setIsLoading(false)

    const unsubscribe = subscribeSyncEvent((key) => {
      if (
        key === "portfolio_auto_skills" ||
        key === "portfolio_projects" ||
        key === "portfolio_experiences" ||
        key === "portfolio_github_repos" ||
        key === "reset-all"
      ) {
        refresh()
      }
    })

    return unsubscribe
  }, [refresh])

  return { autoSkills, isLoading, refresh }
}

export function useAboutSync() {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(() => {
    setAboutInfo(getAboutInfo())
  }, [])

  useEffect(() => {
    refresh()
    setIsLoading(false)

    const unsubscribe = subscribeSyncEvent((key) => {
      if (key === "portfolio_about" || key === "reset-all") {
        refresh()
      }
    })

    return unsubscribe
  }, [refresh])

  return { aboutInfo, isLoading, refresh }
}

export function useProjectsSync() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(() => {
    setProjects(getProjects())
  }, [])

  useEffect(() => {
    refresh()
    setIsLoading(false)

    const unsubscribe = subscribeSyncEvent((key) => {
      if (key === "portfolio_projects" || key === "reset-all") {
        refresh()
      }
    })

    return unsubscribe
  }, [refresh])

  return { projects, isLoading, refresh }
}

export function useExperiencesSync() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(() => {
    setExperiences(getExperiences())
  }, [])

  useEffect(() => {
    refresh()
    setIsLoading(false)

    const unsubscribe = subscribeSyncEvent((key) => {
      if (key === "portfolio_experiences" || key === "reset-all") {
        refresh()
      }
    })

    return unsubscribe
  }, [refresh])

  return { experiences, isLoading, refresh }
}

export function useGitHubReposSync() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(() => {
    setRepos(getGitHubRepos())
  }, [])

  useEffect(() => {
    refresh()
    setIsLoading(false)

    const unsubscribe = subscribeSyncEvent((key) => {
      if (key === "portfolio_github_repos" || key === "reset-all") {
        refresh()
      }
    })

    return unsubscribe
  }, [refresh])

  return { repos, isLoading, refresh }
}

export function usePortfolioSync() {
  const { skills, isLoading: skillsLoading } = useSkillsSync()
  const { autoSkills, isLoading: autoSkillsLoading } = useAutoSkillsSync()
  const { aboutInfo, isLoading: aboutLoading } = useAboutSync()
  const { projects, isLoading: projectsLoading } = useProjectsSync()
  const { experiences, isLoading: experiencesLoading } = useExperiencesSync()
  const { repos, isLoading: reposLoading } = useGitHubReposSync()

  return {
    skills,
    autoSkills,
    aboutInfo,
    projects,
    experiences,
    repos,
    isLoading:
      skillsLoading || autoSkillsLoading || aboutLoading || projectsLoading || experiencesLoading || reposLoading,
  }
}
