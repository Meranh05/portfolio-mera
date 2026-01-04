"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink, Github, Loader2, Star } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer } from "@/components/animations/stagger-container"
import { useClickEffect } from "@/hooks/use-click-effect"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { toast } from "sonner"
import { useProjectsSync, useGitHubReposSync } from "@/hooks/use-portfolio-sync"
import type { Project } from "@/lib/portfolio-store"

export function ProjectsSection() {
  const { createParticles } = useClickEffect()
  const { projects, isLoading: projectsLoading } = useProjectsSync()
  const { repos, isLoading: reposLoading } = useGitHubReposSync()

  const visibleProjects = projects
    .filter((p) => p.visible && p.status === "published")
    .sort((a, b) => {
      // Featured projects first
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      // Then by date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const visibleRepos = repos
    .filter((r) => r.visible)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

  // Convert GitHub repos to project format
  const githubProjects: Project[] = visibleRepos.map((repo) => ({
    id: `github-${repo.id}`,
    title: repo.name,
    description: repo.description || "No description available",
    image: "/github-repository-code.jpg",
    tags: [repo.language || "Code", new Date(repo.created_at).getFullYear().toString()],
    techs: repo.topics.slice(0, 3),
    github: repo.html_url,
    demo: repo.homepage || repo.html_url,
    visible: true,
    featured: repo.featured,
    status: "published",
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
  }))

  const allProjects = [...visibleProjects, ...githubProjects]
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return 0
    })
    .slice(0, 6)

  const featuredCount = allProjects.filter((p) => p.featured).length

  const handleGithubClick = (e: React.MouseEvent, project: Project) => {
    e.preventDefault()
    e.stopPropagation()
    createParticles(e, "sparkle")
    toast.info(`Đang mở GitHub...`, {
      description: `Repo: ${project.title}`,
    })
    window.open(project.github, "_blank")
  }

  const handleDemoClick = (e: React.MouseEvent, project: Project) => {
    e.preventDefault()
    e.stopPropagation()
    createParticles(e, "confetti")
    toast.success(`Đang mở Demo...`, {
      description: `Demo: ${project.title}`,
    })
    window.open(project.demo, "_blank")
  }

  const handleViewAllProjects = (e: React.MouseEvent) => {
    createParticles(e, "confetti")
    toast.info("Đang phát triển...", {
      description: "Trang danh sách dự án sẽ sớm có mặt!",
    })
  }

  if (projectsLoading || reposLoading) {
    return (
      <section id="projects" className="py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2306b6d4' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Dự Án Nổi Bật</h2>
            <p className="text-muted-foreground mt-2">
              Những sản phẩm tôi đã xây dựng và đóng góp.
              {featuredCount > 0 && (
                <span className="ml-2 text-primary">({featuredCount} dự án được đánh dấu nổi bật)</span>
              )}
            </p>
          </div>
        </FadeIn>

        {allProjects.length === 0 ? (
          <FadeIn>
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có dự án nào được hiển thị.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Kết nối GitHub và chọn dự án để hiển thị trong Admin Dashboard.
              </p>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.15}>
            {allProjects.map((project) => (
              <Link
                key={project.id}
                href={project.id.startsWith("github-") ? project.github : `/projects/${project.id}`}
                target={project.id.startsWith("github-") ? "_blank" : undefined}
                className={`group bg-card rounded-xl border overflow-hidden card-hover block relative ${
                  project.featured ? "border-primary/50 ring-1 ring-primary/20" : "border-border"
                }`}
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                  createParticles(
                    {
                      ...e,
                      clientX: rect.left + rect.width / 2,
                      clientY: rect.top + rect.height / 2,
                    } as React.MouseEvent,
                    "sparkle",
                  )
                }}
              >
                {project.featured && (
                  <div className="absolute top-3 right-3 z-20">
                    <Badge className="bg-primary/90 text-primary-foreground gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Nổi bật
                    </Badge>
                  </div>
                )}

                <div className="relative overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg?height=400&width=600&query=project"}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-card/80 backdrop-blur-sm hover:bg-card"
                        onClick={(e) => handleGithubClick(e, project)}
                      >
                        <Github className="w-4 h-4 mr-1" />
                        Code
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary/80 backdrop-blur-sm hover:bg-primary"
                        onClick={(e) => handleDemoClick(e, project)}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Demo
                      </Button>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-card/80 backdrop-blur-sm text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                    {project.title}
                    {project.featured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.techs.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-xs group-hover:border-primary/50 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </StaggerContainer>
        )}

        <FadeIn delay={0.5}>
          <div className="text-center mt-12">
            <MagneticButton>
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-secondary bg-transparent smooth-scale group"
                onClick={handleViewAllProjects}
              >
                Xem tất cả dự án
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </MagneticButton>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
