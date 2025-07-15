"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { useMetallicEffect, getColorfulCardStyle } from "@/lib/metallic-effect"

interface ColorfulCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export function ColorfulCard({ children, className = "", intensity = 1 }: ColorfulCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const motion = useMetallicEffect(cardRef, intensity)
  const [isAnimating, setIsAnimating] = useState(false)

  // Add subtle continuous animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating((prev) => !prev)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div ref={cardRef} className={`relative ${className} animate-float`} style={getColorfulCardStyle(motion)}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 rounded-[inherit]" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
