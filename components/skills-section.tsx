"use client"

import { Badge } from "@/components/ui/badge"
import { Monitor, Settings, Loader2, Info } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useClickEffect } from "@/hooks/use-click-effect"
import { useEffect, useState, useCallback } from "react"
import { useSkillsSync } from "@/hooks/use-portfolio-sync"
import { getAutoSkills, subscribeSyncEvent, type Skill, type AutoCalculatedSkill } from "@/lib/portfolio-store"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

function AutoSkillBar({ skill, isVisible, index }: { skill: AutoCalculatedSkill; isVisible: boolean; index: number }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => setWidth(skill.percentage), 100 + index * 100)
      return () => clearTimeout(timeout)
    }
  }, [isVisible, skill.percentage, index])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            <div className="flex justify-between mb-2">
              <span className="text-foreground font-medium">{skill.name}</span>
              <span className="text-primary font-semibold">{width}%</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${skill.color} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                style={{ width: `${width}%` }}
              >
                <div className="absolute inset-0 animate-shimmer" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">Sử dụng trong {skill.count} dự án/kinh nghiệm</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-semibold mb-1">Nguồn dữ liệu:</p>
          <ul className="text-xs space-y-1">
            {skill.sources.slice(0, 5).map((source, i) => (
              <li key={i} className="text-muted-foreground">
                {source.replace("project:", "📁 ").replace("experience:", "💼 ").replace("github:", "🐙 ")}
              </li>
            ))}
            {skill.sources.length > 5 && (
              <li className="text-muted-foreground">... và {skill.sources.length - 5} nguồn khác</li>
            )}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function AnimatedProgressBar({ skill, isVisible }: { skill: Skill; isVisible: boolean }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => setWidth(skill.level), 100)
      return () => clearTimeout(timeout)
    }
  }, [isVisible, skill.level])

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-foreground">{skill.name}</span>
        <span className="text-primary font-semibold">{isVisible ? width : 0}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${skill.color} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
          style={{ width: `${width}%` }}
        >
          <div className="absolute inset-0 animate-shimmer" />
        </div>
      </div>
    </div>
  )
}

