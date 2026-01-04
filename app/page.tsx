import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { AboutSection } from "@/components/AboutSection"
import { ExperienceSection } from "@/components/ExperienceSection"
import { SkillsSection } from "@/components/SkillsSection"
import { ProjectsSection } from "@/components/ProjectsSection"
import { ContactSection } from "@/components/ContactSection"
import { Footer } from "@/components/Footer"
import { CursorGlow } from "@/components/CursorGlow"
import { BackgroundParticles } from "@/components/BackgroundParticles"
import { ScrollToTop } from "@/components/ScrollToTop"
import { ViewTracker } from "@/components/ViewTracker"


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
