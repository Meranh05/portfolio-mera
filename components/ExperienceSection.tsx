"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Building2, Code2, Paintbrush, Briefcase, Rocket } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useClickEffect } from "@/hooks/use-click-effect"
import { useEffect, useState } from "react"
import { getExperiences, subscribeSyncEvent, type Experience } from "@/lib/portfolio-store"

const iconMap = {
  building: Building2,
  code: Code2,
  paintbrush: Paintbrush,
  briefcase: Briefcase,
  rocket: Rocket,
}

export function ExperienceSection() {
  const { createParticles } = useClickEffect()
  const [experiences, setExperiences] = useState<Experience[]>([])

  useEffect(() => {
    setExperiences(getExperiences().filter((e) => e.visible))

    const unsubscribe = subscribeSyncEvent((key) => {
      if (key.includes("experiences")) {
        setExperiences(getExperiences().filter((e) => e.visible))
      }
    })

    return unsubscribe
  }, [])

  return (
    <section id="experience" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Kinh Nghiệm Làm Việc</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
          </div>
        </FadeIn>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-[140px] md:left-[180px] top-0 bottom-0 w-px bg-gradient-to-b from-primary via-border to-transparent" />

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <ExperienceCard
                  key={exp.id}
                  exp={exp}
                  index={index}
                  onCardClick={(e) => createParticles(e, exp.current ? "confetti" : "sparkle")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({
  exp,
  index,
  onCardClick,
}: {
  exp: Experience
  index: number
  onCardClick: (e: React.MouseEvent) => void
}) {
  const { ref, isVisible } = useScrollAnimation()
  const IconComponent = iconMap[exp.icon] || Building2

  return (
    <div
      ref={ref}
      className={`relative flex gap-6 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
      }`}
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      <div className="w-32 md:w-44 text-right shrink-0">
        <p className={`font-semibold ${exp.current ? "text-primary" : "text-foreground"}`}>{exp.period}</p>
        <p className="text-sm text-muted-foreground">{exp.location}</p>
      </div>

      <div className="relative">
        <div
          className={`w-3 h-3 rounded-full ${
            exp.current ? "bg-primary animate-pulse-glow" : "bg-muted-foreground"
          } absolute -left-[6px] top-2`}
        />
      </div>

      <div
        className="flex-1 bg-card rounded-xl p-6 border border-border ml-4 card-hover cursor-pointer"
        onClick={onCardClick}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
              {exp.title}
            </h3>
            <p className="text-muted-foreground">{exp.company}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors">
            <IconComponent className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <ul className="text-sm text-muted-foreground space-y-1 mb-4">
          {exp.description.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {exp.techs.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className={`transition-all hover:scale-105 cursor-default ${
                tech === "React" || tech === "Node.js"
                  ? "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
                  : tech === "AWS" || tech === "Vue.js"
                    ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