export function SkillsSection() {
  const { ref, isVisible } = useScrollAnimation()
  const { createParticles } = useClickEffect()
  const { skills: manualSkills, isLoading } = useSkillsSync()

  const [autoSkills, setAutoSkills] = useState<AutoCalculatedSkill[]>([])

  const loadAutoSkills = useCallback(() => {
    setAutoSkills(getAutoSkills())
  }, [])

  useEffect(() => {
    loadAutoSkills()
    const unsubscribe = subscribeSyncEvent((key) => {
      if (
        key === "portfolio_auto_skills" ||
        key === "portfolio_projects" ||
        key === "portfolio_experiences" ||
        key === "portfolio_github_repos" ||
        key === "reset-all"
      ) {
        loadAutoSkills()
      }
    })
    return unsubscribe
  }, [loadAutoSkills])

  const autoLanguages = autoSkills
    .filter((s) =>
      [
        "JavaScript",
        "TypeScript",
        "Python",
        "Java",
        "PHP",
        "Ruby",
        "Go",
        "Rust",
        "C++",
        "C#",
        "Swift",
        "Kotlin",
        "HTML",
        "CSS",
        "SQL",
      ].includes(s.name),
    )
    .slice(0, 6)

  const autoTools = autoSkills.filter(
    (s) =>
      ![
        "JavaScript",
        "TypeScript",
        "Python",
        "Java",
        "PHP",
        "Ruby",
        "Go",
        "Rust",
        "C++",
        "C#",
        "Swift",
        "Kotlin",
        "HTML",
        "CSS",
        "SQL",
      ].includes(s.name),
  )

  const languageSkills = manualSkills.filter((s) => s.category === "language" && s.visible)
  const tools = manualSkills.filter((s) => s.category === "tool" && s.visible)
  const softSkills = manualSkills.filter((s) => s.category === "soft" && s.visible)

  const hasAutoData = autoSkills.length > 0
  const hasManualData = manualSkills.length > 0
  const hasAnyData = hasAutoData || hasManualData

  if (isLoading) {
    return (
      <section id="skills" className="py-20 bg-secondary/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    )
  }

  return (
    <section id="skills" className="py-20 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.08),transparent_50%)]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Kỹ Năng Chuyên Môn</h2>
            <p className="text-muted-foreground mt-2">
              {hasAutoData
                ? "Tự động tính toán từ các dự án và kinh nghiệm làm việc."
                : "Bộ công cụ công nghệ tôi sử dụng để hiện thực hóa các ý tưởng."}
            </p>
            {hasAutoData && (
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
                <Info className="w-3 h-3" />
                <span>Di chuột vào thanh để xem chi tiết nguồn dữ liệu</span>
              </div>
            )}
          </div>
        </FadeIn>

        {!hasAnyData ? (
          <FadeIn>
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <p className="text-muted-foreground">
                Chưa có kỹ năng nào. Hãy thêm dự án hoặc kinh nghiệm từ trang Admin để tự động tính toán.
              </p>
            </div>
          </FadeIn>
        ) : (
          <>
            <div ref={ref} className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <FadeIn direction="right" delay={0.2}>
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Monitor className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Ngôn ngữ & Frameworks</h3>
                    {hasAutoData && (
                      <Badge variant="outline" className="text-xs">
                        Tự động
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Show auto-calculated languages first */}
                    {autoLanguages.map((skill, index) => (
                      <div key={skill.name} style={{ transitionDelay: `${index * 0.1}s` }}>
                        <AutoSkillBar skill={skill} isVisible={isVisible} index={index} />
                      </div>
                    ))}

                    {/* Then show manual skills */}
                    {languageSkills.map((skill, index) => (
                      <div key={skill.id} style={{ transitionDelay: `${(autoLanguages.length + index) * 0.1}s` }}>
                        <AnimatedProgressBar skill={skill} isVisible={isVisible} />
                      </div>
                    ))}

                    {autoLanguages.length === 0 && languageSkills.length === 0 && (
                      <p className="text-muted-foreground text-sm">Thêm dự án với tech stack để tự động hiển thị.</p>
                    )}
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="left" delay={0.3}>
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Settings className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Công cụ & Khác</h3>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-8">
                    {/* Auto tools */}
                    {autoTools.slice(0, 10).map((tool, index) => (
                      <TooltipProvider key={tool.name}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="secondary"
                              className={`px-4 py-2 bg-card border border-border text-foreground hover:border-primary/50 hover:scale-105 transition-all cursor-pointer smooth-scale`}
                              onClick={(e) => createParticles(e, "sparkle")}
                              style={{ animationDelay: `${index * 0.05}s` }}
                            >
                              <span className={`w-2 h-2 rounded-full ${tool.color} mr-2`} />
                              {tool.name}
                              <span className="ml-2 text-xs text-muted-foreground">({tool.count})</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Sử dụng trong {tool.count} dự án</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}

                    {/* Manual tools */}
                    {tools.map((tool, index) => (
                      <Badge
                        key={tool.id}
                        variant="secondary"
                        className="px-4 py-2 bg-card border border-border text-foreground hover:border-primary/50 hover:scale-105 transition-all cursor-pointer smooth-scale"
                        onClick={(e) => createParticles(e, "sparkle")}
                        style={{ animationDelay: `${(autoTools.length + index) * 0.05}s` }}
                      >
                        {tool.icon && <span className="mr-2">{tool.icon}</span>}
                        {tool.name}
                      </Badge>
                    ))}

                    {autoTools.length === 0 && tools.length === 0 && (
                      <p className="text-muted-foreground text-sm">Chưa có công cụ nào được thêm.</p>
                    )}
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Soft skills - only show if manual soft skills exist */}
            {softSkills.length > 0 && (
              <FadeIn delay={0.5}>
                <div className="mt-16">
                  <h3 className="text-center text-sm text-muted-foreground tracking-wider uppercase mb-8">
                    Kỹ năng mềm & Phương pháp
                  </h3>
                  <div className="flex flex-wrap justify-center gap-8">
                    {softSkills.map((skill, index) => (
                      <div
                        key={skill.id}
                        className="text-center group cursor-pointer"
                        onClick={(e) => createParticles(e, "confetti")}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div
                          className={`w-24 h-24 rounded-full border-4 ${skill.color} flex items-center justify-center mb-3 
                            transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg relative overflow-hidden`}
                          style={{ boxShadow: "0 0 0 rgba(6, 182, 212, 0)" }}
                          onMouseEnter={(e) => {
                            ;(e.target as HTMLElement).style.boxShadow = "0 0 20px rgba(6, 182, 212, 0.4)"
                          }}
                          onMouseLeave={(e) => {
                            ;(e.target as HTMLElement).style.boxShadow = "0 0 0 rgba(6, 182, 212, 0)"
                          }}
                        >
                          <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center group-hover:bg-secondary transition-colors">
                            <span className="text-2xl group-hover:scale-125 transition-transform">{skill.icon}</span>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
                          {skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
          </>
        )}
      </div>
    </section>
  )
}
