"use client"

import type React from "react"

import { useCallback } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
  rotation: number
  rotationSpeed: number
}

export function useClickEffect() {
  const createParticles = useCallback((e: React.MouseEvent, type: "snow" | "confetti" | "sparkle" = "confetti") => {
    const colors = ["#06b6d4", "#22c55e", "#f59e0b", "#ec4899", "#8b5cf6", "#ffffff"]
    const particleCount = type === "snow" ? 30 : 20

    const container = document.createElement("div")
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `
    document.body.appendChild(container)

    const particles: Particle[] = []
    const canvas = document.createElement("canvas")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.cssText = "position: absolute; top: 0; left: 0;"
    container.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: e.clientX,
        y: e.clientY,
        size: type === "snow" ? Math.random() * 6 + 3 : Math.random() * 8 + 4,
        speedX: (Math.random() - 0.5) * (type === "snow" ? 4 : 12),
        speedY: type === "snow" ? Math.random() * 3 + 2 : (Math.random() - 0.5) * 12 - 3,
        opacity: 1,
        color: type === "snow" ? "#ffffff" : colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }

    let animationId: number
    const gravity = type === "snow" ? 0.05 : 0.3
    const friction = 0.99

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let allDone = true

      particles.forEach((p) => {
        if (p.opacity <= 0) return
        allDone = false

        p.x += p.speedX
        p.y += p.speedY
        p.speedY += gravity
        p.speedX *= friction
        p.opacity -= type === "snow" ? 0.008 : 0.015
        p.rotation += p.rotationSpeed

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillStyle = p.color

        if (type === "snow") {
          // Snowflake
          ctx.beginPath()
          ctx.arc(0, 0, p.size, 0, Math.PI * 2)
          ctx.fill()
          // Add glow
          ctx.shadowBlur = 10
          ctx.shadowColor = p.color
          ctx.fill()
        } else if (type === "confetti") {
          // Confetti rectangle
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else {
          // Sparkle star
          for (let i = 0; i < 4; i++) {
            ctx.beginPath()
            ctx.moveTo(0, -p.size)
            ctx.lineTo(p.size / 4, 0)
            ctx.lineTo(0, p.size)
            ctx.lineTo(-p.size / 4, 0)
            ctx.closePath()
            ctx.fill()
            ctx.rotate(Math.PI / 4)
          }
        }

        ctx.restore()
      })

      if (!allDone) {
        animationId = requestAnimationFrame(animate)
      } else {
        container.remove()
      }
    }

    animate()

    // Cleanup after 3 seconds
    setTimeout(() => {
      cancelAnimationFrame(animationId)
      container.remove()
    }, 3000)
  }, [])

  return { createParticles }
}
