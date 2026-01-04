import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ExperienceSection } from "@/components/experience-section"
import { SkillsSection } from "@/components/skills-section"
import { ProjectsSection } from "@/components/projects-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"
import { BackgroundParticles } from "@/components/background-particles"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ViewTracker } from "@/components/view-tracker"


export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative">
      <ViewTracker />
      <CursorGlow />
      <BackgroundParticles />
      <ScrollToTop />

      <Header />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
