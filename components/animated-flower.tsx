"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface AnimatedFlowerProps {
  moodValue: number
}

export function AnimatedFlower({ moodValue }: AnimatedFlowerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate color based on mood - enhanced saturation for better visibility
    const getColor = (value: number) => {
      // More vibrant colors that work well in both light and dark themes
      if (value < 15) return { main: "#9966ff", accent: "#c4a6ff", bg: "#e2d9f7" } // Purple - very unpleasant
      if (value < 30) return { main: "#5c7cfa", accent: "#91a7ff", bg: "#dce4fd" } // Blue - unpleasant
      if (value < 45) return { main: "#4dabf7", accent: "#82c8ff", bg: "#d9ebfd" } // Light blue - slightly unpleasant
      if (value < 55) return { main: "#38d9d9", accent: "#8ae6e6", bg: "#e6f7f6" } // Teal - neutral
      if (value < 70) return { main: "#69db7c", accent: "#a9e6b8", bg: "#e8f7df" } // Light green - slightly pleasant
      if (value < 85) return { main: "#a9e34b", accent: "#c8eb8e", bg: "#f0f9e6" } // Green - pleasant
      return { main: "#fcc419", accent: "#ffe066", bg: "#fdf6e6" } // Yellow - very pleasant
    }

    const { main, accent, bg } = getColor(moodValue)

    // Animation variables
    let rotation = 0
    let scale = 0.95
    let scaleDirection = 0.0005

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Center coordinates
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Update animation values
      rotation += 0.002 * (moodValue / 50)
      scale += scaleDirection
      if (scale > 1.05) scaleDirection = -0.0005
      if (scale < 0.95) scaleDirection = 0.0005

      // Save context state
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)
      ctx.scale(scale, scale)

      // Draw background glow - consistent in both modes
      const bgGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, canvas.width / 2)
      bgGradient.addColorStop(0, isDark ? `${main}60` : `${bg}90`)
      bgGradient.addColorStop(0.7, isDark ? `${main}20` : `${bg}40`)
      bgGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = bgGradient
      ctx.beginPath()
      ctx.arc(0, 0, canvas.width / 2, 0, Math.PI * 2)
      ctx.fill()

      // Determine shape based on mood value
      const numPetals = moodValue < 30 ? 6 : moodValue < 70 ? 8 : 12
      const innerRadius = 20
      const outerRadius = 40 + (moodValue / 100) * 20

      // Draw petals
      for (let i = 0; i < numPetals; i++) {
        const angle = (i * 2 * Math.PI) / numPetals

        ctx.save()
        ctx.rotate(angle)

        // Create petal path - shape varies by mood
        if (moodValue < 30) {
          // Sharper petals for lower moods
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(outerRadius * 0.7, -outerRadius * 0.3)
          ctx.lineTo(outerRadius, 0)
          ctx.lineTo(outerRadius * 0.7, outerRadius * 0.3)
          ctx.closePath()
        } else if (moodValue < 70) {
          // Rounded petals for neutral moods
          ctx.beginPath()
          ctx.ellipse(outerRadius * 0.5, 0, outerRadius * 0.5, outerRadius * 0.25, 0, 0, Math.PI * 2)
        } else {
          // Sun-like rays for higher moods
          ctx.beginPath()
          ctx.moveTo(innerRadius, 0)
          ctx.lineTo(outerRadius * 0.7, -outerRadius * 0.2)
          ctx.lineTo(outerRadius, 0)
          ctx.lineTo(outerRadius * 0.7, outerRadius * 0.2)
          ctx.closePath()
        }

        // Create gradient for petal
        const gradient = ctx.createLinearGradient(0, 0, outerRadius, 0)
        gradient.addColorStop(0, main)
        gradient.addColorStop(1, accent)
        ctx.fillStyle = gradient

        // Add shadow for depth - enhanced for dark mode
        ctx.shadowColor = isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.2)"
        ctx.shadowBlur = isDark ? 8 : 5
        ctx.shadowOffsetX = isDark ? 2 : 1
        ctx.shadowOffsetY = isDark ? 2 : 1

        ctx.fill()
        ctx.restore()
      }

      // Draw center
      ctx.beginPath()
      ctx.arc(0, 0, innerRadius, 0, Math.PI * 2)

      // Create radial gradient for center
      const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, innerRadius)
      centerGradient.addColorStop(0, "#ffffff")
      centerGradient.addColorStop(1, accent)
      ctx.fillStyle = centerGradient

      ctx.shadowColor = "transparent"
      ctx.fill()

      // Draw center details
      const numDots = 8
      for (let i = 0; i < numDots; i++) {
        const dotAngle = (i * 2 * Math.PI) / numDots
        const dotX = Math.cos(dotAngle) * (innerRadius * 0.6)
        const dotY = Math.sin(dotAngle) * (innerRadius * 0.6)

        ctx.beginPath()
        ctx.arc(dotX, dotY, 2, 0, Math.PI * 2)
        ctx.fillStyle = main
        ctx.fill()
      }

      // Restore context state
      ctx.restore()

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [moodValue, theme])

  return (
    <div className="relative">
      <div className="p-4">
        {" "}
        {/* Added padding container to prevent shadow clipping */}
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          className="rounded-full shadow-lg"
          style={{
            filter: `drop-shadow(0 0 10px rgba(0, 0, 0, 0.1))`,
          }}
        />
      </div>
    </div>
  )
}
