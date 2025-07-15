"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface MoodVisualizerProps {
  moodValue: number
  animated?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function MoodVisualizer({ moodValue, animated = true, size = "md", className = "" }: MoodVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size based on the size prop
    const canvasSize = size === "sm" ? 100 : size === "md" ? 200 : 300
    canvas.width = canvasSize
    canvas.height = canvasSize

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Get color based on mood - enhanced saturation for better visibility in both themes
    const getMoodColor = () => {
      // More vibrant colors that work well in both light and dark themes
      if (moodValue < 15) return { main: "#9966ff", accent: "#c4a6ff", bg: "#e2d9f7" } // Purple - very unpleasant
      if (moodValue < 30) return { main: "#5c7cfa", accent: "#91a7ff", bg: "#dce4fd" } // Blue - unpleasant
      if (moodValue < 45) return { main: "#4dabf7", accent: "#82c8ff", bg: "#d9ebfd" } // Light blue - slightly unpleasant
      if (moodValue < 55) return { main: "#38d9d9", accent: "#8ae6e6", bg: "#e6f7f6" } // Teal - neutral
      if (moodValue < 70) return { main: "#69db7c", accent: "#a9e6b8", bg: "#e8f7df" } // Light green - slightly pleasant
      if (moodValue < 85) return { main: "#a9e34b", accent: "#c8eb8e", bg: "#f0f9e6" } // Green - pleasant
      return { main: "#fcc419", accent: "#ffe066", bg: "#fdf6e6" } // Yellow - very pleasant
    }

    const { main, accent, bg } = getMoodColor()

    // Center coordinates
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Animation variables
    let rotation = 0
    let scale = 1
    let scaleDirection = 0.0005

    const drawShape = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Save context state
      ctx.save()
      ctx.translate(centerX, centerY)

      if (animated) {
        ctx.rotate(rotation)
        ctx.scale(scale, scale)
      }

      // Draw background glow - consistent in both modes
      const bgGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, canvasSize / 1.5)
      bgGradient.addColorStop(0, isDark ? `${main}60` : `${bg}90`)
      bgGradient.addColorStop(0.7, isDark ? `${main}20` : `${bg}40`)
      bgGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = bgGradient
      ctx.beginPath()
      ctx.arc(0, 0, canvasSize / 1.5, 0, Math.PI * 2)
      ctx.fill()

      // Determine shape based on mood value
      if (moodValue < 30) {
        // Unpleasant - Flower with fewer, sharper petals
        drawFlower(0, 0, canvasSize * 0.35, 6, main, accent, isDark)
      } else if (moodValue < 55) {
        // Neutral - Smooth circular shape
        drawCircle(0, 0, canvasSize * 0.35, main, accent, isDark)
      } else if (moodValue < 85) {
        // Pleasant - Flower with more, rounded petals
        drawFlower(0, 0, canvasSize * 0.35, 8, main, accent, isDark)
      } else {
        // Very Pleasant - Sun-like shape
        drawSunShape(0, 0, canvasSize * 0.35, main, accent, isDark)
      }

      // Restore context state
      ctx.restore()
    }

    function drawFlower(
      x: number,
      y: number,
      radius: number,
      petals: number,
      color: string,
      accentColor: string,
      isDark: boolean,
    ) {
      // Draw petals
      for (let i = 0; i < petals; i++) {
        const angle = (i * 2 * Math.PI) / petals
        const petalLength = radius * (moodValue < 30 ? 1.2 : 1.4)
        const petalWidth = radius * (moodValue < 30 ? 0.5 : 0.7)

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)

        // Create petal path
        ctx.beginPath()
        ctx.ellipse(petalLength * 0.5, 0, petalLength * 0.5, petalWidth, 0, 0, Math.PI * 2)

        // Create gradient for petal
        const gradient = ctx.createLinearGradient(-petalLength * 0.2, 0, petalLength, 0)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, accentColor)
        ctx.fillStyle = gradient

        // Add shadow for depth - enhanced for dark mode
        ctx.shadowColor = isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.2)"
        ctx.shadowBlur = isDark ? 15 : 10
        ctx.shadowOffsetX = isDark ? 3 : 2
        ctx.shadowOffsetY = isDark ? 3 : 2

        ctx.fill()
        ctx.restore()
      }

      // Draw center circle
      ctx.beginPath()
      ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2)

      // Create radial gradient for center
      const centerGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 0.3)
      centerGradient.addColorStop(0, isDark ? "#ffffff" : "#ffffff")
      centerGradient.addColorStop(1, isDark ? accentColor : color)
      ctx.fillStyle = centerGradient

      // Add shadow for depth - enhanced for dark mode
      ctx.shadowColor = isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.2)"
      ctx.shadowBlur = isDark ? 15 : 10
      ctx.shadowOffsetX = isDark ? 3 : 2
      ctx.shadowOffsetY = isDark ? 3 : 2

      ctx.fill()

      // Add detail to center
      ctx.beginPath()
      ctx.arc(x, y, radius * 0.15, 0, Math.PI * 2)
      ctx.fillStyle = isDark ? color : accentColor
      ctx.fill()
    }

    function drawCircle(x: number, y: number, radius: number, color: string, accentColor: string, isDark: boolean) {
      // Draw multiple layers of circles with gradient
      const layers = 3
      for (let i = layers; i > 0; i--) {
        const layerRadius = (radius * i) / layers

        ctx.beginPath()
        ctx.arc(x, y, layerRadius, 0, Math.PI * 2)

        // Create radial gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, layerRadius)
        gradient.addColorStop(0, accentColor)
        gradient.addColorStop(1, color)
        ctx.fillStyle = gradient

        // Add shadow for depth - enhanced for dark mode
        ctx.shadowColor = isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.2)"
        ctx.shadowBlur = isDark ? 15 : 10
        ctx.shadowOffsetX = isDark ? 3 : 2
        ctx.shadowOffsetY = isDark ? 3 : 2

        ctx.fill()
      }

      // Add center highlight
      ctx.beginPath()
      ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2)
      ctx.fillStyle = isDark ? "#ffffff" : "#ffffff"
      ctx.shadowColor = "transparent"
      ctx.fill()
    }

    function drawSunShape(x: number, y: number, radius: number, color: string, accentColor: string, isDark: boolean) {
      // Draw sun rays
      const rays = 12
      const outerRadius = radius * 1.5
      const innerRadius = radius * 0.8

      ctx.beginPath()
      for (let i = 0; i < rays * 2; i++) {
        const angle = (i * Math.PI) / rays
        const r = i % 2 === 0 ? outerRadius : innerRadius
        const px = x + r * Math.cos(angle)
        const py = y + r * Math.sin(angle)
        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
      ctx.closePath()

      // Create radial gradient
      const gradient = ctx.createRadialGradient(x, y, innerRadius * 0.5, x, y, outerRadius)
      gradient.addColorStop(0, accentColor)
      gradient.addColorStop(1, color)
      ctx.fillStyle = gradient

      // Add shadow for depth - enhanced for dark mode
      ctx.shadowColor = isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.2)"
      ctx.shadowBlur = isDark ? 15 : 10
      ctx.shadowOffsetX = isDark ? 3 : 2
      ctx.shadowOffsetY = isDark ? 3 : 2

      ctx.fill()

      // Draw center circle
      ctx.beginPath()
      ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2)

      // Create radial gradient for center
      const centerGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 0.5)
      centerGradient.addColorStop(0, "#ffffff")
      centerGradient.addColorStop(1, accentColor)
      ctx.fillStyle = centerGradient

      ctx.shadowColor = "transparent"
      ctx.fill()
    }

    if (animated) {
      const animate = () => {
        // Update animation values
        rotation += 0.002
        scale += scaleDirection
        if (scale > 1.05) scaleDirection = -0.0005
        if (scale < 0.95) scaleDirection = 0.0005

        drawShape()
        requestAnimationFrame(animate)
      }

      const animationId = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationId)
    } else {
      drawShape()
    }
  }, [moodValue, animated, size, theme])

  const sizeClass = size === "sm" ? "w-12 h-12" : size === "md" ? "w-40 h-40" : "w-60 h-60"

  return (
    <div className="flex items-center justify-center">
      <div className="p-4">
        {" "}
        {/* Added padding container to prevent shadow clipping */}
        <canvas ref={canvasRef} className={`${sizeClass} ${className}`} />
      </div>
    </div>
  )
}
