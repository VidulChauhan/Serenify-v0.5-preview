"use client"

import type React from "react"
import { useRef } from "react"
import { useMetallicEffect, getMetallicCardStyle, MetallicPatternOverlay } from "@/lib/metallic-effect"

interface MetallicCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export function MetallicCard({ children, className = "", intensity = 1 }: MetallicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const motion = useMetallicEffect(cardRef, intensity)

  return (
    <div ref={cardRef} className={`relative ${className}`} style={getMetallicCardStyle(motion)}>
      <MetallicPatternOverlay />
      {children}
    </div>
  )
}
