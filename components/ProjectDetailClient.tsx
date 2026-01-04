"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Code2, ExternalLink, FileText, Moon, Play, Share2 } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer } from "@/components/animations/stagger-container"
import { useClickEffect } from "@/hooks/use-click-effect"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { CursorGlow } from "@/components/CursorGlow"
import { toast } from "sonner"

interface ProjectData {
  id: string
  title: string
  description: string
  tags: string[]
  heroImage: string
  overview: string
  features: { icon: string; title: string; description: string }[]
  images: { src: string; label: string }[]
  techStack: { frontend: string[]; backend: string[]; devops: string[] }
  projectInfo: { role: string; duration: string; client: string; status: string }
  links: { sourceCode: string; liveDemo: string }
}

export function ProjectDetailClient({ project }: { project: ProjectData }) {
  const { createParticles } = useClickEffect()

  const handleShareClick = async (e: React.MouseEvent) => {
    createParticles(e, "sparkle")
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Đã sao chép link!", {
        description: "Link dự án đã được sao chép vào clipboard.",
      })
    } catch {
      toast.error("Không thể sao chép link")
    }
  }

  const handleSourceCodeClick = (e: React.MouseEvent) => {
    createParticles(e, "sparkle")
    toast.info("Đang mở GitHub...", {
      description: `Repo: ${project.title}`,
    })
    setTimeout(() => {
      window.open(project.links.sourceCode, "_blank")
    }, 500)
  }

  const handleLiveDemoClick = (e: React.MouseEvent) => {
    createParticles(e, "confetti")
    toast.success("Đang mở Live Demo...", {
      description: `Demo: ${project.title}`,
    })
    setTimeout(() => {
      window.open(project.links.liveDemo, "_blank")
    }, 500)
  }

  const handleImageClick = (e: React.MouseEvent, label: string) => {
    createParticles(e, "sparkle")
    toast.info(`Xem ảnh: ${label}`, {
      description: "Tính năng zoom sẽ sớm có mặt!",
    })
  }

  const handleContactClick = (e: React.MouseEvent) => {
    createParticles(e, "confetti")
    toast.success("Chuyển đến trang Liên hệ!", {
      description: "Hãy điền form để liên lạc với tôi.",
    })
  }

  return (
    <div className="min-h-screen bg-background relative">
      <CursorGlow />

      <div className="container mx-auto px-4 lg:px-8 py-8 relative z-10">
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/#projects"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
              onClick={(e) => createParticles(e, "snow")}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Quay lại Portfolio
            </Link>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 smooth-scale" onClick={handleShareClick}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {project.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-primary border-primary hover:bg-primary/10 transition-colors cursor-pointer"
                onClick={(e) => createParticles(e, "sparkle")}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground italic mb-4">{project.title}</h1>
              <p className="text-muted-foreground max-w-2xl">{project.description}</p>
            </div>
            <div className="flex gap-3">
              <MagneticButton>
                <Button
                  variant="outline"
                  className="border-border bg-transparent smooth-scale"
                  onClick={handleSourceCodeClick}
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  Source Code
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button className="bg-primary text-primary-foreground smooth-scale" onClick={handleLiveDemoClick}>
                  <Play className="w-4 h-4 mr-2" />
                  Live Demo
                </Button>
              </MagneticButton>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div
            className="rounded-2xl overflow-hidden border border-border mb-12 bg-gradient-to-b from-teal-900/30 to-background card-hover cursor-pointer"
            onClick={(e) => {
              createParticles(e, "confetti")
              toast.info("Xem ảnh Hero", {
                description: "Tính năng lightbox sẽ sớm có mặt!",
              })
            }}
          >
            <Image
              src={project.heroImage || "/placeholder.svg"}
              alt={project.title}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <FadeIn delay={0.4}>
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Tổng quan</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  {project.overview.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            </FadeIn>

            <FadeIn delay={0.5}>
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Code2 className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Tính năng chính</h2>
                </div>
                <StaggerContainer className="grid sm:grid-cols-2 gap-4" staggerDelay={0.1}>
                  {project.features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-card rounded-xl p-6 border border-border card-hover cursor-pointer"
                      onClick={(e) => {
                        createParticles(e, "snow")
                        toast.info(feature.title, {
                          description: feature.description,
                        })
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          {feature.icon === "chart" && <ExternalLink className="w-5 h-5 text-primary" />}
                          {feature.icon === "shield" && <Code2 className="w-5 h-5 text-amber-400" />}
                          {feature.icon === "file" && <FileText className="w-5 h-5 text-muted-foreground" />}
                          {feature.icon === "moon" && <Moon className="w-5 h-5 text-amber-400" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </StaggerContainer>
              </section>
            </FadeIn>

            <FadeIn delay={0.6}>
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Hình ảnh giao diện</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative rounded-xl overflow-hidden border border-border bg-card group card-hover cursor-pointer"
                      onClick={(e) => handleImageClick(e, image.label)}
                    >
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.label}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                        <Badge variant="secondary" className="bg-card/80">
                          {image.label}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </FadeIn>
          </div>

          <div className="space-y-6">
            <FadeIn direction="left" delay={0.4}>
              <div className="bg-card rounded-xl p-6 border border-border gradient-border">
                <h3 className="font-semibold text-foreground mb-4">Công nghệ sử dụng</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Frontend</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.frontend.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors cursor-pointer"
                          onClick={(e) => {
                            createParticles(e, "sparkle")
                            toast.info(`Tech: ${tech}`)
                          }}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Backend</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.backend.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors cursor-pointer"
                          onClick={(e) => {
                            createParticles(e, "sparkle")
                            toast.info(`Tech: ${tech}`)
                          }}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">DevOps</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.devops.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors cursor-pointer"
                          onClick={(e) => {
                            createParticles(e, "sparkle")
                            toast.info(`Tech: ${tech}`)
                          }}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.5}>
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Thông tin dự án</h3>
                <div className="space-y-3">
                  {[
                    { label: "Vai trò", value: project.projectInfo.role },
                    { label: "Thời gian", value: project.projectInfo.duration },
                    { label: "Khách hàng", value: project.projectInfo.client },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between group">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                        {item.value}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Trạng thái</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                      {project.projectInfo.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.6}>
              <div className="bg-card rounded-xl p-6 border border-border gradient-border">
                <h3 className="font-semibold text-foreground mb-2">Bạn thích dự án này?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Hãy liên hệ để thảo luận về cách chúng ta có thể hợp tác trong dự án tiếp theo của bạn.
                </p>
                <Link href="/#contact">
                  <MagneticButton className="w-full">
                    <Button
                      className="w-full bg-primary text-primary-foreground smooth-scale"
                      onClick={handleContactClick}
                    >
                      Liên hệ ngay
                    </Button>
                  </MagneticButton>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}
